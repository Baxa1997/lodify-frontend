import React from "react";
import NotificationFilters from "./NotificationFilters";
import {DataTable} from "@components/DataTable";
import {Box} from "@chakra-ui/react";

function NotificationActionNeeded() {
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
        maxH="500px">
        <Box overflowX="auto" overflowY="auto" flex="1" minH="0">
          <DataTable
            headData={[
              {
                label: "Notification",
                key: "notification",
              },
            ]}
            data={[]}
            caption={""}
            limit={10}
            setLimit={() => {}}
            page={1}
            setPage={() => {}}
            tableProps={{
              width: "100%",
              height: "calc(100vh - 290px)",
              overflow: "auto",
            }}
          />
        </Box>
      </Box>
    </>
  );
}

export default NotificationActionNeeded;
