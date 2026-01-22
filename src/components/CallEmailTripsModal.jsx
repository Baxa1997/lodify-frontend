import React from 'react'
import { Menu, MenuButton, MenuList, MenuItem, Button, Text, Icon, VStack, Box } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { FiPhone, FiMail } from 'react-icons/fi'
import checkedPhone from '@hooks/checkedPhone'

const CallEmailTripsModal = ({trip = {}, isBroker, children}) => {
  const getPhone = (trip) => {
    return isBroker ? checkedPhone(trip?.carrier?.telephone) : checkedPhone(trip?.current_driver_phone || trip?.drivers?.phone);
  }

  const getEmail = (trip) => {

    return isBroker ? trip?.carrier?.email : trip?.drivers?.email || trip?.current_driver_email;
  }

  const phone = getPhone(trip);
  const email = getEmail(trip);

  const handleCall = () => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  }

  const handleEmail = () => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <Menu>
      <MenuButton
        as={children ? Box : Button}
        rightIcon={children ? <ChevronDownIcon /> : undefined}
        onClick={(e) => e.stopPropagation()}
        style={children ? { display: 'inline-flex', alignItems: 'center', gap: '4px' } : {}}
      >
        {children || 'Actions'}
      </MenuButton>
      <MenuList>
        <MenuItem
          icon={<Icon as={FiPhone} />}
          onClick={(e) => {
            e.stopPropagation();
            handleCall();
          }}
          isDisabled={!phone}
        >
          <VStack align="start" spacing={0}>
            <Text fontSize="sm" fontWeight="500">
              Call {isBroker ? 'Carrier' : 'Driver'}
            </Text>
            {phone && (
              <Text fontSize="xs" color="gray.500">
                {phone}
              </Text>
            )}
          </VStack>
        </MenuItem>
        <MenuItem
          icon={<Icon as={FiMail} />}
          onClick={(e) => {
            e.stopPropagation();
            handleEmail();
          }}
          isDisabled={!email}
        >
          <VStack align="start" spacing={0}>
            <Text fontSize="sm" fontWeight="500">
              Email {isBroker ? 'Carrier' : 'Driver'}
            </Text>
            {email && (
              <Text fontSize="xs" color="gray.500">
                {email}
              </Text>
            )}
          </VStack>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default CallEmailTripsModal