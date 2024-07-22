export const getDaysInCurrentMonth = (month, year) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = [];

  for (let day = 1; day <= daysInMonth; day++) {
    daysArray.push(new Date(year, month, day));
  }

  return daysArray;
};

export const getCurrentMonthName = () => {
  const now = new Date();
  return now.toLocaleString("en-US", { month: "long" });
};
