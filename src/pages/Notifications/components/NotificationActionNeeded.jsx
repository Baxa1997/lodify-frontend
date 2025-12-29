import React, {useState} from "react";
import NotificationFilters from "./NotificationFilters";
import {Box} from "@chakra-ui/react";
import {useNotifications} from "./useNotifications";
import {NotificationDataTable} from "./NotificationDataTable";
import NotificationDetailModal from "./NotificationDetailModal";
import notificationService from "@services/notificationService";
import {useQueryClient} from "@tanstack/react-query";

function NotificationActionNeeded() {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleViewNotification = async (notification) => {
    if (
      notification?.guid &&
      (notification?.is_read === false || notification?.is_read === 0)
    ) {
      try {
        await notificationService.markAsRead(notification.guid);
        queryClient.invalidateQueries({queryKey: ["NOTIFICATIONS"]});
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }

    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  const {
    headData,
    data,
    isNotificationsLoading,
    limit,
    setLimit,
    page,
    setPage,
    offset,
    count,
  } = useNotifications({
    type: "Action Needed",
    onViewNotification: handleViewNotification,
  });

  return (
    <>
      <NotificationFilters />

      <Box
        mt="20px"
        bg="white"
        border="1px solid #E5E7EB"
        borderRadius="12px"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        h="calc(100vh - 290px)"
        minH="400px">
        <NotificationDataTable
          headData={headData}
          data={data}
          caption={""}
          limit={limit}
          setLimit={setLimit}
          page={offset}
          pagination={true}
          setPage={setPage}
          count={count}
          isLoading={isNotificationsLoading}
          tableProps={{
            width: "100%",
          }}
        />
      </Box>

      <NotificationDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        notification={selectedNotification}
      />
    </>
  );
}

export default NotificationActionNeeded;
