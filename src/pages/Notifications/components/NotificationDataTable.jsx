import {Box, Spinner, Center, Collapse} from "@chakra-ui/react";
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
import React, {useState, useRef} from "react";
import SimplePagination from "@components/SimplePagination";
import TripRowDetails from "../../Trips/components/TripRowDetails";

export const NotificationDataTable = ({
  headData = [],
  data = [],
  limit,
  page,
  pagination,
  count = 0,
  isLoading = false,
  setPage = () => {},
  setLimit = () => {},
  onRowClick,
  ...props
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const tableScrollRef = useRef(null);

  const handleRowClick = (rowId) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });

    if (onRowClick) {
      onRowClick(rowId);
    }
  };

  return (
    <Box display="flex" flexDirection="column" h="100%" {...props}>
      <CTable
        ref={tableScrollRef}
        width="100%"
        height="calc(100vh - 290px)"
        overflow="auto">
        <CTableHead zIndex={1}>
          <Box as={"tr"}>
            {headData?.map((element, index) => (
              <CTableTh zIndex={-1} maxW="334px" key={index}>
                {element.label}
              </CTableTh>
            ))}
          </Box>
        </CTableHead>

        <CTableBody>
          {isLoading ? (
            <CTableRow>
              <CTableTd colSpan={headData.length} textAlign="center" py={8}>
                <Center minH="400px">
                  <Spinner size="lg" color="#FF5B04" thickness="4px" />
                </Center>
              </CTableTd>
            </CTableRow>
          ) : data.length === 0 ? (
            <CTableRow>
              <CTableTd
                colSpan={headData.length}
                textAlign="center"
                p={0}
                border="none">
                <EmptyState
                  icon={FiAlertCircle}
                  title="No notifications"
                  description="You don't have any notifications at the moment."
                />
              </CTableTd>
            </CTableRow>
          ) : (
            data?.map((row, index) => {
              const rowId = row?.guid || row?.id || index;
              const isExpanded = expandedRows.has(rowId);

              const tripId =
                row?.trip_id ||
                row?.trips_id ||
                row?.trip_id_data?.guid ||
                row?.pickup_id_data?.trips_id;
              const hasTripData = Boolean(!tripId);

              const tripData = hasTripData
                ? {
                    guid: tripId,
                    id: row?.trip_id_data?.id || row?.id,
                    ...row?.trip_id_data,
                  }
                : null;

              return (
                <React.Fragment key={rowId}>
                  <CTableRow
                    hover={false}
                    onClick={() => hasTripData && handleRowClick(rowId)}
                    style={{cursor: hasTripData ? "pointer" : "default"}}
                    bg={
                      row?.is_read === false || row?.is_read === 0
                        ? "#FEF2F2"
                        : "white"
                    }>
                    {headData?.map((head, colIndex) => (
                      <CTableTd key={colIndex}>
                        {head?.render
                          ? head.render(row[head.key], row, head, index)
                          : row[head.key]}
                      </CTableTd>
                    ))}
                  </CTableRow>

                  {/* {hasTripData && (
                    <CTableRow>
                      <CTableTd colSpan={headData.length} p={0}>
                        <Collapse
                          position="relative"
                          in={isExpanded}
                          animateOpacity>
                          <TripRowDetails
                            handleRowClick={handleRowClick}
                            trip={tripData}
                            isExpanded={isExpanded}
                            tableScrollRef={tableScrollRef}
                          />
                        </Collapse>
                      </CTableTd>
                    </CTableRow>
                  )} */}
                </React.Fragment>
              );
            })
          )}
        </CTableBody>
      </CTable>
      {/* 
      {pagination && (
        <Box
          width="100%"
          borderTop="1px solid"
          borderColor="#E5E7EB"
          bg="white"
          flexShrink={0}>
          <Box padding="12px 24px" width="100%">
            <SimplePagination
              limit={limit}
              setLimit={setLimit}
              page={page}
              setPage={setPage}
              pageCount={Math.ceil(count / limit) || 1}
            />
          </Box>
        </Box>
      )} */}
    </Box>
  );
};
