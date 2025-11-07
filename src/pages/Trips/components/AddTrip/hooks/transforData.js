export const transformTripData = (data) => {
  if (!data || Object.keys(data).length === 0) return {};

  return {
    ...data,
    rate_confirmation: data.rate_confirmation ? [data.rate_confirmation] : [],
    bold_pod: data.bol_pod ? [data.bol_pod] : [],
    other_files: data.other_files ? [data.other_files] : [],

    shippers_id: data.shipper?.guid || data.shippers_id,
    companies_id_2: data.created_by?.guid || data.companies_id_2,

    driver_type: Array.isArray(data.driver_type)
      ? data.driver_type
      : data.driver_type
      ? [data.driver_type]
      : [],
    trip_type: Array.isArray(data.trip_type)
      ? data.trip_type
      : data.trip_type
      ? [data.trip_type]
      : [],
    status: Array.isArray(data.status)
      ? data.status
      : data.status
      ? [data.status]
      : [],

    lodify_fees_id: data.lodify_fee?.guid || data.lodify_fees_id,
    service_fee: data.lodify_fee?.amount || data.service_fee,

    trip_pickups: Array.isArray(data.pickups) ? data.pickups : [],

    accessorials: Array.isArray(data.accessorials) ? data.accessorials : [],
  };
};

export const transformFileData = (data) => {
  if (!data || Object.keys(data).length === 0) return {};

  return {
    ...data,
    rate_confirmation: data.rate_confirmation ? [data.rate_confirmation] : [],
    bold_pod: data.bol_pod ? [data.bol_pod] : [],
    other_files: data.other_files ? [data.other_files] : [],

    shippers_id: data.shipper?.guid || data.shippers_id,
    companies_id_2: data.created_by?.guid || data.companies_id_2,

    driver_type: Array.isArray(data.driver_type)
      ? data.driver_type
      : data.driver_type
      ? [data.driver_type]
      : [],
    trip_type: Array.isArray(data.stop_type)
      ? data.stop_type
      : data.stop_type
      ? [data.stop_type]
      : [],
    status: Array.isArray(data.status)
      ? data.status
      : data.status
      ? [data.status]
      : [],

    lodify_fees_id: data.lodify_fee?.guid || data.lodify_fees_id,
    service_fee: data.lodify_fee?.amount || data.service_fee,
    reference: data?.rate_con_ref,
    driver_type: Boolean(data?.driver2_name) ? ["Team"] : ["Solo"],
    trip_pickups: data?.stops?.map((stop) => ({
      ...stop,
      shipper: stop?.facility_name,
      zip_code: stop?.postal_code,
      address: stop?.address_line,
      country: stop?.country === "USA" ? "United States" : stop?.country,
      equipment_type:
        data?.equipment_type === "53' Van" ? "Dry Van 53" : "Dry Van 48",
      type: [capitalize(stop?.stop_type)],
      field_type: stop?.stop_type,
    })),

    accessorials: Array.isArray(data.accessorials) ? data.accessorials : [],
  };
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
