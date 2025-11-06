import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  useToast,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { DataTable } from "@components/DataTable";
import { usePermissionsPropsWithForm } from "./usePermissionsProps";
import { FieldPermissionsModal } from "@components/FieldPermissionsModal";
import { AddIcon } from "@chakra-ui/icons";
import authService from "@services/auth/authService";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

export const Permissions = () => {
  const toast = useToast();
  const [activeRole, setActiveRole] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [initialRoleData, setInitialRoleData] = useState(null);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [selectedTableSlug, setSelectedTableSlug] = useState(null);
  const [roleChangeCounter, setRoleChangeCounter] = useState(0);

  const clientTypeId = useSelector((state) => state.auth.clientType?.id);
  const projectId = useSelector((state) => state.auth.projectId);
  const token = useSelector((state) => state.auth.token);
  const permissions = useSelector((state) => state?.auth);

  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  const { bodyData: staticBodyData } = usePermissionsPropsWithForm();

  const { data: roles = [], refetch: refetchRoles } = useQuery({
    queryKey: ["ROLES", clientTypeId, projectId],
    enabled: !!clientTypeId && !!projectId && !!token,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    queryFn: () =>
      authService.getRoles(
        {
          "client-type-id": clientTypeId,
          "project-id": projectId,
        },
        {
          Authorization: `Bearer ${token}`,
        },
      ),
    select: (data) => data.data?.response,
  });

  const {
    data: singleRoleData,
    isLoading: isLoadingRole,
    refetch: refetchSingleRole,
  } = useQuery({
    queryKey: ["SINGLE_ROLE", activeRole?.guid, projectId, roleChangeCounter],
    enabled: !!activeRole?.guid && !!projectId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 0,
    queryFn: () => {
      return authService.getRoleById(projectId, activeRole.guid, {
        "project-id": projectId,
      });
    },
    select: (data) => data?.data,
  });

  useEffect(() => {
    if (roles && roles.length > 0 && !activeRole) {
      const firstRole = roles[0];
      setActiveRole(firstRole);
    }
  }, [roles, activeRole?.guid]);

  const roleForm = useForm({
    defaultValues: {
      roleName: "",
      status: "active",
    },
  });

  const onRoleSubmit = (data) => {
    const newRole = data.roleName.toUpperCase();

    authService
      .roleCreate(
        {
          name: newRole,
          status: data.status === "active" ? true : false,
          client_type_id: clientTypeId,
          "project-id": projectId,
        },
        {
          "project-id": projectId,
        },
      )
      .then((res) => {
        refetch();
        setIsOpen(false);
        roleForm.reset();
        toast({
          title: "Role Added",
          description: `${newRole} role has been added successfully.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to create role. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleFieldModalOpen = (tableSlug) => {
    setSelectedTableSlug(tableSlug);
    setIsFieldModalOpen(true);
  };

  const handleFieldModalClose = () => {
    setIsFieldModalOpen(false);
    setSelectedTableSlug(null);
  };

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setRoleChangeCounter((prev) => prev + 1);

    reset();
  };

  const { headData } = usePermissionsPropsWithForm(
    register,
    setValue,
    watch,
    handleFieldModalOpen,
  );

  const bodyData = staticBodyData;

  const allowedSlugs = [
    "dashboard",
    "trips",
    "users",
    "drivers",
    "assets",
    "contracts",
    "shippers",
    "representative",
    "payments",
    "company_profile",
    "contracts",
    "clients",
    "managing_resource",
  ];

  const transformRoleDataToForm = (roleData) => {
    if (!roleData || !roleData.tables) return {};

    setInitialRoleData(roleData);

    const formData = {};

    staticBodyData.forEach((item, index) => {
      formData[index] = {
        ...item,
        field_permissions: {},
        tableData: null,
      };

      if (item.children) {
        formData[index].children = item.children.map((child, childIndex) => ({
          ...child,
          field_permissions: {},
          tableData: null,
        }));
      }
    });

    const filteredTables = roleData.tables.filter((table) =>
      allowedSlugs.includes(table?.slug?.toLowerCase()),
    );

    filteredTables.forEach((table) => {
      const labelMapping = {
        users: "user",
        "managing resource": "managing resources",
        "company profile": "company profile",
        clients: "clients",
      };

      const normalizedApiLabel = table.label.toLowerCase();
      const mappedLabel =
        labelMapping[normalizedApiLabel] || normalizedApiLabel;

      const staticIndex = staticBodyData.findIndex((item) => {
        const staticLabel = item.objects.toLowerCase();
        return (
          staticLabel === normalizedApiLabel || staticLabel === mappedLabel
        );
      });

      if (staticIndex !== -1) {
        const fieldPermissionsForm = {};
        if (table.field_permissions) {
          table.field_permissions.forEach((field, fieldIndex) => {
            fieldPermissionsForm[fieldIndex] = {
              field_id: field.field_id,
              label: field.label,
              view_permission: field.view_permission,
              edit_permission: field.edit_permission,
              table_slug: field.table_slug,
            };
          });
        }

        formData[staticIndex] = {
          ...formData[staticIndex],
          read: table.record_permissions?.read === "Yes",
          write: table.record_permissions?.write === "Yes",
          update: table.record_permissions?.update === "Yes",
          delete: table.record_permissions?.delete === "Yes",
          public: table.record_permissions?.is_public === true,
          field: table.field_permissions?.length > 0,
          field_permissions: fieldPermissionsForm,
          tableData: {
            id: table.id,
            slug: table.slug,
            field_permissions: table.field_permissions,
            view_permissions: table.view_permissions,
            table_view_permissions: table.table_view_permissions,
            custom_permission: table.custom_permission,
          },
        };
      }
    });

    staticBodyData.forEach((item, index) => {
      if (item.children) {
        item.children.forEach((child, childIndex) => {
          const labelMapping = {
            users: "user",
            user: "users",
            representatives: "representative",
            managing_resource: "managing resources",
            clients: "clients",
          };

          const normalizedChildLabel = child.objects.toLowerCase();
          const mappedChildLabel =
            labelMapping[normalizedChildLabel] || normalizedChildLabel;

          const matchingTable = filteredTables.find((table) => {
            const apiLabel = table.label.toLowerCase();
            return (
              apiLabel === normalizedChildLabel || apiLabel === mappedChildLabel
            );
          });

          if (matchingTable) {
            const fieldPermissionsForm = {};
            if (matchingTable.field_permissions) {
              matchingTable.field_permissions.forEach((field, fieldIndex) => {
                fieldPermissionsForm[fieldIndex] = {
                  field_id: field.field_id,
                  label: field.label,
                  view_permission: field.view_permission,
                  edit_permission: field.edit_permission,
                  table_slug: field.table_slug,
                };
              });
            }

            formData[index].children[childIndex] = {
              ...formData[index].children[childIndex],
              read: matchingTable.record_permissions?.read === "Yes",
              write: matchingTable.record_permissions?.write === "Yes",
              update: matchingTable.record_permissions?.update === "Yes",
              delete: matchingTable.record_permissions?.delete === "Yes",
              public: matchingTable.record_permissions?.is_public === true,
              field: matchingTable.field_permissions?.length > 0,
              field_permissions: fieldPermissionsForm,
              tableData: {
                id: matchingTable.id,
                slug: matchingTable.slug,
                field_permissions: matchingTable.field_permissions,
                view_permissions: matchingTable.view_permissions,
                table_view_permissions: matchingTable.table_view_permissions,
                custom_permission: matchingTable.custom_permission,
              },
            };
          }
        });
      }
    });

    return formData;
  };

  useEffect(() => {
    if (singleRoleData) {
      const formData = transformRoleDataToForm(singleRoleData);

      reset(formData);
    }
  }, [singleRoleData, reset]);

  const transformFormDataToAPI = (formData) => {
    if (!formData || !initialRoleData) return null;

    const updatedRoleData = {
      ...initialRoleData,
      tables: [...initialRoleData.tables],
    };

    Object.values(formData).forEach((permission) => {
      if (permission.tableData?.id) {
        const tableIndex = updatedRoleData.tables.findIndex(
          (table) => table.id === permission.tableData.id,
        );

        if (tableIndex !== -1) {
          const fieldPermissionsAPI = [];
          if (permission.field_permissions) {
            Object.values(permission.field_permissions).forEach((field) => {
              fieldPermissionsAPI.push({
                field_id: field.field_id,
                view_permission: field.view_permission,
                edit_permission: field.edit_permission,
                label: field.label,
                table_slug: field.table_slug,
              });
            });
          }

          updatedRoleData.tables[tableIndex] = {
            ...updatedRoleData.tables[tableIndex],
            record_permissions: {
              read: permission.read ? "Yes" : "No",
              write: permission.write ? "Yes" : "No",
              update: permission.update ? "Yes" : "No",
              delete: permission.delete ? "Yes" : "No",
              is_public: permission.public,
            },
            field_permissions: fieldPermissionsAPI,
          };
        }
      }

      if (permission.children) {
        permission.children.forEach((child) => {
          if (child.tableData?.id) {
            const tableIndex = updatedRoleData.tables.findIndex(
              (table) => table.id === child.tableData.id,
            );

            if (tableIndex !== -1) {
              const fieldPermissionsAPI = [];
              if (child.field_permissions) {
                Object.values(child.field_permissions).forEach((field) => {
                  fieldPermissionsAPI.push({
                    field_id: field.field_id,
                    view_permission: field.view_permission,
                    edit_permission: field.edit_permission,
                    label: field.label,
                    table_slug: field.table_slug,
                  });
                });
              }

              updatedRoleData.tables[tableIndex] = {
                ...updatedRoleData.tables[tableIndex],
                record_permissions: {
                  read: child.read ? "Yes" : "No",
                  write: child.write ? "Yes" : "No",
                  update: child.update ? "Yes" : "No",
                  delete: child.delete ? "Yes" : "No",
                  is_public: child.public,
                },
                field_permissions: fieldPermissionsAPI,
              };
            }
          }
        });
      }
    });

    return updatedRoleData;
  };

  const onSubmit = (data) => {
    const apiData = transformFormDataToAPI(data);

    authService
      .updatePermissions(apiData, {
        "project-id": projectId,
      })
      .then((res) => {
        refetchSingleRole();
        toast({
          title: "Permissions Updated",
          description: "Permissions have been updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to update permissions. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleSave = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <>
      {" "}
      <Box pt="24px">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap="20px">
          <HStack
            px="10px"
            id="scrollbar_none"
            spacing={1}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="8px"
            padding="4px"
            width="100%"
            overflow="scroll"
            bg="white">
            {roles?.map((role) => (
              <Button
                minW="fit-content"
                key={role.id || role.name || role.guid}
                variant={activeRole?.guid === role.guid ? "solid" : "ghost"}
                colorScheme={activeRole?.guid === role.guid ? "gray" : "gray"}
                size="sm"
                borderRadius="6px"
                fontWeight={activeRole?.guid === role.guid ? 500 : 400}
                bg={activeRole?.guid === role.guid ? "gray.100" : "transparent"}
                color={activeRole?.guid === role.guid ? "gray.900" : "gray.600"}
                onClick={() => handleRoleChange(role)}
                _hover={{
                  bg: activeRole?.guid === role.guid ? "gray.100" : "gray.50",
                }}>
                {role.name}
              </Button>
            ))}
            <IconButton
              mx="6px"
              icon={<AddIcon />}
              size="sm"
              variant="ghost"
              colorScheme="gray"
              borderRadius="6px"
              bg="transparent"
              color="gray.600"
              _hover={{
                bg: "gray.200",
              }}
              onClick={() => {
                setIsOpen(true);
              }}
            />
          </HStack>
          <Box
            display="flex"
            gap="12px">
            <Button
              h="40px"
              variant="solid"
              colorScheme="blue"
              onClick={handleSave}
              isDisabled={!isDirty}>
              Save
            </Button>
          </Box>
        </Box>
        <Box
          mt="20px"
          maxH="calc(100vh - 280px)"
          minH="300px"
          overflowY="auto"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="8px"
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#c1c1c1",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#a8a8a8",
            },
          }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DataTable
              headData={headData}
              data={bodyData}
              pagination
              isLoading={isLoadingRole}
            />
          </form>
        </Box>
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isCentered
        size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color="gray.900">
              Add Role
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={roleForm.handleSubmit(onRoleSubmit)}>
            <ModalBody pb={6}>
              <VStack
                spacing={4}
                align="stretch">
                <FormControl isRequired>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700">
                    Role Name
                  </FormLabel>
                  <Input
                    {...roleForm.register("name", {
                      required: "Role name is required",
                      minLength: {
                        value: 2,
                        message: "Role name must be at least 2 characters",
                      },
                    })}
                    placeholder="Enter role name"
                    size="md"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px #3182ce",
                    }}
                  />
                  {roleForm.formState.errors.roleName && (
                    <Text
                      color="red.500"
                      fontSize="sm"
                      mt={1}>
                      {roleForm.formState.errors.roleName.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700">
                    Status
                  </FormLabel>
                  <Select
                    {...roleForm.register("status")}
                    size="md"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px #3182ce",
                    }}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <HStack spacing={2}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    roleForm.reset();
                  }}
                  size="md">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="md"
                  isLoading={roleForm.formState.isSubmitting}>
                  Add Role
                </Button>
              </HStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <FieldPermissionsModal
        key={selectedTableSlug}
        isOpen={isFieldModalOpen}
        onClose={handleFieldModalClose}
        fieldPermissions={(() => {
          if (!selectedTableSlug) return [];
          const currentFormData = watch();
          const tableIndex = Object.keys(currentFormData).find((key) => {
            const permission = currentFormData[key];
            return permission?.tableData?.slug === selectedTableSlug;
          });

          if (
            tableIndex !== undefined &&
            currentFormData[tableIndex]?.field_permissions
          ) {
            return Object.values(currentFormData[tableIndex].field_permissions);
          }

          return (
            initialRoleData?.tables?.find(
              (table) => table.slug === selectedTableSlug,
            )?.field_permissions || []
          );
        })()}
        tableSlug={selectedTableSlug}
        tableIndex={(() => {
          if (!selectedTableSlug) return null;
          const currentFormData = watch();
          return Object.keys(currentFormData).find((key) => {
            const permission = currentFormData[key];
            return permission?.tableData?.slug === selectedTableSlug;
          });
        })()}
        register={register}
        setValue={setValue}
        watch={watch}
        isLoading={isLoadingRole}
      />
    </>
  );
};
