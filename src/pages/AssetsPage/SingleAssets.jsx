import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import HFTextField from "../../components/HFTextField";
import Select from "../../components/Select";
import assetsService from "../../services/assetsService";
import styles from "../../styles/tabs.module.scss";
import LocationTab from "./LocationTab";
import { fieldTypesOptions } from "./components/mockElements";

const SingleAssets = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      unit_number: "",
      license_plate: "",
      country: "",
      state: "",
      make: "",
      year: "",
      fuel_types: "",
      gross_weight: "",
      number_of_axles: "",
      vin_number: "",
      operated_by: "",
      current_driver: "",
      in_service_date: "",
      inactivated_at: "",
      ownership: "",
      owner_operator: "",
      include_to_the_ifta: "",
      asset_type: "",
      model: "",
      color: "",
      engine_size: "",
      transmission: "",
      mileage: "",
      purchase_date: "",
      purchase_price: "",
      current_value: "",
      status: "",
      location: "",
      companies_id: "",
      guid: "",
    },
  });

  const { data: assetData, isLoading: assetLoading } = useQuery({
    queryKey: ["GET_ASSET_BY_ID", id],
    queryFn: () => assetsService.getAssetById(id),
    enabled: !!id,
    select: (res) => res?.data?.data || res?.data || {},
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const updateAssetMutation = useMutation({
    mutationFn: (data) => assetsService.updateAsset(id, { data }),
    onSuccess: () => {
      navigate("/admin/assets");
      queryClient.invalidateQueries({ queryKey: ["GET_ASSETS_LIST"] });

      toast({
        title: "Asset Updated Successfully!",
        description: "Asset information has been saved",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Updating Asset",
        description:
          error?.response?.data?.message ||
          "Failed to update asset. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  useEffect(() => {
    if (assetData?.response) {
      const formData = {
        unit_number:
          assetData?.response?.vehicle_number ||
          assetData?.response?.units ||
          "",
        license_plate: assetData?.response?.licence_plate || "",
        country: assetData?.response?.country || "",
        state: assetData?.response?.state || "",
        make: assetData?.response?.make || "",
        year: assetData?.response?.year || null,
        fuel_type:
          assetData?.response?.fuel_types ||
          assetData?.response?.fuel_types_id ||
          "",
        gross_weight: assetData?.response?.gross_weight || null,
        number_of_axles: assetData?.response?.number_of_axles || null,
        vin_number: assetData?.response?.vin_number || "",

        operated_by: assetData?.response?.operated_by || null,
        current_driver: assetData?.response?.current_driver || "",
        in_service_date: assetData?.response?.in_service_date
          ? new Date(assetData.response.in_service_date)
            .toISOString()
            .split("T")[0]
          : null,
        inactivated_at: assetData?.response?.inactivated_at
          ? new Date(assetData.response.inactivated_at)
            .toISOString()
            .split("T")[0]
          : null,

        ownership: assetData?.response?.ownership || "",
        owner_operator: assetData?.response?.owner_operator || "",
        include_to_the_ifta: assetData?.response?.include_to_the_ifta || "",

        asset_type: Array.isArray(assetData?.response?.type)
          ? assetData?.response?.type[0] || ""
          : assetData?.response?.type || "",
        model: assetData?.response?.model || "",
        color: assetData?.response?.color || "",
        engine_size: assetData?.response?.engine_size || "",
        transmission: assetData?.response?.transmission || "",
        mileage: assetData?.response?.mileage || "",
        purchase_date: assetData?.response?.purchase_date || null,
        purchase_price: assetData?.response?.purchase_price || "",
        current_value: assetData?.response?.current_value || "",
        status: assetData?.response?.status || null,
        location: assetData?.response?.location || "",
        companies_id: assetData?.response?.companies_id || null,
        guid: id || "",
      };
      reset(formData);
    }
  }, [assetData, reset, id]);

  const handleBackToAssets = () => {
    navigate("/admin/assets");
  };

  const onSubmit = (data) => {
    const submitData = {
      ...data,
      fuel_types: data.fuel_type,
    };
    delete submitData.fuel_types;
    updateAssetMutation.mutate(submitData);
  };

  const handleSaveAndExit = () => {
    handleSubmit(onSubmit)();
    navigate("/admin/assets");
  };

  if (assetLoading) {
    return (
      <Flex
        flexDir={"column"}
        gap={"20px"}>
        <HeadBreadCrumb
          customPath={[
            { label: "Asset Info", path: `/admin/assets/${id}` },
            { label: "Assets", path: "/admin/assets" },
          ]}
        />
        <Box>Loading...</Box>
      </Flex>
    );
  }

  return (
    <Flex
      flexDir={"column"}
      gap={"20px"}>
      <HeadBreadCrumb
        customPath={[
          { label: "Asset Info", path: `/admin/assets/${id}` },
          { label: "Assets", path: "/admin/assets" },
        ]}
      />

      <Box h={"32px"}>
        <Text
          h={"32px"}
          color={"#181D27"}
          fontWeight={"600"}
          fontSize={"24px"}>
          {assetData
            ? `${assetData?.response?.asset_name || ""} ${
              assetData?.response?.year || ""
            }`.trim() || "Asset Details"
            : "Asset Details"}
        </Text>
      </Box>

      <Tabs className={styles.tabsContainer}>
        <TabList>
          <Tab>Asset Info</Tab>
          <Tab>Maintenance</Tab>
          <Tab>Location</Tab>
        </TabList>

        <TabPanel>
          <Box
            bg={"white"}
            borderRadius={"8px"}
            pt={"24px"}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex
                flexDir={"column"}
                align={"stretch"}>
                <Box
                  borderBottom={"1px solid #E2E8F0"}
                  pb={"24px"}
                  mb={"24px"}>
                  <Flex gap={"32px"}>
                    <Text
                      w={"26%"}
                      fontWeight={"600"}
                      fontSize={"16px"}
                      color={"#181D27"}
                      mb={"16px"}>
                      Unit Details
                    </Text>
                    <Flex
                      w={"48%"}
                      gap={"16px"}
                      flexDir={"column"}>
                      <Box>
                        <Text
                          fontWeight={"500"}
                          fontSize={"14px"}
                          color={"#181D27"}
                          mb={"8px"}>
                          Operated By <span style={{ color: "#1570EF" }}>*</span>
                        </Text>
                        <HFTextField
                          control={control}
                          name="operated_by"
                          borderColor={"#E2E8F0"}
                          _focus={{ borderColor: "#3182CE" }}
                        />
                      </Box>

                      <Box>
                        <Text
                          fontWeight={"500"}
                          fontSize={"14px"}
                          color={"#181D27"}
                          mb={"8px"}>
                          Current Driver(s){" "}
                          <span style={{ color: "#1570EF" }}>*</span>
                        </Text>
                        <HFTextField
                          control={control}
                          name="current_driver"
                          borderColor={"#E2E8F0"}
                          _focus={{ borderColor: "#3182CE" }}
                        />
                      </Box>

                      <Box>
                        <Text
                          fontWeight={"500"}
                          fontSize={"14px"}
                          color={"#181D27"}
                          mb={"8px"}>
                          In Service Date{" "}
                          <span style={{ color: "#1570EF" }}>*</span>
                        </Text>
                        <HFTextField
                          control={control}
                          name="in_service_date"
                          type="date"
                          borderColor={"#E2E8F0"}
                          _focus={{ borderColor: "#3182CE" }}
                        />
                      </Box>

                      <Box>
                        <Text
                          fontWeight={"500"}
                          fontSize={"14px"}
                          color={"#181D27"}
                          mb={"8px"}>
                          Inactivated At{" "}
                          <span style={{ color: "#1570EF" }}>*</span>
                        </Text>
                        <HFTextField
                          control={control}
                          name="inactivated_at"
                          type="date"
                          borderColor={"#E2E8F0"}
                          _focus={{ borderColor: "#3182CE" }}
                        />
                      </Box>
                    </Flex>
                  </Flex>
                </Box>

                <Box
                  borderBottom={"1px solid #E2E8F0"}
                  pb={"24px"}
                  mb={"24px"}>
                  <Flex gap={"32px"}>
                    <Text
                      w={"26%"}
                      fontWeight={"600"}
                      fontSize={"16px"}
                      color={"#181D27"}
                      mb={"16px"}></Text>
                    <Flex
                      w={"48%"}
                      gap={"16px"}
                      flexDir={"column"}>
                      <Flex
                        w={"100%"}
                        gap={"16px"}>
                        <Box flex={1}>
                          <Text
                            fontWeight={"500"}
                            fontSize={"14px"}
                            color={"#181D27"}
                            mb={"8px"}>
                            Unit # <span style={{ color: "#1570EF" }}>*</span>
                          </Text>
                          <HFTextField
                            control={control}
                            name="unit_number"
                            borderColor={"#E2E8F0"}
                            _focus={{ borderColor: "#3182CE" }}
                          />
                        </Box>
                        <Box flex={1}>
                          <Text
                            fontWeight={"500"}
                            fontSize={"14px"}
                            color={"#181D27"}
                            mb={"8px"}>
                            License Plate #{" "}
                            <span style={{ color: "#1570EF" }}>*</span>
                          </Text>
                          <HFTextField
                            control={control}
                            name="license_plate"
                            borderColor={"#E2E8F0"}
                            _focus={{ borderColor: "#3182CE" }}
                          />
                        </Box>
                      </Flex>

                      <Flex
                        w={"100%"}
                        gap={"16px"}>
                        <Box flex={1}>
                          <Text
                            fontWeight={"500"}
                            fontSize={"14px"}
                            color={"#181D27"}
                            mb={"8px"}>
                            Country <span style={{ color: "#1570EF" }}>*</span>
                          </Text>
                          <HFTextField
                            control={control}
                            name="country"
                            borderColor={"#E2E8F0"}
                            _focus={{ borderColor: "#3182CE" }}
                          />
                        </Box>
                        <Box flex={1}>
                          <Text
                            fontWeight={"500"}
                            fontSize={"14px"}
                            color={"#181D27"}
                            mb={"8px"}>
                            State <span style={{ color: "#1570EF" }}>*</span>
                          </Text>
                          <HFTextField
                            control={control}
                            name="state"
                            borderColor={"#E2E8F0"}
                            _focus={{ borderColor: "#3182CE" }}
                          />
                        </Box>
                      </Flex>

                      <Box flex={1}>
                        <Text
                          fontWeight={"500"}
                          fontSize={"14px"}
                          color={"#181D27"}
                          mb={"8px"}>
                          Make <span style={{ color: "#1570EF" }}>*</span>
                        </Text>
                        <HFTextField
                          control={control}
                          name="make"
                          borderColor={"#E2E8F0"}
                          _focus={{ borderColor: "#3182CE" }}
                        />
                      </Box>
                      <Box flex={1}>
                        <Text
                          fontWeight={"500"}
                          fontSize={"14px"}
                          color={"#181D27"}
                          mb={"8px"}>
                          Year <span style={{ color: "#1570EF" }}>*</span>
                        </Text>
                        <HFTextField
                          control={control}
                          name="year"
                          type="number"
                          borderColor={"#E2E8F0"}
                          _focus={{ borderColor: "#3182CE" }}
                        />
                      </Box>

                      <Box flex={1}>
                        <Text
                          fontWeight={"500"}
                          fontSize={"14px"}
                          color={"#181D27"}
                          mb={"8px"}>
                          Fuel Type <span style={{ color: "#1570EF" }}>*</span>
                        </Text>
                        <Controller
                          name="fuel_types"
                          control={control}
                          render={({ field }) => (
                            <Select
                              placeholder="Select fuel type"
                              value={field.value || ""}
                              options={fieldTypesOptions}
                              onChange={(value) => field.onChange(value)}
                              borderColor={"#E2E8F0"}
                              focusBorderColor={"#3182CE"}
                            />
                          )}
                        />
                      </Box>

                      <Flex
                        w={"100%"}
                        gap={"16px"}>
                        <Box flex={1}>
                          <Text
                            fontWeight={"500"}
                            fontSize={"14px"}
                            color={"#181D27"}
                            mb={"8px"}>
                            Number of Axles{" "}
                            <span style={{ color: "#1570EF" }}>*</span>
                          </Text>
                          <HFTextField
                            control={control}
                            name="number_of_axles"
                            type="number"
                            borderColor={"#E2E8F0"}
                            _focus={{ borderColor: "#3182CE" }}
                          />
                        </Box>
                        <Box flex={1}>
                          <Text
                            fontWeight={"500"}
                            fontSize={"14px"}
                            color={"#181D27"}
                            mb={"8px"}>
                            Gross Weight{" "}
                            <span style={{ color: "#1570EF" }}>*</span>
                          </Text>
                          <HFTextField
                            control={control}
                            name="gross_weight"
                            type="number"
                            borderColor={"#E2E8F0"}
                            _focus={{ borderColor: "#3182CE" }}
                          />
                        </Box>
                      </Flex>

                      <Flex
                        w={"100%"}
                        gap={"16px"}>
                        <Box flex={1}>
                          <Text
                            fontWeight={"500"}
                            fontSize={"14px"}
                            color={"#181D27"}
                            mb={"8px"}>
                            VIN # <span style={{ color: "#1570EF" }}>*</span>
                          </Text>
                          <HFTextField
                            control={control}
                            name="vin_number"
                            borderColor={"#E2E8F0"}
                            _focus={{ borderColor: "#3182CE" }}
                          />
                        </Box>
                      </Flex>
                    </Flex>
                  </Flex>
                </Box>

                <Box
                  borderBottom={"1px solid #E2E8F0"}
                  pb={"24px"}
                  mb={"24px"}>
                  <Flex gap={"32px"}>
                    <Text
                      w={"26%"}
                      fontWeight={"600"}
                      fontSize={"16px"}
                      color={"#181D27"}
                      mb={"16px"}>
                      Ownership Details
                    </Text>
                    <Flex
                      w={"48%"}
                      gap={"16px"}
                      flexDir={"column"}>
                      <Box flex={1}>
                        <Text
                          fontWeight={"500"}
                          fontSize={"14px"}
                          color={"#181D27"}
                          mb={"8px"}>
                          Ownership <span style={{ color: "#1570EF" }}>*</span>
                        </Text>
                        <HFTextField
                          control={control}
                          name="ownership"
                          borderColor={"#E2E8F0"}
                          _focus={{ borderColor: "#3182CE" }}
                        />
                      </Box>
                      <Box flex={1}>
                        <Text
                          fontWeight={"500"}
                          fontSize={"14px"}
                          color={"#181D27"}
                          mb={"8px"}>
                          Owner Operator{" "}
                          <span style={{ color: "#1570EF" }}>*</span>
                        </Text>
                        <HFTextField
                          control={control}
                          name="owner_operator"
                          borderColor={"#E2E8F0"}
                          _focus={{ borderColor: "#3182CE" }}
                        />
                      </Box>

                      <Box flex={1}>
                        <Text
                          fontWeight={"500"}
                          fontSize={"14px"}
                          color={"#181D27"}
                          mb={"8px"}>
                          Include To The IFTA{" "}
                          <span style={{ color: "#1570EF" }}>*</span>
                        </Text>
                        <HFTextField
                          control={control}
                          name="include_to_the_ifta"
                          borderColor={"#E2E8F0"}
                          _focus={{ borderColor: "#3182CE" }}
                        />
                      </Box>
                    </Flex>
                  </Flex>
                </Box>

                <Box w={"100%"}>
                  <Flex justify={"space-between"}>
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={handleBackToAssets}
                      bg={"#F7FAFC"}
                      border={"1px solid #E9EAEB"}
                      borderColor={"#E2E8F0"}
                      color={"#4A5568"}
                      borderRadius={"8px"}
                      px={"16px"}
                      py={"8px"}
                      _hover={{ bg: "#EDF2F7" }}>
                      Exit
                    </Button>

                    <Flex gap={"12px"}>
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={handleSaveAndExit}
                        bg={"white"}
                        border={"1px solid #E9EAEB"}
                        color={"#4A5568"}
                        borderRadius={"8px"}
                        px={"16px"}
                        py={"8px"}
                        _hover={{ bg: "#F7FAFC" }}
                        isLoading={updateAssetMutation.isPending}
                        loadingText="Saving...">
                        Save & Exit
                      </Button>
                      <Button
                        type="submit"
                        bg={"#3182CE"}
                        color={"white"}
                        size="md"
                        borderRadius={"8px"}
                        px={"16px"}
                        py={"8px"}
                        _hover={{ bg: "#2C5AA0" }}
                        isLoading={updateAssetMutation.isPending}
                        loadingText="Saving...">
                        Next →
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </form>
          </Box>
        </TabPanel>

        <TabPanel>
          <Box mt={"32px"}>
            <Text>Asset Maintenance records will be displayed here</Text>
          </Box>
        </TabPanel>

        <TabPanel>
          <LocationTab />
        </TabPanel>
      </Tabs>
    </Flex>
  );
};

export default SingleAssets;
