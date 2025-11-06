import styles from "./style.module.scss";

export const FormSectionTitle = ({ children }) => {
  
  return <h2 className={styles.title}>{children}</h2>;
};
