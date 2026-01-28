import {useState, Suspense, useEffect, useRef} from "react";
import {Outlet, useNavigate, useLocation} from "react-router-dom";
import styles from "./AdminLayout.module.scss";
import {Box, IconButton, Tooltip, Text, Flex} from "@chakra-ui/react";
import {LuSearch} from "react-icons/lu";
import SearchInput from "../components/SearchInput";
import Sidebar from "./Sidebar";
import ContentLoader from "../components/ContentLoader";
import {useSelector, useDispatch} from "react-redux";
import {sidebarActions} from "../store/sidebar";
import TourGuide from "../components/TourGuide";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const pathname = location.pathname;
  const sidebarOpen = useSelector((state) => state.sidebar.sidebar);
  const companyName = useSelector((state) => state.auth.companyName);
  const [searchValue, setSearchValue] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const searchInputRef = useRef(null);

  const toggleSidebar = () => {
    dispatch(sidebarActions.setSidebar(!sidebarOpen));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSearchInput(false);
      }
    };

    if (showSearchInput) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchInput]);

  return (
    <div className={styles.adminLayout}>
      {/* <TourGuide /> */}
      <div
        className={`${styles.sidebar} ${
          sidebarOpen ? styles.open : styles.closed
        }`}>
        <div className={styles.sidebarHeader}>
          <div
            className={styles.logo}
            onClick={toggleSidebar}
            style={{cursor: "pointer"}}>
            {sidebarOpen ? (
              <img src="/img/logoLodify.svg" alt="Lodify Admin" />
            ) : (
              <img src="/img/singleLogo.svg" alt="Lodify Admin" />
            )}
          </div>
          {sidebarOpen ? (
            <Box px={"24px"} mt={"16px"} className={styles.sidebarSearch}>
              <Flex h='40px' alignItems='center'>
               <Tooltip label={companyName} placement="right" hasArrow> 
                {companyName && (
                  <Box mb="10px">
                    <Box
                      as="span"
                      display="block"
                      fontSize="18px"
                      fontWeight="700"
                      color="#fff"
                      textTransform="uppercase"
                      letterSpacing="0.5px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap">
                      {companyName.length > 20 ? companyName.slice(0, 20) + '...' : companyName}
                    </Box>
                  </Box>
              )}</Tooltip>
              </Flex>

              <SearchInput
                placeholder="Search"
                onSearch={(value) => setSearchValue(value)}
                size="sm"
                height="40px"
                bg="rgba(255, 255, 255, 0.1)"
                borderColor="rgba(255, 255, 255, 0.2)"
                focusBorderColor="rgba(255, 255, 255, 0.4)"
                _hover={{
                  bg: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                }}
                _focus={{
                  bg: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.4)",
                }}
              />
            </Box>
          ) : (
            <Box px={"12px"} mt={"16px"}>
              {companyName && (
                <Tooltip
                  label={companyName}
                  placement="right"
                  hasArrow
                  bg="#1a1a1a"
                  color="#fff"
                  fontSize="12px">
                  <Box
                    w="40px"
                    h="40px"
                    mx='auto'
                    bg="transparent"
                    border="0.5px solid rgba(255, 255, 255, 0.1)"
                    borderRadius="8px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="default">
                    <Text
                      fontSize="16px"
                      fontWeight="600"
                      color="#fff">
                      {companyName.charAt(0).toUpperCase()}
                    </Text>
                  </Box>
                </Tooltip>
              )}
              <Box className={styles.sidebarSearchIcon}>
                <Tooltip label="Search" placement="right" hasArrow>
                  <IconButton
                    aria-label="Search"
                    icon={<LuSearch size={20} />}
                    variant="ghost"
                    color="white"
                    _hover={{bg: "rgba(255, 255, 255, 0.1)"}}
                    onClick={() => setShowSearchInput(!showSearchInput)}
                    size="sm"
                    className={styles.searchIconButton}
                  />
                </Tooltip>
              </Box>
            </Box>
          )}
        </div>

        <Sidebar searchValue={searchValue} sidebarOpen={sidebarOpen} />
      </div>

      {!sidebarOpen && showSearchInput && (
        <Box
          ref={searchInputRef}
          position="fixed"
          top="80px"
          left="90px"
          zIndex={99999}
          p={4}
          borderRadius="lg"
          boxShadow="0 4px 20px rgba(0, 0, 0, 0.15)"
          border="1px solid"
          borderColor="gray.200"
          minW="300px"
          bg="white"
          opacity={1}>
          <SearchInput
            showKeyboardShortcut={false}
            placeholder="Search"
            onSearch={(value) => {
              setSearchValue(value);
            }}
            size="md"
            color="gray.700"
            borderColor="gray.300"
            placeholderStyle={{
              color: "#9CA3AF",
              fontSize: "14px",
            }}
            bg="white"
            focusBorderColor="blue.400"
            _hover={{bg: "white", borderColor: "gray.400"}}
            _focus={{bg: "white", borderColor: "blue.400"}}
          />
        </Box>
      )}

      <div className={styles.mainContent}>
        <main
          className={styles.pageContent}
          style={{
            position: "relative",
            padding: `${
              pathname === "/admin/collabrations" ? "0" : "22px 24px"
            }`,
            minHeight: "100vh",
            willChange: "transform",
            backgroundColor: pathname?.includes("dashboard")
              ? "#f5f5f5"
              : "#ffff",
          }}>
          <Suspense fallback={<ContentLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
