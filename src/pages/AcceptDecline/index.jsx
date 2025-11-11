import {Flex, Text} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import {useState} from "react";
import AcceptDecilneTable from "./components/AcceptDecilneTable";

const AcceptDecline = () => {
  return (
    <>
      <Flex flexDir={"column"} gap={"20px"}>
        <HeadBreadCrumb />

        <Text h={"32px"} color={"#181D27"} fontWeight={"600"} fontSize={"24px"}>
          Accept / Decline
        </Text>

        <AcceptDecilneTable />
      </Flex>
    </>
  );
};

export default AcceptDecline;
