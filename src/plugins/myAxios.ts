//全局默认的axios实例
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8101/api",
  timeout: 10000,
  headers: {},
});

//添加响应拦截器，用于拦截响应数据，取出响应体的data数据
instance.interceptors.response.use(
  function (response) {
    //正常响应，拿到响应数据
    const data = response.data;
    //判断后端响应码
    if (data.code === 0) {
      //返回状态正常，去除真正数据
      return data.data;
    } else {
      console.log("后端响应出错! 数据为: " + data);
    }
  },
  function (error) {
    //响应出错
    return Promise.reject(error);
  }
);

export default instance;
