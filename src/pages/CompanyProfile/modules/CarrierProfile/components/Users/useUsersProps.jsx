import {useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useGetTable} from "@services/items.service";

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

  const {data: verifiedUsersData} = useGetTable(
    "verified_users",
    {},
    {
      data: JSON.stringify({
        companies_id,
        offset: (verifiedUsersPage - 1) * verifiedUsersLimit,
        limit: verifiedUsersLimit,
      }),
    }
  );

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

  const defaultVerifiedUsers = [
    {
      name: "Samantha Cole",
      phone: "(309) 660-7884",
      phoneStatus: "verified",
      email: "samantha.cole@nussbaum.com",
      firstSeen: "6/13/25 at 8:17am Minonk, Illinois",
      lastSeen: "6/13/25 at 8:17am Minonk, Illinois",
      country: "-",
    },
    {
      name: "Jeni Nussbaum",
      phone: "(309) 660-7884",
      phoneStatus: "verified",
      email: "jeni.nussbaum@nussbaum.com",
      firstSeen: "7/18/23 at 10:25am Jacksonville, Illinois",
      lastSeen: "6/13/25 at 10:25am Peoria Heights, Illinois",
      country: "United States",
    },
    {
      name: "Tim Bradle",
      phone: "-",
      phoneStatus: null,
      email: "tim.bradle@nussbaum.com",
      firstSeen: "7/20/23 at 12:42pm Jacksonville, Illinois",
      lastSeen: "7/20/23 at 12:42pm Jacksonville, Illinois",
      country: "United States",
    },
    {
      name: "Rusty Damerell",
      phone: "-",
      phoneStatus: null,
      email: "rusty.damerell@nussbaum.com",
      firstSeen: "6/13/25 at 8:17pm Peoria Heights, Illinois",
      lastSeen: "1/13/25 at 8:17pm Peoria Heights, Illinois",
      country: "-",
    },
  ];

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
      label: "First Seen",
      key: "first_seen",
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
      label: "Last Seen",
      key: "last_seen",
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
      label: "Country",
      key: "country",
      thProps: {
        width: "150px",
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
    verifiedUsersBodyData: verifiedUsersData?.response || defaultVerifiedUsers,
    verifiedUsersCount: verifiedUsersData?.count || defaultVerifiedUsers.length,
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
