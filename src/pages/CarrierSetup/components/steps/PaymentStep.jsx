import React from "react";
import {Box, Text} from "@chakra-ui/react";
import styles from "../../CarrierSetup.module.scss";
import GetPaid from "./Payments/GetPaid";
import ConfirmCompany from "./Payments/ConfirmCompany";
import VerifyIdentity from "./Payments/VerifyIdentity";
import OtpPhoneConfirm from "./Payments/OtpPhoneConfirm";
import EnterCompanyFactoring from "./Payments/EnterCompanyFactoring";
import ConfirmCompanyFactoring from "./Payments/ConfirmCompanyFactoring";

const PaymentStep = ({
  control,
  watch,
  setValue,
  subView = 1,
  onOtpSent,
  onOtpVerified,
}) => {
  const renderPaymentView = () => {
    switch (subView) {
      case 1:
        return (
          <Box className={styles.stepContentPayment}>
            <GetPaid control={control} />
          </Box>
        );
      case 2:
        return (
          <Box className={styles.stepContentPayment}>
            <ConfirmCompany control={control} />
          </Box>
        );
      case 3:
        return (
          <Box className={styles.stepContentPayment}>
            <VerifyIdentity
              control={control}
              watch={watch}
              setValue={setValue}
              onSendOtp={onOtpSent}
            />
          </Box>
        );
      case 4:
        return (
          <Box className={styles.stepContentPaymentOtp}>
            <OtpPhoneConfirm
              control={control}
              watch={watch}
              setValue={setValue}
              onVerifySuccess={onOtpVerified}
            />
          </Box>
        );
      case 5:
        return (
          <Box className={styles.stepContentPayment}>
            <EnterCompanyFactoring control={control} />
          </Box>
        );
      case 6:
        return (
          <Box className={styles.stepContentPayment}>
            <ConfirmCompanyFactoring control={control} />
          </Box>
        );
      default:
        return (
          <Box className={styles.stepContentPayment}>
            <ConfirmCompanyFactoring control={control} />
          </Box>
        );
    }
  };

  return renderPaymentView();
};

export default PaymentStep;
