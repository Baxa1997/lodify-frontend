import {Box, Flex, Text, Spinner, Center, Collapse, Link, Checkbox, Button, useToast} from "@chakra-ui/react";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableTd,
  CTableTh,
} from "@components/tableElements";
import CTableRow from "@components/tableElements/CTableRow";
import {EmptyState} from "@components/tableElements/EmptyState";
import {FiAlertCircle} from "react-icons/fi";
import tripsService from "@services/tripsService";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {formatDate} from "@utils/dateFormats";
import {
  calculateTimeDifference,
  getActionButtonColor,
  getActionButtonText,
  getRowBackgroundColor,
} from "@utils/timeUtils";
import React, {useState, useRef, useTransition} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {tableActionsNeeded} from "../../components/mockElements";
import TripsFiltersComponent from "../../modules/TripsFiltersComponent";
import TimeCounter from "@components/TimeCounter";
import TripRowDetails from "../../components/TripRowDetails";
import checkedPhone from "@hooks/checkedPhone";
import { useSort } from "@hooks/useSort";
import useDebounce from "@hooks/useDebounce";
import DeleteConfirmationModal from "@components/DeleteConfirmationModal";

function ActionsNeeded() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({key: "shipper.name", direction: "asc"});
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedTrips, setSelectedTrips] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const tableScrollRef = useRef(null);
  const toast = useToast();
  const envId = useSelector((state) => state.auth.environmentId);
  const clientType = useSelector((state) => state.auth.clientType);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);
  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );
  const isBroker = Boolean(brokersId);
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const {
    data: tripsData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "ACTIONS_NEEDED_TRIPS",
      currentPage,
      pageSize,
      sortConfig,
      searchFilter,
    ],
    queryFn: () =>
      tripsService.getList({
        app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
        environment_id: envId,
        method: "list",
        object_data: {
          search: searchTerm,
          limit: pageSize,
          filter:{
            generated_id: searchFilter
          },
          offset: (currentPage - 1) * pageSize,
          brokers_id:
            clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
              ? brokersId
              : undefined,
          carriers_id:
            clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
              ? brokersId
              : companiesId,
          client_type:
            clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
              ? "broker"
              : "carrier",
        },
        table: "late_trips",
      }),
    select: (data) => data?.data || [],
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    startTransition(() => {
      setSortConfig({
        key: key,
        direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
      });
    });
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  const totalPages = tripsData?.total_count
    ? Math.ceil(tripsData.total_count / pageSize)
    : 0;
  const trips = tripsData?.response || [];

  const handleRowClick = (tripGuid) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tripGuid)) {
        newSet.delete(tripGuid);
        if (selectedRow === tripGuid) {
          setSelectedRow(null);
        }
      } else {
        newSet.add(tripGuid);
        setSelectedRow(tripGuid);
      }
      return newSet;
    });
  };

  const debouncedSearchFilter = useDebounce((val) => {
    const searchValue = typeof val === "string" ? val : String(val || "");
    setSearchFilter(searchValue);
    setCurrentPage(1);
  }, 500);

const getPhone = (trip) => {
  return isBroker ? checkedPhone(trip?.carrier?.telephone) : checkedPhone(trip?.current_driver_phone || trip?.drivers?.phone);
}


const columnWidths = {
  "shipper.name": "200px",
  "id": "150px",
  "origin.address": "250px",
  "stop.address": "250px",
  "timer": "120px",
  "total_miles": "130px",
  "actions": "150px",
};

const {items: sortedTrips} = useSort(trips, sortConfig);


  const handleSelectTrip = (tripGuid, isChecked) => {
    setSelectedTrips((prev) => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(tripGuid);
      } else {
        newSet.delete(tripGuid);
      }
      return newSet;
    });
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allGuids = new Set(sortedTrips.map((trip) => trip.guid).filter(Boolean));
      setSelectedTrips(allGuids);
    } else {
      setSelectedTrips(new Set());
    }
  };

  const isAllSelected = sortedTrips.length > 0 && sortedTrips.every((trip) => selectedTrips.has(trip.guid));
  const isIndeterminate = selectedTrips.size > 0 && !isAllSelected;
  console.log('selectedTripsselectedTrips', selectedTrips)

  const handleDelete = () => {
    if (selectedTrips.size === 0) return;
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTrips.size === 0) return;

    const selectedCount = selectedTrips.size;
    setIsDeleting(true);
    try {
        tripsService.deleteTrips({
         "data": {
          "method": "delete",
          "object_data": {
            "trip_ids": Array.from(selectedTrips),
            "client_type": isBroker ? 'broker' : "carrier"
          },
          "table": "trip"
    }
        })


      queryClient.invalidateQueries({ queryKey: ["ACTIONS_NEEDED_TRIPS"] });

      setSelectedTrips(new Set());
      setIsDeleting(false);
      setIsDeleteModalOpen(false);

      toast({
        title: "Trips Deleted",
        description: `${selectedCount} trip(s) deleted successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting trips:", error);
      setIsDeleting(false);
      toast({
        title: "Error",
        description: "Failed to delete trips. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };


  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <Box mt={"26px"}>
      <TripsFiltersComponent
        filterButton={true}
        actionButton={true}
        actionButtonText="Add Trip"
        onActionButtonClick={() => navigate("/admin/trips/add-trip")}
        onSearch={debouncedSearchFilter}
        searchValue={searchTerm}
      />

      <Box mt={6}>
        <CTable
          ref={tableScrollRef}
          width="100%"
          height={isBroker ? "calc(100vh - 332px)" : "calc(100vh - 280px)"}
          overflow="auto"
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          paginationRightContent={
            selectedTrips.size > 0 ? (
              <Button
                colorScheme="red"
                onClick={handleDelete}
                h={"32px"}
                p={"8px 14px"}
                borderRadius={"8px"}
                size="sm"
                fontWeight={"600"}>
                Delete ({selectedTrips.size})
              </Button>
            ) : null
          }>
          <CTableHead zIndex={1}>
            <Box as={"tr"}>
              
              {tableActionsNeeded
                ?.filter((element) => element.key !== "invited_by")
                .map((element, index) => (
                  index === 0 ? (
                    <CTableTh
                zIndex={-1}
                width="50px"
                w="50px"
                maxW="50px"
                minW="50px"
                p='10px'
                sortable={false}>
                <Checkbox
                  ml='4px'
                  isChecked={isAllSelected}
                  isIndeterminate={isIndeterminate}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  borderColor="#D5D7DA"
                  sx={{
                    "& .chakra-checkbox__control": {
                      borderColor: "#D5D7DA",
                      _checked: {
                        bg: "#FF5B04",
                        borderColor: "#FF5B04",
                        _hover: {
                          bg: "#FF5B04",
                          borderColor: "#FF5B04",
                        },
                      },
                      _indeterminate: {
                        bg: "#FF5B04",
                        borderColor: "#FF5B04",
                      },
                    },
                  }}
                />
              </CTableTh>
                  ) : (
                  <CTableTh
                    zIndex={-1}
                    width={columnWidths[element.key] || "auto"}
                    minW={columnWidths[element.key] || "80px"}
                    maxW={columnWidths[element.key] || "334px"}
                    sortable={element.sortable}
                    sortDirection={
                      sortConfig.key === element.key
                        ? sortConfig.direction
                        : null
                    }
                    key={element.id}
                    onSort={() => handleSort(element.key)}>
                    {element.name}
                  </CTableTh>
                )
                ))}
            </Box>
          </CTableHead>

          <CTableBody>
            {isLoading ? (
              <CTableRow>
                <CTableTd
                  colSpan={tableActionsNeeded.length + 1}
                  textAlign="center"
                  py={8}>
                  <Center minH="400px">
                    <Spinner size="lg" color="#FF5B04" thickness="4px" />
                  </Center>
                </CTableTd>
              </CTableRow>
            ) : error ? (
              <CTableRow>
                <CTableTd
                  colSpan={tableActionsNeeded.length + 1}
                  textAlign="center"
                  py={8}
                  color="red.500">
                  Error loading trips: {error?.message || "Unknown error"}
                </CTableTd>
              </CTableRow>
            ) : trips.length === 0 ? (
              <CTableRow>
                <CTableTd
                  colSpan={tableActionsNeeded.length + 1}
                  textAlign="center"
                  p={0}
                  border="none">
                  <EmptyState
                    icon={FiAlertCircle}
                    title="No trips requiring action"
                    description="All trips are up to date. New trips requiring attention will appear here."
                  />
                </CTableTd>
              </CTableRow>
            ) : (
              sortedTrips?.map((trip, index) => {
                const isExpanded = expandedRows.has(trip.guid);
                const isSelected = selectedTrips.has(trip.guid);
                return (
                  <React.Fragment key={trip.guid || index}>
                    <CTableRow
                      hover={false}
                      onClick={() => handleRowClick(trip.guid)}
                      style={{cursor: "pointer"}}
                      bg={getRowBackgroundColor(
                        calculateTimeDifference(trip?.origin?.[0]?.arrive_by)
                      )}>
                      <CTableTd
                        width="50px"
                        minW="50px"
                        maxW="50px"
                        p='10px'
                        onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          ml='6px'
                          isChecked={isSelected}
                          onChange={(e) => handleSelectTrip(trip.guid, e.target.checked)}
                          borderColor="#D5D7DA"
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            "& .chakra-checkbox__control": {
                              borderColor: "#D5D7DA",
                              _checked: {
                                bg: "#FF5B04",
                                borderColor: "#FF5B04",
                                _hover: {
                                  bg: "#FF5B04",
                                  borderColor: "#FF5B04",
                                },
                              },
                            },
                          }}
                        />
                      </CTableTd>
                      <CTableTd 
                        width={columnWidths["shipper.name"]} 
                        minW={columnWidths["shipper.name"]} 
                        maxW={columnWidths["shipper.name"]}
                        overflow="hidden"
                        textOverflow="ellipsis">
                        <Text color="#181D27" noOfLines={1}>
                          {trip.customer?.name || trip?.shipper?.name || ""}
                        </Text>
                      </CTableTd>

                      <CTableTd 
                        width={columnWidths["id"]} 
                        minW={columnWidths["id"]} 
                        maxW={columnWidths["id"]}
                        overflow="hidden"
                        textOverflow="ellipsis">
                        <Flex
                          gap="24px"
                          alignItems="center"
                          justifyContent="space-between">
                          <Text color="#181D27" noOfLines={1}>{trip.id || ""}</Text>
                        </Flex>
                      </CTableTd>

                      <CTableTd 
                        width={columnWidths["origin.address"]} 
                        minW={columnWidths["origin.address"]} 
                        maxW={columnWidths["origin.address"]}
                        whiteSpace="normal"
                        overflow="hidden">
                        <Flex
                          alignItems="center"
                          gap="16px"
                          justifyContent="space-between">
                          <Box>
                            <>
                              {" "}
                              <Text
                                h="20px"
                                fontSize="14px"
                                fontWeight="500"
                                color="#181D27"
                                noOfLines={1}>
                                {`${trip.origin?.address ?? ""}` || ""}
                              </Text>
                              <Text h="20px">
                                {formatDate(trip?.origin?.arrive_by ?? "")}
                              </Text>
                            </>
                          </Box>
                        </Flex>
                      </CTableTd>

                      <CTableTd 
                        width={columnWidths["stop.address"]} 
                        minW={columnWidths["stop.address"]} 
                        maxW={columnWidths["stop.address"]}
                        whiteSpace="normal"
                        overflow="hidden">
                        <Box>
                          <Flex
                            gap="16px"
                            alignItems="center"
                            justifyContent="space-between">
                            <Box>
                              <Text
                                h="20px"
                                fontSize="14px"
                                fontWeight="500"
                                color="#181D27"
                                noOfLines={1}>
                                {`${trip.stop?.address ?? ""}` || ""}
                              </Text>
                              <Text h="20px">
                                {formatDate(trip?.stop?.arrive_by ?? "")}
                              </Text>
                            </Box>
                          </Flex>
                        </Box>
                      </CTableTd>

                      <CTableTd 
                        width={columnWidths["timer"]} 
                        minW={columnWidths["timer"]} 
                        maxW={columnWidths["timer"]}
                        overflow="hidden">
                        <TimeCounter arriveBy={trip?.stop?.arrive_by} />
                      </CTableTd>

                      {/* <CTableTd>
                        <Text color="#181D27">
                          {trip?.pickup_reason ?? "-"}
                        </Text>
                      </CTableTd> */}

                      <CTableTd 
                        width={columnWidths["total_miles"]} 
                        minW={columnWidths["total_miles"]} 
                        maxW={columnWidths["total_miles"]}
                        overflow="hidden"
                        textOverflow="ellipsis">
                        <Text color="#181D27">
                          {trip?.total_miles?.toFixed(0) ?? "-"} miles
                        </Text>
                      </CTableTd>

                      <CTableTd 
                        width={columnWidths["actions"]} 
                        minW={columnWidths["actions"]} 
                        maxW={columnWidths["actions"]}
                        overflow="hidden">
                        <Flex onClick={(e) => {
                          e.stopPropagation();
                          
                        }} alignItems="center" gap={2}>
                          <Link href={`tel:${getPhone(trip)}`} target="_blank">
                          <Text
                            color={getActionButtonColor(
                              calculateTimeDifference(
                                trip?.origin?.arrive_by ||
                                  trip?.stop?.arrive_by ||
                                  trip?.deadline ||
                                  trip.timer_seconds
                              )
                            )}
                            fontWeight="600">
                            {getActionButtonText(
                              calculateTimeDifference(
                                trip?.origin?.arrive_by ||
                                  trip?.stop?.arrive_by ||
                                  trip?.deadline ||
                                  trip.timer_seconds
                              ), isBroker
                            )}
                          </Text>
                          </Link>
                        </Flex>
                      </CTableTd>
                    </CTableRow>

                    <CTableRow>
                      <CTableTd colSpan={tableActionsNeeded.length + 1} p={0}>
                        <Collapse
                          position="relative"
                          in={isExpanded}
                          animateOpacity>
                          <TripRowDetails
                            handleRowClick={handleRowClick}
                            trip={trip}
                            isExpanded={isExpanded}
                            tableScrollRef={tableScrollRef}
                            navigate={navigate}
                          />
                        </Collapse>
                      </CTableTd>
                    </CTableRow>
                  </React.Fragment>
                );
              })
            )}
          </CTableBody>
        </CTable>
      </Box>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Trips"
        message={`Are you sure you want to delete ${selectedTrips.size} trip(s)? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </Box>
  );
}

export default ActionsNeeded;
