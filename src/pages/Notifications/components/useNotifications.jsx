import {useQuery} from "@tanstack/react-query";
import notificationService from "@services/notificationService";
import {useSelector} from "react-redux";
import {Box, Text, Button, Flex} from "@chakra-ui/react";
import {format, parseISO, isValid} from "date-fns";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {formatDate} from "@utils/dateFormats";
import TimeCounter from "@components/TimeCounter";

export const useNotifications = ({
  type = "Action Needed",
  onViewNotification = () => {},
}) => {
  const navigate = useNavigate();
  const clientType = useSelector((state) => state.auth.clientType);
  const userId = useSelector((state) => state.auth.userId);
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";
  const companyType = isBroker ? "broker_users_id" : "users_id";

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const offset = page * limit;

  const formatDateTime = (dateString) => {
    if (!dateString || dateString === "undefined" || dateString === "null") {
      return "—";
    }

    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return "—";
      }
      return format(date, "MMM dd, yyyy HH:mm");
    } catch (error) {
      return "—";
    }
  };

  const renderSeverityBadge = (severity) => {
    const severityLower = severity?.toLowerCase() || "";
    let bgColor = "#6B7280";
    let label = severity || "Unknown";

    if (severityLower === "critical") {
      bgColor = "#D92D20";
      label = "Critical";
    } else if (severityLower === "high") {
      bgColor = "#EF6820";
      label = "High";
    } else if (severityLower === "medium") {
      bgColor = "#F59E0B";
      label = "Medium";
    } else if (severityLower === "low") {
      bgColor = "#10B981";
      label = "Low";
    }

    return (
      <Box
        display="inline-flex"
        alignItems="center"
        gap="6px"
        bg={bgColor}
        color="white"
        px="10px"
        py="4px"
        borderRadius="22px"
        fontSize="12px"
        fontWeight="600">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="16px"
          border="2px solid #fff"
          h="16px"
          borderRadius="50%"
          bg={bgColor}
          flexShrink={0}>
          <Text color={"#fff"} fontSize="10px" fontWeight="bold" lineHeight="1">
            !
          </Text>
        </Box>
        <Text color="white" fontSize="12px" fontWeight="600">
          {label}
        </Text>
      </Box>
    );
  };

  const roleType = Boolean(isBroker) ? "broker" : "carrier";

  const headData = [
    {
      label: "Customer",
      key: [roleType],
      render: (value, row) => {
        console.log("row", row, value);
        const isUnread = row?.is_read === false || row?.is_read === 0;
        return (
          <Box display="flex" alignItems="center" gap="8px">
            {isUnread && (
              <Box
                w="8px"
                h="8px"
                borderRadius="50%"
                bg="#DC2626"
                flexShrink={0}
              />
            )}
            <Text fontSize="14px" color="#374151">
              {value?.legal_name || "—"}
            </Text>
          </Box>
        );
      },
    },
    {
      label: "Load ID",
      key: "load_id",
      render: (value, row) => (
        <Text fontSize="14px" color="#374151" fontWeight="500">
          {value || "—"}
        </Text>
      ),
    },
    {
      label: "Origin",
      key: "origin",
      render: (value) => (
        <Flex alignItems="center" gap="16px" justifyContent="space-between">
          <Box>
            <>
              {" "}
              <Text h="20px" fontSize="14px" fontWeight="500" color="#181D27">
                {`${value?.address ?? ""}` || ""}
              </Text>
              <Text h="20px">{formatDate(value?.arrive_by ?? "")}</Text>
            </>
          </Box>
        </Flex>
      ),
    },
    {
      label: "Destination",
      key: "stop",
      render: (value) => (
        <Flex gap="16px" alignItems="center" justifyContent="space-between">
          <Box>
            <Text h="20px" fontSize="14px" fontWeight="500" color="#181D27">
              {`${value?.address ?? ""}` || ""}
            </Text>
            <Text h="20px">{formatDate(value?.arrive_by ?? "")}</Text>
          </Box>
        </Flex>
      ),
    },
    {
      label: "Timer",
      key: "stop",
      render: (value) => (
        <Text fontSize="14px" color="#374151">
          <TimeCounter arriveBy={value?.arrive_by} />
        </Text>
      ),
    },
    // {
    //   label: "Reason",
    //   key: "type",
    //   render: (value) => (
    //     <Text fontSize="14px" color="#374151">
    //       {Array.isArray(value) ? value[0] : value || "—"}
    //     </Text>
    //   ),
    // },
    // {
    //   label: "Total Miles",
    //   key: "trip_id_data",
    //   render: (value) => (
    //     <Text fontSize="14px" color="#374151">
    //       {value?.total_miles ? `${value.total_miles.toFixed(0)} miles` : "—"}
    //     </Text>
    //   ),
    // },

    {
      label: "Actions",
      key: "guid",
      thProps: {
        width: "150px",
      },
      tdProps: {
        width: "150px",
      },
      render: (value, row) => (
        <Button
          fontWeight="500"
          variant="outline"
          color="#EF6820"
          h="28px"
          w="80px"
          fontSize="13px"
          borderColor="#535862"
          borderRadius="22px"
          border="none"
          px="12px"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/trips/${row?.orders_id}`, {
              state: {
                label: `${row?.driver_1?.first_name}.${row?.driver_1?.last_name}`,
                tripType: "upcoming",
              },
            });
            // onViewNotification?.(row);
          }}>
          View
        </Button>
      ),
    },
  ];

  const {
    data: notificationsListData = {},
    isLoading: isNotificationsListLoading,
  } = useQuery({
    queryKey: ["NOTIFICATIONS_LIST", page, limit, offset],
    queryFn: () =>
      notificationService.getNotificationList({
        data: {
          method: "list",
          object_data: {
            users_id: userId,
            notification_type: ["Action Needed"],
            offset: offset,
            limit: limit,
          },
          table: "user_notifications",
        },
      }),
    select: (res) => res?.data || {},
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  return {
    headData,
    data: notificationsListData?.response || [],
    isNotificationsLoading: isNotificationsListLoading,
    setLimit,
    limit,
    page,
    setPage,
    offset,
    count: notificationsListData?.total_count || 0,
    onViewNotification,
  };
};
