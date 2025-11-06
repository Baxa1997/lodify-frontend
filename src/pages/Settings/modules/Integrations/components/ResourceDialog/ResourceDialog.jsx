import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";

export const ResourceDialog = ({
  isOpen,
  onClose = () => {},
  content = {},
  onSubmit = () => {},
  register = () => {},
}) => {
  // Only show modal if content type is ELD or SAMSARA (not MOTIVE)
  const shouldShow =
    (content?.type?.[0] === "ELD" || content?.type?.[0] === "SAMSARA") &&
    isOpen;

  return (
    <Modal
      isCentered
      isOpen={shouldShow}
      onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{content?.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form
            onSubmit={onSubmit}
            id="resourceForm">
            <Box
              display="flex"
              flexDir="column"
              gap="16px">
              {content?.type?.[0] === "ELD" && (
                <>
                  <Input
                    {...register("username", {
                      required: true,
                    })}
                    placeholder="Username"
                    defaultValue={content?.username || ""}
                    required
                  />
                  <Input
                    {...register("password", {
                      required: true,
                    })}
                    placeholder="Password"
                    defaultValue={content?.password || ""}
                    type="password"
                    required
                  />
                </>
              )}
              <Input
                {...register("api_key", {
                  required: true,
                })}
                placeholder="Api key"
                defaultValue={content?.api_key || ""}
                required
              />
            </Box>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            mr={3}
            onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="blue"
            type="submit"
            form="resourceForm">
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
