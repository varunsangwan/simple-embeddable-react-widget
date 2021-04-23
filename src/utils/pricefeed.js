import { BACKUP_PRICE_FEED, PRICE_FEED } from "../config";
import { getRequestWithoutAuth } from "./api";

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
