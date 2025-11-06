import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { format, isValid } from "date-fns";
import { useGetCompanySingle } from "../../services/companyInfo.service";

export const useReportProps = () => {
  const { company_id, guid } = useSelector(state => state.auth.user_data);

  const { control, reset } = useForm();

  const { data } = useGetCompanySingle({}, company_id || guid);

  useEffect(() => {
    if (data?.response) {
      const { out_of_service_date, mcs_150_form_date } = data.response;
      reset({
        ...data?.response,
        out_of_service_date: isValid(out_of_service_date) ? format(new Date(out_of_service_date), "dd-MM-yyyy") : "",
        mcs_150_form_date: isValid(out_of_service_date) ? format(new Date(out_of_service_date), "dd-MM-yyyy") : "",
      });
    }
  }, [data]);

  return { control };
};