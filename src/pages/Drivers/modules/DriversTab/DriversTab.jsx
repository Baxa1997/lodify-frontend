import {Badge, Box} from "@chakra-ui/react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {useDispatch} from "react-redux";
import {sidebarActions} from "@store/sidebar";
import driversService from "@services/driversService";
import useDebounce from "@hooks/useDebounce";
import FiltersComponent from "@components/FiltersComponent";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableTd,
  CTableTh,
} from "@components/tableElements";
import CTableRow from "@components/tableElements/CTableRow";
import {getLoadEligibilityColor} from "../../components/mockElements";
import AddDriverModal from "../../components/AddDriverModal";
import AddDriverCode from "../../components/AddDriverCode";

export const DriversTab = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [searchText, setSearchText] = useState("");
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
  const [isAddDriverCodeModalOpen, setIsAddDriverCodeModalOpen] =
    useState(false);
  const offset = (currentPage - 1) * pageSize;

  const {data: driversData, isLoading} = useQuery({
    queryKey: [
      "GET_DRIVERS_LIST",
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
      return driversService.getList(params);
    },
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    select: (res) => ({
      drivers: res?.data?.response ?? [],
      total: res?.data?.count ?? 0,
    }),
  });

  const debouncedSearch = useDebounce((val) => {
    const searchValue = typeof val === "string" ? val : String(val || "");
    setSearchText(searchValue);
    setCurrentPage(1);
  }, 500);

  const drivers = driversData?.drivers || [];
  const totalDrivers = driversData?.total || 0;
  const totalPages = Math.ceil(totalDrivers / pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const handleRowClick = (driverId) => {
    dispatch(sidebarActions.setSidebar(false));
    navigate(`/admin/drivers/${driverId}`);
  };

  const getStatusColor = (status) => {
    switch (status?.[0]?.toLowerCase()) {
      case "active":
      case "available":
      case "ready":
        return "green";
      case "inactive":
      case "unavailable":
      case "offline":
        return "red";
      case "pending":
      case "pending approval":
      case "under review":
        return "orange";
      case "on duty":
      case "on trip":
      case "driving":
        return "blue";
      case "maintenance":
      case "repair":
        return "purple";
      case "suspended":
      case "terminated":
        return "red";
      case "part-time":
      case "limited":
        return "yellow";
      default:
        return "gray";
    }
  };

  if (isLoading) {
    return (
      <Box mt={"32px"}>
        <FiltersComponent filterButton={true} actionButton={true} />
        <Box mt={6} p={4} textAlign="center">
          Loading drivers...
        </Box>
      </Box>
    );
  }

  return (
    <Box mt={"32px"}>
      <FiltersComponent
        actionButton={true}
        filterButton={true}
        lastAddButton={true}
        onSearchChange={debouncedSearch}
        onActionButtonClick={() => setIsAddDriverModalOpen(true)}
        onLastAddButtonClick={() => setIsAddDriverCodeModalOpen(true)}
      />

      <Box mt={6}>
        <CTable
          height="calc(100vh - 300px)"
          overflow="auto"
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
                  sortConfig.key === "name" ? sortConfig.direction : null
                }
                onSort={() => handleSort("name")}>
                Name
              </CTableTh>
              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "cdlClass" ? sortConfig.direction : null
                }
                onSort={() => handleSort("cdlClass")}>
                CDL Class
              </CTableTh>
              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "licenseNumber"
                    ? sortConfig.direction
                    : null
                }
                onSort={() => handleSort("licenseNumber")}>
                License #
              </CTableTh>
              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "region" ? sortConfig.direction : null
                }
                onSort={() => handleSort("region")}>
                Region
              </CTableTh>
              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "status" ? sortConfig.direction : null
                }
                onSort={() => handleSort("status")}>
                Status
              </CTableTh>
              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "loadEligibility"
                    ? sortConfig.direction
                    : null
                }
                onSort={() => handleSort("loadEligibility")}>
                Load eligibility
              </CTableTh>
              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "medicalCard" ? sortConfig.direction : null
                }
                onSort={() => handleSort("medicalCard")}>
                Medical card
              </CTableTh>
            </Box>
          </CTableHead>

          <CTableBody>
            {drivers.map((driver, index) => (
              <CTableRow
                key={driver.id || driver.guid || index}
                style={{
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
                onClick={() => handleRowClick(driver.id || driver.guid)}>
                <CTableTd>{driver.full_name || driver.name || "N/A"}</CTableTd>
                <CTableTd>
                  {driver.cdl_class || driver.cdlClass || "N/A"}
                </CTableTd>
                <CTableTd>
                  {driver.license_number || driver.licenseNumber || "N/A"}
                </CTableTd>
                <CTableTd>{driver.region || "N/A"}</CTableTd>
                <CTableTd>
                  <Badge
                    colorScheme={getStatusColor(driver.status)}
                    variant="subtle"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="12px"
                    fontWeight="500">
                    {driver.status || "N/A"}
                  </Badge>
                </CTableTd>
                <CTableTd>
                  <Badge
                    colorScheme={getLoadEligibilityColor(
                      driver.load_eligibility || driver.loadEligibility
                    )}
                    variant="subtle"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="12px"
                    fontWeight="500">
                    {Array.isArray(
                      driver.load_eligibility || driver.loadEligibility
                    )
                      ? (driver.load_eligibility ||
                          driver.loadEligibility)[0] || "N/A"
                      : driver.load_eligibility ||
                        driver.loadEligibility ||
                        "N/A"}
                  </Badge>
                </CTableTd>
                <CTableTd>
                  {driver.medical_card || driver.medicalCard || "N/A"}
                </CTableTd>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </Box>
      <AddDriverCode
        isOpen={isAddDriverCodeModalOpen}
        onClose={() => setIsAddDriverCodeModalOpen(false)}
      />

      <AddDriverModal
        isOpen={isAddDriverModalOpen}
        onClose={() => setIsAddDriverModalOpen(false)}
      />
    </Box>
  );
};
