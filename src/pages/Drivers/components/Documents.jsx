import React, { useState, useMemo } from "react";
import { Box, Text, Image } from "@chakra-ui/react";
import { MdZoomIn } from "react-icons/md";
import FileViewer from "@components/FileViewer";

const THUMB_SIZE = 150;

const Documents = ({ driverData }) => {
  const { passport } = driverData?.response ?? {};
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const passportImages = useMemo(() => {
    if (!passport) return [];
    return Array.isArray(passport) ? passport : [passport];
  }, [passport]);

  const handleImageClick = (index) => {
    setSelectedIndex(index);
    setIsViewerOpen(true);
  };

  if (passportImages.length === 0) {
    return (
      <Box mt="16px">
        <Text fontWeight="600" fontSize="14px" mb="8px">
          Driver Documents
        </Text>
        <Text fontSize="13px" color="gray.600">No passport documents available.</Text>
      </Box>
    );
  }

  return (
    <Box mt="16px">
      {/* <Text fontWeight="600" fontSize="14px" mb="8px">
        Driver Documents
      </Text> */}
      <Box display="flex" flexWrap="wrap" gap="8px">
        {passportImages.map((src, index) => (
          <Box
            key={index}
            width={`${THUMB_SIZE}px`}
            height={`${THUMB_SIZE}px`}
            position="relative"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="8px"
            overflow="hidden"
            backgroundColor="gray.100"
            cursor="pointer"
            onClick={() => handleImageClick(index)}
            _hover={{
              borderColor: "blue.400",
              boxShadow: "md",
              "& .doc-thumb": {
                transform: "scale(1.08)",
              },
              "& .doc-overlay": {
                opacity: 1,
              },
            }}
            transition="all 0.2s ease-out"
            sx={{
              "& .doc-thumb": { transition: "transform 0.25s ease-out" },
              "& .doc-overlay": { transition: "opacity 0.2s ease-out" },
            }}>
            <Image
              className="doc-thumb"
              src={src}
              alt={`Passport page ${index + 1}`}
              width="100%"
              height="100%"
              objectFit="cover"
              fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect fill='%23e2e8f0' width='150' height='150'/%3E%3Ctext x='50%25' y='50%25' fill='%23718096' dominant-baseline='middle' text-anchor='middle' font-size='14'%3ELoading…%3C/text%3E%3C/svg%3E"
              loading="lazy"
              ignoreFallback={false}
            />
            <Box
              className="doc-overlay"
              position="absolute"
              inset={0}
              bg="blackAlpha.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
              opacity={0}
              pointerEvents="none">
              <Box
                color="white"
                bg="blackAlpha.600"
                borderRadius="full"
                p="10px"
                display="flex"
                alignItems="center"
                justifyContent="center">
                <MdZoomIn size={28} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <FileViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        startIndex={selectedIndex}
        images={passportImages}
      />
    </Box>
  );
};

export default Documents;