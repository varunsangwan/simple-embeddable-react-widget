import { fetchItem } from "../config";
import { postRequestWithoutAuthReturnData } from "../utils/api";

export const fetchByStoreId = async (data) => {
  const network = 1;
  try {
    const res = await postRequestWithoutAuthReturnData(
      `${fetchItem}bystoreid?network=${network}`,
      data
    );

    //TODO - now we return just top 50
    return res.Items.slice(0, 50);
  } catch (err) {
    console.log(err);
  }
  return;
};
