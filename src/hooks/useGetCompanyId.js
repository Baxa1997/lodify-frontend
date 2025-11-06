import { useSelector } from "react-redux";

export const useGetCompanyId = () => {

  const { companies_id: companyId, guid } = useSelector(state => state.auth.user_data);

  const companies_id = companyId || guid;

  return companies_id;
};