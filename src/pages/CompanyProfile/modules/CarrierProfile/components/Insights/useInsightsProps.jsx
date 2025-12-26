import {useQuery} from "@tanstack/react-query";
import carrierService from "@services/carrierService";
import {useSearchParams} from "react-router-dom";
import {useState} from "react";

export const useInsightsProps = () => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");
  const [selectedTab, setSelectedTab] = useState(0);

  const {data: virtualAddressData} = useQuery({
    queryKey: ["GET_VIRTUAL_ADDRESS_DATA", companies_id],
    queryFn: () =>
      carrierService.getVirtualAddress({
        data: {
          method: "virtual",
          object_data: {
            companies_id: companies_id,
          },
          table: "addresses",
        },
      }),
    select: (res) => res?.data?.virtual_addresses ?? [],
    enabled: Boolean(companies_id),
  });

  const {data: equipmentData} = useQuery({
    queryKey: ["GET_EQUIPMENT_DATA", companies_id],
    queryFn: () =>
      carrierService.getEquipmentData({
        data: {
          method: "vin",
          object_data: {
            companies_id: companies_id,
          },
          table: "matches",
        },
      }),
    select: (res) => res?.data?.response ?? [],
    enabled: Boolean(companies_id),
  });

  const {data: carrierAuditData} = useQuery({
    queryKey: ["GET_CARRIER_AUDIT_DATA", companies_id],
    queryFn: () =>
      carrierService.getCarrierAudit({
        companies_id: companies_id,
      }),
    select: (res) => res?.data?.response?.[0] ?? {},
    enabled: Boolean(companies_id),
  });

  const {data: contactsMatchesData} = useQuery({
    queryKey: ["GET_CONTACTS_MATCHES_DATA", companies_id],
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
    select: (res) => res?.data || {},
    enabled: Boolean(companies_id),
  });

  const associationInsights = [
    {
      title: "Reused Equipment Scheduled Auto",
      date: "Observed March, 2024",
      filtered: equipmentData?.length > 0 ? false : true,
    },
    {
      title: "Flagged Factor",
      date: "Observed May, 2023",
      filtered: true,
    },
  ];

  const locationInsights = [
    {
      title: "Virtual Office Address",
      date: "Observed January, 2022",
    },
  ];

  const associatedCarrierData = {
    name: "OPERATION X LLC",
    status: "Authorized Carrier",
    vehicle: {
      make: "International",
      model: "LF687",
      year: "2015",
      international: "2HSDIAPREENS22924",
      regState: "-",
      plateNumber: "-",
      class: "Class 8",
      nonies: "15V1",
    },
  };

  return {
    virtualAddressData,
    equipmentData,
    associationInsights,
    locationInsights,
    associatedCarrierData,
    setSelectedTab,
    selectedTab,
    carrierAuditData,
    contactsMatchesData,
  };
};
