import type { TableColumn } from "@/types/table";
import type { MarketTableItem } from "@/types/table";

/**
 * Market table column definitions
 */
export const MARKET_TABLE_COLUMNS: TableColumn<MarketTableItem>[] = [
  {
    key: "pair",
    label: "NAME",
    sortable: true,
    width: "minmax(120px, 1fr)",
    align: "left",
  },
  {
    key: "price.last",
    label: "LAST PRICE",
    sortable: true,
    width: "minmax(100px, 1fr)",
    align: "right",
  },
  {
    key: "price.change",
    label: "24H CHANGE",
    sortable: true,
    width: "minmax(100px, 1fr)",
    align: "center",
  },
  {
    key: "price.bestBid",
    label: "BID",
    sortable: false,
    width: "minmax(80px, 1fr)",
    align: "right",
  },
  {
    key: "price.bestOffer",
    label: "ASK",
    sortable: false,
    width: "minmax(80px, 1fr)",
    align: "right",
  },
  {
    key: "volume",
    label: "VOLUME (24H)",
    sortable: true,
    width: "minmax(120px, 1fr)",
    align: "right",
  },
  {
    key: "volumePercent",
    label: "VOLUME %",
    sortable: true,
    width: "minmax(80px, 1fr)",
    align: "right",
  },
  {
    key: "priceHistory",
    label: "PRICE CHART",
    sortable: false,
    width: "minmax(100px, 1fr)",
    align: "center",
  },
];
