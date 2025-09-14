import { Endpoint } from "./endpoint";

export interface CurrencyItem {
  code: string; // e.g. "AUD"
  sort_order: number; // sorting index
  ticker: string; // short code or ticker symbol
  type: "Primary" | "Secondary";
  decimals_places: number; // number of decimal places
  icon: string; // Base64-encoded SVG string
}

export type CurrencyResponse = CurrencyItem[];

interface IError {
  error: string;
}

type GetCurrenciesResponse = CurrencyResponse | IError;

export default class CurrencyAPI {
  data: CurrencyItem;

  constructor(data: CurrencyItem) {
    this.data = data;
  }

  /** Get all currencies */
  static getAll(): Promise<CurrencyAPI[]> {
    return Endpoint.request<GetCurrenciesResponse>("GET", {
      url: `currency`,
      params: { username: "user26614" },
      headers: { Accept: "application/json" },
    }).then((resp) => {
      if ("error" in resp.data) throw new Error(resp.data.error);
      return resp.data.map((c) => new CurrencyAPI(c));
    });
  }


  getIconDataUrl(): string {
    return this.data.icon.startsWith("data:")
      ? this.data.icon
      : `data:image/svg+xml;base64,${this.data.icon}`;
  }
}
