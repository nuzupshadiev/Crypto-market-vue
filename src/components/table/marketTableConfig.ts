// useMarketTableConfig.ts
import type { TableConfig, MarketTableItem } from "@/types/table";
import { MARKET_TABLE_COLUMNS } from "@/constants/table-config";
import PairCell from "@/components/table/cells/PairCell.vue";
import PriceCell from "@/components/table/cells/PriceCell.vue";
import ChangeCell from "@/components/table/cells/ChangeCell.vue";
import VolumeCell from "@/components/table/cells/VolumeCell.vue";
import VolumePercentCell from "@/components/table/cells/VolumePercentCell.vue";
import PriceChartCell from "@/components/table/cells/PriceChartCell.vue";

interface MarketTableConfigProps {
  currencyIcons: Record<string, string>;
  currencyMap?: Record<string, any>;
}

export function createMarketTableConfig({
  currencyIcons,
  currencyMap,
}: MarketTableConfigProps): TableConfig<MarketTableItem> {
  const columns = MARKET_TABLE_COLUMNS.map((column) => ({
    ...column,
    render: (value: any, item: MarketTableItem) => {
      switch (column.key) {
        case "pair":
          return {
            component: PairCell,
            props: {
              item,
              baseIcon: currencyIcons[item.pair.primary],
              baseTicker: item.pair.primary,
              currencyMap,
            },
          };

        case "price.last":
          return {
            component: PriceCell,
            props: {
              item,
              value: item.price.last,
              quoteIcon: currencyIcons[item.pair.secondary],
            },
          };

        case "price.change":
          return {
            component: ChangeCell,
            props: {
              item,
              direction: item.price.change.direction,
              percent: item.price.change.percent,
            },
          };

        case "price.bestBid":
        case "price.bestOffer":
          return {
            component: PriceCell,
            props: {
              item,
              value:
                column.key === "price.bestBid"
                  ? item.price.bestBid
                  : item.price.bestOffer,
              quoteIcon: currencyIcons[item.pair.secondary],
            },
          };

        case "volume":
          return {
            component: VolumeCell,
            props: {
              item,
              value: item.volume.secondary,
              primaryValue: item.volume.primary,
              abbreviate: true,
            },
          };

        case "volumePercent":
          return {
            component: VolumePercentCell,
            props: { value: item.volumePercent || 0 },
          };

        case "priceHistory":
          return {
            component: PriceChartCell,
            props: {
              item,
              color:
                item.price.change.direction === "Up"
                  ? "success"
                  : item.price.change.direction === "Down"
                  ? "danger"
                  : "default",
            },
          };

        default:
          return { component: "div", props: { innerHTML: String(value) } };
      }
    },
  }));

  return {
    columns,
    sortable: true,
    filterable: true,
    selectable: false,
    pagination: false,
    loading: false,
    emptyMessage: "No data available",
  };
}
