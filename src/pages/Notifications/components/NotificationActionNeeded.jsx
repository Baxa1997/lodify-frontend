import React, {useState, useRef} from "react";
import NotificationFilters from "./NotificationFilters";
import {
  Box,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Text,
} from "@chakra-ui/react";
import {useNotifications} from "./useNotifications";
import {NotificationDataTable} from "./NotificationDataTable";
import NotificationDetailModal from "./NotificationDetailModal";
import notificationService from "@services/notificationService";
import {useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import {showAlert} from "@store/alert/alert.thunk";
import {useDispatch} from "react-redux";

function NotificationActionNeeded() {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReadAllDialogOpen, setIsReadAllDialogOpen] = useState(false);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const cancelRef = useRef();
  const clientType = useSelector((state) => state.auth.clientType);
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";
  const clientTypeValue = isBroker ? "broker" : "carrier";

  const handleViewNotification = (notification) => {
    // Open modal immediately for smooth UX
    setSelectedNotification(notification);
    setIsModalOpen(true);

    // Mark notification as read in the background (non-blocking)
    if (
      notification?.guid &&
      (notification?.is_read === false || notification?.is_read === 0)
    ) {
      // Fire and forget - don't await
      notificationService
        .markAsRead(notification.guid)
        .then(() => {
          // Invalidate and refetch notifications to update the UI
          queryClient.invalidateQueries({queryKey: ["NOTIFICATIONS"]});
        })
        .catch((error) => {
          console.error("Failed to mark notification as read:", error);
        });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  const handleReadAllClick = () => {
    setIsReadAllDialogOpen(true);
  };

  const handleConfirmReadAll = async () => {
    setIsMarkingAllAsRead(true);
    try {
      await notificationService.markAllAsRead(clientTypeValue);
      dispatch(showAlert("All notifications marked as read", "success"));
      queryClient.invalidateQueries({queryKey: ["NOTIFICATIONS"]});
      setIsReadAllDialogOpen(false);
    } catch (error) {
      dispatch(
        showAlert(
          error?.response?.data?.data ||
            "Failed to mark all notifications as read. Please try again.",
          "error"
        )
      );
    } finally {
      setIsMarkingAllAsRead(false);
    }
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
      <NotificationFilters
        onReadAllClick={handleReadAllClick}
        showReadAll={true}
      />

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

      <AlertDialog
        isOpen={isReadAllDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsReadAllDialogOpen(false)}
        isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="12px">
            <AlertDialogHeader
              fontSize="18px"
              fontWeight="600"
              color="#181D27"
              pb="16px">
              Mark All as Read
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text fontSize="14px" color="#374151" lineHeight="1.6">
                Are you sure you want to make all notifications read?
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter gap="12px" pt="16px">
              <Button
                ref={cancelRef}
                onClick={() => setIsReadAllDialogOpen(false)}
                variant="outline"
                borderColor="#E2E8F0"
                color="#4A5568"
                bg="white"
                fontSize="14px"
                fontWeight="500"
                px="16px"
                h="36px"
                borderRadius="8px"
                _hover={{bg: "#F7FAFC"}}
                isDisabled={isMarkingAllAsRead}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmReadAll}
                bg="#EF6820"
                color="white"
                fontSize="14px"
                fontWeight="500"
                px="16px"
                h="36px"
                borderRadius="8px"
                _hover={{bg: "#DC5A1A"}}
                isLoading={isMarkingAllAsRead}
                loadingText="Marking...">
                Yes, Mark All as Read
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default NotificationActionNeeded;
