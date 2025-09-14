// src/api/currency.ts
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

  /** Get all currencies as a hashmap */
  static getAllAsMap(): Promise<Record<string, CurrencyAPI>> {
    return this.getAll().then((currencies) =>
      Object.fromEntries(currencies.map((c) => [c.data.code, c]))
    );
  }

  /** Get specific currency by code */
  static getByCode(code: string): Promise<CurrencyAPI> {
    return this.getAll().then((currencies) => {
      const found = currencies.find(
        (c) => c.data.code.toUpperCase() === code.toUpperCase()
      );
      if (!found) throw new Error(`Currency ${code} not found`);
      return found;
    });
  }

  /** Get all primary currencies */
  static getPrimary(): Promise<CurrencyAPI[]> {
    return this.getAll().then((currencies) =>
      currencies.filter((c) => c.data.type === "Primary")
    );
  }

  /** Get all secondary currencies */
  static getSecondary(): Promise<CurrencyAPI[]> {
    return this.getAll().then((currencies) =>
      currencies.filter((c) => c.data.type === "Secondary")
    );
  }

  /** Get all currencies sorted by sort_order */
  static getAllSorted(): Promise<CurrencyAPI[]> {
    return this.getAll().then((currencies) =>
      currencies.sort((a, b) => a.data.sort_order - b.data.sort_order)
    );
  }

  // Instance helpers
  isPrimary(): boolean {
    return this.data.type === "Primary";
  }

  isSecondary(): boolean {
    return this.data.type === "Secondary";
  }

  getIconDataUrl(): string {
    return this.data.icon.startsWith("data:")
      ? this.data.icon
      : `data:image/svg+xml;base64,${this.data.icon}`;
  }

  formatAmount(amount: number): string {
    return amount.toFixed(this.data.decimals_places);
  }
}
