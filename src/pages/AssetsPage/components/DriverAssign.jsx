import React, {useEffect, useMemo, useState} from "react";
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import {BsThreeDotsVertical} from "react-icons/bs";
import assetsService from "@services/assetsService";
import HFSearchableSelect from "@components/HFSearchableSelect";
import useDebounce from "@hooks/useDebounce";

const DriverAssign = ({asset}) => {
  const queryClient = useQueryClient();
  const {control, handleSubmit, reset} = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );

  const debouncedSetSearch = useDebounce((value) => {
    setDebouncedSearchText(value);
  }, 300);

  useEffect(() => {
    debouncedSetSearch(searchText);
  }, [searchText, debouncedSetSearch]);

  const hasDriver = asset?.drivers_id || asset?.drivers?.id;
  const driverName =
    asset?.drivers?.first_name || asset?.drivers?.last_name
      ? `${asset?.drivers?.first_name || ""} ${
          asset?.drivers?.last_name || ""
        }`.trim()
      : null;

  useEffect(() => {
    if (isModalOpen) {
      reset();
      setSearchText("");
    }
  }, [isModalOpen, reset]);

  const onSubmit = (data) => {
    if (!data?.driver) {
      return;
    }

    setLoading(true);
    const updateData = {
      data: {
        drivers_id: data.driver,
        guid: asset?.guid,
      },
    };

    assetsService
      .updateAsset(asset?.guid, updateData)
      .then((res) => {
        queryClient.invalidateQueries({queryKey: ["GET_ASSETS_LIST"]});
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error assigning driver:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const {data: driversData} = useQuery({
    queryKey: ["DRIVERS_BY_COMPANY", companiesId, debouncedSearchText],
    queryFn: () =>
      assetsService.getDriversByCompany({
        method: "get",
        object_data: {
          companies_id: companiesId,
          ...(debouncedSearchText && {search: debouncedSearchText}),
        },
        table: "drivers_by_company",
      }),
    select: (res) => {
      const drivers = res?.data?.response || [];
      return drivers.map((driver) => ({
        label:
          `${driver.first_name || ""} ${driver.last_name || ""}`.trim() ||
          "Driver",
        value: driver.id || driver.guid,
        ...driver,
      }));
    },
    enabled: Boolean(isModalOpen) && !!companiesId,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const options = useMemo(() => {
    return driversData || [];
  }, [driversData]);

  const handleOpenModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setSearchText("");
  };

  return (
    <>
      {hasDriver ? (
        <Flex alignItems="center" gap="8px">
          <Text color="#535862" fontWeight="400" fontSize="14px">
            {driverName || "N/A"}
          </Text>
          <Menu>
            <MenuButton
              as={Button}
              p="0"
              maxWidth="22px"
              width="22px"
              minWidth="22px"
              height="22px"
              bg="none"
              onClick={(e) => e.stopPropagation()}>
              <BsThreeDotsVertical style={{width: "22px", height: "14px"}} />
            </MenuButton>
            <MenuList zIndex={8}>
              <MenuItem onClick={handleOpenModal}>
                <Text color="#535862" fontWeight="600">
                  Re-Assign Driver
                </Text>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      ) : (
        <Button
          bg="none"
          border="none"
          color="#EF6820"
          fontWeight="600"
          px="0"
          fontSize="14px"
          _hover={{bg: "none"}}
          onClick={handleOpenModal}>
          Assign
        </Button>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {hasDriver ? "Re-Assign Driver" : "Assign Driver"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Text fontSize="16px" fontWeight="500" color="gray.700" mb={2}>
                Select Driver
              </Text>
              <HFSearchableSelect
                control={control}
                name="driver"
                options={options}
                placeholder="Search and select driver..."
                searchText={searchText}
                setSearchText={setSearchText}
              />

              <Flex mt={4} justifyContent="flex-end" gap={2}>
                <Button
                  onClick={handleCloseModal}
                  variant="outline"
                  borderColor="#EF6820"
                  color="#EF6820"
                  fontSize="14px"
                  fontWeight="500"
                  px={4}
                  py={2}
                  borderRadius="8px"
                  _hover={{bg: "gray.50", borderColor: "#EF6820"}}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  bg="#EF6820"
                  color="white"
                  _hover={{bg: "#d45a1a"}}
                  fontSize="14px"
                  fontWeight="600"
                  px={4}
                  py={2}
                  borderRadius="8px"
                  isLoading={loading}>
                  {hasDriver ? "Re-Assign" : "Assign"}
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DriverAssign;
