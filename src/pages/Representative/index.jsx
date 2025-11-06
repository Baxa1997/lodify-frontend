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
import AddRepresentModal from "./components/AddRepresentModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

function Representative() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [search, setSearch] = useState("");
  const [assets, setAssets] = useState([]);
  const [isAddRepresentativeModalOpen, setIsAddRepresentativeModalOpen] =
    useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRepresentative, setSelectedRepresentative] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [representativeToDelete, setRepresentativeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data: representatives } = useQuery({
    queryKey: ["REPRESENTATIVES_LIST"],
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    queryFn: () => clientsService.getListRepresentative(),
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

  const handleRowClick = (id, representative) => {
    setSelectedRepresentative(representative);
    setIsEditMode(true);
    setIsAddRepresentativeModalOpen(true);
  };

  const handleAddRepresentative = () => {
    setSelectedRepresentative(null);
    setIsEditMode(false);
    setIsAddRepresentativeModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddRepresentativeModalOpen(false);
    setSelectedRepresentative(null);
    setIsEditMode(false);
  };

  const handleDeleteClick = (e, representative) => {
    e.stopPropagation(); // Prevent row click
    setRepresentativeToDelete(representative);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!representativeToDelete) return;

    setIsDeleting(true);
    try {
      await clientsService.deleteRepresentative(
        representativeToDelete.id || representativeToDelete.guid,
      );

      queryClient.invalidateQueries({ queryKey: ["REPRESENTATIVES_LIST"] });
      setIsDeleteModalOpen(false);
      setRepresentativeToDelete(null);
      setIsDeleting(false);

      toast({
        title: "Representative Deleted Successfully!",
        description: "The representative has been removed from the system",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      setIsDeleting(false);
      console.error("Error deleting representative:", error);

      toast({
        title: "Error Deleting Representative",
        description:
          error?.response?.data?.message ||
          "Failed to delete representative. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setRepresentativeToDelete(null);
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
          Representative
        </Text>
      </Box>

      <FiltersComponent
        filterButton={true}
        actionButton={true}
        actionButtonText="Add"
        onActionButtonClick={handleAddRepresentative}
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
            {representatives?.map((asset, index) => (
              <CTableRow
                key={asset.id || asset.guid || index}
                style={{
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleRowClick(asset.id || asset.guid, asset);
                }}>
                <CTableTd>{asset.full_name || ""}</CTableTd>
                <CTableTd>{asset?.email || ""}</CTableTd>
                <CTableTd>{asset?.phone || ""}</CTableTd>
                <CTableTd>{asset?.title || ""}</CTableTd>
                <CTableTd>{asset?.shippers_id_data?.name || ""}</CTableTd>
                <CTableTd>
                  <Box
                    w="100%"
                    textAlign="end">
                    <Menu>
                      <MenuButton
                        as={Button}
                        w="32px"
                        h="32px"
                        bg="none"
                        _hover={{ bg: "none" }}
                        _active={{ bg: "none" }}
                        _focus={{ boxShadow: "none" }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}>
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
      <AddRepresentModal
        isOpen={isAddRepresentativeModalOpen}
        onClose={handleCloseModal}
        text="Create Representative"
        selectedRepresentative={selectedRepresentative}
        isEditMode={isEditMode}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete?"
        itemName={representativeToDelete?.full_name || ""}
        isLoading={isDeleting}
      />
    </Flex>
  );
}

export default Representative;
