import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  Button,
  HStack,
} from "@chakra-ui/react";
import styles from "../style.module.scss";
import { useForm } from "react-hook-form";
import HFTextField from "../../../components/HFTextField";
import driversService from "@services/driversService";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCompanyId } from "@hooks/useGetCompanyId";

const AddDriverCode = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const environmentId = useSelector((state) => state?.auth?.environmentId);
  const queryClient = useQueryClient();

  const companyId = useGetCompanyId();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    driversService
      .addDrivercode({
        data: {
          app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
          environment_id: environmentId,
          method: "add",
          object_data: {
            driver_code: data?.driver_code,
            company_id: companyId,
          },
          table: "driver",
        },
      })
      .then(() => {
        queryClient.refetchQueries(["GET_DRIVERS_LIST"]);
        onClose();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          p={"14px 24px 6px"}
          fontSize="18px"
          fontWeight="600"
          color="gray.800">
          Add Driver
        </ModalHeader>
        <ModalBody p="8px 24px 12px">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <HFTextField
                border="1px solid #d5d7da"
                control={control}
                name="driver_code"
                placeholder={"Enter driver code"}
              />
            </FormControl>

            <HStack
              spacing={2}
              justify="flex-end"
              mt={3}>
              <Button
                fontWeight={400}
                onClick={onClose}
                type="button"
                variant="outline"
                isDisabled={loading}>
                Close
              </Button>
              <Button
                fontWeight={400}
                type="submit"
                className={styles.sendInviteButton}
                isDisabled={loading}>
                {loading ? "Adding..." : "Confirm"}
              </Button>
            </HStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddDriverCode;
