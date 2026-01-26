import React, {useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, Button, Flex } from '@chakra-ui/react'
import { ModalBody, Text } from '@chakra-ui/react'
import SearchableSelect from './SearchableSelect'
import { useSelector } from 'react-redux'
import tripsService from '@services/tripsService'
import { useQuery, useQueryClient } from '@tanstack/react-query'

function MultipleCarrierAssignModal({isOpen, onClose, loading, selectedTrips, keyRefetch = ''}) {
    const queryClient = useQueryClient();
    const [searchText, setSearchText] = useState('')
    const envId = useSelector((state) => state.auth.environmentId);
    const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);
    const [selectedCarrier, setSelectedCarrier] = useState({});


    const {data: carriersData} = useQuery({
        queryKey: ["CARRIERS_LIST", brokersId, searchText],
        queryFn: () =>
          tripsService.getCarriersList({
            app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
            environment_id: envId,
            method: "list",
            object_data: {
              broker_id: brokersId,
              own_carriers: true,
              offset: 0,
              limit: 10,
              ...(searchText && {search: searchText}),
            },
            table: "carriers",
          }),
        select: (res) =>
          res.data?.response?.map((item) => ({
            label: item?.legal_name,
            value: item?.guid,
          })),
        enabled: !!brokersId && Boolean(isOpen),
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
      });


        

    const handleAddCarrier = () => {
        const data = Array.from(selectedTrips).map((trip) => ({
            companies_id: selectedCarrier?.value,
            guid: trip
        }))
        tripsService.multipleCarrierAssign({
            objects: [...data],
        }).then(() => {
            queryClient.refetchQueries([keyRefetch]);

        }).catch((error) => {
            console.log('error', error)
        }).finally(() => {
            // setLoading(false)
        })
        setSearchText('')
        setSelectedCarrier({})
    }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Multiple Carrier Assign</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="16px" fontWeight="500" color="gray.700" mb={2}>
            Select Carrier
          </Text>
          <SearchableSelect
          value={selectedCarrier?.value}
            options={carriersData}
            searchText={searchText}
            setSearchText={setSearchText}
            handleOptions={setSelectedCarrier}
          />
         <Flex mt={4} justifyContent="flex-end" gap={2}>
         <Button
            onClick={handleAddCarrier}
            bg="#EF6820"
            color="white"
            _hover={{bg: "#EF6820"}}
            isLoading={loading}
          >
            Add Carrier
          </Button>
         </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default MultipleCarrierAssignModal