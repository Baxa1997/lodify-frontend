export const getLoadTypeColor = (loadType) => {
  switch (loadType) {
    case "Dry":
      return "#FF5B04";
    case "Refrigerated":
      return "#003B63";
    case "Temperature Controlled":
      return "#00707A";
    case "Other":
      return "#6B7280";
    case "Preloaded":
      return "#00707A";
    case "Drop":
      return "#6B7280";
    default:
      return "#6B7280";
  }
};
