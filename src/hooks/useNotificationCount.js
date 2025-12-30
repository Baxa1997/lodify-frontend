import {useQuery} from "@tanstack/react-query";
import notificationService from "@services/notificationService";
import {useSelector} from "react-redux";

export const useNotificationCount = () => {
  const clientType = useSelector((state) => state.auth.clientType);
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";
  const clientTypeValue = isBroker ? "broker" : "carrier";

  const {data: countData, refetch} = useQuery({
    queryKey: ["NOTIFICATION_COUNT", clientTypeValue],
    queryFn: () => notificationService.getUnreadCount(clientTypeValue),
    select: (res) => {
      // The API returns the count in the response
      // Adjust based on actual API response structure
      return res?.data?.count || res?.count || res?.response?.count || 0;
    },
    enabled: Boolean(clientTypeValue),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  return {
    unreadCount: countData || 0,
    refetch,
  };
};

