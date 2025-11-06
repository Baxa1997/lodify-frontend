import React from "react";
import styles from "./DateSeparator.module.scss";

const DateSeparator = ({date}) => {
  const formatDate = (dateString) => {
    if (!dateString) {
      return "Unknown Date";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString);
      return "Invalid Date";
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className={styles.dateSeparator}>
      <div className={styles.line} />
      <span className={styles.dateText}>{formatDate(date)}</span>
      <div className={styles.line} />
    </div>
  );
};

export default DateSeparator;
