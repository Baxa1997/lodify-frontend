export const calculateTimeDifference = (apiTime) => {
  try {
    if (!apiTime) return 0;

    let targetTime;

    if (typeof apiTime === "string" && apiTime.includes("T")) {
      targetTime = new Date(apiTime);
      targetTime.setHours(targetTime.getHours() + 5);
    } else {
      targetTime = new Date(Date.now() + apiTime * 1000);
      targetTime.setHours(targetTime.getHours() + 5);
    }

    const now = new Date();
    const differenceMs = targetTime.getTime() - now.getTime();
    const differenceSeconds = Math.floor(differenceMs / 1000);

    return Math.max(0, differenceSeconds);
  } catch (error) {
    console.error("Error calculating time difference:", error);
    return 0;
  }
};

export const getTimerBackgroundColor = (time) => {
  if (time === 0) return "#DC2626";
  if (time > 3600) return "white";
  if (time > 1800) return "#FEF3C7";
  if (time > 900) return "#FED7AA";
  return "#FECACA";
};

export const getTimerTextColor = (time) => {
  if (time === 0) return "#D92D20";
  if (time > 3600) return "#000";
  if (time > 1800) return "#000";
  if (time > 900) return "#EF6820";
  return "#D92D20";
};

export const getRowBackgroundColor = (time) => {
  if (time === 0) return "#FEE4E2";
  if (time > 3600) return "#fff";
  if (time > 1800) return "#FEF0C7";
  if (time > 900) return "#FEE4E2";
  return "#FECACA";
};

export const getActionButtonText = (time) => {
  if (time === 0) return "Call Carrier";
  if (time > 3600) return "Send Message";
  if (time > 1800) return "Send Email";
  if (time > 900) return "Call Carrier";
  return "Call Carrier";
};

export const getActionButtonColor = (time) => {
  if (time === 0) return "#DC2626";
  return "#EF6820";
};

export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
