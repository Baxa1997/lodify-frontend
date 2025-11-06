export const useLaneInsightsProps = ({ data = {} }) => {

  const {
    us_vehicle_inspections,
    us_crashes_fatal,
    us_crashes_injury,
    us_crashes_tow,
    us_crashes_total,
    us_driver_inspections,
    us_hazmat_inspections,
    us_iep_inspections,
    us_vehicle_out_of_service,
    us_driver_out_of_service,
    us_hazmat_out_of_service,
    us_iep_out_of_service,
    us_vehicle_out_of_service_pct,
    us_driver_out_of_service_pct,
    us_hazmat_out_of_service_pct,
    us_iep_out_of_service_pct,
    us_vehicle_national_average,
    us_driver_national_average,
    us_hazmat_national_average,
    us_iep_national_average,
    canada_crashes_fatal,
    canada_crashes_injury,
    canada_crashes_tow,
    canada_crashes_total,
    canada_vehicle_inspections,
    canada_driver_inspections,
    canada_vehicle_out_of_service,
    canada_driver_out_of_service,
    canada_vehicle_out_of_service_pct,
    canada_driver_out_of_service_pct,
  } = data;

  const usInspectionResult = [
    {
      title: "Crash Results",
      list: [
        {
          title: "Fatal:",
          data: us_crashes_fatal,
        },
        {
          title: "Injury:",
          data: us_crashes_injury,
        },
        {
          title: "Tow:",
          data: us_crashes_tow,
        },
        {
          title: "Total:",
          data: us_crashes_total,
        },
      ],
    },
    {
      title: "Inspections",
      list: [
        {
          title: "Vehicle:",
          data: us_vehicle_inspections,
        },
        {
          title: "Driver:",
          data: us_driver_inspections,
        },
        {
          title: "Hazmat:",
          data: us_hazmat_inspections,
        },
        {
          title: "IEP:",
          data: us_iep_inspections,
        },
      ],
    },
    {
      title: "Out of Service",
      list: [
        {
          title: "Vehicle:",
          data: us_vehicle_out_of_service,
        },
        {
          title: "Driver:",
          data: us_driver_out_of_service,
        },
        {
          title: "Hazmat:",
          data: us_hazmat_out_of_service,
        },
        {
          title: "IEP:",
          data: us_iep_out_of_service,
        },
      ],
    },
    {
      title: "Out of Service %",
      list: [
        {
          title: "Vehicle:",
          data: us_vehicle_out_of_service_pct,
        },
        {
          title: "Driver:",
          data: us_driver_out_of_service_pct,
        },
        {
          title: "Hazmat:",
          data: us_hazmat_out_of_service_pct,
        },
        {
          title: "IEP:",
          data: us_iep_out_of_service_pct,
        },
      ],
    },
    {
      title: "National Average",
      list: [
        {
          title: "Vehicle:",
          data: us_vehicle_national_average,
        },
        {
          title: "Driver:",
          data: us_driver_national_average,
        },
        {
          title: "Hazmat:",
          data: us_hazmat_national_average,
        },
        {
          title: "IEP:",
          data: us_iep_national_average,
        },
      ],
    },
  ];

  const canadaInspectionResult = [
    {
      title: "Crash Results",
      list: [
        {
          title: "Fatal:",
          data: canada_crashes_fatal,
        },
        {
          title: "Injury:",
          data: canada_crashes_injury,
        },
        {
          title: "Tow:",
          data: canada_crashes_tow,
        },
        {
          title: "Total:",
          data: canada_crashes_total,
        },
      ],
    },
    {
      title: "Inspections",
      list: [
        {
          title: "Vehicle:",
          data: canada_vehicle_inspections,
        },
        {
          title: "Driver:",
          data: canada_driver_inspections,
        },
        {
          title: "Hazmat:",
          data: "",
        },
        {
          title: "IEP:",
          data: "",
        },
      ],
    },
    {
      title: "Out of Service",
      list: [
        {
          title: "Vehicle:",
          data: canada_vehicle_out_of_service,
        },
        {
          title: "Driver:",
          data: canada_driver_out_of_service,
        },
        {
          title: "Hazmat:",
          data: "",
        },
        {
          title: "IEP:",
          data: "",
        },
      ],
    },
    {
      title: "Out of Service %",
      list: [
        {
          title: "Vehicle:",
          data: canada_vehicle_out_of_service_pct,
        },
        {
          title: "Driver:",
          data: canada_driver_out_of_service_pct,
        },
        {
          title: "Hazmat:",
          data: "",
        },
        {
          title: "IEP:",
          data: "",
        },
      ],
    },
  ];

  return {
    usInspectionResult,
    canadaInspectionResult,
  };
};