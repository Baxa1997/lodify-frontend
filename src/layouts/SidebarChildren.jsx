import React from "react";
import {Menu, MenuButton, MenuList, MenuItem} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";

const SidebarChildren = ({open = false, onClose = () => {}, children}) => {
  return (
    <>
      <Menu open={open} onClose={onClose}>
        <MenuList>
          {children.map((child) => (
            <MenuItem key={child.id}>{child.label}</MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
};

export default SidebarChildren;
