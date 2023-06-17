import axios from "axios";

interface TalkApi {
  endpoint?: string;
  method?: string;
  body?: object;
}
export const talkApi = async ({ endpoint, method, body }: TalkApi) => {
  const response = await axios({
    method: method,
    url: `https://conference-api.onrender.com/${endpoint}`,
    data: JSON.stringify(body),
  })
    .then((response) => {
      // console.log("response", response);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return response;
};
