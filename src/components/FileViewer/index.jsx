import React, { useState, useCallback, useEffect } from "react";
import { Modal, Box, ModalOverlay } from "@chakra-ui/react";
import { MdRotateLeft, MdRotateRight } from "react-icons/md";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const ROTATE_STEP = 90;

function FileViewer({ isOpen = false, onClose, startIndex = 0, images = [] }) {
  const slides = images?.filter(Boolean)?.map((el) => ({ src: el })) ?? [];
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [rotations, setRotations] = useState({});

  const currentSlideSrc = slides[currentIndex]?.src;

  const handleRotate = useCallback(
    (delta) => {
      if (!currentSlideSrc) return;
      setRotations((prev) => ({
        ...prev,
        [currentSlideSrc]: (prev[currentSlideSrc] ?? 0) + delta,
      }));
    },
    [currentSlideSrc]
  );

  const handleView = useCallback(({ index }) => setCurrentIndex(index), []);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(startIndex);
    } else {
      setRotations({});
    }
  }, [isOpen, startIndex]);

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
          slides={slides}
          on={{ view: handleView }}
          carousel={{
            finite: true,
            padding: 0,
            spacing: 0,
            imageFit: "contain",
          }}
          plugins={[Thumbnails, Zoom, Download]}
          toolbar={{
            buttons: [
              <button
                key="rotate-left"
                type="button"
                className="yarl__button"
                onClick={() => handleRotate(-ROTATE_STEP)}
                title="Rotate left"
                aria-label="Rotate left">
                <MdRotateLeft size={24} />
              </button>,
              <button
                key="rotate-right"
                type="button"
                className="yarl__button"
                onClick={() => handleRotate(ROTATE_STEP)}
                title="Rotate right"
                aria-label="Rotate right">
                <MdRotateRight size={24} />
              </button>,
              "download",
              "close",
            ],
          }}
          render={{
            buttonPrev: () => null,
            buttonNext: () => null,
            slideContainer: ({ slide, children }) => (
              <div
                style={{
                  transform: `rotate(${rotations[slide.src] ?? 0}deg)`,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                {children}
              </div>
            ),
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
