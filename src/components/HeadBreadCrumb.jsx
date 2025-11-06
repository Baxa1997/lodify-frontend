import {Button, Flex, Text} from "@chakra-ui/react";
import React, {memo} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {sidebarActions} from "../store/sidebar";

const HeadBreadCrumb = ({customPath = null, title}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.sidebar.sidebar);
  const {label} = location.state || {};

  const toggleSidebar = () => {
    dispatch(sidebarActions.setSidebar(!sidebarOpen));
  };

  const renderBreadcrumb = () => {
    const baseElements = (
      <>
        <Button
          width={"24px"}
          maxWidth={"24px"}
          minWidth={"24px"}
          height={"28px"}
          maxHeight={"28px"}
          minHeight={"28px"}
          padding={"4px"}
          bg={"none"}
          onClick={toggleSidebar}
          cursor="pointer"
          _hover={{bg: "gray.100"}}>
          <img src="/img/sidebar.svg" alt="sidebar" />
        </Button>

        <Button
          width={"24px"}
          maxWidth={"24px"}
          minWidth={"24px"}
          height={"28px"}
          maxHeight={"28px"}
          minHeight={"28px"}
          padding={"4px"}
          bg={"none"}
          onClick={() => navigate("/admin/dashboard")}
          cursor="pointer"
          _hover={{bg: "gray.100"}}>
          <img src="/img/home.svg" alt="home" />
        </Button>

        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          w={"16px"}
          h={"16px"}>
          <img src="/img/chevron-right.svg" alt="arrow" />
        </Flex>
      </>
    );

    if (customPath && Array.isArray(customPath)) {
      return (
        <>
          {baseElements}
          {customPath.map((item, index) => (
            <React.Fragment key={index}>
              <Flex>
                <Text
                  fontSize={"14px"}
                  fontWeight={"600"}
                  color={"#181D27"}
                  cursor={item.path ? "pointer" : "default"}
                  onClick={item.path ? () => navigate(item.path) : undefined}>
                  {item.label}
                </Text>
              </Flex>
              {index < customPath.length - 1 && (
                <Flex
                  alignItems={"center"}
                  justifyContent={"center"}
                  w={"16px"}
                  h={"16px"}>
                  <img src="/img/chevron-right.svg" alt="arrow" />
                </Flex>
              )}
            </React.Fragment>
          ))}
        </>
      );
    }

    let path = location.pathname.split("/").pop();
    const titleFromPath = path.charAt(0).toUpperCase() + path.slice(1);

    return (
      <>
        {baseElements}
        <Flex>
          <Text fontSize={"14px"} fontWeight={"600"} color={"#181D27"}>
            {label || title || titleFromPath}
          </Text>
        </Flex>
      </>
    );
  };

  return (
    <Flex h={"28px"} p={"4px"} gap={"4px"} alignItems={"center"}>
      {renderBreadcrumb()}
    </Flex>
  );
};

export default memo(HeadBreadCrumb);
