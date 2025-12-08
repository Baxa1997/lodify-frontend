import React from "react";
import {
  Box,
  Text,
  Flex,
  VStack,
  HStack,
  Badge,
  Tooltip,
  Button,
  IconButton,
} from "@chakra-ui/react";
import {DataTable} from "@components/DataTable";
import {useUsersProps} from "./useUsersProps";
import {LuCopy} from "react-icons/lu";

export const Users = () => {
  const {
    verifiedUsersHeadData,
    verifiedUsersBodyData,
    verifiedUsersCount,
    verifiedUsersPage,
    setVerifiedUsersPage,
    verifiedUsersLimit,
    setVerifiedUsersLimit,
    contactsHeadData,
    contactsBodyData,
    contactsCount,
    contactsPage,
    setContactsPage,
    contactsLimit,
    setContactsLimit,
    selectedContactStatus,
    setSelectedContactStatus,
  } = useUsersProps();

  const StatusCircle = ({color}) => (
    <Box w="12px" h="12px" borderRadius="50%" bg={color} flexShrink={0} />
  );

  const CopyIcon = ({onClick}) => (
    <IconButton
      icon={<LuCopy size={14} />}
      size="xs"
      variant="ghost"
      aria-label="Copy"
      onClick={onClick}
      color="#6B7280"
      _hover={{bg: "#F3F4F6", color: "#374151"}}
    />
  );

  const formatVerifiedUsersData = (data) => {
    return data.map((row) => ({
      name: row.name,
      phone: row.phone,
      phoneStatus: row.phoneStatus,
      email: row.email,
      first_seen: row.firstSeen || row.first_seen,
      last_seen: row.lastSeen || row.last_seen,
      country: row.country,
    }));
  };

  const formatContactsData = (data) => {
    return data.map((row) => ({
      status: row.status,
      name: row.name,
      phone: row.phone,
      phoneStatus: row.phoneStatus,
      email: row.email,
      emailStatus: row.emailStatus,
      created: row.created,
    }));
  };

  const enhancedVerifiedUsersHeadData = verifiedUsersHeadData.map((head) => {
    if (head.key === "phone") {
      return {
        ...head,
        render: (value, row) => (
          <HStack spacing="8px">
            {row.phoneStatus === "verified" && <StatusCircle color="#10B981" />}
            {row.phoneStatus === "delivery_risk" && (
              <StatusCircle color="#F38744" />
            )}
            {row.phoneStatus === "inactive" && <StatusCircle color="#92400E" />}
            <Text fontSize="14px" color="#374151">
              {value}
            </Text>
          </HStack>
        ),
      };
    }
    if (head.key === "email") {
      return {
        ...head,
        render: (value, row) => (
          <HStack spacing="8px">
            <Text fontSize="14px" color="#374151">
              {value}
            </Text>
            <CopyIcon
              onClick={() => {
                navigator.clipboard.writeText(value);
              }}
            />
          </HStack>
        ),
      };
    }
    if (head.key === "country") {
      return {
        ...head,
        render: (value) => (
          <HStack spacing="8px">
            {value !== "-" && value === "United States" && (
              <Text fontSize="16px">🇺🇸</Text>
            )}
            <Text fontSize="14px" color="#374151">
              {value}
            </Text>
          </HStack>
        ),
      };
    }
    return head;
  });

  const enhancedContactsHeadData = contactsHeadData.map((head) => {
    if (head.key === "phone") {
      return {
        ...head,
        render: (value, row) => (
          <HStack spacing="8px">
            {row.phoneStatus === "inactive" && <StatusCircle color="#92400E" />}
            {row.phoneStatus === "verified" && <StatusCircle color="#10B981" />}
            {row.phoneStatus === "delivery_risk" && (
              <StatusCircle color="#F38744" />
            )}
            <Text fontSize="14px" color="#374151">
              {value}
            </Text>
          </HStack>
        ),
      };
    }
    if (head.key === "email") {
      return {
        ...head,
        render: (value, row) => (
          <HStack spacing="8px">
            {row.emailStatus === "inactive" && <StatusCircle color="#92400E" />}
            {row.emailStatus === "verified" && <StatusCircle color="#10B981" />}
            {row.emailStatus === "delivery_risk" && (
              <StatusCircle color="#F38744" />
            )}
            <Text fontSize="14px" color="#374151">
              {value}
            </Text>
            <CopyIcon
              onClick={() => {
                navigator.clipboard.writeText(value);
              }}
            />
          </HStack>
        ),
      };
    }
    return head;
  });

  const formattedVerifiedUsers = formatVerifiedUsersData(verifiedUsersBodyData);
  const formattedContacts = formatContactsData(contactsBodyData);

  const handleContactStatusToggle = (status) => {
    setSelectedContactStatus((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  return (
    <Box>
      <VStack spacing="32px" align="stretch" p="20px">
        <Box>
          <Flex mb="16px" alignItems="center" justifyContent="space-between">
            <Flex alignItems="center" gap="12px">
              <Box
                as="img"
                src="/img/verifiedUsers.svg"
                alt="check"
                w="32px"
                h="32px"
                flexShrink={0}
              />
              <Box>
                <Text fontSize="16px" fontWeight="600" color="#181D27">
                  Verified Users
                </Text>
                <Text fontSize="14px" color="#6B7280" lineHeight="1.5">
                  Verified users are digitally authenticated and authorized by
                  the Highway Identity Engine.
                </Text>
              </Box>
            </Flex>

            <Box>
              <HStack spacing="24px" flexWrap="wrap">
                <HStack spacing="8px">
                  <Text fontSize="13px" color="#6B7280">
                    Contact status
                  </Text>
                  <StatusCircle color="#000" />
                </HStack>

                <HStack spacing="8px">
                  <StatusCircle color="#10B981" />
                  <Text fontSize="13px" color="#6B7280">
                    Verified
                  </Text>
                </HStack>
                <HStack spacing="8px">
                  <StatusCircle color="#F38744" />
                  <Text fontSize="13px" color="#6B7280">
                    Delivery Risk
                  </Text>
                </HStack>
                <HStack spacing="8px">
                  <StatusCircle color="#92400E" />
                  <Text fontSize="13px" color="#6B7280">
                    Inactive
                  </Text>
                </HStack>
              </HStack>
            </Box>
          </Flex>

          <Box
            bg="white"
            border="1px solid #E5E7EB"
            borderRadius="12px"
            overflow="hidden">
            <DataTable
              headData={enhancedVerifiedUsersHeadData}
              data={formattedVerifiedUsers}
              pagination
              count={verifiedUsersCount}
              page={verifiedUsersPage}
              limit={verifiedUsersLimit}
              setLimit={setVerifiedUsersLimit}
              setPage={setVerifiedUsersPage}
              tableProps={{
                layout: "fixed",
                variant: "simple",
              }}
            />
          </Box>
        </Box>

        <Box>
          <Flex mb="16px" alignItems="center" gap="12px">
            <Box
              as="img"
              src="/img/contacts2.svg"
              alt="check"
              w="32px"
              h="32px"
              flexShrink={0}
            />

            <Box>
              <Text fontSize="16px" fontWeight="600" color="#181D27">
                Contacts
              </Text>
              <Text fontSize="14px" color="#6B7280" lineHeight="1.5">
                Contacts can only be provided by authenticated and authorized
                users of the carrier.
              </Text>
            </Box>
          </Flex>

          <Box
            bg="white"
            border="1px solid #E5E7EB"
            borderRadius="12px"
            overflow="hidden">
            <DataTable
              headData={enhancedContactsHeadData}
              data={formattedContacts}
              pagination
              count={contactsCount}
              page={contactsPage}
              limit={contactsLimit}
              setLimit={setContactsLimit}
              setPage={setContactsPage}
              tableProps={{
                layout: "fixed",
                variant: "simple",
              }}
            />
          </Box>
        </Box>

        <Flex alignItems="center" gap="12px">
          <Box
            as="img"
            src="/img/filePhoto.svg"
            alt="document"
            w="20px"
            h="20px"
            flexShrink={0}
          />

          <Box>
            <Text fontSize="16px" fontWeight="600" color="#181D27">
              Rate Confirmation Users
            </Text>

            <Text fontSize="14px" color="#6B7280" lineHeight="1.5">
              Contacts only provided by authenticated and authorized users of
              the carrier are eligible to receive rate confirmations.
            </Text>
          </Box>
        </Flex>
      </VStack>
    </Box>
  );
};
