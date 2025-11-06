import {Box, Text} from "@chakra-ui/react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import styles from "../../styles/tabs.module.scss";
import HeadBreadCrumb from "@components/HeadBreadCrumb";
import GeneralTripsTab from "./Tabs/GeneralsTripTab";
import AddTrip from "./components/AddTrip/AddTrip";
import tripsService from "@services/tripsService";
import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {useState} from "react";

function UpcomingTabSinglePage() {
  const {id} = useParams();
  const [selectedTabId, setSelectedTabId] = useState(1);
  const envId = useSelector((state) => state.auth.environmentId);

  const {data: tripData = {}, isLoading} = useQuery({
    queryKey: ["TRIP_BY_ID", id, selectedTabId],
    queryFn: () =>
      tripsService.getTripById({
        app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
        environment_id: envId,
        method: "single",
        object_data: {
          trip_id: id,
        },
        table: "trips",
      }),
    enabled: !!id,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    select: (data) => data?.data?.response?.[0] || [],
  });

  return (
    <Box>
      <HeadBreadCrumb />

      <Box my={"20px"} h={"32px"}>
        <Text h={"32px"} color={"#181D27"} fontWeight={"600"} fontSize={"24px"}>
          Trips
        </Text>
      </Box>

      <Tabs
        onSelect={(index) => setSelectedTabId(index)}
        className={styles.tabsContainer}>
        <TabList>
          <Tab>Trip</Tab>
          <Tab>History</Tab>
        </TabList>

        <TabPanel>
          <AddTrip tripData={tripData} />
        </TabPanel>

        {/* <TabPanel>
          <HistoryTripsTab />
        </TabPanel> */}

        <TabPanel>
          <GeneralTripsTab isLoading={isLoading} />
        </TabPanel>
      </Tabs>
    </Box>
  );
}

export default UpcomingTabSinglePage;
