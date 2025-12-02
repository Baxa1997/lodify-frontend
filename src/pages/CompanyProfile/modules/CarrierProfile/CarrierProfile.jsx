import {Box} from "@chakra-ui/react";
import {useCarrierProfileProps} from "./useCarrierProfileProps";
import {MainInfo} from "./components/MainInfo";
import {CarrierTabs} from "./components/CarrierTabs";

export const CarrierProfile = () => {
  const {
    generalInfo,
    companySnapshot,
    carrierDetails,
    insuranceHistory,
    operation,
  } = useCarrierProfileProps();

  return (
    <Box>
      <MainInfo generalInfo={generalInfo} />
      <CarrierTabs
        carrierDetails={carrierDetails}
        companySnapshot={companySnapshot}
        generalInfo={generalInfo}
        insuranceHistory={insuranceHistory}
        operation={operation}
      />
    </Box>
  );
};
