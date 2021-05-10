import { ESSearch } from "../config";

export const fetchById = async (id) => {
  try {
    let fetchResult = null;
    await fetch(ESSearch + id)
      .then((res) => {
        if (res.status > 200) {
          throw `404: ${id} not available`;
        }
        return res.json();
      })
      .then((data) => (fetchResult = data));
    return fetchResult._source.data;
  } catch (err) {
    console.warn(err);
  }
};

// export const fetchById = async function fetchItemReq(id) {
//   try {
//     let network = 1;
//     // console.log(fetchItem + id + `?network=${network}`);
//     const response = getRequestWithoutAuth(
//       fetchItem + id + `?network=${network}`
//     );

//     return response;
//   } catch (err) {
//     console.log(err);
//   }
// };
