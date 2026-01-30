import React, { useTransition } from "react";
import FiltersComponent from "../../components/FiltersComponent";
import {Box, Flex} from "@chakra-ui/react";
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
import AddAssetsModal from "./components/AddAssetsModal";
import {
  getLoadEligibilityColor,
  tractorTableElements,
} from "./components/mockElements";
import useDebounce from "../../hooks/useDebounce";
import {AiOutlineExclamationCircle} from "react-icons/ai";
import { useSort } from "@hooks/useSort";

const TractorsTab = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [sortConfig, setSortConfig] = useState({
    key: "vehicle_number",
    direction: "asc",
  });
  const [isAddAssetsModalOpen, setIsAddAssetsModalOpen] = useState(false);

  const offset = (currentPage - 1) * pageSize;

  const {data: assetsData, isLoading} = useQuery({
    queryKey: [
      "GET_ASSETS_LIST",
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
    select: (res) => (
      {
        assets: res?.data?.response ?? [],
        total: res?.data?.count ?? 0,
      }
    ),
  });

  const assets = assetsData?.assets || [];
  const totalAssets = assetsData?.total || 0;
  const totalPages = Math.ceil(totalAssets / pageSize);

  const {items: sortedAssets} = useSort(assets, sortConfig);

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
    startTransition(() => {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    });
  };

  const handleRowClick = (assetId, asset) => {
    dispatch(sidebarActions.setSidebar(false));
    navigate(`/admin/assets/${assetId}`, {
      state: {
        asset,
      },
    });
  };

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
  console.log("sortedAssetssortedAssets", sortedAssets)
  return (
    <Box mt={"32px"}>
      <FiltersComponent
        filterButton={true}
        verifySelect={true}
        actionButton={true}
        onActionButtonClick={() => setIsAddAssetsModalOpen(true)}
        onSearchChange={debouncedSearch}
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
            {tractorTableElements.map((element) => (
              <CTableTh
                key={element.sortKey}
                sortable={element.sortable}
                sortDirection={
                  sortConfig.key === element.sortKey ? sortConfig.direction : null
                }
                onSort={() => handleSort(element.sortKey)}>
                {element.label}
              </CTableTh>
            ))}
          </CTableHead>

          <CTableBody>
            {sortedAssets?.map((asset, index) => (
              <CTableRow
                key={asset.id || asset.guid || index}
                style={{
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
                onClick={() => handleRowClick(asset.id || asset.guid, asset)}>
                <CTableTd>{asset.vehicle_number || "N/A"}</CTableTd>
                <CTableTd>{asset.licence_plate || "N/A"}</CTableTd>
                <CTableTd>{asset.type?.[0] || "N/A"}</CTableTd>
                {/* <CTableTd>
                  {asset.fuel_types_id_data?.name || asset.fuel_type || "N/A"}
                </CTableTd> */}
                <CTableTd>
                  { asset.year || "N/A"}
                </CTableTd>
                <CTableTd>{asset.vin_number || "N/A"}</CTableTd>
                <CTableTd>
                  <Flex
                    gap="4px"
                    alignItems="center"
                    justifyContent="center"
                    h="24px"
                    w="100px"
                    bg={getLoadEligibilityColor(
                      asset.load_eligibility ?? "Eligible"
                    )}
                    px={3}
                    py={1}
                    borderRadius="16px"
                    fontSize="14px"
                    fontWeight="600"
                    color="white">
                    <span>
                      <AiOutlineExclamationCircle />{" "}
                    </span>{" "}
                    {asset.load_eligibility || "Eligible"}
                  </Flex>
                </CTableTd>
                {/* <CTableTd>
                  <Badge
                    colorScheme={getVerificationStatusColor(
                      asset.status || asset.status
                    )}
                    variant="subtle"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="12px"
                    fontWeight="500">
                    {Array.isArray(asset.status || asset.status)
                      ? (asset.status || asset.status)[0] || "N/A"
                      : asset.status || asset.status || "N/A"}
                  </Badge>
                </CTableTd> */}
                {/* <CTableTd>
                  <DriverAssign asset={asset} />
                </CTableTd> */}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </Box>

      <AddAssetsModal
        isOpen={isAddAssetsModalOpen}
        onClose={() => setIsAddAssetsModalOpen(false)}
      />
    </Box>
  );
};

export default TractorsTab;
