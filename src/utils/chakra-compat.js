// Compatibility layer for Chakra UI v2 to v3 migration
// Re-exports all Chakra UI components with Menu component aliases
// Note: This file is aliased in vite.config.js to replace @chakra-ui/react imports
import * as ChakraCore from "@chakra-ui/react";

// Re-export everything from Chakra UI
export * from "@chakra-ui/react";

// Add compatibility aliases for Menu components (v2 names -> v3 names)
export const Menu = ChakraCore.MenuRoot;
export const MenuButton = ChakraCore.MenuTrigger;
export const MenuList = ChakraCore.MenuContent;
