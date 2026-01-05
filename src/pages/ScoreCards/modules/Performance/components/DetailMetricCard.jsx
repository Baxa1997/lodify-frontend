import {Flex, Text, Box, VStack, Link} from "@chakra-ui/react";
import {MdKeyboardArrowRight} from "react-icons/md";
import {ResponsiveBar} from "@nivo/bar";

const DetailedMetricCard = ({title = "Overall", data = {}}) => {
  return (
    <Flex
      bg="white"
      flexDirection="column"
      border="1px solid #E5E7EB"
      borderRadius="12px">
      <VStack spacing="10px" align="stretch">
        <Text
          borderBottom="1px solid #E5E7EB"
          fontSize="18px"
          fontWeight="600"
          color="#181D27"
          mb="4px"
          p="12px 20px">
          {title || ""}
        </Text>
        <Box px="20px">
          <Text fontSize="16px" color="#181D27" fontWeight="600">
            {data?.subtitle || ""}
          </Text>
          <Text fontSize="14px" color="#6B7280" lineHeight="1.5">
            {data?.description}
          </Text>
        </Box>

        <Flex p="20px" pb="0" gap="24px">
          <Box position="relative" width="55%" flexShrink={0}>
            <BarChart data={data} layout="vertical" title={title} />
          </Box>

          <VStack
            spacing="16px"
            width="37%"
            align="flex-start"
            pt="8px"
            flex="1">
            {(Array.isArray(data?.details) ? data.details : [data?.details])
              .filter(Boolean)
              .map((detail, index) => {
                const getItemColor = (label, index) => {
                  if (label?.toLowerCase().includes("accepted")) {
                    return "#10B981";
                  }
                  if (label?.toLowerCase().includes("rejected")) {
                    return "#EF4444";
                  }

                  const colors = [
                    data?.color || "#1570EF",
                    "#9333EA",
                    "#EC4899",
                    "#1E40AF",
                    "#10B981",
                    "#F59E0B",
                  ];
                  return colors[index % colors.length];
                };
                const itemColor = getItemColor(detail?.label, index);

                let displayValue = detail?.value;
                if (title === "Acceptance" || title === "Disruption Free") {
                  displayValue = parseFloat(detail?.value) || 0;
                }

                return (
                  <Flex key={index} alignItems="center" gap="12px">
                    <Box
                      w="12px"
                      h="12px"
                      borderRadius="50%"
                      bg={itemColor}
                      flexShrink={0}
                    />
                    <Box flex="1">
                      <Text
                        fontSize="14px"
                        fontWeight="600"
                        color="#181D27"
                        mb="4px">
                        {displayValue}
                        {detail?.contribution && (
                          <Text
                            as="span"
                            fontSize="12px"
                            color="#6B7280"
                            fontWeight="400"
                            ml="4px">
                            ({detail.contribution})
                          </Text>
                        )}
                      </Text>
                      <Text fontSize="13px" color="#6B7280" fontWeight="400">
                        {detail?.label}
                      </Text>
                    </Box>
                  </Flex>
                );
              })}
          </VStack>
        </Flex>

        <Flex
          alignItems="center"
          justifyContent="flex-end"
          p="12px 20px"
          borderTop="1px solid #E5E7EB">
          <Link
            href="#"
            fontSize="14px"
            color="#EF6820"
            fontWeight="500"
            _hover={{textDecoration: "underline"}}>
            View details
          </Link>
          <MdKeyboardArrowRight color="#EF6820" w="20px" h="20px" />
        </Flex>
      </VStack>
    </Flex>
  );
};

const BarChart = ({data, layout = "vertical", title = ""}) => {
  const {percentage, color, details} = data || {};
  const detailsArray = Array.isArray(details)
    ? details
    : details
    ? [details]
    : [];

  const hasDetails = detailsArray.length > 0;
  const isAcceptance = title === "Acceptance";
  const isDisruptionFree = title === "Disruption Free";
  const totalUnits = 300;

  const chartData = hasDetails
    ? detailsArray.map((detail, index) => {
        let value = 0;
        if (isAcceptance || isDisruptionFree) {
          value = parseFloat(detail?.value) || 0;
        } else {
          const valueStr = String(detail?.value || "0").replace(/%/g, "");
          value = parseFloat(valueStr) || 0;
        }
        return {
          id: detail?.label || `Item ${index + 1}`,
          value: value,
          label: detail?.label || "",
        };
      })
    : [
        {
          id: "value",
          value: Math.min(Math.max(percentage || 0, 0), 100),
        },
      ];

  const getColorForLabel = (label, index) => {
    if (label?.toLowerCase().includes("accepted")) {
      return "#10B981";
    }
    if (label?.toLowerCase().includes("rejected")) {
      return "#EF4444";
    }

    const defaultColors = [
      color || "#1570EF",
      "#9333EA",
      "#EC4899",
      "#1E40AF",
      "#10B981",
      "#F59E0B",
    ];
    return defaultColors[index % defaultColors.length];
  };

  const chartHeight = 240;
  const chartKeys = hasDetails ? ["value"] : ["value"];

  const maxValue = hasDetails
    ? isAcceptance || isDisruptionFree
      ? totalUnits
      : Math.max(...chartData.map((d) => d.value), 100)
    : 100;

  return (
    <Box position="relative" w="100%" h={`${chartHeight}px`}>
      <ResponsiveBar
        data={chartData}
        keys={chartKeys}
        indexBy="id"
        layout={layout}
        margin={{top: 20, right: 20, bottom: 10, left: 50}}
        padding={hasDetails ? 0.5 : 0.6}
        barComponent={({bar}) => {
          const barWidth = 40;
          return (
            <g transform={`translate(${bar.x},${bar.y})`}>
              <rect
                x={-barWidth / 2}
                y={0}
                width={barWidth}
                height={bar.height}
                fill={bar.color}
                rx={4}
              />
              {bar.height > 20 && (
                <text
                  x={0}
                  y={bar.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#FFFFFF"
                  fontSize={12}
                  fontWeight={600}>
                  {isAcceptance || isDisruptionFree
                    ? Math.round(bar.data.value)
                    : `${Math.round(bar.data.value)}%`}
                </text>
              )}
            </g>
          );
        }}
        valueScale={{
          type: "linear",
          min: 0,
          max:
            isAcceptance || isDisruptionFree
              ? totalUnits
              : Math.max(maxValue * 1.1, 100),
        }}
        indexScale={{type: "band", round: true}}
        colors={(bar) => {
          if (hasDetails) {
            const label = chartData[bar.index]?.label || "";
            return getColorForLabel(label, bar.index);
          }
          return color || "#1570EF";
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={null}
        axisLeft={{
          tickSize: 5,
          tickPadding: 8,
          tickRotation: 0,
          legend: "",
          legendPosition: "middle",
          legendOffset: -45,
          format: (value) =>
            isAcceptance || isDisruptionFree
              ? `${Math.round(value)}`
              : `${Math.round(value)}%`,
          tickValues: 5,
        }}
        enableLabel={false}
        enableGridY={true}
        enableGridX={false}
        gridYValues={5}
        gridYStrokeDasharray="2,2"
        gridYStroke="#E5E7EB"
        animate={true}
        motionConfig="gentle"
        borderRadius={4}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: "#6B7280",
                fontSize: 11,
                fontWeight: 500,
              },
              line: {
                stroke: "#E5E7EB",
                strokeWidth: 1,
              },
            },
            domain: {
              line: {
                stroke: "#E5E7EB",
                strokeWidth: 1,
              },
            },
          },
          grid: {
            line: {
              stroke: "#E5E7EB",
              strokeWidth: 1,
              strokeDasharray: "2,2",
            },
          },
        }}
      />
    </Box>
  );
};

export default DetailedMetricCard;
