export const checkIfVideoExtension = (key) => {
  if (!key) return false;
  let url = key.split(/[#?]/)[0].split(".").pop().trim();
  url = url.toLowerCase();

  if (
    url === "webm" ||
    url === "mpg" ||
    url === "mpg2" ||
    url === "mpeg" ||
    url === "mpe" ||
    url === "mpv" ||
    url === "ogg" ||
    url === "mov" ||
    url === "mp4" ||
    url === "avi" ||
    url === "flv" ||
    url === "swf" ||
    url === "wmv" ||
    url === "m4v" ||
    url === "qt"
  ) {
    return true;
  } else {
    return false;
  }
};
