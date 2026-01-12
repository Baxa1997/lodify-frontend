import {Box, Spinner} from "@chakra-ui/react";
import {useCarrierProfileProps} from "./useCarrierProfileProps";
import {MainInfo} from "./components/MainInfo";
import {CarrierTabs} from "./components/CarrierTabs";
import {useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";

export const CarrierProfile = () => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");
  const prevCompaniesIdRef = useRef(companies_id);
  const [isNavigating, setIsNavigating] = useState(false);

  const {generalInfo, operation, isLoading, isFetching} =
    useCarrierProfileProps();

  useEffect(() => {
    if (
      prevCompaniesIdRef.current &&
      prevCompaniesIdRef.current !== companies_id
    ) {
      setIsNavigating(true);
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }
    prevCompaniesIdRef.current = companies_id;
  }, [companies_id]);

  useEffect(() => {
    if (!isLoading && !isFetching && companies_id) {
      setIsNavigating(false);
    }
  }, [isLoading, isFetching, companies_id]);

  const showLoading =
    (isLoading || isFetching || isNavigating) && Boolean(companies_id);

  useEffect(() => {
    if (showLoading) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [showLoading]);

  return (
    <Box position="relative">
      <MainInfo generalInfo={generalInfo} />
      <CarrierTabs generalInfo={generalInfo} operation={operation} />

      {showLoading && (
        <Box
          h="100vh"
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          overflow="hidden"
          bg="rgba(0, 0, 0, 0.3)"
          zIndex="9999"
          display="flex"
          alignItems="center"
          justifyContent="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="#ff5b04"
            size="xl"
          />
        </Box>
      )}
    </Box>
  );
};
