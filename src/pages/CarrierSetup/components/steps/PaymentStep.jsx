import React from "react";
import {Box, Text} from "@chakra-ui/react";
import styles from "../../CarrierSetup.module.scss";
import GetPaid from "./Payments/GetPaid";
import ConfirmCompany from "./Payments/ConfirmCompany";
import VerifyIdentity from "./Payments/VerifyIdentity";
import OtpPhoneConfirm from "./Payments/OtpPhoneConfirm";
import EnterCompanyFactoring from "./Payments/EnterCompanyFactoring";
import ConfirmCompanyFactoring from "./Payments/ConfirmCompanyFactoring";

const PaymentStep = ({control, subView = 1}) => {
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
            <VerifyIdentity />
          </Box>
        );
      case 4:
        return (
          <Box className={styles.stepContentPayment}>
            <OtpPhoneConfirm />
          </Box>
        );
      case 5:
        return (
          <Box className={styles.stepContentPayment}>
            <EnterCompanyFactoring />
          </Box>
        );
      case 6:
        return (
          <Box className={styles.stepContentPayment}>
            <ConfirmCompanyFactoring />
          </Box>
        );
      // case 7:
      //   return (
      //     <Box className={styles.stepContentPayment}>
      //       <Text fontSize="24px" fontWeight="bold" color="#1e293b" mb="8px">
      //         Payment View 7
      //       </Text>
      //       <Text fontSize="14px" color="#414651" mb="12px">
      //         Payment step content for view 7
      //       </Text>
      //     </Box>
      //   );
      default:
        return (
          <Box className={styles.stepContentPayment}>
            <Text fontSize="24px" fontWeight="bold" color="#1e293b" mb="8px">
              Payment View 1
            </Text>
            <Text fontSize="14px" color="#414651" mb="12px">
              Payment step content for view 1
            </Text>
          </Box>
        );
    }
  };

  return renderPaymentView();
};

export default PaymentStep;
