import axios from "axios";
const BASE_URL =
  "https://27wtezn6oceehsb4snltwync3q0bwvru.lambda-url.ap-northeast-1.on.aws/default";

function fetch(url, data, options) {
  return axios({
    url: `${BASE_URL}${url}`,
    method: "POST",
    data,
    ...options,
  })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return err;
    });
}

class Service {
  constructor() {
  }

  sendMessages(data, onListen) {
    console.log(data);
    return fetch(
      "/task-ai",
      data,
      {
        responseType: "text",
        onDownloadProgress: function ({ event }) {
          const xhr = event.target;
          const { responseText } = xhr;
          let formattedData = responseText.replace(/}{/g, '},{');
          formattedData = '[' + formattedData + ']';
          const objects = JSON.parse(formattedData);
          const text = objects.map(i => i.choices[0]['delta']['content']).join('');
          const isFinish = objects[objects.length - 1].choices[0]['finish_reason'] === 'stop';
          onListen(text, isFinish);
        },
      }
    );
  }
}

const apis = new Service();
export default apis;
