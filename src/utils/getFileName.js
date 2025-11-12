export function getShortFileName(url, maxBaseLength = 5) {
  if (!url || typeof url !== "string") {
    return {
      shortName: "",
      extension: "",
      fullName: "",
    };
  }

  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return {
      shortName: "",
      extension: "",
      fullName: "",
    };
  }

  let fullName = "";

  try {
    const u = new URL(trimmedUrl);
    const pathname = u.pathname || "";
    fullName = pathname.split("/").filter(Boolean).pop() || "";

    if (!fullName) {
      fullName = trimmedUrl.split("/").filter(Boolean).pop() || trimmedUrl;
    }
  } catch {
    const parts = trimmedUrl.split("/").filter(Boolean);
    fullName = parts.length > 0 ? parts[parts.length - 1] : trimmedUrl;
  }

  if (!fullName || fullName === trimmedUrl) {
    const withoutQuery = trimmedUrl.split("?")[0].split("#")[0];
    const parts = withoutQuery.split("/").filter(Boolean);
    fullName = parts.length > 0 ? parts[parts.length - 1] : trimmedUrl;
  }

  const lastDot = fullName.lastIndexOf(".");
  let base =
    lastDot !== -1 && lastDot > 0 ? fullName.substring(0, lastDot) : fullName;
  const ext = lastDot !== -1 && lastDot > 0 ? fullName.substring(lastDot) : "";

  if (base.length > maxBaseLength) {
    base = base.substring(0, maxBaseLength) + "...";
  }

  const shortName = base + ext || trimmedUrl;

  return {
    shortName,
    extension: ext,
    fullName: fullName || trimmedUrl,
  };
}
