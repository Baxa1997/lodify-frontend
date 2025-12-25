import {useSelector} from "react-redux";
import {useSearchParams} from "react-router-dom";

export const useGetCompanyId = () => {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("id");

  const {guid, companies_id} = useSelector((state) => state.auth.user_data);

  const companiesId = companies_id || companyId || guid;

  return companies_id;
};
