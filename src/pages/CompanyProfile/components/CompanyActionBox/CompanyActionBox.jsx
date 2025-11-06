import styles from "./style.module.scss";
import { Button } from "@chakra-ui/react";

export const CompanyActionBox = ({ onSaveClick = () => {} }) => {
  return <div className={styles.actions}>
    <Button variant="outline">Cancel</Button>
    <Button
      onClick={onSaveClick}
      colorScheme="blue"
      variant="solid">Save</Button>
  </div>;
};