export const responseStatuses = (data) => {
  if(data === "true") {
    return {
      variant: "success",
      label: "Yes",
    };
  } else if (data === null) {
    return {
      variant: "error",
      label: "NA",
    };
  } else {
    return {
      variant: "error",
      label: "No",
    };
  };
};