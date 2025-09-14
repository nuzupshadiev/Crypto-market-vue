import { Endpoint } from "./endpoint";

export interface MarketPair {
  primary: string;
  secondary: string;
}

export interface MarketChange {
  direction: "Up" | "Down" | "None";
  percent: string; // e.g. "3.87"
  amount: string; // e.g. "6182.77"
}

export interface MarketPrice {
  last: string;
  bestBid: string;
  bestOffer: string;
  change: MarketChange; // 24h change
}

export interface MarketVolume {
  primary: string; // traded in base currency
  secondary: string; // traded in quote currency
}

export interface MarketItem {
  pair: MarketPair;
  price: MarketPrice;
  volume: MarketVolume;
  priceHistory: string[];
}

export type MarketResponse = MarketItem[];

interface IError {
  error: string;
}

type GetMarketResponse = MarketResponse | IError;

export default class MarketAPI {
  data: MarketItem;

  constructor(data: MarketItem) {
    this.data = data;
  }

  /** Get all market data */
  static getAll(): Promise<MarketAPI[]> {
    return Endpoint.request<GetMarketResponse>("GET", {
      url: `market`,
      params: {
        username: "user26614", // query parameters
      },
      headers: {
        Accept: "application/json",
      },
    }).then((resp) => {
      if ("error" in resp.data) {
        throw new Error(resp.data.error);
      }
      return resp.data.map((m) => new MarketAPI(m));
    });
  }

  /** Get a specific market pair */
  static getByPair(primary: string, secondary: string): Promise<MarketAPI> {
    return this.getAll().then((markets) => {
      const found = markets.find(
        (m) =>
          m.data.pair.primary.toLowerCase() === primary.toLowerCase() &&
          m.data.pair.secondary.toLowerCase() === secondary.toLowerCase()
      );
      if (!found) {
        throw new Error(`Market ${primary}/${secondary} not found`);
      }
      return found;
    });
  }
}
