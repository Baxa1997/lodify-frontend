import {useState, useEffect} from "react";
import {Box, Input, Kbd, IconButton} from "@chakra-ui/react";
import {LuSearch, LuX} from "react-icons/lu";

const SearchBar = ({
  placeholder = "Search",
  onSearch,
  showKeyboardShortcut = true,
  size = "md",
  variant = "filled",
  bg = "#fff",
  focusBorderColor = "blue.400",
  borderColor = "#D5D7DA",
  color = "#000",
  height = "40px",
  placeholderStyle = {
    color: "#717680",
    fontSize: "16px",
  },
  p = "0px 16px 12px",
  inputBorderRadius = "lg",
  _hover,
  _focus,
  ...props
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        const searchInput = document.querySelector("[data-search-input]");
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (value) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setSearchValue("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <Box p={p} position="relative" {...props}>
      <Box position="relative">
        <Box
          position="absolute"
          left="12px"
          top="50%"
          transform="translateY(-50%)"
          color="gray.400"
          zIndex={1}
          pointerEvents="none">
          <LuSearch color="#667085" size={20} />
        </Box>

        <Input
          data-search-input
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          variant={variant}
          bg={bg}
          border="1px solid"
          borderColor={borderColor}
          color={color}
          _placeholder={{...placeholderStyle}}
          _hover={_hover}
          _focus={
            _focus || {
              borderColor: focusBorderColor,
              boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
            }
          }
          borderRadius={inputBorderRadius}
          pl="40px"
          pr={showKeyboardShortcut ? "80px" : "30px"}
          size={size}
          height={height}
        />

        <Box
          position="absolute"
          right="8px"
          top="50%"
          transform="translateY(-50%)"
          zIndex={1}>
          {searchValue ? (
            <IconButton
              size="xs"
              variant="ghost"
              color="gray.400"
              _hover={{color: "white", bg: "gray.700"}}
              onClick={handleClear}
              aria-label="Clear search">
              <LuX size={12} />
            </IconButton>
          ) : showKeyboardShortcut ? (
            <Kbd
              fontSize="xs"
              bg="transparent"
              color="#717680"
              border="1px solid"
              borderColor="#D5D7DA"
              px={2}
              py={1}
              borderRadius="md">
              ⌘K
            </Kbd>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchBar;
