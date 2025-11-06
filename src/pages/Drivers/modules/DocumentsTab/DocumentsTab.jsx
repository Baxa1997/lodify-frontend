import { Box, Button, Link, Text } from "@chakra-ui/react";
import MainHeading from "../../../../components/MainHeading";
import { useDocumentsTabProps } from "./useDocumentsTabProps";

const FolderCard = ({ name, expiration_date, file, disabled }) => {

  return <Box
    padding="16px"
    border="1px solid"
    borderColor="gray.border-main"
    borderRadius="12px"
    backgroundColor={disabled ? "gray.200" : "#fff"}
  >
    <Box
      display="flex"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Box
        display="flex"
        alignItems="flex-end"
        gap="12px"
      >
        <img
          src={`/img/folder${disabled ? "-disabled" : ""}.svg`}
          width="48"
          height="48"
          alt="folder"
        />
        <Box
          display="flex"
          flexDirection="column"
        >
          <Box fontWeight="500">{name}</Box>
          <Box color="tertiary.600">Exp: {expiration_date} <Box as="span">Valid</Box></Box>
        </Box>
      </Box>
      <Button
        color="blue.500"
        href="#"
        fontWeight="600"
        variant="text"
        isDisabled={disabled}
        _disabled={{
          color: "gray.400",
        }}
        onClick={()=> {
          window.open(file, "_blank", "noopener,noreferrer");
        }}
      >
        View
      </Button>
    </Box>
    <Box
      display="flex"
      justifyContent="space-between"
      mt="4px"
    >
      <Box>
        <Box color="tertiary.600">Completed by</Box>
        <Text
          fontWeight="500"
          fontSize="12px"
          color="secondary.700"
        >
        Safety Department (Admin)
        </Text>
      </Box>
      <Box>
        <Box color="tertiary.600">Completed Date</Box>
        <Text
          fontWeight="500"
          fontSize="12px"
          color="secondary.700"
        >
        05/01/2025
        </Text>
      </Box>
    </Box>
  </Box>;
};

export const DocumentsTab = () => {
  const { data, handleDownloadFiles } = useDocumentsTabProps();


  return <Box mt="32px">
    <Box
      padding="20px 24px"
      border="1px solid"
      borderColor="gray.border-main"
      borderRadius="12px"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <MainHeading size="18px">Mandatory</MainHeading>
        <Link
          href="#"
          colorScheme="tertiary.600"
          fontWeight="600"
          _hover={
            {
              color: "tertiary.600",
            }
          }
        >
          <Button
            variant="transparent"
            display="flex"
            alignItems="center"
            gap="6px"
            onClick={handleDownloadFiles}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"><path
                stroke="#535862"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.667"
                d="M6.667 14.167 10 17.5m0 0 3.333-3.333M10 17.5V10m6.666 3.952a4.583 4.583 0 0 0-2.917-8.12.516.516 0 0 1-.444-.25 6.25 6.25 0 1 0-9.816 7.58"/></svg>
            <span>Download all files</span>
          </Button>
        </Link>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        gap="24px"
        mt="36px"
      >
        {
          data?.map(item => (
            <FolderCard
              {...item}
              key={item?.guid} />
          ))
        }
        {/* <FolderCard />
        <FolderCard />
        <FolderCard />
        <FolderCard />
        <FolderCard disabled /> */}
      </Box>
      {/* <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt="44px"
      >
        <MainHeading size="18px">Background Screenings</MainHeading>
        <Link
          href="#"
          colorScheme="tertiary.600"
          fontWeight="600"
          _hover={
            {
              color: "tertiary.600",
            }
          }
        >
          <Box
            display="flex"
            alignItems="center"
            gap="6px"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"><path
                stroke="#535862"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.667"
                d="M6.667 14.167 10 17.5m0 0 3.333-3.333M10 17.5V10m6.666 3.952a4.583 4.583 0 0 0-2.917-8.12.516.516 0 0 1-.444-.25 6.25 6.25 0 1 0-9.816 7.58"/></svg>
            <span>Download all files</span>
          </Box>
        </Link>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        gap="24px"
        mt="36px"
      >
        <FolderCard />
        <FolderCard />
        <FolderCard disabled />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt="44px"
      >
        <MainHeading size="18px">Other</MainHeading>
        <Link
          href="#"
          colorScheme="tertiary.600"
          fontWeight="600"
          _hover={
            {
              color: "tertiary.600",
            }
          }
        >
          <Box
            display="flex"
            alignItems="center"
            gap="6px"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"><path
                stroke="#535862"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.667"
                d="M6.667 14.167 10 17.5m0 0 3.333-3.333M10 17.5V10m6.666 3.952a4.583 4.583 0 0 0-2.917-8.12.516.516 0 0 1-.444-.25 6.25 6.25 0 1 0-9.816 7.58"/></svg>
            <span>Download all files</span>
          </Box>
        </Link>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        gap="24px"
        mt="36px"
      >
        <FolderCard disabled />
        <FolderCard disabled />
        <FolderCard disabled />
      </Box> */}
    </Box>
  </Box>;
};
