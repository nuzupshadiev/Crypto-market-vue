import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";

export class Endpoint<OutputT> {
  instance: AxiosInstance;
  method: Method;

  constructor(method: Method, baseURL?: string) {
    // Use Vite env variable instead of Next.js
    baseURL = baseURL ?? import.meta.env.VITE_BADAM_NET_ENDPOINT;
    this.instance = axios.create({ baseURL });
    this.method = method;
  }

  req(
    config: Omit<AxiosRequestConfig<any>, "baseURL" | "method">
  ): Promise<AxiosResponse<OutputT>> {
    return this.instance.request({
      ...config,
      method: this.method,
    });
  }

  static request<OutputT>(
    method: Method,
    params: Omit<AxiosRequestConfig<any>, "method">
  ): Promise<AxiosResponse<OutputT>> {
    const endpoint = new Endpoint<OutputT>(method);
    return endpoint.req(params);
  }
}
