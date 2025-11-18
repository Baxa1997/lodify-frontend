import React, {useState, useEffect, useRef} from "react";
import {
  Modal,
  Box,
  ModalOverlay,
  Button,
  Flex,
  Spinner,
  Center,
} from "@chakra-ui/react";
import {CloseIcon, DownloadIcon} from "@chakra-ui/icons";
import useDownloader from "../../utils/useDownloader";
import axios from "axios";

function FilesReader({isOpen = false, onClose, file = ""}) {
  const {download} = useDownloader();
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const blobUrlRef = useRef(null);

  const fileExt = file?.split(".").pop()?.toLowerCase();
  const isPDF = fileExt === "pdf";
  const isWord = fileExt === "doc" || fileExt === "docx";
  const isExcel = fileExt === "xls" || fileExt === "xlsx";

  const encodedURL = encodeURIComponent(file || "");

  useEffect(() => {
    if (isOpen && file && isPDF) {
      setLoading(true);
      setError(null);

      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }

      axios
        .get(file, {
          responseType: "blob",
          headers: {
            Accept: "application/pdf",
          },
        })
        .then((response) => {
          const blob = new Blob([response.data], {type: "application/pdf"});
          const url = URL.createObjectURL(blob);
          blobUrlRef.current = url;
          setPdfBlobUrl(url);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading PDF:", err);
          setError("Failed to load PDF");
          setLoading(false);
        });
    } else {
      setPdfBlobUrl(null);
      setLoading(false);
      setError(null);
    }

    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [isOpen, file, isPDF]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <Box
        h="500px"
        w="800px"
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          width: "500px",
          height: "600px",
          bgcolor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1400,
        }}>
        {file ? (
          isPDF ? (
            loading ? (
              <Center w="100%" h="100%">
                <Spinner size="xl" color="#EF6820" thickness="4px" />
              </Center>
            ) : error ? (
              <Center w="100%" h="100%">
                <Box color="red.500" fontSize="16px">
                  {error}
                </Box>
              </Center>
            ) : pdfBlobUrl ? (
              <iframe
                src={pdfBlobUrl}
                style={{width: "100%", height: "100%", border: "none"}}
                title="PDF Viewer"
              />
            ) : null
          ) : isWord || isExcel ? (
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodedURL}`}
              width="100%"
              height="100%"
              frameBorder="0"
              title={`${isExcel ? "Excel" : "Word"} Viewer`}
            />
          ) : (
            <img
              type="text"
              src={file}
              width="100%"
              height="100%"
              objectFit="contain"
            />
          )
        ) : (
          <div>Document could not be loaded</div>
        )}

        <Flex gap="10px" position="fixed" top="-10%" right="-80%">
          <Button
            cursor="pointer"
            bg="none"
            _hover={{bg: "none"}}
            onClick={() => download({link: file, fileName: "download"})}
            colorScheme="blue">
            <DownloadIcon fontSize="20px" />
          </Button>

          <Button
            cursor="pointer"
            bg="none"
            _hover={{bg: "none"}}
            onClick={onClose}
            colorScheme="blue">
            <CloseIcon fontSize="20px" />
          </Button>
        </Flex>
      </Box>
    </Modal>
  );
}

export default FilesReader;
