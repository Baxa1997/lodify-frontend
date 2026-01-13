import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {QRCodeSVG} from "qrcode.react";
import {
  Box,
  Button,
  Text,
  Container,
  VStack,
  useToast,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import {MdCheckCircle, MdQrCodeScanner, MdLogout} from "react-icons/md";
import {authActions} from "../../store/auth/auth.slice";
import styles from "./QRVerification.module.scss";
import {useQuery} from "@tanstack/react-query";
import qrVerificationService from "@services/qrVerificationService";
import {MdOutlineErrorOutline} from "react-icons/md";
import {MdOutlineRefresh} from "react-icons/md";

const QRVerification = () => {
  const clientType = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const roleInfo = useSelector((state) => state?.auth?.roleInfo);
  const clientTypeId = useSelector((state) => state?.auth?.clientType?.id);

  const userId = useSelector((state) => state?.auth?.userId);

  const {
    data: qrVerificationLinkData,
    isLoading: isLoadingQR,
    isError: isQRError,
    error: qrError,
    isFetching: isFetchingQR,
    refetch: refetchQR,
  } = useQuery({
    queryKey: ["QR_VERIFICATION_LINK_URL", userId, clientTypeId, roleInfo?.id],
    queryFn: () =>
      qrVerificationService.getQRVerificationLink({
        data: {
          method: "generate_link",
          table: "session",
          object_data: {
            client_type_id: clientTypeId,
            role_id: roleInfo?.id,
            user_id: userId,
          },
        },
      }),
    select: (res) => res?.data || {},
    enabled: Boolean(userId && clientTypeId && roleInfo?.id),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: 2,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (qrVerificationLinkData?.url) {
      const qrData = {
        action: "mobile_verification",
        appDownloadUrl: qrVerificationLinkData?.url || "",
      };
      setQrValue(JSON.stringify(qrData));
    }
  }, [qrVerificationLinkData]);

  useEffect(() => {
    if (isQRError) {
      toast({
        title: "Failed to Generate QR Code",
        description:
          qrError?.message ||
          "Unable to generate verification link. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [isQRError, qrError, toast]);

  const handleVerification = () => {
    if (!qrVerificationLinkData?.vendor_data) {
      toast({
        title: "QR Code Not Ready",
        description: "Please wait for the QR code to load before verifying",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsVerifying(true);
    const splittedVal = qrVerificationLinkData?.vendor_data?.split(":")?.[1];

    if (Boolean(splittedVal)) {
      qrVerificationService
        .checkForVerification({
          guid: splittedVal,
        })
        .then((res) => {
          const response = res?.data?.response?.[0];
          const {is_verified, name_detected} = response;
          if (Boolean(is_verified) && Boolean(name_detected)) {
            toast({
              title: "Verification Successful",
              description: "You have been verified successfully!",
              status: "success",
              duration: 1000,
              isClosable: true,
              position: "top-right",
            });
            dispatch(authActions.setQRVerified(true));
            setTimeout(() => {
              navigate("/admin/dashboard");
              setIsVerifying(false);
            }, 1000);
          } else {
            toast({
              title: "Verification Failed",
              description: "You must verify your identity to continue",
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "top-right",
            });
            setIsVerifying(false);
          }
        })
        .catch((err) => {
          setIsVerifying(false);
          toast({
            title: "Verification Failed",
            description:
              err?.response?.data?.message ||
              "Invalid QR code or verification error",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          console.error("Verification error:", err);
        });
    } else {
      setIsVerifying(false);
      toast({
        title: "Invalid QR Data",
        description: "Unable to verify. Please refresh and try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleBackToLogin = () => {
    dispatch(authActions.logout());
    localStorage.clear();
    sessionStorage.clear();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });
    navigate("/login", {replace: true});
  };

  return (
    <div className={styles.verificationContainer}>
      <Container maxW="container.md" centerContent>
        <Box className={styles.verificationCard}>
          <VStack spacing={3} mb={6}>
            <Box className={styles.iconWrapper}>
              <Icon
                as={MdQrCodeScanner}
                boxSize={{base: 8, md: 10, lg: 12}}
                color="#ef6820"
              />
            </Box>
            <Text className={styles.title}>Mobile Verification Required</Text>
            <Text className={styles.subtitle}>
              Scan the QR code below with your mobile device to continue
            </Text>
          </VStack>

          <Box className={styles.qrSection}>
            <Box className={styles.qrWrapper}>
              {isLoadingQR ? (
                <VStack
                  spacing={4}
                  w={{base: "220px", md: "240px", lg: "280px"}}
                  h={{base: "220px", md: "240px", lg: "280px"}}
                  justify="center">
                  <Spinner
                    size={{base: "lg", md: "xl"}}
                    color="#ef6820"
                    thickness="4px"
                  />
                  <Text
                    fontSize={{base: "13px", md: "14px"}}
                    color="#6b7280"
                    fontWeight="500">
                    Generating QR Code...
                  </Text>
                </VStack>
              ) : isQRError ? (
                <VStack
                  spacing={3}
                  className={styles.errorContainer}
                  justify="center">
                  <MdOutlineErrorOutline size={100} color="#ef4444" />
                  <Text
                    fontSize={{base: "16px", md: "17px", lg: "18px"}}
                    color="#181d27"
                    fontWeight="700"
                    textAlign="center"
                    px={3}>
                    Failed to Generate QR Code
                  </Text>
                  <Text
                    fontSize={{base: "12px", md: "13px", lg: "14px"}}
                    color="#6b7280"
                    textAlign="center"
                    px={3}
                    maxW={{base: "180px", md: "200px", lg: "240px"}}>
                    Unable to create verification link. Please try again.
                  </Text>
                  <Button
                    isLoading={isFetchingQR}
                    onClick={() => refetchQR()}
                    bg="#ef6820"
                    color="white"
                    fontWeight="600"
                    w={{base: "90px", md: "90px", lg: "90px"}}
                    h={{base: "40px", md: "40px", lg: "40px"}}
                    borderRadius="10px"
                    mt={1}
                    _hover={{
                      bg: "#d85a1a",
                      transform: "translateY(-1px)",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    transition="all 0.2s ease">
                    <MdOutlineRefresh mr="6px" size={100} />
                    Retry
                  </Button>
                </VStack>
              ) : qrValue ? (
                <Box
                  w={{base: "220px", md: "240px", lg: "280px"}}
                  h={{base: "220px", md: "240px", lg: "280px"}}
                  display="flex"
                  alignItems="center"
                  justifyContent="center">
                  <QRCodeSVG
                    value={qrValue}
                    size={
                      window.innerWidth < 480
                        ? 220
                        : window.innerWidth < 768
                        ? 240
                        : 280
                    }
                    level="H"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#181D27"
                    imageSettings={{
                      src: "/img/singleLogo.svg",
                      x: undefined,
                      y: undefined,
                      height:
                        window.innerWidth < 480
                          ? 30
                          : window.innerWidth < 768
                          ? 35
                          : 40,
                      width:
                        window.innerWidth < 480
                          ? 30
                          : window.innerWidth < 768
                          ? 35
                          : 40,
                      excavate: true,
                    }}
                  />
                </Box>
              ) : (
                <VStack spacing={4} w="280px" h="280px" justify="center">
                  <Spinner size="xl" color="#ef6820" thickness="4px" />
                  <Text fontSize="14px" color="#6b7280" fontWeight="500">
                    Loading...
                  </Text>
                </VStack>
              )}
            </Box>
          </Box>

          <Box className={styles.actionSection}>
            <Button
              className={styles.verifyButton}
              onClick={handleVerification}
              isLoading={isVerifying}
              isDisabled={isLoadingQR || isQRError || !qrValue}
              loadingText="Verifying..."
              leftIcon={<MdCheckCircle />}
              size="lg"
              w="100%"
              h="44px"
              bg="#ef6820"
              color="white"
              fontSize="16px"
              fontWeight="600"
              borderRadius="12px"
              _hover={{
                bg: "#d85a1a",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(239, 104, 32, 0.3)",
              }}
              _active={{
                transform: "translateY(0)",
              }}
              _disabled={{
                bg: "#9ca3af",
                cursor: "not-allowed",
                opacity: 0.6,
              }}
              transition="all 0.3s ease">
              I Am Verified
            </Button>

            <Button
              mt="16px"
              className={styles.backButton}
              onClick={handleBackToLogin}
              leftIcon={<MdLogout />}
              size="lg"
              w="100%"
              h="44px"
              bg="#f3f4f6"
              color="#374151"
              border="2px solid #d1d5db"
              fontSize="16px"
              fontWeight="600"
              borderRadius="12px"
              _active={{
                transform: "translateY(0)",
                bg: "#d85a1a",
              }}
              transition="all 0.3s ease">
              Back to Login
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default QRVerification;
