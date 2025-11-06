import { Box, Button, Link, Text } from "@chakra-ui/react";
import MainHeading from "@components/MainHeading";
import StarRating from "@components/Rating";
import CustomBadge from "@components/CustomBadge";
import { MdMailOutline } from "react-icons/md";
import { RxCircleBackslash } from "react-icons/rx";
import { FiEyeOff } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { HiOutlineFlag } from "react-icons/hi2";
import { IoMdHelpCircleOutline } from "react-icons/io";
import AlertCard from "@components/AlertCard";
import Chart from "react-google-charts";
import Select from "@components/Select";
import { useMainSectionProps } from "./useMainSectionProps";
import { SectionCard, SectionCardBody, SectionCardHeader } from "../../../../components/SectionCard/SectionCard";
import { DataTable } from "@components/DataTable";
import { BoldLink } from "../../../../components/BoldLink";
import { CompanyInformation } from "../CompanyInformation";

export const MainSection = ({ data, companySnapshot }) => {

  const { headData, bodyData, pieData, options, btnStyleProps } = useMainSectionProps();

  return <Box
    display="flex"
    // columnGap="24px"
    // alignItems="flex-start"
  >
    {/* <Box
      maxWidth="528px"
      width="100%"
      display="flex"
      flexDirection="column"
      gap="24px"
    >
      <SectionCard
        variant="card"
        padding="0 !important"
      >
        <SectionCardHeader
          borderBottom="1px solid"
          borderColor="gray.border-main"              
          padding="20px 24px">
          <StarRating value={4.99} />
          <p>Average: 4.99 stars based on 521 customers</p>
          <MainHeading mt="8px">{data?.legal_name}</MainHeading>
        </SectionCardHeader>
        <SectionCardBody padding="24px">
          <MainHeading size="16px">
          DOT: {data?.us_dot_number}
          </MainHeading>
          <MainHeading size="16px">
          Docket: {data?.docket_number}
          </MainHeading>
          <Box
            mt="4px"
            display="flex"
            flexDirection="column"
            gap="4px"
          >
            <Link
              href="#"
              color="blue.500">
              {data?.phone}
            </Link>
            <Link
              href="#"
              color="blue.500"
            >
              {data?.mailing_address}
            </Link>
            <Link
              href="#"
              color="blue.500">
              {data?.physical_address}
            </Link>
          </Box>
          <Box
            display="flex"
            gap="32px"
            mt="32px"
          >
            <Box
              as="dl"
              width="100%">
              <Box
                display="flex"
                justifyContent="space-between"
                fontWeight={600}
                fontSize="16px"
              >
                <Box as="dt">Common:</Box>
                <Box as="dd">{data?.common_stat}</Box>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                fontWeight={600}
                fontSize="16px"
              >
                <Box as="dt">Broker:</Box>
                <Box as="dd">{data?.broker_stat}</Box>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                fontWeight={600}
                fontSize="16px"
              >
                <Box as="dt">Drivers:</Box>
                <Box as="dd">{data?.drivers}</Box>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                fontWeight={600}
                fontSize="16px"
              >
                <Box as="dt">Trailers:</Box>
                <Box as="dd">{data?.trailers}</Box>
              </Box>
            </Box>
            <Box
              as="dl"
              width="100%"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                fontWeight={600}
                fontSize="16px"
              >
                <Box as="dt">Common:</Box>
                <Box as="dd">Y</Box>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                fontWeight={600}
                fontSize="16px"
              >
                <Box as="dt">Broker:</Box>
                <Box as="dd">N</Box>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                fontWeight={600}
                fontSize="16px"
              >
                <Box as="dt">Drivers:</Box>
                <Box as="dd">320</Box>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                fontWeight={600}
                fontSize="16px"
              >
                <Box as="dt">Trailers:</Box>
                <Box as="dd">0</Box>
              </Box>
            </Box>
          </Box>
          <Box mt="32px">
            <DataTable
              headData={headData}
              data={bodyData}
              borderRadius="12px"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.border-main"
            />
          </Box>
          <Box mt="32px">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box
                display="flex"
                alignItems="center"
                gap="4px"
              >
                <MainHeading size="17px">
              Packet status:
                </MainHeading>
                <CustomBadge
                  withBgColor
                  variant="error"
                >
                Not invited
                </CustomBadge>
              </Box>
              <BoldLink icon={<MdMailOutline size="18px" />}>
                Intellivite
              </BoldLink>
            </Box>
            <Box
              display="flex"
              gap="12px"
              flexWrap="wrap"
              mt="12px"
            >
              <Button
                variant="outline"
                leftIcon={<RxCircleBackslash size={"16px"} />}
                {...btnStyleProps}
              >
              Block Carrier
              </Button>
              <Button
                colorScheme="red"
                leftIcon={<FiEyeOff size={"16px"} />}
                {...btnStyleProps}
              >
              Stop Monitoring
              </Button>
            </Box>
            <Box
              mt="12px"
              display="flex"
              gap="12px">
              <Button
                variant="solid"
                colorScheme="blue"
                leftIcon={<FaPlus size={"16px"} />}
                {...btnStyleProps}
              >
              Notes
              </Button>
              <Button
                variant="solid"
                colorScheme="blue"
                {...btnStyleProps}
              >
              Validate VIN
              </Button>
              <Button
                variant="solid"
                colorScheme="blue"
                {...btnStyleProps}
              >
              User Verification
              </Button>
            </Box>
          </Box>
          <Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt="32px"
            >
              <MainHeading size="17px">
                Incident Report
              </MainHeading>
              <BoldLink icon={<HiOutlineFlag size="18px" />}>
                Create New Report
              </BoldLink>
            </Box>
            <Box
              mt="12px"
              fontWeight="600"
              fontSize="14px"
            >
            0 reports exists
            </Box>
            <Box mt="12px">
              <AlertCard
                title="FMCSA change alert"
                description="The carrier has submitted an MCS-150 Form update within the past 60 days. Click here to review the changes"
              />
            </Box>
          </Box>
        </SectionCardBody>
      </SectionCard>
      <SectionCard
        variant="card"
        padding="0 !important"
      >
        <SectionCardHeader padding="20px 24px">
          <MainHeading size="17px">
        3rd party insights
          </MainHeading>
        </SectionCardHeader>
        <SectionCardBody padding="24px">
          <DataTable
            headData={[
              {
                label: "Total orders",
                key: "total_orders",
              },
              {
                label: "Loads tracked",
                key: "loads_tracked",
              },
            ]}
            data={
              [
                {
                  total_orders: "4529",
                  loads_tracked: "95.68%",
                },
              ]
            }
          />
          <Box
            mt="32px"
            display="flex"
            gap="32px">
            <Box flexGrow={1}>
              <Chart
                chartType="PieChart"
                data={pieData}
                options={options}
                width={"238px"}
                height={"120px"}
              />
            </Box>
            <Box
              display="flex"
              gap="12px"
              alignItems="center"
            >
              <img
                src="/img/validate.png"
                width={80}
                height={28} />
              <img
                src="/img/tia.svg"
                width={60}
                height={28} />
              <img
                src="/img/fmcsa.png"
                width={28}
                height={28} />
            </Box>
          </Box>
        </SectionCardBody>
      </SectionCard>
    </Box> */}
    <CompanyInformation data={data} />
    {/* <Box width="100%">
      <Text
        fontSize="18px"
        fontWeight={600}
        color="primary.500">
        Overall assessment using
      </Text>
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        gap="12px"
        mt="12px"
      >
        <Select
          value={"Industry standard"}
          options={[
            {
              label: "FMCSA",
              value: "FMCSA",
            },
            {
              label: "Intellivite",
              value: "Intellivite",
            },
            {
              label: "Industry standard",
              value: "Industry standard",
            },
          ]}
        />
        <Box>
          <Button
            variant="outline"
            leftIcon={<IoMdHelpCircleOutline size={"20px"} />}>
              View Rating System
          </Button>
        </Box>
      </Box>
      <Box mt="32px">
        <Text
          fontWeight="600"
          fontSize="18px"
          color="primary.500"
          textAlign="right"
        >
          Total points: 3,500
        </Text>
        <Box
          mt="12px"
          display="flex"
          flexDirection="column"
          gap="12px">
          <SectionCard
            isAccordion
            variant="card"
            padding="0 !important"
            overflow="hidden"
          >
            <SectionCardHeader
              padding="20px 24px"
              borderBottom="1px solid"
              borderColor="gray.border-main"
            >
              <Box
                display="flex"
                alignItems="center"
                gap="8px"
              >
                <Text
                  fontSize="18px"
                  fontWeight="600"
                  color="primary.500"
                >
                  Insurance
                </Text>
                <CustomBadge>Acceptable</CustomBadge>
              </Box>
            </SectionCardHeader>
            <SectionCardBody>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus quod repudiandae cumque sed facere velit repellat nostrum enim, sequi illum dignissimos aliquam ut quo ea, repellendus autem saepe tempore deserunt.
            </SectionCardBody>
          </SectionCard>
          <SectionCard
            isAccordion
            variant="card"
            padding="0 !important"
            overflow="hidden"
          >
            <SectionCardHeader
              padding="20px 24px"
              borderBottom="1px solid"
              borderColor="gray.border-main"
            >
              <Box
                display="flex"
                alignItems="center"
                gap="8px"
              >
                <Text
                  fontSize="18px"
                  fontWeight="600"
                  color="primary.500"
                >
                  Authority
                </Text>
                <CustomBadge>Acceptable</CustomBadge>
              </Box>
            </SectionCardHeader>
            <SectionCardBody>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus quod repudiandae cumque sed facere velit repellat nostrum enim, sequi illum dignissimos aliquam ut quo ea, repellendus autem saepe tempore deserunt.
            </SectionCardBody>
          </SectionCard>
          <SectionCard
            isAccordion
            variant="card"
            padding="0 !important"
            overflow="hidden"
          >
            <SectionCardHeader
              padding="20px 24px"
              borderBottom="1px solid"
              borderColor="gray.border-main"
            >
              <Box
                display="flex"
                alignItems="center"
                gap="8px"
              >
                <Text
                  fontSize="18px"
                  fontWeight="600"
                  color="primary.500"
                >
                  Operations
                </Text>
                <CustomBadge>Acceptable</CustomBadge>
              </Box>
            </SectionCardHeader>
            <SectionCardBody>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus quod repudiandae cumque sed facere velit repellat nostrum enim, sequi illum dignissimos aliquam ut quo ea, repellendus autem saepe tempore deserunt.
            </SectionCardBody>
          </SectionCard>
          <SectionCard
            isAccordion
            variant="card"
            padding="0 !important"
            overflow="hidden"
          >
            <SectionCardHeader
              padding="20px 24px"
              borderBottom="1px solid"
              borderColor="gray.border-main"
            >
              <Box
                display="flex"
                alignItems="center"
                gap="8px"
              >
                <Text
                  fontSize="18px"
                  fontWeight="600"
                  color="primary.500"
                >
                  Safety
                </Text>
                <CustomBadge variant="error">Review required</CustomBadge>
              </Box>
            </SectionCardHeader>
            <SectionCardBody>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus quod repudiandae cumque sed facere velit repellat nostrum enim, sequi illum dignissimos aliquam ut quo ea, repellendus autem saepe tempore deserunt.
            </SectionCardBody>
          </SectionCard>
          <SectionCard
            isAccordion
            variant="card"
            padding="0 !important"
            overflow="hidden"
          >
            <SectionCardHeader
              padding="20px 24px"
              borderBottom="1px solid"
              borderColor="gray.border-main"
            >
              <Box
                display="flex"
                alignItems="center"
                gap="8px"
              >
                <Text
                  fontSize="18px"
                  fontWeight="600"
                  color="primary.500"
                >
                  Lodify Protect
                </Text>
                <CustomBadge variant="error">Review required</CustomBadge>
              </Box>
            </SectionCardHeader>
            <SectionCardBody>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus quod repudiandae cumque sed facere velit repellat nostrum enim, sequi illum dignissimos aliquam ut quo ea, repellendus autem saepe tempore deserunt.
            </SectionCardBody>
          </SectionCard>
        </Box>
      </Box>
    </Box> */}
  </Box>;
};