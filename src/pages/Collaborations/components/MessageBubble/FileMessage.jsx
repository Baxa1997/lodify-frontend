import React, {useState} from "react";
import {Flex, Box, Text} from "@chakra-ui/react";
import {DownloadIcon} from "@chakra-ui/icons";
import FilesReader from "../../../../components/FileViewer/FilesReader";

function FileMessage({isOwn, content, fileInfo}) {
  const [isFileReaderOpen, setIsFileReaderOpen] = useState(false);
  const fileName = fileInfo?.name || content || "File attachment";
  const fileSize = fileInfo?.size || "Unknown size";
  const fileUrl = fileInfo?.url || content;

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return fileSize;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const isViewableFile = (filename) => {
    const ext = filename?.split(".").pop()?.toLowerCase();
    const viewableExtensions = [
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "webp",
    ];
    return viewableExtensions.includes(ext);
  };

  const handleFileClick = () => {
    if (isViewableFile(fileName)) {
      setIsFileReaderOpen(true);
    } else {
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <>
      <Box
        p={isOwn ? "6px 0px 6px 14px" : "6px 14px 6px 14px"}
        borderRadius="8px"
        bg={isOwn ? "transparent" : "#fff"}
        color={isOwn ? "#fff" : "#181D27"}
        maxW="80%"
        cursor="pointer"
        onClick={handleFileClick}>
        <Flex gap="12px" alignItems="center">
          <Box
            w="44px"
            h="44px"
            borderRadius="6px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="20px"
            flexShrink={0}>
            <img src={"/img/messagePdf.svg"} alt="" />
          </Box>
          <Box flex="1" minW="0">
            <Text
              color={isOwn ? "#fff" : "#181D27"}
              fontWeight="500"
              fontSize="14px"
              noOfLines={1}>
              {fileName}
            </Text>
            <Text color={isOwn ? "#fff" : "#535862"} fontSize="12px">
              {formatFileSize(fileInfo?.size)}
            </Text>
          </Box>
        </Flex>
      </Box>

      <FilesReader
        isOpen={isFileReaderOpen}
        onClose={() => setIsFileReaderOpen(false)}
        file={fileUrl}
      />
    </>
  );
}

export default FileMessage;
