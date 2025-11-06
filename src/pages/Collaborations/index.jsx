import React from "react";
import {Chat} from "./components/Chat";
import styles from "./Collaborations.module.scss";

const Collaborations = () => {
  return (
    <div className={styles.collaborations}>
      <Chat />
    </div>
  );
};

export default Collaborations;
