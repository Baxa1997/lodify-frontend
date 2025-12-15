import {useState} from "react";
import {useSearchParams} from "react-router-dom";
import {Link, HStack} from "@chakra-ui/react";
import {LuChevronUp, LuChevronDown} from "react-icons/lu";
import {useGetTable} from "@services/items.service";

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

  // const {data: addressMatchesData} = useGetTable(
  //   "matched_data",
  //   {},
  //   {
  //     data: JSON.stringify({
  //       companies_id,
  //       type: "address",
  //       offset: (addressMatchesPage - 1) * addressMatchesLimit,
  //       limit: addressMatchesLimit,
  //     }),
  //   }
  // );

  // const {data: vinMatchesData} = useGetTable(
  //   "matched_data",
  //   {},
  //   {
  //     data: JSON.stringify({
  //       companies_id,
  //       type: "vin",
  //       offset: (addressMatchesPage - 1) * addressMatchesLimit,
  //       limit: addressMatchesLimit,
  //     }),
  //   }
  // );

  // const {data: ipMatchesData} = useGetTable(
  //   "matched_data",
  //   {},
  //   {
  //     data: JSON.stringify({
  //       companies_id,
  //       type: "ip",
  //       offset: (addressMatchesPage - 1) * addressMatchesLimit,
  //       limit: addressMatchesLimit,
  //     }),
  //   }
  // );

  const addressMatchesHeadData = [
    {
      label: "Dot/Docet",
      key: "dot_docet",
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
      key: "company_name",
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
      key: "dot_status",
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
      key: "mc_record",
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
    {
      label: "Carriers Dot Record (Safer)",
      key: "dot_record",
      thProps: {
        width: "240px",
        px: "16px",
        py: "12px",
      },
      tdProps: {
        px: "16px",
        py: "12px",
      },
    },
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
    // addressMatchesData,
    // vinMatchesData,
    // ipMatchesData,
    addressMatchesHeadData,
    addressMatchesBodyData: defaultBodyData,
    addressMatchesCount: defaultBodyData.length,
    addressMatchesPage,
    setAddressMatchesPage,
    addressMatchesLimit,
    setAddressMatchesLimit,
    vinMatchesData: defaultBodyData,
    ipMatchesData: defaultBodyData,
  };
};
