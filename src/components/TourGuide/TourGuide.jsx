import React, {useState, useEffect} from "react";
import Joyride, {ACTIONS, EVENTS, STATUS} from "react-joyride";
import {useNavigate, useLocation} from "react-router-dom";
import {Box, Button, Flex, Text} from "@chakra-ui/react";
import {useSelector} from "react-redux";

const TourGuide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [tourCompleted, setTourCompleted] = useState(false);

  const userInfo = useSelector((state) => state.auth.userInfo);
  const clientType = useSelector((state) => state.auth.clientType);
  const isCarrier = clientType?.id !== "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";

  // Check if user is new and hasn't completed the tour
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem(
      `tour_completed_${userInfo?.id}`
    );
    const isCarrierUser = isCarrier;

    // Only show tour for new carriers who haven't completed it
    if (!hasCompletedTour && isCarrierUser) {
      // Start tour after a short delay
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [userInfo?.id, isCarrier]);

  const steps = [
    {
      target: "body",
      content: (
        <Box>
          <Text fontSize="18px" fontWeight="600" mb="8px">
            Welcome to Lodify! 🎉
          </Text>
          <Text fontSize="14px" color="#6B7280">
            We're excited to have you here. Let's take a quick tour to help you
            get started with managing your trips and loads.
          </Text>
        </Box>
      ),
      placement: "center",
      disableBeacon: true,
    },
    {
      target: '[data-tour="dashboard"]',
      content: (
        <Box>
          <Text fontSize="16px" fontWeight="600" mb="8px">
            Dashboard Overview
          </Text>
          <Text fontSize="14px" color="#6B7280">
            Your dashboard provides a quick overview of your operations,
            including active trips, performance metrics, and important alerts.
          </Text>
        </Box>
      ),
      placement: "right",
      disableBeacon: true,
    },
    {
      target: '[data-tour="trips"]',
      content: (
        <Box>
          <Text fontSize="16px" fontWeight="600" mb="8px">
            Trips Management
          </Text>
          <Text fontSize="14px" color="#6B7280">
            This is where you'll spend most of your time. View and manage all
            your trips, from pending to completed deliveries.
          </Text>
        </Box>
      ),
      placement: "right",
      disableBeacon: true,
      beforeNavigate: () => {
        if (!location.pathname.includes("/trips")) {
          navigate("/admin/trips");
        }
      },
    },
    {
      target: '[data-tour="trips-tabs"]',
      content: (
        <Box>
          <Text fontSize="16px" fontWeight="600" mb="8px">
            Trip Categories
          </Text>
          <Text fontSize="14px" color="#6B7280">
            Organize your trips by status: Upcoming, Active, Actions Needed, and
            Completed. This helps you stay on top of what needs attention.
          </Text>
        </Box>
      ),
      placement: "bottom",
      disableBeacon: true,
    },
    {
      target: '[data-tour="add-trip"]',
      content: (
        <Box>
          <Text fontSize="16px" fontWeight="600" mb="8px">
            Create New Trips
          </Text>
          <Text fontSize="14px" color="#6B7280">
            Click here to add new trips to your schedule. You can add trip
            details, pickup and delivery locations, and more.
          </Text>
        </Box>
      ),
      placement: "left",
      disableBeacon: true,
    },
    {
      target: '[data-tour="notifications"]',
      content: (
        <Box>
          <Text fontSize="16px" fontWeight="600" mb="8px">
            Stay Updated
          </Text>
          <Text fontSize="14px" color="#6B7280">
            Get real-time notifications about trip updates, delays, and
            important alerts. Never miss critical information.
          </Text>
        </Box>
      ),
      placement: "bottom",
      disableBeacon: true,
    },
    {
      target: '[data-tour="profile"]',
      content: (
        <Box>
          <Text fontSize="16px" fontWeight="600" mb="8px">
            Your Profile & Settings
          </Text>
          <Text fontSize="14px" color="#6B7280">
            Manage your account, update company information, and configure your
            preferences from here.
          </Text>
        </Box>
      ),
      placement: "bottom",
      disableBeacon: true,
    },
    {
      target: "body",
      content: (
        <Box>
          <Text fontSize="18px" fontWeight="600" mb="8px">
            You're All Set! 🚀
          </Text>
          <Text fontSize="14px" color="#6B7280" mb="12px">
            You're ready to start managing your trips efficiently. If you need
            help at any time, you can restart this tour from your profile
            settings.
          </Text>
          <Text fontSize="13px" color="#9CA3AF" fontStyle="italic">
            Happy trucking!
          </Text>
        </Box>
      ),
      placement: "center",
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data) => {
    const {action, index, status, type, lifecycle} = data;

    // Handle step navigation that requires route changes
    if (
      type === EVENTS.STEP_AFTER &&
      lifecycle === "complete" &&
      steps[index + 1]?.beforeNavigate
    ) {
      steps[index + 1].beforeNavigate();
      // Wait for navigation to complete before showing next step
      setTimeout(() => {
        setStepIndex(index + 1);
      }, 500);
      return;
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Tour finished or skipped
      setRun(false);
      setTourCompleted(true);
      localStorage.setItem(`tour_completed_${userInfo?.id}`, "true");

      // Navigate back to dashboard if not already there
      if (!location.pathname.includes("/dashboard")) {
        navigate("/admin/dashboard");
      }
    }
  };

  // Function to restart tour (can be called from settings)
  const restartTour = () => {
    setStepIndex(0);
    setRun(true);
    setTourCompleted(false);
    navigate("/admin/dashboard");
  };

  // Expose restart function globally
  useEffect(() => {
    window.restartCarrierTour = restartTour;
    return () => {
      delete window.restartCarrierTour;
    };
  }, []);

  // Custom tooltip component
  const TooltipComponent = ({
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    tooltipProps,
    isLastStep,
  }) => (
    <Box
      {...tooltipProps}
      bg="white"
      borderRadius="12px"
      boxShadow="0 10px 40px rgba(0,0,0,0.2)"
      p="20px"
      maxW="400px"
      border="1px solid #E5E7EB">
      <Box mb="16px">{step.content}</Box>

      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="12px" color="#9CA3AF">
          {index + 1} of {steps.length}
        </Text>

        <Flex gap="8px">
          {index > 0 && (
            <Button
              {...backProps}
              size="sm"
              variant="outline"
              borderColor="#E5E7EB"
              color="#374151"
              _hover={{bg: "#F9FAFB"}}>
              Back
            </Button>
          )}

          {continuous && !isLastStep && (
            <Button
              {...primaryProps}
              size="sm"
              bg="#EF6820"
              color="white"
              _hover={{bg: "#DC5A1A"}}>
              Next
            </Button>
          )}

          {isLastStep && (
            <Button
              {...primaryProps}
              size="sm"
              bg="#10B981"
              color="white"
              _hover={{bg: "#059669"}}>
              Finish
            </Button>
          )}

          <Button
            {...closeProps}
            size="sm"
            variant="ghost"
            color="#6B7280"
            _hover={{bg: "#F9FAFB"}}>
            Skip
          </Button>
        </Flex>
      </Flex>
    </Box>
  );

  if (!isCarrier || tourCompleted) {
    return null;
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous={true}
      showProgress={false}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      tooltipComponent={TooltipComponent}
      disableOverlayClose={false}
      disableCloseOnEsc={false}
      spotlightClicks={false}
      styles={{
        options: {
          arrowColor: "white",
          backgroundColor: "white",
          overlayColor: "rgba(0, 0, 0, 0.5)",
          primaryColor: "#EF6820",
          textColor: "#181D27",
          zIndex: 10000,
        },
        spotlight: {
          borderRadius: "8px",
        },
      }}
    />
  );
};

export default TourGuide;
