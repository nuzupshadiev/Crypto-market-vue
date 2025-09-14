# Cryptocurrency Market Dashboard

A real-time cryptocurrency market data dashboard built with Vue 3, TypeScript, and modern web technologies. This application provides live market data, interactive tables, comprehensive filtering capabilities, and price charts for cryptocurrency trading pairs.

## 🚀 Features

- **Real-time Market Data**: Live cryptocurrency market data with automatic refresh every 10 seconds
- **Advanced Data Table**: Custom-built table system with high-performance sorting, filtering, and data management
- **Comprehensive Filtering**: Multi-currency filtering, price change direction, percentage ranges, and real-time search
- **Price Charts**: Interactive mini sparkline charts showing price history for each trading pair
- **Currency Icons**: Dynamic currency icons with Base64-encoded SVG support and proper ticker symbols
- **Type Safety**: Full TypeScript support with strict type checking throughout
- **Modern UI Components**: Custom component library built on Reka UI primitives
- **State Management**: Pinia stores with reactive data fetching and caching
- **Performance Optimized**: Debounced search, memoized queries, and efficient data transformations

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript with strict type checking
- **Build Tool**: Vite with Vue plugin
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: Shadcn UI Vue with custom implementations
- **Icons**: Lucide Vue Next
- **Charts**: Chart.js with Vue Chart.js for price sparklines
- **HTTP Client**: Axios with custom endpoint wrapper
- **State Management**: Pinia stores with reactive composables
- **Table Management**: Custom table system with advanced sorting and filtering
- **Data Fetching**: Custom useQuery composable with caching and refetching

## 📦 Project Structure

```
src/
├── API/                    # API layer with type-safe endpoints
│   ├── currency.ts         # Currency data API with icon handling
│   ├── market.ts          # Market data API with trading pairs
│   └── endpoint.ts        # Axios-based HTTP client wrapper
├── components/            # Reusable component library
│   ├── table/            # Advanced data table system
│   │   ├── cells/        # Specialized table cell components
│   │   │   ├── ChangeCell.vue      # Price change indicators
│   │   │   ├── PairCell.vue        # Trading pair display
│   │   │   ├── PriceCell.vue       # Price formatting
│   │   │   ├── PriceChartCell.vue  # Sparkline charts
│   │   │   ├── VolumeCell.vue      # Volume display
│   │   │   └── VolumePercentCell.vue # Volume percentages
│   │   ├── filters/      # Advanced filtering components
│   │   │   └── MarketFilters.vue   # Multi-criteria filters
│   │   ├── index.vue     # Main table component
│   │   └── marketTableConfig.ts    # Table configuration
│   ├── currency-icon/    # Currency icon component
│   ├── price-sparkline/  # Price chart component
│   └── ui/               # Base UI component library
│       ├── button/       # Button component
│       ├── input/        # Input component
│       ├── select/       # Select component family
│       ├── table/        # Table primitives
│       └── tooltip/      # Tooltip component family
├── composables/          # Vue composition functions
│   ├── useQuery.ts       # Data fetching with caching & refetching
│   └── useTableData.ts   # Table state management & filtering
├── pages/                # Application pages
│   └── market/           # Main market dashboard
├── stores/               # Pinia state management
│   ├── currency.ts       # Currency data store
│   └── market.ts         # Market data store
├── types/                # TypeScript type definitions
│   └── table.ts          # Table and data types
├── utils/                # Utility functions
│   ├── format-utils.ts   # Number and currency formatting
│   └── table-utils.ts    # Table data transformations
├── constants/            # Application constants
│   └── table-config.ts   # Table column definitions
└── lib/                  # Shared utilities
    └── utils.ts          # Common utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/nuzupshadiev/Crypto-market-vue
cd vue-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory:

```env
VITE_API_ENDPOINT=https://requestly.tech/api/mockv2/test/api
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📊 Features Overview

### Advanced Data Table

- **Trading Pairs**: Display cryptocurrency trading pairs with dynamic currency icons
- **Price Information**: Last price, best bid, and best offer prices with proper formatting
- **Price Changes**: 24-hour price changes with color-coded indicators and percentage display
- **Volume Data**: Trading volume in both base and quote currencies with percentage calculations
- **Price Charts**: Interactive mini sparkline charts showing price history with color-coded trends
- **Sortable Columns**: Click column headers to sort data in ascending/descending order

### Comprehensive Filtering System

- **Multi-Currency Filters**: Filter by multiple base and quote currencies simultaneously
- **Price Change Filters**: Filter by price change direction (Up/Down) and percentage ranges
- **Real-time Search**: Debounced search across trading pairs
- **Advanced Filtering**: Combine multiple filter criteria for precise data selection
- **Filter Persistence**: Maintains filter state during data refreshes

### Real-time Data Management

- **Automatic Refresh**: Data updates every 10 seconds with configurable intervals
- **Loading States**: Comprehensive loading indicators and error handling
- **Data Caching**: Intelligent caching with previous data retention during updates
- **Error Recovery**: Graceful error handling with retry mechanisms
- **Optimistic Updates**: Smooth UI updates without data flickering

### Performance Optimizations

- **Debounced Search**: 300ms debounce for search input to reduce API calls
- **Memoized Queries**: Cached query results with smart invalidation
- **Efficient Rendering**: Optimized table rendering with virtual scrolling capabilities
- **Data Transformations**: Pre-computed volume percentages and formatted values

## 🎨 Design System

The application features a sophisticated design system built on modern web standards:

- **Tailwind CSS v4**: Latest utility-first CSS framework with custom design tokens
- **Shadcn UI Vue**: Accessible component primitives with custom implementations
- **Lucide Icons**: Beautiful, customizable SVG icons throughout the interface
- **Custom Components**: Specialized table cells, filters, and interactive elements
- **Responsive Design**: Mobile-first approach with adaptive layouts

## 🔧 Development Architecture

### State Management

- **Pinia Stores**: Reactive state management for market and currency data
- **Composables**: Reusable logic with `useQuery` and `useTableData` hooks
- **Type Safety**: Full TypeScript integration with strict type checking

### Data Flow

1. **API Layer**: Type-safe endpoints with Axios wrapper
2. **Stores**: Pinia stores manage data fetching and caching
3. **Composables**: Business logic and state management
4. **Components**: Reactive UI components with proper prop validation

### Key Composable Functions

- **`useQuery`**: Advanced data fetching with caching, refetching, and error states
- **`useTableData`**: Comprehensive table state management including sorting, filtering, and data processing
- **`useDebouncedSearch`**: Optimized search functionality with configurable debounce timing

### API Integration

The application integrates with a cryptocurrency API providing:

- **Market Data**: Real-time trading pair information with price and volume data
- **Currency Information**: Currency metadata with Base64-encoded SVG icons
- **Price History**: Historical price data for sparkline chart generation
- **Error Handling**: Robust error handling with user-friendly error messages

### Type Safety & Code Quality

- **Strict TypeScript**: Full type safety with strict mode enabled
- **Interface Definitions**: Comprehensive type definitions for all data structures
- **Type-safe API**: End-to-end type safety from API responses to component props
- **Component Validation**: Proper prop validation and type checking

## 🚀 Performance Features

- **Virtual Scrolling**: Efficient rendering of large datasets
- **Memoized Computations**: Optimized data transformations and filtering
- **Lazy Loading**: On-demand component loading for better initial performance
- **Caching Strategy**: Intelligent data caching with smart invalidation
- **Bundle Optimization**: Tree-shaking and code splitting for minimal bundle size

## 🔧 Development Commands

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and fix code
npm run lint
```

## 👨‍💻 Author

**Nuzup Shadiev**  
Email: nuzupshadiev@gmail.com
