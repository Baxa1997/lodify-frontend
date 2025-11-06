import React from "react";
import { Modal, Box, ModalOverlay } from "@chakra-ui/react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

function FileViewer({ isOpen = false, onClose, startIndex = 0, images = [] }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl">
      <ModalOverlay />
      <Box
        h="500px"
        w="600px"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "500px",
          height: "600px",
          bgcolor: "rgba(0,0,0,0.4)",
          zIndex: 1400,
        }}>
        <Lightbox
          open={isOpen}
          close={onClose}
          index={startIndex}
          slides={images
            ?.filter((image) => Boolean(image))
            ?.map((el) => ({ src: el }))}
          carousel={{
            finite: true,
            padding: 0,
            spacing: 0,
            imageFit: "contain",
          }}
          plugins={[Thumbnails, Zoom, Download]}
          render={{
            buttonPrev: () => null,
            buttonNext: () => null,
          }}
          styles={{
            thumbnailsContainer: {
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              margin: 0,
              padding: "10px 0",
              background: "rgba(18,18,18,0.7)",
              display: "flex",
              justifyContent: "center",
              zIndex: 11,
            },
            slide: {
              top: "50px",
              width: "400px",
              height: "600px",
              overflow: "hidden",
            },

            thumbnail: {
              width: 60,
              height: 50,
              border: "none",
              background: "transparent",
            },
            container: {
              background: "transparent",
            },
          }}
          animation={{ swipe: 400 }}
        />
      </Box>
    </Modal>
  );
}

export default FileViewer;
