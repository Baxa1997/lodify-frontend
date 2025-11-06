import { useGetLodify } from "@services/lodify-user.service";
import { useSelector } from "react-redux";

export const useOperationsProps = () => {

  const { us_dot_number } = useSelector(state => state.auth.user_data);

  const { data: extraData } = useGetLodify(us_dot_number, {
    enabled: Boolean(us_dot_number),
  });

  return {
    extraData,
  };
};
