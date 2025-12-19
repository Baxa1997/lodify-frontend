import {Box} from "@chakra-ui/react";
import {useCarrierProfileProps} from "./useCarrierProfileProps";
import {MainInfo} from "./components/MainInfo";
import {CarrierTabs} from "./components/CarrierTabs";

export const CarrierProfile = () => {
  const {generalInfo, operation} = useCarrierProfileProps();

  return (
    <Box>
      <MainInfo generalInfo={generalInfo} />
      <CarrierTabs generalInfo={generalInfo} operation={operation} />
    </Box>
  );
};
