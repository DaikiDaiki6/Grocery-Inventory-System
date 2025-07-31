# Pagination Guide

All `GetAll` endpoints now support pagination to handle large datasets efficiently.

## Available Paginated Endpoints

- `GET /api/categories` - Get all categories
- `GET /api/products` - Get all products
- `GET /api/suppliers` - Get all suppliers
- `GET /api/warehouses` - Get all warehouses
- `GET /api/inventories` - Get all inventories

## Query Parameters

| Parameter    | Type | Default | Range | Description                 |
| ------------ | ---- | ------- | ----- | --------------------------- |
| `pageNumber` | int  | 1       | 1+    | The page number to retrieve |
| `pageSize`   | int  | 20      | 1-100 | Number of items per page    |

## Usage Examples

### Basic Usage (Default Pagination)

```http
GET /api/categories
```

Returns first 20 categories.

### Custom Page Size

```http
GET /api/categories?pageSize=50
```

Returns first 50 categories.

### Specific Page

```http
GET /api/categories?pageNumber=2&pageSize=10
```

Returns categories 11-20 (page 2 with 10 items per page).

### Large Page Size

```http
GET /api/products?pageSize=100
```

Returns up to 100 products (maximum allowed).

## Response Format

All paginated endpoints return the same response structure:

```json
{
  "data": [
    // Array of items for the current page
  ],
  "totalCount": 1250,
  "pageNumber": 2,
  "pageSize": 20,
  "totalPages": 63,
  "hasPreviousPage": true,
  "hasNextPage": true,
  "previousPageNumber": 1,
  "nextPageNumber": 3
}
```

### Response Fields

| Field                | Type    | Description                            |
| -------------------- | ------- | -------------------------------------- |
| `data`               | array   | The actual items for the current page  |
| `totalCount`         | int     | Total number of items across all pages |
| `pageNumber`         | int     | Current page number                    |
| `pageSize`           | int     | Number of items per page               |
| `totalPages`         | int     | Total number of pages                  |
| `hasPreviousPage`    | boolean | Whether there's a previous page        |
| `hasNextPage`        | boolean | Whether there's a next page            |
| `previousPageNumber` | int     | Previous page number (0 if none)       |
| `nextPageNumber`     | int     | Next page number (0 if none)           |

## Error Responses

### Invalid Page Number

```http
GET /api/categories?pageNumber=0
```

```json
{
  "message": "Page number must be 1 or greater"
}
```

### Invalid Page Size

```http
GET /api/categories?pageSize=150
```

```json
{
  "message": "Page size must be between 1 and 100"
}
```

## Frontend Integration

When building pagination controls, use the response metadata:

- **Previous Button**: Show if `hasPreviousPage` is true, navigate to `previousPageNumber`
- **Next Button**: Show if `hasNextPage` is true, navigate to `nextPageNumber`
- **Page Numbers**: Generate range from 1 to `totalPages`
- **Item Count**: Display `totalCount` for "Showing X of Y items"

## Performance Benefits

- **Reduced Memory Usage**: Only loads requested page of data
- **Faster Response Times**: Smaller data transfers
- **Better User Experience**: Faster page loads and navigation
- **Database Efficiency**: Uses SQL `OFFSET` and `LIMIT` for optimal queries

## Migration Notes

- **Backward Compatibility**: Default parameters maintain existing behavior
- **No Breaking Changes**: Existing frontend code will continue to work
- **Optional Enhancement**: Pagination parameters are optional
