import React, {useState} from "react";
import {Box, Text, Button, VStack, Flex} from "@chakra-ui/react";
import HFTextField from "../../../../components/HFTextField";
import {useNavigate} from "react-router-dom";
import {useWatch} from "react-hook-form";

const VerificationStep = ({
  watch,
  setValue = () => {},
  onSubmit = () => {},
  onNext = () => {},
  control,
  registerSuccess = false,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const passwordValue = useWatch({
    control,
    name: "password",
  });

  const handleCreateAccount = async () => {
    setIsLoading(true);
    try {
      await onSubmit(watch());
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return !registerSuccess ? (
    <Box borderRadius="12px" bg="white">
      <VStack align="start" spacing={2} mb={6}>
        <Text fontSize="18px" fontWeight="600" color="#111827">
          Create Account
        </Text>
        <Text fontSize="16px" w="360px" color="#6B7280">
          Enter your email and create a secure password to continue.
        </Text>
      </VStack>

      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontSize="14px" fontWeight="500" color="#414651" mb={2}>
            Email <span style={{color: "#EF6820"}}>*</span>
          </Text>
          <HFTextField
            borderColor="#E2E8F0"
            name="email"
            placeholder="example@gmail.com"
            control={control}
            disabled
          />
        </Box>

        <Box>
          <Text fontSize="14px" fontWeight="500" color="#414651" mb={2}>
            Login <span style={{color: "#EF6820"}}>*</span>
          </Text>
          <HFTextField
            borderColor="#E2E8F0"
            name="login"
            placeholder="Create a login"
            control={control}
          />
        </Box>

        <Box>
          <Text fontSize="14px" fontWeight="500" color="#414651" mb={2}>
            New Password <span style={{color: "#EF6820"}}>*</span>
          </Text>
          <HFTextField
            borderColor="#E2E8F0"
            type="password"
            name="password"
            placeholder="New password"
            control={control}
            required
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              validate: (value) => {
                if (!value) return "Password is required";
                if (value.length < 6) {
                  return "Password must be at least 6 characters";
                }
                if (!/[A-Z]/.test(value)) {
                  return "Password must contain at least one uppercase letter";
                }
                if (!/[a-z]/.test(value)) {
                  return "Password must contain at least one lowercase letter";
                }
                if (!/[0-9]/.test(value)) {
                  return "Password must contain at least one number";
                }
                if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
                  return "Password must contain at least one symbol";
                }
                return true;
              },
            }}
          />
        </Box>

        <Box>
          <Text fontSize="14px" fontWeight="500" color="#414651" mb={2}>
            Repeat New Password <span style={{color: "#EF6820"}}>*</span>
          </Text>
          <HFTextField
            borderColor="#E2E8F0"
            type="password"
            name="confirmPassword"
            placeholder="Repeat new password"
            control={control}
            required
            rules={{
              required: "Please confirm your password",
              validate: (value) => {
                console.log("passwordValuepasswordValue", passwordValue);
                if (!value) return "Please confirm your password";
                if (value !== passwordValue) {
                  return "Passwords do not match";
                }
                return true;
              },
            }}
          />
        </Box>

        <Button
          w="100%"
          h="44px"
          bg="#EF6820"
          color="white"
          _hover={{bg: "#EF6820"}}
          borderRadius="8px"
          onClick={handleCreateAccount}
          isLoading={isLoading}
          loadingText="Creating Account..."
          mt={4}>
          Login
        </Button>

        <Flex align="center" gap="8px" justify="center" w="100%">
          <img src="/img/backArrow.svg" alt="arrow-left" />
          <Text
            fontSize="16px"
            color="#6B7280"
            cursor="pointer"
            onClick={() => onNext()}>
            Back to Verify Identity
          </Text>
        </Flex>
      </VStack>
    </Box>
  ) : (
    <Box borderRadius="12px" bg="white" mt="20px">
      <Flex alignItems="center" justifyContent="center" flexDirection="column">
        <Box
          w="80px"
          h="80px"
          bg="#10B981"
          borderRadius="50%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 4px 12px rgba(16, 185, 129, 0.3)">
          <Text fontSize="40px" color="white" fontWeight="bold">
            ✓
          </Text>
        </Box>

        <VStack w="100%" align="center" my="16px">
          <Text fontSize="24px" fontWeight="600" color="#111827">
            Thank you!
          </Text>
          <Text fontSize="16px" color="#6B7280" textAlign="center">
            Your identity is secured. We'll see you soon.
          </Text>
        </VStack>

        <Button
          w="100%"
          h="44px"
          bg="#EF6820"
          color="white"
          _hover={{bg: "#EF6820"}}
          borderRadius="8px"
          fontSize="16px"
          fontWeight="600"
          boxShadow="0 2px 8px rgba(239, 104, 32, 0.3)"
          onClick={() => navigate("/login")}>
          Go to Sign in
        </Button>
      </Flex>
    </Box>
  );
};

export default VerificationStep;
