import {useQuery} from "@tanstack/react-query";
import httpRequest from "@utils/httpRequest";
import axios from "axios";

export const useGetLodify = (fmcsa, params) =>
  useQuery({
    queryKey: ["GET_FMCSA_DATA", fmcsa],
    queryFn: async () =>
      axios.get(
        `https://lodify-usa.u-code.io/data/fmcsa/${fmcsa}/extra?page=1&limit=1`
      ),
    ...params,
  });

export const useGetLodifyMC = (mcNumber, params) =>
  useQuery({
    queryKey: ["GET_MC_DATA", mcNumber],
    queryFn: async () =>
      axios.get(
        `https://lodify-usa.u-code.io/get-data/from-mc-number/${mcNumber}`
      ),
    ...params,
  });
