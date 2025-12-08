import {useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {useGetTable} from "@services/items.service";

export const useAgreementsProps = () => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);

  const {data: agreementsData, isLoading} = useGetTable(
    "agreements",
    {},
    {
      data: JSON.stringify({
        companies_id,
        offset: (page - 1) * limit,
        limit: limit,
      }),
    }
  );

  // Mock data as fallback
  const defaultAgreementsData = [
    {
      guid: "1",
      companies_id: companies_id,
      company_name: "1st Choise Freighter, LLC",
      email: "m.straightcargollc@gmail.com",
      rating: "5.0",
      connected_date: "2024-07-09",
      joined_at: "2024-07-09",
    },
    {
      guid: "2",
      companies_id: companies_id,
      company_name: "3 River Logistics, INC",
      email: "m.straightcargollc@gmail.com",
      rating: "5.0",
      connected_date: "2024-07-09",
      joined_at: "2024-07-09",
    },
    {
      guid: "3",
      companies_id: companies_id,
      company_name: "4wrd Freight & Logistics",
      email: "m.straightcargollc@gmail.com",
      rating: "5.0",
      connected_date: "2024-07-09",
      joined_at: "2024-07-09",
    },
    {
      guid: "4",
      companies_id: companies_id,
      company_name: "7 Star Brokerage",
      email: "m.straightcargollc@gmail.com",
      rating: "5.0",
      connected_date: "2024-07-09",
      joined_at: "2024-07-09",
    },
    {
      guid: "5",
      companies_id: companies_id,
      company_name: "828 Logistics, LLC",
      email: "m.straightcargollc@gmail.com",
      rating: "5.0",
      connected_date: "2024-07-09",
      joined_at: "2024-07-09",
    },
    {
      guid: "6",
      companies_id: companies_id,
      company_name: "Ace Forwarding",
      email: "m.straightcargollc@gmail.com",
      rating: "5.0",
      connected_date: "2024-07-09",
      joined_at: "2024-07-09",
    },
    {
      guid: "7",
      companies_id: companies_id,
      company_name: "Action Enterprise Logistics",
      email: "m.straightcargollc@gmail.com",
      rating: "5.0",
      connected_date: "2024-07-09",
      joined_at: "2024-07-09",
    },
    {
      guid: "8",
      companies_id: companies_id,
      company_name: "Aden Logistics",
      email: "m.straightcargollc@gmail.com",
      rating: "5.0",
      connected_date: "2024-07-09",
      joined_at: "2024-07-09",
    },
    {
      guid: "9",
      companies_id: companies_id,
      company_name: "Advance Transportation Systems, Inc",
      email: "m.straightcargollc@gmail.com",
      rating: "5.0",
      connected_date: "2024-07-09",
      joined_at: "2024-07-09",
    },
  ];

  return {
    agreements: agreementsData?.response || defaultAgreementsData,
    count: agreementsData?.count || defaultAgreementsData.length,
    isLoading,
    page,
    setPage,
    limit,
    setLimit,
  };
};

