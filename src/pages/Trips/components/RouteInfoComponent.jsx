import {Box, Button, Flex, Text, useToast} from "@chakra-ui/react";
import {useGetCompanyId} from "@hooks/useGetCompanyId";
import fileService from "@services/fileService";
import {useCreateItemMutation} from "@services/items.service";
import {useState} from "react";
import {useForm} from "react-hook-form";
import FilesReader from "../../../components/FileViewer/FilesReader";
import styles from "../style.module.scss";
import {getShortFileName} from "./mockElements";
import {ChevronDownIcon, ChevronRightIcon} from "@chakra-ui/icons";

function RouteInfoComponent({tripData = {}}) {
  const [isFilesReaderOpen, setIsFilesReaderOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDocumentList, setShowDocumentList] = useState(false);

  const companyId = useGetCompanyId();

  const {control, watch, setValue} = useForm();

  const handleFilesReaderOpen = (file) => {
    setSelectedFile(file);
    setIsFilesReaderOpen(true);
  };

  const handleFilesReaderClose = () => {
    setIsFilesReaderOpen(false);
  };

  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const createFileItemMutation = useCreateItemMutation({
    onSuccess: () => {
      toast({
        status: "success",
        description: "Successfully uploaded",
        position: "top-right",
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleUpload = (data) => {
    setLoading(true);
    fileService
      .folderUpload(data)
      .then((res) => {
        setValue("file", res.file_name_download);
        createFileItemMutation.mutate({
          slug: "upload_files",
          data: {
            data: {
              companies_id: companyId,
              file: `https://cdn.u-code.io/${res.link}`,
            },
          },
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {tripData?.pickups?.map((pickup, index) => (
        <Flex
          m={"20px"}
          gap={"12px"}
          p="12px 14px"
          borderRadius={"8px"}
          border="1px solid #D5D7DA">
          <Flex
            w="27px"
            h="24px"
            bg="rgba(239, 104, 32, 1)"
            borderRadius="50%"
            alignItems="center"
            justifyContent="center"
            color="#fff"
            fontSize="12px"
            fontWeight="600">
            {index + 1}
          </Flex>

          <Box w="100%">
            <Text mb="14px" fontSize="14px" fontWeight="600" color="#181D27">
              Stop
            </Text>

            <Flex mb="12px" w="100%" justifyContent="space-between">
              <Text fontSize="14px" fontWeight="400" color="#535862">
                Type
              </Text>
              <Text fontSize="14px" fontWeight="500" color="#535862">
                {pickup?.type?.[0]}
              </Text>
            </Flex>

            <Flex mb="12px" w="100%" justifyContent="space-between">
              <Text fontSize="14px" fontWeight="400" color="#535862">
                Location
              </Text>
              <Text fontSize="14px" fontWeight="500" color="#535862">
                {pickup?.address}
              </Text>
            </Flex>

            <Flex mb="12px" w="100%" justifyContent="space-between">
              <Text fontSize="14px" fontWeight="400" color="#535862">
                Appointment
              </Text>
              <Text fontSize="14px" fontWeight="500" color="#535862">
                {pickup?.appointment}
              </Text>
            </Flex>

            <Box>
              <Text fontSize="14px" fontWeight="400" color="#535862" mb="6px">
                Referance Numbers & Instruction:
              </Text>
              <Text fontSize="14px" fontWeight="500" color="#181D27">
                {tripData?.reference} {tripData?.reference_po}{" "}
                {tripData?.reference_other}
              </Text>
            </Box>
          </Box>
        </Flex>
      ))}

      {/* DOCUMENT LIST & VIEW */}
      <Box
        className={styles.documentsContainer}
        onClick={() => setShowDocumentList(!showDocumentList)}>
        <Flex
          className={styles.documentHeader}
          justifyContent="space-between"
          alignItems="center">
          <Text fontSize="16px" fontWeight="600" color="#181D27">
            Documents
          </Text>
          <Flex
            w="24px"
            h="24px"
            alignItems="center"
            gap="6px"
            justifyContent="center"
            cursor="pointer">
            {showDocumentList ? (
              <ChevronDownIcon width="20px" height="20px" />
            ) : (
              <ChevronRightIcon width="20px" height="20px" />
            )}
          </Flex>
        </Flex>

        <Box display={showDocumentList ? "block" : "none"}>
          {tripData?.documents?.map((document, index) => (
            <Box className={styles.documentItem} key={index}>
              <Box className={styles.documentIcon}>
                <img src={document} alt="PDF" width="32px" height="40px" />
              </Box>
              <Box className={styles.documentInfo}>
                <Text className={styles.documentName}>
                  {getShortFileName(document, 10)}
                </Text>
              </Box>
              <button
                className={styles.documentAction}
                onClick={() => handleFilesReaderOpen(document)}>
                View
              </button>
            </Box>
          ))}
        </Box>
        {/* <Box padding="12px">
          <HFFileUpload
            name="file"
            control={control}
            disableRequest
            onChange={handleUpload}
            loading={loading}
          />
        </Box> */}
        {/* <Button className={styles.actionBtn}>
          <img
            src="/img/navigation.svg"
            alt="edit" />
          <Text color="#175cd3">Upload file</Text>
        </Button> */}
      </Box>

      <FilesReader
        isOpen={isFilesReaderOpen}
        onClose={handleFilesReaderClose}
        file={selectedFile}
      />
    </>
  );
}

export default RouteInfoComponent;
