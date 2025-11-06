export const useMainInfoProps = () => {

  const companyData = {
    name: "Nussabaum Transportation Service Inc",
    rating: 5,
    ids: "TX 6912286 / DOT 00071317 / MC 120436 / SCAC - NUSH / SCAC - NUST",
    phone: "+1 (309) 319-9295",
    email: "nussabaum@lodify.io",
    address: "19336 N 1425 EAST RD HUDSON, IL 61748",
    metrics: [
      { label: "Common", value: "+1 (309) 319-9295", status: "success" },
      { label: "Broker", value: "Inactive", status: "error" },
      { label: "Safety Rating", value: "Satisfactory", status: "success" },
      { label: "ELD", value: "Geotab", status: "success" },
      { label: "Contract", value: "24+ months", status: "success" },
      { label: "Operating Status", value: "Property", status: "success" },
      { label: "Certifications", value: "Smartway", status: "success" },
      { label: "TIN", value: "Verified", status: "success" },
    ],
    equipment: [
      { type: "Power Units", count: "670", image: "/img/truck.svg" },
      { type: "Dry Van", count: "670", image: "/img/trailerImage.svg" },
      { type: "Uncategorized", count: "670", image: "/img/trailerImage.svg" },
      { type: "Box Trucks", count: "670", image: "/img/truck.svg" },
      { type: "Flat Bed", count: "9", image: "/img/trailerImage.svg" },
      { type: "Heavy Haul", count: "1", image: "/img/trailerImage.svg" },
      { type: "Low Boy", count: "1", image: "/img/trailerImage.svg" },
    ],
    resources: [
      { type: "Power Units", count: "670", image: "/img/truck.svg" },
      { type: "Solo Drivers", count: "9", image: "/img/user.svg" },
      { type: "Team Drivers", count: "1", image: "/img/user.svg" },
      { type: "Trailers", count: "80", image: "/img/trailerImage.svg" },
      { type: "Box Trucks", count: "670", image: "/img/truck.svg" },
    ],
  };

  const powerUnits = [
    {
      title: "Power Units",
      count: "670",
    },
    {
      title: "Dry Van",
      count: "9",
    },
    {
      title: "Uncategorized",
      count: "1",
    },
    {
      title: "Box Trucks",
      count: "80",
    },
    {
      title: "Flat Bed",
      count: "670",
    },
    {
      title: "Heavy Haul",
      count: "670",
    },
    {
      title: "Low Boy",
      count: "670",
    },
  ];

  const getTypeImage = (type) => {
    switch (type) {
    case "Power Units":
      return <img
        src="/img/powerUnit.svg"
        alt="Power Units"
      />;
    case "Box Trucks":
      return <img
        src="/img/boxTrucks.svg"
        alt="Box Trucks"
      />;
    case "Low Boy":
      return <img
        src="/img/lowBoy.svg"
        alt="Low Boy"
      />;
    case "Heavy Haul":
      return <img
        src="/img/heavyHaul.svg"
        alt="Heavy Haul"
      />;
    case "Flat Bed":
      return <img
        src="/img/flatBed.svg"
        alt="Flat Bed"
      />;
    case "Drivers":
      return <img
        src="/img/team_drivers2.png"
        alt="Drivers"
      />;
    default:
      return <img
        src="/img/dryVan.svg"
        alt="Dry Van"
      />;
    }
  };

  return {
    getTypeImage,
    companyData,
    powerUnits,
  };
};
