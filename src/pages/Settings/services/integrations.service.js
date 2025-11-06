import { useMutation, useQuery } from "@tanstack/react-query";
import httpRequest from "../../../utils/httpRequest";

const itemService = {
  getList: (companyId) => httpRequest.get("v2/items/integration", { params: {
    data: JSON.stringify({ company_id: companyId }),
  } }),
  update: (data) => httpRequest.put("v2/items/integration", data),
  create: (data) => httpRequest.post("v2/items/integration", data),
};

export const useGetIntegrations = (params = {}, companyId) => {
  return useQuery({
    queryKey: ["GET_INTEGRATIONS", companyId],
    queryFn: () => itemService.getList(companyId),
    select: (res) => res.data,
    enabled: !!companyId,
    staleTime: 0,
    ...params,
  });
};

export const useUpdateIntegrationsMutation = (params) => useMutation({ mutationFn: itemService.update, ...params });
export const useCreateIntegrationsMutation = (params) => useMutation({ mutationFn: itemService.create, ...params });
