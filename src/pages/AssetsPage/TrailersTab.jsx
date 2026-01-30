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
import { useSort } from "@hooks/useSort";

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
   })
  };

  const handleRowClick = (assetId) => {
    dispatch(sidebarActions.setSidebar(false));
    navigate(`/admin/assets/${assetId}`);
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
  console.log("sortedAssetssortedAssets", assets)
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
                  sortConfig.key === "vehicle_number" ? sortConfig.direction : null
                }
                onSort={() => handleSort("vehicle_number")}>
                Unit #
              </CTableTh>
              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "type.[0]" ? sortConfig.direction : null
                }
                onSort={() => handleSort("type.[0]")}>
                Type
              </CTableTh>

              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "year" ? sortConfig.direction : null
                }
                onSort={() => handleSort("year")}>
                Model year
              </CTableTh>
              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "licence_plate" ? sortConfig.direction : null
                }
                onSort={() => handleSort("licence_plate")}>
                License plate
              </CTableTh>
              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "vin_number"
                    ? sortConfig.direction
                    : null
                }
                onSort={() => handleSort("vin_number")}>
                VIN
              </CTableTh>

              <CTableTh
                sortable={true}
                sortDirection={
                  sortConfig.key === "verification_status"
                    ? sortConfig.direction
                    : null
                }
                onSort={() => handleSort("verification_status")}>
                Verification status
              </CTableTh>
            </Box>
          </CTableHead>

          <CTableBody>
            {sortedAssets?.map((asset, index) => (
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
