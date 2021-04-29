export function requestParamsNoAuth(method, body) {
  let params = {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  if (body) {
    params["body"] = JSON.stringify(body);
  }

  params["mode"] = "cors";
  return params;
}

export async function getRequestWithoutAuth(url) {
  const res = await fetch(url, requestParamsNoAuth("GET", null));
  if (res.status >= 200 && res.status < 400) {
    return res.json();
  } else {
    const res = await res.json();
    throw res.error;
  }
}

export const postRequestWithoutAuthReturnData = async (url, body) => {
  const res = await fetch(url, requestParamsNoAuth("POST", body));

  if (res.status >= 200 && res.status < 400) {
    return res.json();
  } else {
    const response = await res.json();
    throw Error(response.reason);
  }
};
