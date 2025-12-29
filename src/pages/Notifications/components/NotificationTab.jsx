import React from "react";
import NotificationFilters from "./NotificationFilters";
import {Box} from "@chakra-ui/react";
import {useNotifications} from "./useNotifications";
import {NotificationDataTable} from "./NotificationDataTable";

function NotificationTab() {
  const {
    headData,
    data,
    isNotificationsLoading,
    limit,
    setLimit,
    page,
    setPage,
    count,
  } = useNotifications();
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
          page={page}
          setPage={setPage}
          pagination
          count={count}
          isLoading={isNotificationsLoading}
          tableProps={{
            width: "100%",
          }}
        />
      </Box>
    </>
  );
}

export default NotificationTab;
