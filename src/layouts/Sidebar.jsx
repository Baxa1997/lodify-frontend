import React, {useState} from "react";
import {brokerMenuItems, menuItems} from "../utils/menuItems";
import styles from "./AdminLayout.module.scss";
import {useNavigate, useLocation} from "react-router-dom";
import {Tooltip} from "@chakra-ui/react";
import SidebarFooter from "./SidebarFooter";
import {useSelector} from "react-redux";

const Sidebar = ({sidebarOpen = false, searchValue = ""}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const clientType = useSelector((state) => state.auth.clientType);
  const [expandedItems, setExpandedItems] = useState(new Set());

  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";

  const isActiveRoute = (path) => {
    const lastPath = location.pathname.split("/").pop();
    return lastPath === path;
  };

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const filteredMenuItems = (isBroker ? brokerMenuItems : menuItems).filter(
    (item) => item?.label.toLowerCase().includes(searchValue.toLowerCase())
  );
  return (
    <>
      <nav className={styles.sidebarNav}>
        <ul className={styles.navList}>
          {filteredMenuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.has(item.id);
            const isActive =
              isActiveRoute(item.path) ||
              (hasChildren &&
                item.children.some((child) => isActiveRoute(child.path)));

            return (
              <li key={item.id} className={styles.navItem}>
                {!sidebarOpen ? (
                  <Tooltip placement="right" label={item?.label || ""} hasArrow>
                    <button
                      className={`${styles.navLink} ${
                        isActive ? styles.active : ""
                      }`}
                      onClick={() => {
                        if (hasChildren) {
                          toggleExpanded(item.id);
                        } else {
                          navigate(item.path);
                        }
                      }}>
                      <span className={styles.navIcon}>
                        <img src={item.icon} alt="" />
                      </span>
                    </button>
                  </Tooltip>
                ) : (
                  <button
                    className={`${styles.navLink} ${
                      isActive ? styles.active : ""
                    }`}
                    onClick={() => {
                      if (hasChildren) {
                        toggleExpanded(item.id);
                      } else {
                        navigate(item.path);
                      }
                    }}>
                    <span className={styles.navIcon}>
                      <img src={item.icon} alt="" />
                    </span>
                    <span className={styles.navLabel}>{item.label}</span>
                    {hasChildren && (
                      <span
                        className={`${styles.accordionIcon} ${
                          isExpanded ? styles.expanded : ""
                        }`}>
                        <img src="/img/iconDown.svg" alt="" />
                      </span>
                    )}
                  </button>
                )}

                {hasChildren && sidebarOpen && (
                  <ul
                    className={`${styles.subNavList} ${
                      isExpanded ? styles.expanded : ""
                    }`}>
                    {item.children.map((child) => (
                      <li key={child.id} className={styles.subNavItem}>
                        <button
                          className={`${styles.navLink} ${styles.subNavLink} ${
                            isActiveRoute(child.path) ? styles.active : ""
                          }`}
                          onClick={() => navigate(child.path)}>
                          <span className={styles.navLabel}>{child.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <SidebarFooter sidebarOpen={sidebarOpen} />
    </>
  );
};

export default Sidebar;
