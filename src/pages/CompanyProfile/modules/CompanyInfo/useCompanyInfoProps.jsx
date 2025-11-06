import { useForm } from "react-hook-form";
import { useGetCompanySingle, useUpdateCompanySingleMutation } from "../../services/companyInfo.service";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";

export const useCompanyInfoProps = () => {
  const { company_id, guid, client_type_id, role_id } = useSelector(state => state.auth.user_data);
  const toast = useToast();

  const id = company_id || guid;

  const { watch, setValue, reset, handleSubmit, control } = useForm({
    defaultValues: {
      company_name: "",
      identifier: "",
      us_dot_number: "",
      mc_number: "",
      email: "",
      phone: "",
      physical_address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
    },
  });

  const { data } = useGetCompanySingle({}, id);

  const updateCompany = useUpdateCompanySingleMutation({
    onSuccess() {
      toast({
        title: "Successfully updated",
        status: "success",
        position: "top-right",
      });
    },
  });

  const onSubmit = (data) => {

    updateCompany.mutate({
      data: {
        guid: id,
        client_type_id,
        role_id,
        ...data,
      },
    });
  };


  useEffect(() => {
    if(data?.response) {
      const formData = {
        company_name: data.response.company_name,
        identifier: data.response.identifier,
        us_dot_number: data.response.us_dot_number,
        mc_number: data.response.mc_number,
        email: data.response.email,
        phone: data.response.phone,
        physical_address: data.response.physical_address,
        city: data.response.city,
        state: data.response.state,
        zip_code: data.response.zip_code,
        country: data.response.country,
      };
      reset(data.response);
    }
  }, [data]);

  return {
    control,
    watch,
    setValue,
    handleSubmit,
    onSubmit,
  };
};