# CPG Dashboard API Documentation

## Overview
This document describes the improved APIs for the CPG Dashboard that provide properly structured data for all chart components with correct units, filtering, and data consistency.

## Schema Discovery

### GET /api/schema
Returns the schema of all MongoDB collections with sample data and field information.

**Response:**
```json
{
  "collection_name": {
    "fields": ["field1", "field2", ...],
    "sample": { /* sample document */ },
    "count": 1234
  }
}
```

## Main KPIs

### GET /api/kpis
Returns aggregated KPIs from multiple collections with proper filtering.

**Query Parameters:**
- `region` - Filter by region
- `area` - Filter by area  
- `store` - Filter by store
- `category` - Filter by category
- `event` - Filter by event
- `month` - Filter by month

**Response:**
```json
{
  "featureExecution": 85.2,
  "featureExpectedLocation": 78.5,
  "dayOneReady": 92.1,
  "incrementalGainLoss": 1250000,
  "totalRevenue": 25000000,
  "storeCount": 150,
  "performanceScore": 8.7,
  "avgPace": 82.3,
  "avgInstock": 94.5
}
```

## Feature Execution APIs

### GET /api/feature-execution-by-category
Returns feature execution data by category for bar charts.

**Response:**
```json
[
  {
    "category": "PWS",
    "value": 87.5,
    "color": "#14B8A6",
    "count": 45
  }
]
```

### GET /api/day-one-ready
Returns day-one ready data by category for bar charts.

**Response:**
```json
[
  {
    "category": "SEASONAL", 
    "value": 91.2,
    "color": "#059669",
    "count": 38
  }
]
```

### GET /api/incremental-impact
Returns incremental financial impact by category.

**Response:**
```json
[
  {
    "category": "BTEC",
    "value": 1500000,
    "count": 25
  }
]
```

### GET /api/hierarchy-performance
Returns top performing stores with additional context.

**Response:**
```json
[
  {
    "store": "Store 1",
    "performance": 94.2,
    "region": "KUSA Region",
    "area": "KUSA Area", 
    "category": "PWS",
    "count": 12
  }
]
```

## OSA (On-Shelf Availability) APIs

### GET /api/osa/kpis
Returns OSA key performance indicators.

**Response:**
```json
{
  "overallOSA": 92.5,
  "outOfStockRate": 7.5,
  "replenishmentSpeed": 24,
  "inventoryTurnover": 8.2
}
```

### GET /api/osa/by-category
Returns OSA data by category for bar charts.

**Response:**
```json
[
  {
    "category": "PWS",
    "osa": 94.2,
    "outOfStock": 5.8,
    "replenishment": 12.5,
    "count": 45
  }
]
```

### GET /api/osa/regional
Returns OSA performance by region.

**Response:**
```json
[
  {
    "region": "KUSA Region",
    "osa": 93.1,
    "stores": 25,
    "criticalOOS": 3,
    "totalRecords": 150,
    "avgPace": 85.2
  }
]
```

## Supply Chain APIs

### GET /api/supply/kpis
Returns supply chain key performance indicators.

**Response:**
```json
{
  "onTimeDelivery": 94.2,
  "inventoryAccuracy": 95.5,
  "orderFulfillment": 92.5,
  "supplierPerformance": 89.2
}
```

### GET /api/supply/delivery-by-category
Returns delivery performance by category.

**Response:**
```json
[
  {
    "category": "Electronics",
    "onTime": 94.5,
    "accuracy": 97.2,
    "totalOrders": 150,
    "totalQuantity": 2500
  }
]
```

### GET /api/supply/trends
Returns weekly supply chain trends for line charts.

**Response:**
```json
[
  {
    "week": "2024-01-07",
    "onTime": 92.1,
    "accuracy": 95.8,
    "issues": 12,
    "totalOrders": 450,
    "totalQuantity": 7500
  }
]
```

### GET /api/supply/suppliers
Returns supplier performance data.

**Response:**
```json
[
  {
    "supplier": "Supplier A",
    "performance": 94.2,
    "reliability": 96.8,
    "totalOrders": 85,
    "totalQuantity": 1200,
    "receivedQuantity": 1130
  }
]
```

## Retail Wallet APIs

### GET /api/wallet/kpis
Returns wallet share and customer metrics.

**Response:**
```json
{
  "totalWalletShare": 23.5,
  "walletGrowth": 12.5,
  "customerPenetration": 67.8,
  "avgWalletSize": 1250.75
}
```

### GET /api/wallet/by-category
Returns wallet share by category.

**Response:**
```json
[
  {
    "category": "PWS",
    "walletShare": 28.5,
    "growth": 2.85,
    "penetration": 72.3,
    "totalOrders": 200,
    "totalQuantity": 3500,
    "avgOrderValue": 17.5
  }
]
```

### GET /api/wallet/regions
Returns wallet performance by region.

**Response:**
```json
[
  {
    "region": "KUSA Region",
    "walletShare": 25.2,
    "growth": 8.5,
    "customers": 45,
    "totalOrders": 300,
    "totalQuantity": 5000
  }
]
```

## Summary APIs

### GET /api/summary/monthly
Returns monthly trends for executive summary.

**Response:**
```json
[
  {
    "month": "2024-01-07",
    "execution": 87.5,
    "revenue": 2.5,
    "compliance": 92.1,
    "totalOrders": 450,
    "onTimeOrders": 394
  }
]
```

### GET /api/summary/regions
Returns regional performance summary.

**Response:**
```json
[
  {
    "region": "KUSA Region",
    "execution": 89.2,
    "revenue": 150,
    "stores": 25,
    "totalRecords": 300,
    "avgChannel": 4.2
  }
]
```

### GET /api/summary/categories
Returns category breakdown for pie charts.

**Response:**
```json
[
  {
    "name": "PWS",
    "value": 28.5,
    "color": "#14B8A6",
    "totalOrders": 200,
    "totalQuantity": 3500
  }
]
```

### GET /api/summary/top-issues
Returns top issues requiring attention.

**Response:**
```json
[
  {
    "issue": "Execution Alert",
    "count": 25,
    "severity": "High",
    "avgExecution": 75.2,
    "totalRevenue": 125000
  }
]
```

## Key Improvements

### 1. **Consistent Filtering**
All APIs now support the same filter parameters:
- `region` - Filter by region
- `area` - Filter by area
- `store` - Filter by store
- `category` - Filter by category
- `event` - Filter by event
- `month` - Filter by month

### 2. **Proper Data Types and Units**
- Percentages are properly calculated and rounded
- Financial values are in correct units (dollars, millions)
- Counts and quantities are properly aggregated
- All numeric values are rounded to appropriate decimal places

### 3. **Enhanced Data Structure**
- Added metadata fields (count, totalOrders, etc.) for better context
- Consistent field naming across all APIs
- Proper null handling and default values
- Additional context fields for better chart tooltips

### 4. **MongoDB Field Mapping**
- `Rgn Nm` → region
- `Area Nm` → area
- `Store Name` → store
- `Catg Nm` → category
- `Event Nm` → event
- `Month Nm` → month
- `Feature Execution Pct` → featureExecution
- `Expected Location Pct` → featureExpectedLocation
- `Day One Ready Pct` → dayOneReady
- `Daily Instock POD *` → osa/instock metrics
- `Pace Pct` → performance metrics
- `Revenue` → financial metrics

### 5. **Data Consistency**
- All APIs use the same filter logic
- Consistent aggregation patterns
- Proper error handling
- Standardized response formats

## Usage Examples

### Get KPIs for specific region and category:
```
GET /api/kpis?region=KUSA Region&category=PWS
```

### Get feature execution data for specific store:
```
GET /api/feature-execution-by-category?store=Store 1
```

### Get OSA trends for specific month:
```
GET /api/osa/by-category?month=January
```

## Error Handling

All APIs return consistent error responses:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `500` - Server error (database connection, query errors)

## Performance Considerations

- All queries use MongoDB aggregation pipelines for optimal performance
- Proper indexing recommended on filter fields
- Results are limited to prevent large data transfers
- Queries are optimized to only return necessary fields
