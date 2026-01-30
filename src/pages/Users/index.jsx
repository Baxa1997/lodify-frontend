import React, {useState, useCallback, useMemo, useTransition} from "react";
import {Box, Flex, Text, Badge} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {sidebarActions} from "../../store/sidebar";
import {
  CTable,
  CTableHead,
  CTableTh,
  CTableBody,
  CTableTd,
} from "../../components/tableElements";
import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import CTableRow from "../../components/tableElements/CTableRow";
import FiltersComponent from "../../components/FiltersComponent";
import AddUserModal from "../../components/AddUserModal";
import usersService from "../../services/usersService";
import {useQuery} from "@tanstack/react-query";
import {tableHeading, getStatusColor} from "./components/mockElements";
import useDebounce from "../../hooks/useDebounce";
import { useSort } from "@hooks/useSort";

const Users = () => {
  const clientTypeId = useSelector((state) => state?.auth?.clientType?.id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortConfig, setSortConfig] = useState({key: null, direction: "asc"});
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [isPending, startTransition] = useTransition();
  const userData = useSelector((state) => state?.auth?.user_data);

  const roleType = userData?.brokers_id ? "broker_users" : "users";
  const roleTypeFilter = userData?.brokers_id ? "brokers_id" : "companies_id";
  const roleTypeValue = userData?.brokers_id
    ? userData?.brokers_id
    : userData?.companies_id;

  const offset = (currentPage - 1) * pageSize;

  const {data: usersData, isLoading} = useQuery({
    queryKey: [
      "GET_USERS_LIST",
      currentPage,
      pageSize,
      String(searchText || ""),
    ],
    queryFn: () => {
      const params = {
        search: searchText,
        limit: pageSize,
        offset: searchText ? 0 : offset,
        with_relations: false,
        [roleTypeFilter]: roleTypeValue,
      };
      return usersService.getList(params, roleType);
    },
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    select: (res) => ({
      users: res?.data?.response ?? [],
      total: res?.data?.count ?? 0,
    }),
  });

  const {data: rolesData, isLoading: isLoadingRoles} = useQuery({
    queryKey: ["GET_ROLES_LIST"],
    queryFn: () =>
      usersService.getRolesList({
        client_type_id: clientTypeId,
      }),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    select: (res) => res?.data?.response ?? [],
  });

  const users = usersData?.users || [];
  const totalUsers = usersData?.total || 0;
  const totalPages = Math.ceil(totalUsers / pageSize);

  console.log('usersusers', users)
  const {items: sortedUsers} = useSort(users, sortConfig);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const debouncedSearch = useDebounce((val) => {
    const searchValue = typeof val === "string" ? val : String(val || "");
    setSearchText(searchValue);
    setCurrentPage(1);
  }, 500);

  const handleSort = useCallback(
    (key) => {
      let direction = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
        startTransition(() => {
          setSortConfig({key, direction});
        });
    },
    [sortConfig]
  );

  const handleUserClick = useCallback(
    (user) => {
      dispatch(sidebarActions.setSidebar(false));
      navigate(`/admin/users/${user.guid}`, {state: {user}});
    },
    [navigate, dispatch]
  );

  const handleAddUserClick = useCallback(() => {
    setIsAddUserModalOpen(true);
  }, []);

  const rolesMap = useMemo(() => {
    return rolesData?.reduce((acc, role) => {
      acc[role.guid] = role.name;
      return acc;
    });
  }, [rolesData]);

  if (isLoading) {
    return (
      <>
        <Flex flexDir={"column"} gap={"20px"}>
          <HeadBreadCrumb />
          <Box mb={"20px"} h={"32px"}>
            <Text
              h={"32px"}
              color={"#181D27"}
              fontWeight={"600"}
              fontSize={"24px"}>
              Users
            </Text>
          </Box>
        </Flex>

        <FiltersComponent
          filterByDomicile={true}
          addButton={true}
          verifySelect={true}
          onAddUserClick={handleAddUserClick}
        />

        <Box mt={6} p={4} textAlign="center">
          Loading users...
        </Box>
      </>
    );
  }

  return (
    <>
      <Flex flexDir={"column"} gap={"20px"}>
        <HeadBreadCrumb />
        <Box mb={"20px"} h={"32px"}>
          <Text
            h={"32px"}
            color={"#181D27"}
            fontWeight={"600"}
            fontSize={"24px"}>
            Users
          </Text>
        </Box>
      </Flex>

      <FiltersComponent
        filterByDomicile={true}
        addButton={true}
        verifySelect={true}
        onAddUserClick={handleAddUserClick}
        onSearchChange={debouncedSearch}
      />

      <Box mt={6}>
        <CTable
          height="calc(100vh - 235px)"
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}>
          <CTableHead>
            <Box as="tr">
              {tableHeading?.map((element, idx) => (
                <CTableTh
                  sortable={element?.sortable}
                  sortDirection={
                    sortConfig.key === element.key ? sortConfig.direction : null
                  }
                  key={element.key || idx}
                  onSort={() => handleSort(element.key)}>
                  {element.label}
                </CTableTh>
              ))}
            </Box>
          </CTableHead>
          <CTableBody>
            {sortedUsers?.map((user) => (
              <CTableRow
                key={user?.id}
                onClick={() => handleUserClick(user)}
                style={{
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
                _hover={{
                  backgroundColor: "gray.50",
                }}>
                <CTableTd>{user?.first_name}</CTableTd>
                <CTableTd>{user?.last_name}</CTableTd>
                <CTableTd>{user?.email}</CTableTd>
                <CTableTd>{user?.phone}</CTableTd>
                <CTableTd>{rolesMap[user?.role_id]}</CTableTd>

                <CTableTd>
                  <Badge
                    colorScheme={getStatusColor(user?.status?.[0])}
                    variant="subtle"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="12px"
                    fontWeight="500">
                    {user?.status?.[0]}
                  </Badge>
                </CTableTd>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </Box>

      <AddUserModal
        roleTypeValue={roleTypeValue}
        roleTypeFilter={roleTypeFilter}
        roleType={roleType}
        rolesData={rolesData}
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
    </>
  );
};

export default Users;
