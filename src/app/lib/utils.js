export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const checkCache = async (key) => {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  }
  return null;
};

export function formatDate(dateString) {
  if (!dateString) return "-";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

export const saveToCache = (key, data) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const formatNumber = (number) => {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const getNames = (arr) =>
  arr?.length > 0 ? arr.map((item) => item.name).join(", ") : "-";

export const capitalizeFirstLetter = (string) =>
  string ? string.charAt(0).toUpperCase() + string.slice(1) : "-";
