
import axios from "axios";
import { history } from 'umi';
import { message } from 'antd';
import { baseUrl } from '@/utils/process'

const instance = axios.create({
    // baseURL: 'http://120.232.132.10:37107',//生产环境
    baseURL: baseUrl,
    // baseURL: 'http://120.232.132.10:37109',//测试环境
    // timeout: 50000,
    // headers: { 'Authorization': 'Bearer your_token_here' }
});
// 获取长文的接口
const requestLongText = axios.create({
    baseURL: baseUrl,
});

// 添加请求拦截器
requestLongText.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    let token = localStorage.getItem('token');
    if (token) {
        config.headers.token = token;
    }


    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
requestLongText.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // if (error.response.message.includes('timeout')) {
    //     return alert('请求超时')
    // }

    // let code = error.response.status

    // switch (code) {
    //     case 400:
    //         console.log('语法错误');
    //         break;
    //     case 401:
    //         // router.push('/Login')
    //         console.log('未授权');
    //         break;
    //     case 403:
    //         console.log('拒绝访问');
    //         break;
    //     case 404:
    //         console.log('页面未找到');
    //         break;
    //     case 500:
    //         console.log('服务器内部错误');
    //         break;
    //     default:
    //         break;
    // }
    return Promise.reject(error);
});



// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // let router = useRouter()
    // 在发送请求之前做些什么
    let token = localStorage.getItem('token');
    // console.log(token);
    if (token) {
        config.headers.token = token;
    }

    return config;
}, function (error) {

    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
}, function (error) {

    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // console.log(error.response);

    // if (error.response.message.includes('timeout')) {
    //     return alert('请求超时')
    // }
    // console.log(error.response.status);

    let code = error.response.status
    // let router = useRouter()
    switch (code) {
        case 400:
            return console.log('语法错误');
            break;
        case 401:
            message.warning('登录超时，请重新登陆！');
            localStorage.removeItem('token'); // 清除 token
            return history.push('/Login')
        case 403:
            return console.log('拒绝访问');
            break;
        case 404:
            return console.log('页面未找到');
            break;
        case 500:
            return console.log('服务器内部错误');
            break;
        case 422:
            return console.log('用户不存在');
        default:
            break;
    }
    return Promise.reject(error);
});

export { instance, requestLongText };

// import axios from "axios";

// // 提取公共拦截器逻辑
// const addRequestInterceptor = (instance: axios.AxiosInstance) => {
//     instance.interceptors.request.use((config: { headers: { token: string; }; }) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.token = token;
//         }
//         return config;
//     }, (error: any) => Promise.reject(error));
// };

// const addResponseInterceptor = (instance: axios.AxiosInstance) => {
//     instance.interceptors.response.use((response: any) => response, (error: { response: { status: any; data: any; }; }) => {
//         if (error.response) {
//             const { status, data } = error.response;
//             if (data.message && data.message.includes('timeout')) {
//                 alert('请求超时');
//             } else {
//                 switch (status) {
//                     case 400: console.log('语法错误'); break;
//                     case 401: console.log('未授权'); break;
//                     case 403: console.log('拒绝访问'); break;
//                     case 404: console.log('页面未找到'); break;
//                     case 500: console.log('服务器内部错误'); break;
//                     default: break;
//                 }
//             }
//         }
//         return Promise.reject(error);
//     });
// };

// // 创建实例
// const baseURL = process.env.NEXT_PUBLIC_API_URL || '';

// const instance = axios.create({ baseURL });
// const requestLongText = axios.create({ baseURL });

// // 应用拦截器
// addRequestInterceptor(instance);
// addRequestInterceptor(requestLongText);

// addResponseInterceptor(instance);
// addResponseInterceptor(requestLongText);

// export { instance, requestLongText };
