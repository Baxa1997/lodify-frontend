import {useQuery} from "@tanstack/react-query";
import notificationService from "@services/notificationService";
import {useSelector} from "react-redux";
import {Box, Text, Button} from "@chakra-ui/react";
import {format, parseISO, isValid} from "date-fns";
import {useState} from "react";

export const useNotifications = ({
  type = "Action Needed",
  onViewNotification,
}) => {
  const clientType = useSelector((state) => state.auth.clientType);
  const userId = useSelector((state) => state.auth.userId);
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";
  const companyType = isBroker ? "broker_users_id" : "users_id";

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const offset = page === 1 ? 1 : (page - 1) * limit;

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

  const headData = [
    {
      label: "Customer",
      key: "title",
      render: (value, row) => {
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
              {value || "—"}
            </Text>
          </Box>
        );
      },
    },
    {
      label: "Load ID",
      key: "trip_id_data",
      render: (value, row) => (
        <Text fontSize="14px" color="#374151" fontWeight="500">
          {value?.id || row?.trip_id || "—"}
        </Text>
      ),
    },
    {
      label: "Origin",
      key: "trip_id_data",
      render: (value) => (
        <Text fontSize="14px" color="#374151">
          {value?.origin?.address || "—"}
        </Text>
      ),
    },
    {
      label: "Destination",
      key: "trip_id_data",
      render: (value) => (
        <Text fontSize="14px" color="#374151">
          {value?.stop?.address || "—"}
        </Text>
      ),
    },
    {
      label: "Timer",
      key: "pickup_id_data",
      render: (value) => (
        <Text fontSize="14px" color="#374151">
          {formatDateTime(value?.arrive_by)}
        </Text>
      ),
    },
    {
      label: "Reason",
      key: "type",
      render: (value) => (
        <Text fontSize="14px" color="#374151">
          {Array.isArray(value) ? value[0] : value || "—"}
        </Text>
      ),
    },
    {
      label: "Total Miles",
      key: "trip_id_data",
      render: (value) => (
        <Text fontSize="14px" color="#374151">
          {value?.total_miles ? `${value.total_miles.toFixed(0)} miles` : "—"}
        </Text>
      ),
    },

    {
      label: "Actions",
      key: "actions",
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
            onViewNotification?.(row);
          }}>
          View
        </Button>
      ),
    },
  ];

  const {data: notificationsData = {}, isLoading: isNotificationsLoading} =
    useQuery({
      queryKey: ["NOTIFICATIONS", page, limit, offset],
      queryFn: () =>
        notificationService.getList({
          [companyType]: userId,
          notification_type: [type],
          offset: offset,
          limit: limit,
        }),
      select: (res) => res?.data || {},
      enabled: true,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 0,
    });

  return {
    headData,
    data: notificationsData?.response || [],
    isNotificationsLoading,
    setLimit,
    limit,
    page,
    setPage,
    offset,
    count: notificationsData?.count || 0,
  };
};
