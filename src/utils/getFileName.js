export function getShortFileName(url, maxBaseLength = 5) {
  let fullName;
  if(typeof url === "string") {
    try {
      const u = new URL(url);
      fullName = u.pathname.split("/").pop();
    } catch {
      fullName = url.split("/").pop();
    }
  }

  const lastDot = fullName?.lastIndexOf(".");
  let base = lastDot !== -1 ? fullName?.substring(0, lastDot) : fullName;
  const ext = lastDot !== -1 ? fullName?.substring(lastDot) : "";

  if (base?.length > maxBaseLength) {
    base = base.substring(0, maxBaseLength) + "...";
  }

  return {
    shortName: base + ext,
    extension: ext,
    fullName,
  };
}
