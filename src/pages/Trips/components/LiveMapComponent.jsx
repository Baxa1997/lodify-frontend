import React, { useMemo, useState } from "react";
import { Box, Button, Flex, Text, Tooltip } from "@chakra-ui/react";
import GoogleLiveComponent from "./GoogleLiveComponent";

function LiveMapComponent({ tripData = {} }) {
  const [latitude, setLatitude] = useState(37.422);
  const [longitude, setLongitude] = useState(-122.0862);

  const timelineEvents = useMemo(() => {
    const stopsWithStatus = tripData?.trips_logs?.filter((s) => s.status?.[0]);
    if (!stopsWithStatus?.length) return [];
    const count = stopsWithStatus?.length;
    return stopsWithStatus.map((s, idx) => {
      const percent = (idx / (count - 1)) * 100;
      return {
        status: s.status[0],
        date_time: s.date_time,
        percent,
      };
    });
  }, [tripData?.trips_logs]);

  const stoppedSegments = useMemo(() => {
    const stopsWithStatus = tripData?.trips_logs?.filter((s) => s.status?.[0]);
    if (stopsWithStatus?.length < 2) return [];

    const startTime = new Date(stopsWithStatus?.[0]?.date_time).getTime();
    const endTime = new Date(
      stopsWithStatus?.[stopsWithStatus?.length - 1]?.date_time,
    ).getTime();
    const totalTime = endTime - startTime;

    const segs = [];
    for (let i = 1; i < stopsWithStatus?.length; i++) {
      const prevTime = new Date(stopsWithStatus[i - 1].date_time).getTime();
      const currTime = new Date(stopsWithStatus[i].date_time).getTime();
      if (stopsWithStatus[i].status?.[0] === "STOPPED") {
        const left = ((prevTime - startTime) / totalTime) * 100;
        const width = ((currTime - prevTime) / totalTime) * 100;
        segs.push({ left, width });
      }
    }
    return segs;
  }, [tripData?.trips_logs]);

  const stoppedSegmentsLogs = useMemo(() => {
    if (!timelineEvents?.length) return [];

    const segs = [];
    for (let i = 0; i < timelineEvents.length; i++) {
      const ev = timelineEvents[i];
      const next = timelineEvents[i + 1];

      if (ev.status?.toUpperCase() === "STOPPED" && next) {
        segs.push({
          left: ev.percent,
          width: next.percent - ev.percent,
        });
      }
    }
    return segs;
  }, [timelineEvents]);

  return (
    <>
      <Box
        width="100%"
        overflow="hidden"
        height="410px"
        borderRadius="12px"
        border="1px solid #E2E8F0">
        <GoogleLiveComponent
          latitude={latitude}
          longitude={longitude}
        />
      </Box>

      <Flex
        justifyContent="space-between"
        alignItems="center"
        mt="12px">
        <Text
          p="6px 12px"
          borderRadius="8px"
          border="1px solid #E2E8F0">
          Jun 25, 09:48 +05
        </Text>
        <Box>
          <Button
            px="10px"
            bg="transparent"
            border="none"
            _hover={{ bg: "transparent" }}>
            <img
              src="/img/arrow-left-double.svg"
              alt="" />
          </Button>
          <Button
            px="10px"
            bg="transparent"
            border="none"
            _hover={{ bg: "transparent" }}>
            <img
              src="/img/play.svg"
              alt="" />
          </Button>
          <Button
            px="10px"
            bg="transparent"
            border="none"
            _hover={{ bg: "transparent" }}>
            <img
              src="/img/arrow-right-double.svg"
              alt="" />
          </Button>
        </Box>

        <Box>
          <Button
            px="12px"
            bg={"none"}
            border="1px solid #D5D7DA"
            _hover={{ bg: "none" }}>
            1x
          </Button>
          <Button
            ml="10px"
            px="12px"
            bg={"none"}
            border="1px solid #D5D7DA"
            _hover={{ bg: "none" }}>
            <img
              src="/img/refreshIcon.svg"
              alt="" />
          </Button>
        </Box>
      </Flex>

      <Box
        mt="16px"
        width="96%"
        m={"0 6px"}
        position="relative"
        height="80px">
        <Box
          position="absolute"
          top="40px"
          left="0"
          width="100%"
          height="8px"
          bg="#E2E8F0"
          borderRadius="4px"
        />

        {stoppedSegmentsLogs.map((seg, idx) => (
          <Box
            key={idx}
            position="absolute"
            top="40px"
            left={`${seg.left}%`}
            width={`${seg.width}%`}
            height="8px"
            bg="#4A5568"
            borderRadius="4px"
          />
        ))}

        {timelineEvents.map((ev, idx) => (
          <Box key={idx}>
            <Tooltip
              label={`${ev.status} – ${new Date(
                ev.date_time,
              ).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}, ${new Date(ev.date_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
              fontSize="sm"
              hasArrow>
              <Box
                position="absolute"
                top="28px"
                left={`${ev.percent}%`}
                transform="translate(-50%, -50%)"
                width="10px"
                height="10px"
                bg="#2D3748"
                borderRadius="2px"
                cursor="pointer"
              />
            </Tooltip>
            <Text
              position="absolute"
              top="55px"
              left={`${ev.percent}%`}
              transform="translateX(-50%)"
              fontSize="10px"
              color="#2D3748"
              whiteSpace="nowrap">
              {new Date(ev.date_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Box>
        ))}
      </Box>
    </>
  );
}

export default LiveMapComponent;
