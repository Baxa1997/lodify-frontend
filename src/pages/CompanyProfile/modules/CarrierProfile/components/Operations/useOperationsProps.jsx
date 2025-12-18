import carrierService from "@services/carrierService";
import {useGetLodify} from "@services/lodify-user.service";
import {useQuery} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import {useSearchParams} from "react-router-dom";

export const useOperationsProps = ({dot_number}) => {
  const {us_dot_number} = useSelector((state) => state.auth.user_data);
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");

  const {data: extraData} = useGetLodify(us_dot_number, {
    enabled: Boolean(us_dot_number),
  });

  const {data: operationsData} = useQuery({
    queryKey: ["GET_OPERATIONS_DATA", dot_number],
    queryFn: () =>
      carrierService.getCarrierInfo({
        data: {
          method: "get",
          object_data: {
            dot_number: dot_number,
            companies_id: companies_id,
          },
          table: "operations",
        },
      }),
    select: (data) => data?.data || {},
  });

  return {
    extraData,
    operationsData,
  };
};
