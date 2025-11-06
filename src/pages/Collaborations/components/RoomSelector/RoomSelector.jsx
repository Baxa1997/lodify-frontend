import React from "react";
import {useChat} from "../../context/ChatContext";
import styles from "./RoomSelector.module.scss";

const RoomSelector = () => {
  const {rooms, activeRoomId, setActiveRoom, clearSearch, isSearching} =
    useChat();

  const roomTabs = [
    {id: "all", label: "All", count: rooms.all.conversations.length},
    {
      id: "favorites",
      label: "Favorites",
      count: rooms.favorites.conversations.length,
    },
    {
      id: "archived",
      label: "Archived",
      count: rooms.archived.conversations.length,
    },
  ];

  const handleRoomChange = (roomId) => {
    if (roomId === "search" && isSearching) {
      return; // Don't allow manual selection of search room
    }
    setActiveRoom(roomId);
    if (isSearching) {
      clearSearch();
    }
  };

  return (
    <div className={styles.roomSelector}>
      <div className={styles.tabs}>
        {roomTabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${
              activeRoomId === tab.id ? styles.active : ""
            }`}
            onClick={() => handleRoomChange(tab.id)}>
            <span className={styles.tabLabel}>{tab.label}</span>
            {tab.count > 0 && (
              <span className={styles.tabCount}>{tab.count}</span>
            )}
          </button>
        ))}

        {isSearching && (
          <button
            className={`${styles.tab} ${styles.searchTab} ${
              activeRoomId === "search" ? styles.active : ""
            }`}
            disabled>
            <span className={styles.tabLabel}>Search Results</span>
            <span className={styles.tabCount}>
              {rooms.search.conversations.length}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomSelector;
