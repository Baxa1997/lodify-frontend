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

const QRVerification = () => {
  const clientType = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const userInfo = useSelector((state) => state?.auth?.userInfo);
  const roleInfo = useSelector((state) => state?.auth?.roleInfo);
  const clientTypeId = useSelector((state) => state?.auth?.clientType?.id);

  const userId = useSelector((state) => state?.auth?.userId);

  const {data: qrVerificationLinkData} = useQuery({
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
  });

  useEffect(() => {
    const qrData = {
      action: "mobile_verification",
      appDownloadUrl: qrVerificationLinkData?.url || "",
    };
    setQrValue(JSON.stringify(qrData));
  }, [userId, userInfo, qrVerificationLinkData]);

  const handleVerification = () => {
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
            description: "Invalid QR code",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          console.log("err", err);
        })
        .finally(() => {});
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
          <VStack spacing={4} mb={6}>
            <Box className={styles.iconWrapper}>
              <Icon as={MdQrCodeScanner} boxSize={12} color="#ef6820" />
            </Box>
            <Text className={styles.title}>Mobile Verification Required</Text>
            <Text className={styles.subtitle}>
              Scan the QR code below with your mobile device to continue
            </Text>
          </VStack>

          <Box className={styles.qrSection}>
            <Box className={styles.qrWrapper}>
              {qrValue ? (
                <QRCodeSVG
                  value={qrValue}
                  size={280}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#181D27"
                  imageSettings={{
                    src: "/img/singleLogo.svg",
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              ) : (
                <Spinner size="xl" color="#ef6820" thickness="4px" />
              )}
            </Box>
          </Box>

          <Box className={styles.actionSection}>
            <Button
              className={styles.verifyButton}
              onClick={handleVerification}
              isLoading={isVerifying}
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

          {/* <Box className={styles.instructionsSection}>
            <Text className={styles.instructionsTitle}>How to verify:</Text>
            <VStack spacing={3} align="stretch" mt={4}>
              <Box className={styles.instructionItem}>
                <Box className={styles.stepNumber}>1</Box>
                <Box className={styles.stepContent}>
                  <Text className={styles.stepTitle}>Download the App</Text>
                  <Text className={styles.stepDescription}>
                    Download Lodify mobile app from App Store or Google Play
                  </Text>
                </Box>
              </Box>

              <Box className={styles.instructionItem}>
                <Box className={styles.stepNumber}>2</Box>
                <Box className={styles.stepContent}>
                  <Text className={styles.stepTitle}>Scan QR Code</Text>
                  <Text className={styles.stepDescription}>
                    Open the app and scan this QR code with your camera
                  </Text>
                </Box>
              </Box>

              <Box className={styles.instructionItem}>
                <Box className={styles.stepNumber}>3</Box>
                <Box className={styles.stepContent}>
                  <Text className={styles.stepTitle}>Verify Identity</Text>
                  <Text className={styles.stepDescription}>
                    Complete the verification process on your mobile device
                  </Text>
                </Box>
              </Box>
            </VStack>
          </Box>

        

          <Box className={styles.downloadSection}>
            <Text className={styles.downloadTitle}>
              <Icon as={MdSmartphone} mr={2} />
              Download Mobile App
            </Text>
            <Box className={styles.downloadButtons}>
              <a
                href="https://apps.apple.com/app/lodify"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadLink}>
                <img
                  src="/img/app-store-badge.svg"
                  alt="Download on App Store"
                  className={styles.storeBadge}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.lodify"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadLink}>
                <img
                  src="/img/google-play-badge.svg"
                  alt="Get it on Google Play"
                  className={styles.storeBadge}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </a>
            </Box>
          </Box> */}
        </Box>
      </Container>
    </div>
  );
};

export default QRVerification;
