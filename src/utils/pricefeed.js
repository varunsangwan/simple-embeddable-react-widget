import {PRICE_FEED, BACKUP_PRICE_FEED} from "../config"
async function requestParamsNoAuth(method, body) {
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
  };

async function  getRequestWithoutAuth (url){
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

export const getETHPrice = async () => {
    try {
      let price = await getRequestWithoutAuth(PRICE_FEED);
      return price.ethereum;
    } catch (e) {
      console.log("Price feed error, using backup");
      let price = await getRequestWithoutAuth(BACKUP_PRICE_FEED);
  
      price = {
        usd: parseFloat(price.result.ethusd),
      };
      return price;
    }
  };