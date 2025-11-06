import React from "react";
import {mockUsers} from "../../data/mockData";
import styles from "./TypingIndicator.module.scss";

const TypingIndicator = ({users}) => {
  return (
    <div className={styles.typingIndicator}>
      <div className={styles.avatars}>
        {users.slice(0, 3).map((userId) => {
          const user = mockUsers[userId];
          return (
            <img
              key={userId}
              src={user?.avatar || "/img/avatars/default.jpg"}
              alt={user?.name || "User"}
              className={styles.avatar}
            />
          );
        })}
      </div>

      <div className={styles.typingBubble}>
        <div className={styles.dots}>
          <div className={styles.dot} />
          <div className={styles.dot} />
          <div className={styles.dot} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
