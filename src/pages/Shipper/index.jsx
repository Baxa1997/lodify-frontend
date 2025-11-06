import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import HeadBreadcrumb from "../../components/HeadBreadCrumb";
import FiltersComponent from "../../components/FiltersComponent";
import { CTable } from "@components/tableElements";
import {
  CTableHead,
  CTableTh,
  CTableBody,
  CTableTd,
} from "@components/tableElements";
import { tableElements } from "./components/mockElements";
import CTableRow from "@components/tableElements/CTableRow";
import clientsService from "../../services/clientsService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AddShipperModal from "./components/AddShipperModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

function Shipper() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [search, setSearch] = useState("");
  const [assets, setAssets] = useState([]);
  const [isAddShipperModalOpen, setIsAddShipperModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [shipperToDelete, setShipperToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data: clients } = useQuery({
    queryKey: ["CLIENTS_LIST"],
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    queryFn: () => clientsService.getListShipper(),
    select: (data) => data?.data?.response || [],
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const handleRowClick = (id, shipper) => {
    setSelectedShipper(shipper);
    setIsEditMode(true);
    setIsAddShipperModalOpen(true);
  };

  const handleAddShipper = () => {
    setSelectedShipper(null);
    setIsEditMode(false);
    setIsAddShipperModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddShipperModalOpen(false);
    setSelectedShipper(null);
    setIsEditMode(false);
  };

  const handleDeleteClick = (e, shipper) => {
    e.stopPropagation(); // Prevent row click
    setShipperToDelete(shipper);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!shipperToDelete) return;

    setIsDeleting(true);
    try {
      await clientsService.deleteShipper(
        shipperToDelete.id || shipperToDelete.guid,
      );

      queryClient.invalidateQueries({ queryKey: ["CLIENTS_LIST"] });
      setIsDeleteModalOpen(false);
      setShipperToDelete(null);
      setIsDeleting(false);

      toast({
        title: "Shipper Deleted Successfully!",
        description: "The shipper has been removed from the system",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      setIsDeleting(false);
      console.error("Error deleting shipper:", error);

      toast({
        title: "Error Deleting Shipper",
        description:
          error?.response?.data?.message ||
          "Failed to delete shipper. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setShipperToDelete(null);
  };

  return (
    <Flex
      flexDir={"column"}
      gap={"20px"}>
      <HeadBreadcrumb />
      <Box h={"32px"}>
        <Text
          h={"32px"}
          color={"#181D27"}
          fontWeight={"600"}
          fontSize={"24px"}>
          Shipper
        </Text>
      </Box>

      <FiltersComponent
        filterButton={true}
        actionButton={true}
        actionButtonText="Add Shipper"
        onActionButtonClick={handleAddShipper}
      />

      <Box mt={6}>
        <CTable
          height="calc(100vh - 270px)"
          overflow="auto"
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}>
          <CTableHead>
            {tableElements.map((element) => (
              <CTableTh
                key={element.key}
                sortable={element.sortable}
                sortDirection={
                  sortConfig.key === element.key ? sortConfig.direction : null
                }
                onSort={() => handleSort(element.key)}>
                {element.label}
              </CTableTh>
            ))}
          </CTableHead>

          <CTableBody>
            {clients?.map((asset, index) => (
              <CTableRow
                key={asset.id || asset.guid || index}
                style={{
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
                onClick={() => {
                  e.stopPropagation();
                  handleRowClick(asset.id || asset.guid, asset);
                }}>
                <CTableTd w="50%">{asset.name || asset.title || ""}</CTableTd>
                <CTableTd w="30%">
                  <Flex
                    alignItems={"center"}
                    justifyContent={"center"}
                    w="32px"
                    h="32px"
                    borderRadius="50%"
                    overflow={"hidden"}>
                    <img
                      src={asset?.logo}
                      alt=""
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Flex>
                </CTableTd>
                <CTableTd w="20%">
                  <Box
                    w="100%"
                    textAlign="end">
                    <Menu>
                      <MenuButton
                        as={Button}
                        w="20px"
                        h="20px"
                        bg="none"
                        _hover={{ bg: "none" }}
                        _active={{ bg: "none" }}
                        _focus={{ boxShadow: "none" }}>
                        <img
                          src="/img/threeDots.svg"
                          alt="" />
                      </MenuButton>
                      <MenuList>
                        <MenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(e, asset);
                          }}
                          color="red.500"
                          _hover={{ bg: "red.50" }}>
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Box>
                </CTableTd>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </Box>
      <AddShipperModal
        text="Create Shipper"
        isOpen={isAddShipperModalOpen}
        onClose={handleCloseModal}
        selectedShipper={selectedShipper}
        isEditMode={isEditMode}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete?"
        itemName={shipperToDelete?.name || shipperToDelete?.title || ""}
        isLoading={isDeleting}
      />
    </Flex>
  );
}

export default Shipper;
