import {
    fetchCurrentItem,
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

  function preparePaginationQuery(data){
    const params = {
      ...data,
      size: (data && data.size) || 5,
      lastKey: (data && data.lastKey) || 0,
    };
    return Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
  }

  async function getRequestWithoutAuth(url){
    const res = await fetch(url, requestParamsNoAuth("GET", null));
    if (res.status === 401) {
      //localStorage.removeItem(AUTHENTICATION_TOKEN);
    }
    if (res.status >= 200 && res.status < 400) {
      
      return  await res.json();
    } else {
      const response = await res.json();
  
      throw response.error;
    }
  };
  export const fetchByUsername = async function fetchItemsCurrentlyListed(data) {
    
    
    console.log(data);
    const query = preparePaginationQuery(data);
    console.log(query);
    let network = 1;
  
    try {
      
        var resp = await getRequestWithoutAuth(
        fetchCurrentItem + "?" + query + `&network=${network}`)
      
      
    } catch (err) {
      console.log(err);
    }
    console.log(resp);
    return;
  }