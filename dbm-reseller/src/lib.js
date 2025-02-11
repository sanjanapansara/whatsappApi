export function getMediaPath(path) {
  const https = path?.match(/^https/);
  if (https) {
    return path;
  } else {
    if (path === undefined || path === null || path === "") {
      return `${
        import.meta.env.VITE_MODE === "production"
          ? "/api/"
          : import.meta.env.VITE_API_URL
      }/media/place-holder.png`;
    } else {
      return `${
        import.meta.env.VITE_MODE === "production"
          ? "/api/"
          : import.meta.env.VITE_API_URL
      }${path}`;
    }
  }
}
