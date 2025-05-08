export const parseTheme = (themeString) => {
  if (!themeString) return ["", ""];
  const parts = themeString.split(" by ");
  return [parts[0].trim(), parts.length > 1 ? parts[1].trim() : ""];
};
