import {Box, Spinner, Center} from "@chakra-ui/react";
import {useCarrierProfileProps} from "./useCarrierProfileProps";
import {MainInfo} from "./components/MainInfo";
import {CarrierTabs} from "./components/CarrierTabs";
import {useSearchParams} from "react-router-dom";
import {useEffect, useRef} from "react";

export const CarrierProfile = () => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");
  const prevCompaniesIdRef = useRef(companies_id);
  
  const {generalInfo, operation, isLoading, isFetching} = useCarrierProfileProps();

  // Scroll to top instantly when navigating to a different carrier
  useEffect(() => {
    if (prevCompaniesIdRef.current && prevCompaniesIdRef.current !== companies_id) {
      // Scroll instantly without animation
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }
    prevCompaniesIdRef.current = companies_id;
  }, [companies_id]);

  const showLoading = (isLoading || isFetching) && Boolean(companies_id);

  return (
    <Box position="relative">
      <MainInfo generalInfo={generalInfo} />
      <CarrierTabs generalInfo={generalInfo} operation={operation} />
      
      {showLoading && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.3)"
          zIndex="9999"
          display="flex"
          alignItems="center"
          justifyContent="center"
          transition="opacity 0.2s ease-in-out"
          opacity={showLoading ? 1 : 0}>
          <Center
            bg="white"
            borderRadius="12px"
            p="40px"
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="#EF6820"
              size="xl"
            />
          </Center>
        </Box>
      )}
    </Box>
  );
};
