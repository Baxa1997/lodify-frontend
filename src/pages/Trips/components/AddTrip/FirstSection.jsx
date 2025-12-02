import React, {useEffect, useState} from "react";
import {Flex} from "@chakra-ui/react";
import {Box} from "@chakra-ui/react";
import {Text} from "@chakra-ui/react";
import HFSelect from "../../../../components/HFSelect";
import HFTextField from "../../../../components/HFTextField";
import AssignTripCarrier from "./AssignTripCarrier";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import assetsService from "../../../../services/assetsService";
import tripsService from "../../../../services/tripsService";
import {useToast} from "@chakra-ui/react";

function FirstSection({control, watch}) {
  const clientType = useSelector((state) => state.auth.clientType);
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";
  const {id: tripId} = useParams();
  const toast = useToast();
  const [tractorValue, setTractorValue] = useState(null);
  const [trailerValue, setTrailerValue] = useState(null);

  const {data: trucksData} = useQuery({
    queryKey: ["TRUCKS_LIST"],
    queryFn: () => assetsService.getList({}),
    select: (res) =>
      res?.data?.response?.map((item) => ({
        label: item.licence_plate || item.name || "N/A",
        value: item.guid,
      })) || [],
    enabled: !!tripId,
  });

  const {data: trailersData} = useQuery({
    queryKey: ["TRAILERS_LIST"],
    queryFn: () => tripsService.getTrailersList(),
    select: (res) =>
      res?.data?.response?.map((item) => ({
        label: item.plate_number || item.external_id || "N/A",
        value: item.guid,
      })) || [],
    enabled: !!tripId,
  });

  const watchedTractor = watch("tractors_id");
  const watchedTrailer = watch("assets_id");

  useEffect(() => {
    if (watchedTractor && watchedTractor !== tractorValue && tripId) {
      setTractorValue(watchedTractor);
      assignTractor(watchedTractor);
    }
  }, [watchedTractor, tripId]);

  useEffect(() => {
    if (watchedTrailer && watchedTrailer !== trailerValue && tripId) {
      setTrailerValue(watchedTrailer);
      assignTrailer(watchedTrailer);
    }
  }, [watchedTrailer, tripId]);

  const assignTractor = async (assetsId) => {
    if (!tripId || !assetsId) return;

    try {
      await tripsService.updateOrder({
        data: {
          assets_id: assetsId,
          guid: tripId,
        },
      });
      toast({
        title: "Tractor Assigned",
        description: "Tractor has been assigned successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error assigning tractor:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to assign tractor",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const assignTrailer = async (trailersId) => {
    if (!tripId || !trailersId) return;

    try {
      await tripsService.updateOrder({
        data: {
          trailers_id: trailersId,
          guid: tripId,
        },
      });
      toast({
        title: "Trailer Assigned",
        description: "Trailer has been assigned successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error assigning trailer:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to assign trailer",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  return (
    <Box
      border="1px solid #E9EAEB"
      borderRadius="12px"
      p="24px"
      alignItems="center"
      gap="24px"
      justifyContent="space-between">
      <Flex alignItems="center" gap="24px" justifyContent="space-between">
        <Box w={"100%"}>
          <Text
            mb={"6px"}
            fontSize={"14px"}
            fontWeight={"500"}
            color={"#414651"}>
            Customer <span>*</span>
          </Text>
          <HFSelect
            view_fields={["name"]}
            value="guid"
            table_slug="shippers"
            size="md"
            control={control}
            name="shippers_id"
            options={[]}
          />
        </Box>
        <Box w={"100%"}>
          <Text
            mb={"6px"}
            fontSize={"14px"}
            fontWeight={"500"}
            color={"#414651"}>
            Load ID <span>*</span>
          </Text>
          <HFTextField
            disabled={true}
            placeholder="Load ID"
            border="1px solid #D5D7DA"
            size="md"
            width={"100%"}
            control={control}
            name="generated_id"
          />
        </Box>
        <Box w={"100%"}>
          <Text
            mb={"6px"}
            fontSize={"14px"}
            fontWeight={"500"}
            color={"#414651"}>
            Created By <span>*</span>
          </Text>
          <HFTextField
            disabled={true}
            border="1px solid #D5D7DA"
            size="md"
            width={"100%"}
            control={control}
            name="created_by"
          />
        </Box>
        {Boolean(isBroker) && (
          <AssignTripCarrier control={control} name="companies_id_2" />
        )}
      </Flex>
      {Boolean(!isBroker) && (
        <Flex
          mt="12px"
          alignItems="center"
          gap="24px"
          justifyContent="space-between">
          <Box w={"100%"}>
            <Text
              mb={"6px"}
              fontSize={"14px"}
              fontWeight={"500"}
              color={"#414651"}>
              Tractor <span>*</span>
            </Text>
            {tripId ? (
              <HFSelect
                control={control}
                name="assets_id"
                options={trucksData || []}
                size="md"
                disabled={!tripId}
              />
            ) : (
              <HFTextField
                disabled={true}
                placeholder="Tractor"
                border="1px solid #D5D7DA"
                size="md"
                width={"100%"}
                control={control}
                name="tractor"
              />
            )}
          </Box>
          <Box w={"100%"}>
            <Text
              mb={"6px"}
              fontSize={"14px"}
              fontWeight={"500"}
              color={"#414651"}>
              Trailer <span>*</span>
            </Text>
            {tripId ? (
              <HFSelect
                control={control}
                name="trailers_id"
                options={trailersData || []}
                size="md"
                disabled={!tripId}
              />
            ) : (
              <HFTextField
                disabled={true}
                border="1px solid #D5D7DA"
                size="md"
                width={"100%"}
                control={control}
                name="trailer"
              />
            )}
          </Box>
        </Flex>
      )}
    </Box>
  );
}

export default FirstSection;
