import {useState} from "react";
import {useSearchParams} from "react-router-dom";
import {Link, HStack} from "@chakra-ui/react";
import {LuChevronUp, LuChevronDown} from "react-icons/lu";
import {useQuery} from "@tanstack/react-query";
import carrierService from "@services/carrierService";

export const useMatchedDataProps = () => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");

  const [addressMatchesPage, setAddressMatchesPage] = useState(1);
  const [addressMatchesLimit, setAddressMatchesLimit] = useState(10);

  const mcRecordData = {
    businessAddress: "606 HILLROSE AVE UNIT B DAYTON, OH 45404",
    businessPhone: "(937) 301-3516",
  };

  const dotRecordData = {
    physicalAddress: "606 HILLROSE AVE UNIT B DAYTON, OH 45404",
    mailingAddress: "606 HILLROSE AVE UNIT B DAYTON, OH 45404",
    officePhone: "(937) 301-3516",
    cellPhone: "(937) 301-3516",
    emailAddress: "eagleeyetrucking2920@yahoo.com",
  };

  const {data: vinMatchesData} = useQuery({
    queryKey: ["GET_MATCHED_DATA", companies_id],
    queryFn: () =>
      carrierService.getMatchedData({
        data: {
          method: "vin",
          object_data: {
            companies_id: companies_id,
          },
          table: "matches",
        },
      }),
    select: (res) => res?.data?.response || [],
    enabled: Boolean(companies_id),
  });

  const {data: addressMatchesBodyData} = useQuery({
    queryKey: ["GET_ADDRESS_MATCHES_DATA", companies_id],
    queryFn: () =>
      carrierService.getMatchedData({
        data: {
          method: "addresses",
          object_data: {
            companies_id: companies_id,
          },
          table: "matches",
        },
      }),
    select: (res) => {
      const result = [
        ...res?.data?.mailing_address,
        ...res?.data?.physical_address,
      ];
      return result;
    },
    enabled: Boolean(companies_id),
  });

  const {data: addressMatchesContacts} = useQuery({
    queryKey: ["GET_ADDRESS_MATCHES_COUNT", companies_id],
    queryFn: () =>
      carrierService.getMatchedData({
        data: {
          method: "contact",
          object_data: {
            companies_id: companies_id,
          },
          table: "matches",
        },
      }),
    select: (res) => console.log("resssss====>", res),
    enabled: Boolean(companies_id),
  });

  console.log(
    "addressMatchesContactsaddressMatchesContacts",
    addressMatchesContacts
  );

  const addressMatchesHeadData = [
    {
      label: "Dot/Docet",
      key: "us_dot_number",
      thProps: {
        width: "140px",
        px: "16px",
        py: "12px",
      },
      tdProps: {
        px: "16px",
        py: "12px",
      },
    },
    {
      label: (
        <HStack spacing={1} display="inline-flex" alignItems="center">
          <span>Company Name</span>
          <HStack spacing={0} align="center" display="inline-flex" ml="4px">
            <LuChevronUp size={12} opacity={0.3} />
            <LuChevronDown
              size={12}
              opacity={0.3}
              style={{marginTop: "-2px"}}
            />
          </HStack>
        </HStack>
      ),
      key: "legal_name",
      sortable: true,
      thProps: {
        width: "180px",
        px: "16px",
        py: "12px",
      },
      tdProps: {
        px: "16px",
        py: "12px",
      },
    },
    {
      label: "Dot Status",
      key: "us_dot_status",
      thProps: {
        width: "120px",
        px: "16px",
        py: "12px",
      },
      tdProps: {
        px: "16px",
        py: "12px",
      },
    },
    {
      label: "Carriers Mc Record (L&I)",
      key: "docket_number",
      thProps: {
        width: "220px",
        px: "16px",
        py: "12px",
      },
      tdProps: {
        px: "16px",
        py: "12px",
      },
    },
    // {
    //   label: "Carriers Dot Record (Safer)",
    //   key: "dot_record",
    //   thProps: {
    //     width: "240px",
    //     px: "16px",
    //     py: "12px",
    //   },
    //   tdProps: {
    //     px: "16px",
    //     py: "12px",
    //   },
    // },
    {
      label: "ACTION",
      key: "action",
      thProps: {
        width: "140px",
        px: "16px",
        py: "12px",
      },
      tdProps: {
        px: "16px",
        py: "12px",
      },
      render: (value, row) => (
        <Link
          href={`/company-profile?id=${row.companies_id || row.id || row.guid}`}
          fontSize="14px"
          color="#175CD3"
          fontWeight="500"
          textDecoration="underline"
          _hover={{textDecoration: "underline", opacity: 0.8}}>
          Carrier Profile
        </Link>
      ),
    },
  ];

  const defaultBodyData = [
    {
      dot_docet: "26/09/2025",
      company_name: "4004520441",
      dot_status: "IL",
      mc_record: "P1039337",
      dot_record: "Power Unit",
    },
    {
      dot_docet: "26/09/2025",
      company_name: "0",
      dot_status: "IL",
      mc_record: "P1039337",
      dot_record: "Power Unit",
    },
    {
      dot_docet: "26/09/2025",
      company_name: "35",
      dot_status: "IL",
      mc_record: "P1039337",
      dot_record: "Power Unit",
    },
  ];

  return {
    mcRecordData,
    dotRecordData,
    vinMatchesData,
    // ipMatchesData,
    addressMatchesHeadData,
    addressMatchesBodyData,
    addressMatchesCount: defaultBodyData.length,
    addressMatchesPage,
    setAddressMatchesPage,
    addressMatchesLimit,
    setAddressMatchesLimit,
    ipMatchesData: defaultBodyData,
  };
};
