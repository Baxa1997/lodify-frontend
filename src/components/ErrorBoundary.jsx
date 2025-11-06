import React, { Component } from "react";
import { Box, Text, Button, VStack } from "@chakra-ui/react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
          p={8}>
          <VStack
            spacing={4}
            textAlign="center">
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="red.500">
              Something went wrong
            </Text>
            <Text color="gray.600">
              We're sorry, but something unexpected happened. Please try again.
            </Text>
            <Button
              colorScheme="blue"
              onClick={this.handleRetry}
              mt={4}>
              Try Again
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
