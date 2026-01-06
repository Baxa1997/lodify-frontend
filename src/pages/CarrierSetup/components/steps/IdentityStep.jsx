import React, {useState} from "react";
import {
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
} from "@chakra-ui/react";
import {useSearchParams} from "react-router-dom";
import styles from "../../CarrierSetup.module.scss";
import HFTextField from "@components/HFTextField";
import {useWatch} from "react-hook-form";
import HFPhoneInput from "@components/HFPhoneInput";

const IdentityStep = ({control, subView = 1, isEditable = false, setValue}) => {
  const [searchParams] = useSearchParams();
  const carrierSetup = searchParams.get("carrier_setup");
  const values = useWatch({control});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContactType, setCurrentContactType] = useState("");
  const [originalValues, setOriginalValues] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Disable fields in first subview if carrier_setup query param is "true"
  const shouldDisableFields = subView === 1 && carrierSetup === "true";
  const fieldDisabled = !isEditable || shouldDisableFields;
  const handleOpenModal = (contactType) => {
    setCurrentContactType(contactType);

    const prefix = contactType.toLowerCase().replace(" ", "_");

    const original = {
      name: values?.contact_information?.[`${prefix}_name`] || "",
      email: values?.contact_information?.[`${prefix}_email`] || "",
      phone: values?.contact_information?.[`${prefix}_phone`] || "",
    };
    setOriginalValues(original);

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    const prefix = currentContactType.toLowerCase().replace(" ", "_");
    setValue(`contact_information.${prefix}_name`, originalValues.name);
    setValue(`contact_information.${prefix}_email`, originalValues.email);
    setValue(`contact_information.${prefix}_phone`, originalValues.phone);

    setIsModalOpen(false);
    setCurrentContactType("");
    setOriginalValues({name: "", email: "", phone: ""});
  };

  const handleSaveContact = () => {
    setIsModalOpen(false);
    setCurrentContactType("");
    setOriginalValues({name: "", email: "", phone: ""});
  };

  const getCurrentFieldPrefix = () => {
    return currentContactType.toLowerCase().replace(" ", "_");
  };

  const getContactData = (contactType) => {
    const prefix = contactType.toLowerCase().replace(" ", "_");
    return {
      name: values?.contact_information?.[`${prefix}_name`] || "---",
      email: values?.contact_information?.[`${prefix}_email`] || "---",
      phone: values?.contact_information?.[`${prefix}_phone`] || "---",
    };
  };

  if (subView === 2) {
    return (
      <>
        <Box className={styles.stepContentIdentityContact}>
          <Text fontSize="14x" fontWeight="600" color="#181D27">
            Confirm your contact information.
          </Text>
          <Text fontSize="14px" color="#6B7280" mb="14px">
            Enter the code we just sent to the mobile number you entered.
          </Text>

          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="16px">
            <ContactsInfo
              contactLabel="Dispatch"
              {...getContactData("Dispatch")}
              src="/img/dispatch.svg"
              onClick={() => handleOpenModal("Dispatch")}
            />

            <ContactsInfo
              contactLabel="Billing"
              {...getContactData("Billing")}
              src="/img/billing.svg"
              onClick={() => handleOpenModal("Billing")}
            />

            <ContactsInfo
              contactLabel="Claims"
              {...getContactData("Claims")}
              src="/img/claims.svg"
              onClick={() => handleOpenModal("Claims")}
            />

            <ContactsInfo
              contactLabel="After Hours"
              {...getContactData("After Hours")}
              src="/img/afterHours.svg"
              onClick={() => handleOpenModal("After Hours")}
            />
          </Box>
        </Box>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          size="md"
          isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize="18px" fontWeight="600" color="#181D27">
              {currentContactType}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Box mb={4}>
                <HFTextField
                  label="Full name"
                  required
                  control={control}
                  name={`contact_information.${getCurrentFieldPrefix()}_name`}
                  placeholder="Enter full name"
                  style={{
                    border: "1px solid #D5D7DA",
                  }}
                  labelStyle={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#414651",
                  }}
                />
              </Box>

              <Box mb={4}>
                <HFTextField
                  label="Email Address"
                  required
                  control={control}
                  name={`contact_information.${getCurrentFieldPrefix()}_email`}
                  placeholder="name@example.com"
                  type="email"
                  style={{
                    border: "1px solid #D5D7DA",
                  }}
                  labelStyle={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#414651",
                  }}
                />
              </Box>

              <Box mb={6}>
                <HFPhoneInput
                  label="Phone number"
                  control={control}
                  name={`contact_information.${getCurrentFieldPrefix()}_phone`}
                  placeholder="+1"
                  type="tel"
                  style={{
                    border: "1px solid #D5D7DA",
                  }}
                  labelStyle={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#414651",
                  }}
                />
              </Box>

              <Flex gap="12px" justifyContent="flex-end">
                <Button
                  variant="outline"
                  borderColor="#D1D5DB"
                  color="#374151"
                  fontSize="14px"
                  fontWeight="500"
                  px="20px"
                  py="6px"
                  borderRadius="8px"
                  _hover={{bg: "#F9FAFB"}}
                  onClick={handleCloseModal}>
                  Close
                </Button>
                <Button
                  bg="#EF6820"
                  color="white"
                  fontSize="14px"
                  fontWeight="600"
                  px="20px"
                  py="6px"
                  borderRadius="8px"
                  _hover={{bg: "#DC5A1A"}}
                  onClick={handleSaveContact}>
                  Save
                </Button>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <Box className={styles.stepContentIdentity}>
      <Text fontSize="14x" fontWeight="600" color="#181D27">
        Let&apos;s start with the basics.
      </Text>
      <Text fontSize="14px" color="#6B7280" mb="14px">
        Please confirm the information below.
      </Text>

      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="16px">
        <HFTextField
          disabled={fieldDisabled}
          label="Legal name"
          control={control}
          name="identity.legal_name"
          placeholder="Enter carrier name"
          style={{
            border: "1px solid #D5D7DA",
          }}
          labelStyle={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#414651",
          }}
        />

        <HFTextField
          disabled={fieldDisabled}
          label="Identifires"
          control={control}
          name="identity.us_dot_number"
          placeholder="Enter carrier name"
          style={{
            border: "1px solid #D5D7DA",
          }}
          labelStyle={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#414651",
          }}
        />
      </Box>

      <Box mt="14px">
        <Text fontSize="14px" fontWeight="600" color="#181D27" mb="12px">
          Physical Address
        </Text>

        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="16px">
          <HFTextField
            disabled={fieldDisabled}
            label="Address Line 1"
            control={control}
            name="identity.phy_street"
            placeholder="Address Line 1"
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <HFTextField
            disabled={fieldDisabled}
            label="Address Line 2"
            control={control}
            name=""
            placeholder="Address Line 2"
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <HFTextField
            disabled={fieldDisabled}
            label="City"
            control={control}
            name="identity.phy_city"
            placeholder="City"
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <HFTextField
            disabled={fieldDisabled}
            label="State"
            control={control}
            name="identity.phy_state"
            placeholder="State"
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <HFTextField
            disabled={fieldDisabled}
            label="ZIP"
            control={control}
            name="identity.phy_zip"
            placeholder="ZIP"
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <HFTextField
            disabled={fieldDisabled}
            label="Country"
            control={control}
            name="identity.phy_country"
            placeholder="Country"
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <HFTextField
            disabled={fieldDisabled}
            label="Phone(s)"
            control={control}
            name="identity.telephone"
            placeholder="Phones"
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />
        </Box>
      </Box>

      <Box mt="14px">
        <Text fontSize="14px" fontWeight="600" color="#181D27" mb="6px">
          Physical Address
        </Text>

        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="12px">
          <HFTextField
            disabled={fieldDisabled}
            label="Email address"
            control={control}
            name="identity.email"
            placeholder="Email address"
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <HFTextField
            disabled={fieldDisabled}
            label="Phone number"
            control={control}
            name="identity.telephone"
            placeholder="Phone number"
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const ContactsInfo = ({
  src = "/img/phone.svg",
  contactLabel = "Dispatch",
  name = "",
  phone = "",
  email = "",
  onClick,
}) => {
  return (
    <Box>
      <Text fontSize="14x" fontWeight="500" color="#414651" mb="8px">
        {contactLabel}
      </Text>
      <Box
        border="1px solid #D5D7DA"
        p="12px 14px"
        borderRadius="8px"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{
          borderColor: "#3b82f6",
          boxShadow: "0 0 0 1px #3b82f6",
        }}
        onClick={onClick}>
        <img width="28px" height="28px" src={src} alt="phone" />
        <Text
          color="#181D27"
          fontSize="16px"
          fontWeight="600"
          mt="12px"
          mb="6px">
          {name || "Name Surname"}
        </Text>
        <Text mb="6px" color="#535862" fontSize="14px">
          {email || "---"}
        </Text>
        <Text color="#535862" fontSize="14px">
          {phone || "---"}
        </Text>
      </Box>
    </Box>
  );
};

export default IdentityStep;
