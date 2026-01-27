import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Button,
  VStack,
  Icon,
  Flex,
} from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'

function MultipleActionModal({
  isOpen,
  onClose,
  selectedTrips,
  action,
  acceptAction,
  rejectAction,
  isLoading

}) {
  const isAccept = action === 'accept'
  const tripCount = selectedTrips?.size || selectedTrips?.length || 0
  const actionText = isAccept ? 'Accept' : 'Reject'
  const actionColor = isAccept ? 'green' : 'red'

  const handleConfirm = () => {
    if (isAccept) {
      acceptAction()
    } else {
      rejectAction()
    }

  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
      <ModalContent
        bg="white"
        borderRadius="12px"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.15)">
        <ModalHeader borderBottom="1px solid #E2E8F0" pb={4}>
          <VStack spacing={1} align="center">
            <Icon
              as={WarningIcon}
              w={12}
              h={12}
              color={`${actionColor}.500`}
              bg={`${actionColor}.50`}
              borderRadius="full"
              p={2}
            />
          </VStack>
        </ModalHeader>

        <ModalBody py={6} px={6}>
          <Text
            fontSize="16px"
            fontWeight="600"
            color="#181D27"
            textAlign="center"
            mb={2}>
            Are you sure to {actionText} all chosen trips?
          </Text>
          <Text
            fontSize="14px"
            color="#64748B"
            textAlign="center"
            lineHeight="1.5">
            You are about to {actionText.toLowerCase()} <strong>{tripCount}</strong>{' '}
            {tripCount === 1 ? 'trip' : 'trips'}. This action cannot be undone.
          </Text>
        </ModalBody>

        <ModalFooter borderTop="1px solid #E2E8F0" pt={4} gap={3}>
          <Flex w="100%" justifyContent="space-between" alignItems="center" gap={3}>
            <Button
              onClick={onClose}
              variant="outline"
              borderColor="#E2E8F0"
              color="#64748B"
              fontSize="14px"
              fontWeight="500"
              px={6}
              py={2}
              borderRadius="8px"
              _hover={{
                bg: '#F7FAFC',
                borderColor: '#CBD5E0',
              }}
              isDisabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              bg={`${actionColor}.500`}
              color="white"
              fontSize="14px"
              fontWeight="500"
              px={6}
              py={2}
              borderRadius="8px"
              _hover={{
                bg: `${actionColor}.600`,
              }}
              _active={{
                bg: `${actionColor}.700`,
              }}
              isLoading={isLoading}
              loadingText={`${actionText}ing...`}>
              {actionText}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default MultipleActionModal