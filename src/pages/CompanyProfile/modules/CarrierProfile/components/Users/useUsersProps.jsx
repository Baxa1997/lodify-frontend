import {useMemo, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useGetTable} from "@services/items.service";
import { useQuery } from "@tanstack/react-query";
import usersService from "@services/usersService";

export const useUsersProps = () => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");

  const [verifiedUsersPage, setVerifiedUsersPage] = useState(1);
  const [verifiedUsersLimit, setVerifiedUsersLimit] = useState(10);
  const [contactsPage, setContactsPage] = useState(1);
  const [contactsLimit, setContactsLimit] = useState(10);
  const [selectedContactStatus, setSelectedContactStatus] = useState([
    "Claims",
    "Billing",
    "Dispatch",
  ]);

  // const {data: verifiedUsersData} = useGetTable(
  //   "verified_users",
  //   {},
  //   {
  //     data: JSON.stringify({
  //       companies_id,
  //       offset: (verifiedUsersPage - 1) * verifiedUsersLimit,
  //       limit: verifiedUsersLimit,
  //     }),
  //   }
  // );

  const {data: contactsData} = useGetTable(
    "contacts",
    {},
    {
      data: JSON.stringify({
        companies_id,
        status: selectedContactStatus,
        offset: (contactsPage - 1) * contactsLimit,
        limit: contactsLimit,
      }),
    }
  );

  const {data: usersListData = {}} = useQuery({
    queryKey: ["GET_USERS_DATA", companies_id],
    queryFn: () => usersService.getList({companies_id:companies_id}, "users"),
    select: (res) => res?.data || {},
    enabled: !!companies_id,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });



    const userListMappedData = useMemo(() => {
      return usersListData?.response?.map((item) => ({
        id: item?.id,
        name: item?.first_name + " " + item?.last_name,
        phone: item?.phone,
        email: item?.email,
        ip_address: item?.ip_address,
        role: item?.role_id_data?.name,
      }))
    }, [usersListData]);


  const defaultContacts = [
    {
      status: "Claims",
      name: "ARRON KADIF",
      phone: "(855) 200-3356",
      phoneStatus: "inactive",
      email: "dispatch@truckersglobelogistics.com",
      emailStatus: "inactive",
      created: "5/10/23 at 4:27pm",
    },
  ];

  const verifiedUsersHeadData = [
    {
      label: "Name",
      key: "name",
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
      label: "Phone Number",
      key: "phone",
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
      label: "Email",
      key: "email",
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
      label: "IP Address",
      key: "ip_address",
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
      label: "Role",
      key: "role",
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
   
  ];

  const contactsHeadData = [
    {
      label: "Status",
      key: "status",
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
      label: "Name",
      key: "name",
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
      label: "Phone",
      key: "phone",
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
      label: "Email",
      key: "email",
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
      label: "Created",
      key: "created",
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
  ];



  return {
    verifiedUsersHeadData,
    verifiedUsersBodyData: userListMappedData,
    verifiedUsersCount: usersListData?.count ,
    verifiedUsersPage,
    setVerifiedUsersPage,
    verifiedUsersLimit,
    setVerifiedUsersLimit,
    contactsHeadData,
    contactsBodyData: contactsData?.response || defaultContacts,
    contactsCount: contactsData?.count || defaultContacts.length,
    contactsPage,
    setContactsPage,
    contactsLimit,
    setContactsLimit,
    selectedContactStatus,
    setSelectedContactStatus,
  };
};
