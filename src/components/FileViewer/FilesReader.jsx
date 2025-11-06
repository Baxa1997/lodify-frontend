import React from "react";
import { Modal, Box, ModalOverlay, Button, Flex } from "@chakra-ui/react";
import { CloseIcon, DownloadIcon } from "@chakra-ui/icons";
import useDownloader from "../../utils/useDownloader";

function FilesReader({ isOpen = false, onClose, file = "" }) {
  const { download } = useDownloader();
  const fileExt = file?.split(".").pop()?.toLowerCase();
  const isPDF = fileExt === "pdf";
  const isWord = fileExt === "doc" || fileExt === "docx";
  const isExcel = fileExt === "xls" || fileExt === "xlsx";

  const encodedURL = encodeURIComponent(file || "");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl">
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
            <iframe
              src={file}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="PDF Viewer"
            />
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

        <Flex
          gap="10px"
          position="fixed"
          top="-10%"
          right="-80%">
          <Button
            cursor="pointer"
            bg="none"
            _hover={{ bg: "none" }}
            onClick={() => download({ link: file, fileName: "download" })}
            colorScheme="blue">
            <DownloadIcon fontSize="20px" />
          </Button>

          <Button
            cursor="pointer"
            bg="none"
            _hover={{ bg: "none" }}
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
