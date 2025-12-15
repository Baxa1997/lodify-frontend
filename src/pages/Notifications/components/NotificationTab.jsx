import React from "react";
import NotificationFilters from "./NotificationFilters";
import {Box} from "@chakra-ui/react";
import {useNotifications} from "./useNotifications";
import {NotificationDataTable} from "./NotificationDataTable";

function NotificationTab() {
  const {headData, data} = useNotifications();
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
          limit={10}
          setLimit={() => {}}
          page={1}
          setPage={() => {}}
          pagination
          count={0}
          tableProps={{
            width: "100%",
          }}
        />
      </Box>
    </>
  );
}

export default NotificationTab;
