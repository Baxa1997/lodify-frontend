export const useCompanyInformationProps = ({ data = {} }) => {

  const {
    operating_status,
    us_dot_status,
    us_dot_number,
    legal_name,
    phone,
    physical_address,
    mailing_address,
    entity_type,
    docket_number,
    dba_name,

    common_stat,
    broker_stat,
    drivers,
    trailers,
  } = data;
  
  const firstDataList = [
    {
      title: "Operating Status",
      description: operating_status,
      color: "success.600",
    },
    {
      title: "DOT Status",
      description: us_dot_status,
      color: "success.600",
    },
    {
      title: "DOT Number",
      description: us_dot_number,
    },
    {
      title: "Legal Name",
      description: legal_name,
    },
    {
      title: "SCAC (Standard Carrier Alpha Code)",
      description: "None",
    },
    {
      title: "Main Phone Number",
      description: phone,
    },
    {
      title: "Cell Phone Number",
      description: "None",
    },
    {
      title: "Fax Number",
      description: "None",
    },
    {
      title: "Common",
      description: common_stat,
    },
    {
      title: "Broker",
      description: broker_stat,
    },
    {
      title: "Address",
      description: physical_address,
    },
  ];

  const secondDataList = [
    {
      title: "Entity Type",
      description: entity_type,
    },
    {
      title: "Active Since",
      description: "None",
    },
    {
      title: "Docket Number",
      description: docket_number,
    },
    {
      title: "DBA Name",
      description: dba_name,
    },
    {
      title: "Representative 1",
      description: "None",
    },
    {
      title: "Representative 2",
      description: "None",
    },
    {
      title: "Emergency Number",
      description: "None",
    },
    {
      title: "Company Main Address",
      description: "None",
    },
    {
      title: "Drivers",
      description: drivers,
    },
    {
      title: "Trailers",
      description: trailers,
    },
    {
      title: "Mailing Address",
      description: mailing_address,
    },
  ];

  return {
    firstDataList,
    secondDataList,
  };
};
