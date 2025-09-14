# Cryptocurrency Market Dashboard

A real-time cryptocurrency market data dashboard built with Vue 3, TypeScript, and modern web technologies. This application provides live market data, interactive tables, filtering capabilities, and price charts for cryptocurrency trading pairs.

## 🚀 Features

- **Real-time Market Data**: Live cryptocurrency market data with automatic refresh every 10 seconds
- **Interactive Data Table**: Sortable and filterable table with custom cell components
- **Advanced Filtering**: Filter by base/quote currencies, price change direction, and percentage ranges
- **Price Charts**: Mini sparkline charts showing price history for each trading pair
- **Currency Icons**: Visual currency icons with proper ticker symbols
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **Modern UI Components**: Shadcn UI components and Lucide icons

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn Vue
- **Icons**: Lucide Vue Next
- **Charts**: Chart.js with Vue Chart.js
- **HTTP Client**: Axios
- **State Management**: Vue composables with reactive state

## 📦 Project Structure

```
src/
├── API/                    # API layer
│   ├── currency.ts         # Currency data API
│   ├── market.ts          # Market data API
│   └── endpoint.ts        # HTTP client wrapper
├── components/            # Reusable components
│   ├── table/            # Data table components
│   │   ├── cells/        # Custom table cell components
│   │   └── filters/      # Filter components
│   └── ui/               # Base UI components
├── composables/          # Vue composables
│   ├── useQuery.ts       # Data fetching composable
│   └── useTableData.ts   # Table state management
├── pages/                # Page components
│   └── market/           # Market dashboard page
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── constants/            # Application constants
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

### Market Data Table

- **Trading Pairs**: Display cryptocurrency trading pairs with currency icons
- **Price Information**: Last price, best bid, and best offer prices
- **Price Changes**: 24-hour price changes with color-coded indicators
- **Volume Data**: Trading volume in both base and quote currencies
- **Price Charts**: Mini sparkline charts showing price history

### Filtering & Search

- **Currency Filters**: Filter by base and quote currencies
- **Price Change Filters**: Filter by price change direction and percentage ranges
- **Search**: Real-time search across trading pairs
- **Sorting**: Click column headers to sort data

### Real-time Updates

- Automatic data refresh every 10 seconds
- Loading states and error handling
- Optimistic UI updates with previous data retention

## 🎨 UI Components

The application uses a custom design system built on top of:

- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Beautiful, customizable icons
- **Custom Components**: Specialized table cells and filters

## 🔧 Development

### Key Composable Functions

- `useQuery`: Handles data fetching with caching, refetching, and error states
- `useTableData`: Manages table state including sorting, filtering, and data processing

### API Integration

The application integrates with a cryptocurrency API that provides:

- Market data for trading pairs
- Currency information with icons and metadata
- Real-time price updates

### Type Safety

Full TypeScript support with:

- Strict type checking
- Interface definitions for all data structures
- Type-safe API responses
- Component prop validation

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Reka UI for accessible component primitives
- Lucide for the beautiful icon set
- Chart.js for the charting capabilities
