import { useState } from "react";
import { useGetCrashIndicator } from "../../../../services/companyInfo.service";
import CustomBadge from "@components/CustomBadge";
import { responseStatuses } from "@utils/getResponseStatuses";

export const useCrashIndicatorProps = () => {
  const [enabled, setEnabled] = useState(false);

  const { data } = useGetCrashIndicator({
    enabled, 
  });

  const onAccordionChange = () => {
    setEnabled(true);
  };

  const headData = [
    {
      label: "Report Date",
      key: "report_date",
    },
    {
      label: "Report Number",
      key: "report_number",
    },
    {
      label: "Report State",
      key: "report_state",
    },
    {
      label: "Vehicle License Number",
      key: "vehicle_license_number",
    },
    {
      label: "Vehicle License State",
      key: "vehicle_license_state",
    },
    {
      label: "Fatalities",
      key: "fatalities",
    },
    {
      label: "Injuries",
      key: "injuries",
    },
    {
      label: "Tow Away",
      key: "tow_away",
      render: (data) => {
        return <CustomBadge
          withBgColor
          variant={responseStatuses(data).variant}
        >
          {responseStatuses(data).label}
        </CustomBadge>;
      },
    },
    {
      label: "Hazmat Released",
      key: "hazmat_released",
      render: (data) => {
        return <CustomBadge
          withBgColor
          variant={responseStatuses(data).variant}
        >
          {responseStatuses(data).label}
        </CustomBadge>;
      },
    },
    {
      label: "Severity Weight",
      key: "severity_weight",
    },
    {
      label: "Time Weight",
      key: "time_weight",
    },
  ];

  return {
    headData,
    bodyData: data?.response,
    onAccordionChange,
  };
};
