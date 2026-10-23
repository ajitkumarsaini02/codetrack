const getTodayDate = () => {
  return new Date().toISOString().slice(0, 10);
};

const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);

  return date.toISOString().slice(0, 10);
};

const getDateRange = (days = 7) => {
  const dates = [];

  for (let i = days - 1; i >= 0; i--) {
    dates.push(getDateDaysAgo(i));
  }

  return dates;
};

const isValidDate = (dateString) => {
  if (typeof dateString !== "string") return false;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  const date = new Date(`${dateString}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === dateString
  );
};

module.exports = {
  getTodayDate,
  getDateDaysAgo,
  getDateRange,
  isValidDate,
};
