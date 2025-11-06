import React, {useState} from "react";
import {Box, Text} from "@chakra-ui/react";
import FileViewer from "../../../../components/FileViewer";

function ImageMessage({isOwn, content, fileInfo}) {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const imageUrl = fileInfo?.url || content;
  const fileName = fileInfo?.name || "Image";

  if (!imageUrl) {
    return (
      <Box p="10px 14px">
        <Text color={isOwn ? "#fff" : "#181D27"}>Image not available</Text>
      </Box>
    );
  }

  const handleImageClick = () => {
    setIsImageViewerOpen(true);
  };

  return (
    <>
      <Box
        p="0"
        borderRadius="8px"
        cursor="pointer"
        onClick={handleImageClick}
        overflow="hidden"
        maxW="100%">
        <img
          src={imageUrl}
          alt={fileName}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "cover",
            maxHeight: "400px",
          }}
        />
      </Box>

      <FileViewer
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        startIndex={0}
        images={[imageUrl]}
      />
    </>
  );
}

export default ImageMessage;
