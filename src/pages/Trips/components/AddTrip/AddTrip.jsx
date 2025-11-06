import React, {useEffect, useState} from "react";
import HeadBreadCrumb from "../../../../components/HeadBreadCrumb";
import {Box, Flex, Text, useToast, Button, Spinner} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import FirstSection from "./FirstSection";
import ThirdSection from "./ThirdSection";
import FourthSection from "./FourthSection";
import PackageSection from "./PackageSection";
import TotalRatesSection from "./TotalRatesSection";
import AddressSection from "./AddressSection";
import tripsService from "../../../../services/tripsService";
import {useSelector} from "react-redux";
import {generateID} from "@utils/generateID";
import {transformTripData, transformFileData} from "./hooks/transforData";

function AddTrip({tripData = {}}) {
  const {id} = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const {state} = location;
  const csvFile = state?.csv ?? "";

  const clientType = useSelector((state) => state.auth.clientType);
  const addTrip = location?.pathname?.includes("add-trip");
  const userData = useSelector((state) => state?.auth?.user_data);
  const envId = useSelector((state) => state.auth.environmentId);
  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );

  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";

  const {
    reset,
    setValue,
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm({
    defaultValues: {
      generated_id: generateID(),
    },
  });

  const totalRates = watch("accessorials");

  const {data: rocFileData = {}, isLoading: isRocFileLoading} = useQuery({
    queryKey: ["TRIP_BY_ID", csvFile],
    queryFn: () =>
      tripsService.getTripById({
        app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
        environment_id: envId,
        method: "extract",
        object_data: {
          file_url: csvFile,
          companies_id: companiesId,
        },
        table: "roc_file",
      }),
    enabled: Boolean(csvFile),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    select: (data) => data?.data?.response?.[0] || [],
  });

  useEffect(() => {
    if (!addTrip) {
      const transformedData = transformTripData(tripData);
      reset(transformedData);
    }
  }, [tripData, addTrip]);

  useEffect(() => {
    if (rocFileData?.guid) {
      const transformedData = transformFileData(rocFileData);
      reset(transformedData);
    }
  }, [rocFileData]);

  const createTripMutation = useMutation({
    mutationFn: (data) => {
      return tripsService.createTrip(data);
    },
    onSuccess: (response) => {
      toast({
        title: "Trip Created Successfully",
        description: "The trip has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/admin/trips");
    },
    onError: (error) => {
      toast({
        title: "Error Creating Trip",
        description:
          error?.response?.data?.message ||
          "Failed to create trip. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const updateTripMutation = useMutation({
    mutationFn: (data) => {
      return tripsService.updateTrip(id, data);
    },
    onSuccess: (response) => {
      console.log("Update response:", response);
      toast({
        title: "Trip Updated Successfully",
        description: "The trip has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/admin/trips");
    },
    onError: (error) => {
      toast({
        title: "Error Updating Trip",
        description:
          error?.response?.data?.message ||
          "Failed to update trip. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const getTotalAmount = () => {
    return totalRates?.length > 0
      ? totalRates?.reduce((total, field) => total + (field.amount || 0), 0)
      : 0;
  };

  const onSubmit = (data) => {
    const isUpdate = Boolean(id);
    const dataToSend = {
      data: {
        guid: id,
        app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
        environment_id: envId,
        method: isUpdate ? "update" : "create",
        object_data: {
          main_trip: {
            ...data,
            total_rates: getTotalAmount() + (watch("service_fee") ?? 0),
            generated_id: generateID(),
            brokers_id: isBroker ? userData?.brokers_id : undefined,
            broker_users_id: isBroker ? userData?.guid : undefined,
            bold_pod: data.bold_pod?.[0],
            rate_confirmation: data.rate_confirmation?.[0],
            ...(isUpdate && {trip_id: id}),
          },
          trip_pickups: data.trip_pickups,
          accessorials: data.accessorials,
        },
        table: "trips",
      },
    };

    if (isUpdate) {
      updateTripMutation.mutate(dataToSend);
    } else {
      createTripMutation.mutate(dataToSend);
    }
  };

  const handleCancel = () => {
    navigate("/admin/trips");
  };

  const handleManualSubmit = () => {
    const formData = watch();
    onSubmit(formData);
  };

  useEffect(() => {
    setValue(
      "created_by",
      `${userData?.first_name ?? ""} ${userData?.last_name ?? ""}`
    );
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
    }
  }, [errors]);

  useEffect(() => {
    if (isRocFileLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isRocFileLoading]);

  return (
    <>
      {isRocFileLoading && (
        <Box
          overflow="hidden"
          zIndex="99999"
          w="100%"
          color="white"
          h="100vh"
          position="fixed"
          top="0"
          left="0"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          justifyContent="center"
          gap="10px"
          flexDirection="column"
          alignItems="center">
          <Spinner size="xl" />
          <Text fontSize="16px" fontWeight="600" color="white">
            Loading Data...
          </Text>
        </Box>
      )}

      <Box mt={id ? "20px" : "0px"}>
        {!id && (
          <>
            {" "}
            <HeadBreadCrumb />
            <Box h={"32px"} mb={"30px"}>
              <Text
                mt="16px"
                fontSize={"24px"}
                h={"32px"}
                color={"#181D27"}
                fontWeight={"600"}>
                Add Trip
              </Text>
            </Box>
          </>
        )}

        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <FirstSection control={control} />
          <ThirdSection control={control} />

          <PackageSection setValue={setValue} control={control} />
          <TotalRatesSection watch={watch} control={control} />
          <FourthSection control={control} />
          <AddressSection
            control={control}
            isLoading={
              createTripMutation.isPending || updateTripMutation.isPending
            }
            onCancel={handleCancel}
          />

          <Flex
            mt="20px"
            borderTop="1px solid #E9EAEB"
            pt="20px"
            gap="12px"
            justifyContent="flex-end">
            <Button
              type="button"
              w="80px"
              border="1px solid #E9EAEB"
              borderRadius="8px"
              bg="transparent"
              mr="12px"
              _hover={{bg: "transparent"}}
              onClick={handleCancel}
              isDisabled={
                createTripMutation.isPending || updateTripMutation.isPending
              }>
              <Text ml="6px" fontSize="14px" fontWeight="600" color="#A4A7AE">
                Cancel
              </Text>
            </Button>
            <Button
              w="80px"
              type="button"
              _hover={{bg: "#1570EF"}}
              bg="#1570EF"
              loadingText="Saving..."
              isLoading={
                createTripMutation.isPending || updateTripMutation.isPending
              }
              onClick={(e) => {
                console.log("=== SUBMIT BUTTON CLICKED ===");
                console.log("Form errors:", errors);
                console.log(
                  "Is pending:",
                  createTripMutation.isPending || updateTripMutation.isPending
                );

                e.preventDefault();
                console.log("Manually triggering form submission...");
                handleManualSubmit();
              }}>
              <Text ml="6px" fontSize="14px" fontWeight="600" color="#fff">
                {createTripMutation.isPending || updateTripMutation.isPending
                  ? "Saving..."
                  : "Save"}
              </Text>
            </Button>
          </Flex>
        </form>
      </Box>
    </>
  );
}

export default AddTrip;
