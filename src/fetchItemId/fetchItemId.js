import { fetchItem, ESSearch } from "../config";

function requestParamsNoAuth(method, body) {
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
async function getRequestWithoutAuth(url) {
  const res = await fetch(url, requestParamsNoAuth("GET", null));

  if (res.status >= 200 && res.status < 400) {
    return res.json();
  } else {
    const response = await res.json();

    throw response.error;
  }
}

export const fetchES = async function fetchESReq(id) {
  try {
    let fetchResult = null;
    const response = await fetch(ESSearch + id)
    .then(response => response.json())
    .then(data => fetchResult=data );
    console.log(fetchResult)
    return fetchResult._source.data;
    
  } catch (err) {
    console.log(err);
  }
};
export const fetchById = async function fetchItemReq(id) {
  try {
    let network = 1;
    console.log(fetchItem + id + `?network=${network}`);
    const response = getRequestWithoutAuth(
      fetchItem + id + `?network=${network}`
    );

    return response;
  } catch (err) {
    console.log(err);
  }
};
