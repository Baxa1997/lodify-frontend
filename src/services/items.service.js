import { useMutation, useQuery } from "@tanstack/react-query";
import httpRequest from "@utils/httpRequest";

const itemService = {
  getTable: (slug, params) => httpRequest.get(`v2/items/${slug}`, { params }),
  createItem: (slug, data) => httpRequest.post(`v2/items/${slug}`, data),
};

export const useGetTable = (slug, params = {}, props) => {
  return useQuery({
    queryKey: ["GET_TABLE", props, slug],
    queryFn: () => itemService.getTable(slug, props),
    select: (res) => res.data,
    ...params,
  });
};

export const useCreateItemMutation = (params) => useMutation({
  mutationFn: ({ slug, data }) => itemService.createItem(slug, data),
  ...params,
});
