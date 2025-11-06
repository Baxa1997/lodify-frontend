
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
  Box,
  Flex,
  Badge,
  VStack,
  HStack,
  Image,
} from "@chakra-ui/react";
import styles from "../../../style.module.scss";

export const Insights = () => {

  return <>
    <Accordion
      allowMultiple
      className={styles.mainAccordion}>
      <AccordionItem className={styles.accordionItem}>
        <AccordionButton className={styles.assessmentButton}>
          <Flex
            gap="8px"
            align="center"
            width="100%">
            <Text
              fontSize="16px"
              fontWeight="600"
              color="primary.500"
            >
                Insights
            </Text>
            <Badge
              bg="#FEF6EE"
              color="#F38744"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="12px"
              fontWeight="600"
            >
                3 Total insights biscowered
            </Badge>
            <Box ml="auto">
              <AccordionIcon />
            </Box>
          </Flex>
        </AccordionButton>
        <AccordionPanel className={styles.assessmentPanel}>
          <Box>
            <Flex
              alignItems="center"
              gap="8px"
              padding="8px 12px"
              bgColor="#FAFAFA"
              borderRadius="8px"
            >
              <Image
                src="/img/image-x.svg"
                w={"20px"}
                h={"20px"} 
              />
              Sharing screenshots externally may cause you to lose access to Highway. Please help us protect your network.
            </Flex>
            <Box mt="32px">
              <Text
                fontSize="16px"
                fontWeight="600"
                color="primary.500"
                mb="16px"
              >
                Association Insights
              </Text>
              <Box>
                
              </Box>
            </Box>
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  </>;
};
