import styles from "./styles.module.scss";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Text } from "@chakra-ui/react";

export const InfoAccordion = ({ children, ...props }) => {
  return <Accordion
    allowMultiple
    className={styles.accordionContainer}
    {...props}
  >
    {children}
  </Accordion>;
};

export const InfoAccordionItem = ({ children, ...props }) => {
  return <AccordionItem
    className={styles.accordionItem}
    {...props}
  >
    {children}
  </AccordionItem>;
};

export const InfoAccordionPanel = ({ children, ...props }) => {
  return <AccordionPanel
    className={styles.accordionPanel}
    {...props}
  >
    {children}
  </AccordionPanel>;
};

export const InfoAccordionButton = ({ children, ...props }) => {
  return <AccordionButton
    className={styles.accordionButton}
    {...props}
  >
    {children}
    <AccordionIcon marginLeft="auto" />
  </AccordionButton>;
};

export const InfoAccordionTitle = ({ children, ...props }) => {
  return <Text
    fontSize="16px"
    fontWeight="600"
    color="primary.500"
    {...props}
  >
    {children}
  </Text>;
};

export const InfoAccordionDescription = ({ children, ...props }) => {
  return <Text
    fontSize="14px"
    color="#6b7280"
    {...props}
  >
    {children}
  </Text>;
};
