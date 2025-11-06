import { useMutation, useQuery } from "@tanstack/react-query";
import httpRequest from "../../../utils/httpRequest";

const itemService = {
  getSingle: (id) => httpRequest.get(`v1/object-slim/companies/${id}`),
  updateSingle: (data) => httpRequest.put("/v2/items/companies", data),
  getCarrierDetails: (companyId) => httpRequest.get("v2/items/carrier_details", { params: {
    data: JSON.stringify({ companies_id: companyId }),
  } }),
  getInsuranceHistory: (companyId)  => httpRequest.get("v2/items/insurance_history", { params: {
    data: JSON.stringify({ companies_id: companyId }),
  } }),
  getSmsResult: (params) => httpRequest.get("v2/items/sms_results", { params: { data: JSON.stringify(params) } }),
  getCrashIndicator: () => httpRequest.get("v2/items/crash_indicator"),
  getTable: (slug, params) => httpRequest.get(`v2/items/${slug}`, { params }),
};

export const useGetCompanySingle = (params = {}, id) => {
  return useQuery({
    queryKey: ["GET_COMPANY_SINGLE", id],
    queryFn: () => itemService.getSingle(id),
    select: (res) => res.data,
    enabled: !!id,
    ...params,
  });
};

export const useGetSmsResult = (queryParams = {}, params = {}) => {
  return useQuery({
    queryKey: ["GET_SMS_RESULT", params],
    queryFn: () => itemService.getSmsResult(params),
    select: (res) => res.data,
    ...queryParams,
  });
};

export const useGetCrashIndicator = (params = {}) => {
  return useQuery({
    queryKey: ["GET_CRASH_INDICATOR"],
    queryFn: () => itemService.getCrashIndicator(),
    select: (res) => res.data,
    ...params,
  });
};

export const useGetCarrierDetails = (params = {}, id) => {
  return useQuery({
    queryKey: ["GET_CARRIER_DETAILS", id],
    queryFn: () => itemService.getCarrierDetails(id),
    select: (res) => res.data,
    enabled: !!id,
    ...params,
  });
};

export const useGetInsuranceHistory = (params = {}, id) => {
  return useQuery({
    queryKey: ["GET_INSURANCE_HISTORY", id],
    queryFn: () => itemService.getInsuranceHistory(id),
    select: (res) => res.data,
    enabled: !!id,
    ...params,
  });
};

export const useGetTable = (slug, params = {}, props) => {
  return useQuery({
    queryKey: ["GET_TABLE", props, slug],
    queryFn: () => itemService.getTable(slug),
    select: (res) => res.data,
    ...params,
  });
};

export const useUpdateCompanySingleMutation = (params) => useMutation({ mutationFn: itemService.updateSingle, ...params });
