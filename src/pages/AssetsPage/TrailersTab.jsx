import React from "react";
import FiltersComponent from "../../components/FiltersComponent";
import {Badge, Box, Flex} from "@chakra-ui/react";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableTh,
  CTableTd,
} from "../../components/tableElements";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {sidebarActions} from "../../store/sidebar";
import CTableRow from "../../components/tableElements/CTableRow";
import {useQuery} from "@tanstack/react-query";
import assetsService from "../../services/assetsService";
import useDebounce from "../../hooks/useDebounce";
import {AiOutlineExclamationCircle} from "react-icons/ai";
import {getVerificationStatusColor} from "./components/mockElements";

const TrailersTab = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [searchText, setSearchText] = useState("");

  const offset = (currentPage - 1) * pageSize;

  const {data: assetsData, isLoading} = useQuery({
    queryKey: [
      "GET_TRAILERS_LIST",
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
      };
      return assetsService.getList(params);
    },
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    select: (res) => ({
      assets: res?.data?.response ?? [],
      total: res?.data?.total ?? 0,
    }),
  });

  const assets = assetsData?.assets || [];
  const totalAssets = assetsData?.total || 0;
  const totalPages = Math.ceil(totalAssets / pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const debouncedSearch = useDebounce((val) => {
    const searchValue = typeof val === "string" ? val : String(val || "");
    setSearchText(searchValue);
    setCurrentPage(1);
  }, 500);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const handleRowClick = (assetId) => {
    dispatch(sidebarActions.setSidebar(false));
    navigate(`/admin/assets/${assetId}`);
  };

  // const getVerificationStatusColor = (status) => {
  //   if (Array.isArray(status)) {
  //     const statusValue = status[0]?.toLowerCase();
  //     switch (statusValue) {
  //       case "verified":
  //         return "green";
  //       case "needs attention":
  //       case "pending":
  //       case "unverified":
  //         return "red";
  //       case "in review":
  //       case "processing":
  //         return "orange";
  //       case "expired":
  //         return "red";
  //       case "approved":
  //         return "green";
  //       case "rejected":
  //       case "denied":
  //         return "red";
  //       default:
  //         return "gray";
  //     }
  //   }

  //   switch (status?.toLowerCase()) {
  //     case "verified":
  //       return "green";
  //     case "needs attention":
  //     case "pending":
  //     case "unverified":
  //       return "red";
  //     case "in review":
  //     case "processing":
  //       return "orange";
  //     case "expired":
  //       return "red";
  //     case "approved":
  //       return "green";
  //     case "rejected":
  //     case "denied":
  //       return "red";
  //     default:
  //       return "gray";
  //   }
  // };

  if (isLoading) {
    return (
      <Box mt={"32px"}>
        <FiltersComponent
          filterButton={true}
          verifySelect={true}
          actionButton={true}
        />
        <Box mt={6} p={4} textAlign="center">
          Loading assets...
        </Box>
      </Box>
    );
  }

  return (
    <Box mt={"32px"}>
      <FiltersComponent
        filterButton={true}
        verifySelect={true}
        actionButton={true}
        onSearchChange={debouncedSearch}
      />

      <Box mt={6}>
        <CTable
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}>
          <CTableHead>
            <Box as="tr">
              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "unitNumber" ? sortConfig.direction : null
                }
                onSort={() => handleSort("unitNumber")}>
                Unit #
              </CTableTh>
              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "type" ? sortConfig.direction : null
                }
                onSort={() => handleSort("type")}>
                Type
              </CTableTh>
              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "make" ? sortConfig.direction : null
                }
                onSort={() => handleSort("make")}>
                Make
              </CTableTh>
              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "fuel" ? sortConfig.direction : null
                }
                onSort={() => handleSort("fuel")}>
                Model year
              </CTableTh>
              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "modelYear" ? sortConfig.direction : null
                }
                onSort={() => handleSort("modelYear")}>
                License plate
              </CTableTh>
              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "licensePlate"
                    ? sortConfig.direction
                    : null
                }
                onSort={() => handleSort("licensePlate")}>
                VIN
              </CTableTh>

              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "verificationStatus"
                    ? sortConfig.direction
                    : null
                }
                onSort={() => handleSort("verificationStatus")}>
                Verification status
              </CTableTh>
            </Box>
          </CTableHead>

          <CTableBody>
            {assets.map((asset, index) => (
              <CTableRow
                key={asset.id || asset.guid || index}
                style={{
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
                onClick={() => handleRowClick(asset.id || asset.guid)}>
                <CTableTd>{asset.vehicle_number || "N/A"}</CTableTd>
                <CTableTd>
                  {asset.type?.[0] || asset.asset_type || "N/A"}
                </CTableTd>
                <CTableTd>{asset.make || "N/A"}</CTableTd>
                <CTableTd>
                  {asset.model_year || asset.modelYear || asset.year || "N/A"}
                </CTableTd>
                <CTableTd>{asset.licence_plate || "N/A"}</CTableTd>
                <CTableTd>{asset.vin_number || "N/A"}</CTableTd>
                <CTableTd>
                  <Flex
                    gap="4px"
                    alignItems="center"
                    justifyContent="center"
                    h="24px"
                    w="100px"
                    bg={getVerificationStatusColor("Verified")}
                    px={3}
                    py={1}
                    borderRadius="16px"
                    fontSize="14px"
                    fontWeight="600"
                    color="white">
                    <span>
                      <AiOutlineExclamationCircle />{" "}
                    </span>{" "}
                    {asset.load_eligibility || "Verified"}
                  </Flex>
                </CTableTd>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </Box>
    </Box>
  );
};

export default TrailersTab;
