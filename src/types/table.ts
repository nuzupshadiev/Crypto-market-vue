// Base table configuration
export interface TableConfig<T> {
  columns: TableColumn<T>[];
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

// Column definition
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
  render?: (value: any, item: T, index: number) => any; // Vue → any VNode
  headerRender?: () => any; // Vue slots or VNode
}

// Sorting configuration
export interface SortConfig {
  column: string;
  direction: "ascending" | "descending" | undefined;
}

// Filter configuration
export interface FilterConfig {
  search?: string;
  filters?: Record<string, any>;
  customFilters?: Record<string, (item: any) => boolean>;
}

// Table state
export interface TableState<T> {
  data: T[];
  filteredData: T[];
  sortedData: T[];
  sortConfig: SortConfig;
  filterConfig: FilterConfig;
  loading: boolean;
  error?: string;
}

// Table actions
export interface TableActions<T> {
  setData: (data: T[]) => void;
  setSorting: (
    column: string,
    direction: "ascending" | "descending" | undefined
  ) => void;
  setFilter: (key: string, value: any) => void;
  setFilterConfig: (config: FilterConfig) => void;
  setSearch: (search: string) => void;
}

// Market-specific types
export interface MarketTableItem {
  id: string;
  pair: {
    primary: string;
    secondary: string;
  };
  price: {
    last: number;
    bestBid: number;
    bestOffer: number;
    change: {
      direction: "Up" | "Down" | "None";
      percent: number;
      amount: number;
    };
  };
  volume: {
    primary: number;
    secondary: number;
  };
  priceHistory: number[];
  volumePercent?: number;
}

// Filter types
export interface MarketFilters {
  search: string;
  baseCurrencies: string[];
  quoteCurrencies: string[];
  direction: "Up" | "Down" | null;
  changeMin: number;
  changeMax: number;
}

// Table props (Vue)
export interface DataTableProps<T> {
  data: T[];
  config: TableConfig<T>;
  sortConfig?: SortConfig;
  loading?: boolean;
  error?: string;
  filters?: any; // Vue slot instead of React.ReactNode
  footerContent?: any; // Vue slot
  hasActiveFilters?: boolean;
  // Vue emits instead of callbacks
  onSort?: (
    column: string,
    direction: "ascending" | "descending" | undefined
  ) => void;
  onFilter?: (filters: FilterConfig) => void;
  onSelect?: (selectedItems: Set<string | number>) => void;
  onRefresh?: () => void;
}

// Cell renderer props
export interface CellRendererProps<T> {
  value: any;
  item: T;
  column: TableColumn<T>;
  index: number;
}
