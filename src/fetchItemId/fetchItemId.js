import {
    fetchItem,
    } from "../config";

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
    if (res.status === 401) {
      //localStorage.removeItem(AUTHENTICATION_TOKEN);
    }
    if (res.status >= 200 && res.status < 400) {
      return res.json();
    } else {
      const response = await res.json();
  
      throw response.error;
    }
  };
  export const fetchById = async function fetchItemReq(id) {
    try {
      
      let network = 1;
        console.log(fetchItem + id + `?network=${network}`);
      const response = 
        getRequestWithoutAuth(
        fetchItem + id + `?network=${network}`)
      
      return response;
      
    } catch (err) {
        console.log(err);
    }
  }