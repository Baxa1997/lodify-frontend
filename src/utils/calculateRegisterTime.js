export const calculateMonthsFromDate = (dateString) => {
  if (!dateString) return 0;

  try {
    const registerDate = new Date(dateString);
    const now = new Date();

    if (isNaN(registerDate.getTime())) {
      return 0;
    }

    const yearsDiff = now.getFullYear() - registerDate.getFullYear();
    const monthsDiff = now.getMonth() - registerDate.getMonth();
    let totalMonths = yearsDiff * 12 + monthsDiff;

    if (now.getDate() < registerDate.getDate()) {
      totalMonths = Math.max(0, totalMonths - 1);
    }

    return Math.max(0, totalMonths);
  } catch (error) {
    console.error("Error calculating months:", error);
    return 0;
  }
};
