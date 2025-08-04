# 🛒 Grocery Inventory Management System

A full-stack web application for managing grocery inventory, products, suppliers, warehouses, and categories. Built with React frontend and ASP.NET Core Web API backend with PostgreSQL database.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Pagination Guide](#-pagination-guide)
- [Database Schema](#-database-schema)
- [Authentication](#-authentication)
- [Contributing](#-contributing)

## ✨ Features

### Core Functionality

- **Product Management**: Add, edit, delete, and view products with categories and suppliers
- **Inventory Tracking**: Monitor stock levels, reorder points, and inventory turnover rates
- **Supplier Management**: Manage supplier information and relationships
- **Warehouse Management**: Track inventory across multiple warehouse locations
- **Category Organization**: Organize products by categories for better management
- **Real-time Stock Monitoring**: Track stock quantities, expiration dates, and sales volume

### Advanced Features

- **JWT Authentication**: Secure user authentication and authorization
- **Pagination**: Efficient data loading for large datasets
- **RESTful API**: Clean, standardized API endpoints
- **Responsive UI**: Modern React frontend with Tailwind CSS
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Cross-origin resource sharing for frontend-backend communication

## 🛠️ Tech Stack

### Backend

- **Framework**: ASP.NET Core 8.0 Web API
- **Database**: PostgreSQL with Entity Framework Core
- **Authentication**: JWT Bearer Tokens
- **Documentation**: Swagger/OpenAPI
- **Password Hashing**: BCrypt.Net-Next
- **Validation**: Built-in model validation

### Frontend

- **Framework**: React 19 with Vite
- **Routing**: TanStack Router
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS 4.1
- **HTTP Client**: Axios
- **UI Components**: Custom components with modern design

### Development Tools

- **Package Manager**: npm (frontend), NuGet (backend)
- **Build Tool**: Vite
- **Linting**: ESLint
- **Database Migrations**: Entity Framework Migrations

## 📁 Project Structure

```
Grocery-Inventory-System/
├── client/
│   └── grocery-inventory-frontend/     # React frontend application
│       ├── src/
│       │   ├── components/             # React components organized by feature
│       │   │   ├── Categories/         # Category management components
│       │   │   ├── Products/           # Product management components
│       │   │   ├── Inventories/        # Inventory management components
│       │   │   ├── Suppliers/          # Supplier management components
│       │   │   └── Warehouses/         # Warehouse management components
│       │   ├── api/                    # API service layer
│       │   ├── hooks/                  # Custom React hooks
│       │   ├── routes/                 # Application routing
│       │   └── utils/                  # Utility functions
│       └── package.json
├── server/
│   └── GroceryInventoryAPI/            # ASP.NET Core Web API
│       ├── Controllers/                # API controllers
│       ├── Models/                     # Entity models
│       ├── DTOs/                       # Data transfer objects
│       ├── Services/                   # Business logic services
│       ├── Data/                       # Database context
│       ├── MiddleWare/                 # Custom middleware
│       └── Migrations/                 # Database migrations
└── database/                           # Database scripts and data
```

## 🚀 Getting Started

### Prerequisites

- .NET 8.0 SDK
- Node.js 18+ and npm
- PostgreSQL database
- Git

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Grocery-Inventory-System
   ```

2. **Configure the database**

   - Create a PostgreSQL database
   - Update connection string in `server/GroceryInventoryAPI/appsettings.json`
   - Run database migrations:

   ```bash
   cd server/GroceryInventoryAPI
   dotnet ef database update
   ```

3. **Configure JWT settings**

   - Update JWT settings in `appsettings.json`:

   ```json
   {
     "JwtSettings": {
       "SecretKey": "your-secret-key-here",
       "Issuer": "your-issuer",
       "Audience": "your-audience"
     }
   }
   ```

4. **Run the backend**
   ```bash
   dotnet run
   ```
   The API will be available at `https://localhost:7000` (or your configured port)

### Frontend Setup

1. **Install dependencies**

   ```bash
   cd client/grocery-inventory-frontend
   npm install
   ```

2. **Configure API endpoint**

   - Update the API base URL in `src/api/axios.js` if needed

3. **Run the frontend**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 📚 API Documentation

The API documentation is available via Swagger UI when running the backend in development mode:

- **Swagger UI**: `https://localhost:7000/swagger`

### Available Endpoints

#### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

#### Categories

- `GET /api/categories` - Get all categories (paginated)
- `GET /api/categories/{id}` - Get specific category
- `POST /api/categories` - Create new category
- `PATCH /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

#### Products

- `GET /api/products` - Get all products (paginated)
- `GET /api/products/{id}` - Get specific product
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `PATCH /api/products/{id}` - Partially update product
- `DELETE /api/products/{id}` - Delete product

#### Suppliers

- `GET /api/suppliers` - Get all suppliers (paginated)
- `GET /api/suppliers/{id}` - Get specific supplier
- `POST /api/suppliers` - Create new supplier
- `PATCH /api/suppliers/{id}` - Update supplier
- `DELETE /api/suppliers/{id}` - Delete supplier

#### Warehouses

- `GET /api/warehouses` - Get all warehouses (paginated)
- `GET /api/warehouses/{id}` - Get specific warehouse
- `POST /api/warehouses` - Create new warehouse
- `PATCH /api/warehouses/{id}` - Update warehouse
- `DELETE /api/warehouses/{id}` - Delete warehouse

#### Inventories

- `GET /api/inventories` - Get all inventories (paginated)
- `GET /api/inventories/{id}` - Get specific inventory
- `POST /api/inventories` - Create new inventory
- `PUT /api/inventories/{id}` - Update inventory
- `PATCH /api/inventories/{id}` - Partially update inventory
- `DELETE /api/inventories/{id}` - Delete inventory

## 📄 Pagination Guide

All `GetAll` endpoints support pagination to handle large datasets efficiently.

### Available Paginated Endpoints

- `GET /api/categories` - Get all categories
- `GET /api/products` - Get all products
- `GET /api/suppliers` - Get all suppliers
- `GET /api/warehouses` - Get all warehouses
- `GET /api/inventories` - Get all inventories

### Query Parameters

| Parameter    | Type | Default | Range | Description                 |
| ------------ | ---- | ------- | ----- | --------------------------- |
| `pageNumber` | int  | 1       | 1+    | The page number to retrieve |
| `pageSize`   | int  | 20      | 1-100 | Number of items per page    |

### Usage Examples

#### Basic Usage (Default Pagination)

```http
GET /api/categories
```

Returns first 20 categories.

#### Custom Page Size

```http
GET /api/categories?pageSize=50
```

Returns first 50 categories.

#### Specific Page

```http
GET /api/categories?pageNumber=2&pageSize=10
```

Returns categories 11-20 (page 2 with 10 items per page).

#### Large Page Size

```http
GET /api/products?pageSize=100
```

Returns up to 100 products (maximum allowed).

### Response Format

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

### Error Responses

#### Invalid Page Number

```http
GET /api/categories?pageNumber=0
```

```json
{
  "message": "Page number must be 1 or greater"
}
```

#### Invalid Page Size

```http
GET /api/categories?pageSize=150
```

```json
{
  "message": "Page size must be between 1 and 100"
}
```

### Frontend Integration

When building pagination controls, use the response metadata:

- **Previous Button**: Show if `hasPreviousPage` is true, navigate to `previousPageNumber`
- **Next Button**: Show if `hasNextPage` is true, navigate to `nextPageNumber`
- **Page Numbers**: Generate range from 1 to `totalPages`
- **Item Count**: Display `totalCount` for "Showing X of Y items"

### Performance Benefits

- **Reduced Memory Usage**: Only loads requested page of data
- **Faster Response Times**: Smaller data transfers
- **Better User Experience**: Faster page loads and navigation
- **Database Efficiency**: Uses SQL `OFFSET` and `LIMIT` for optimal queries

## 🗄️ Database Schema

### Core Entities

#### Product

- `ProductID` (string) - Primary key
- `ProductName` (string) - Product name
- `CategoryID` (int) - Foreign key to Category
- `SupplierID` (string) - Foreign key to Supplier

#### Category

- `CategoryID` (int) - Primary key
- `CategoryName` (string) - Category name
- `Description` (string) - Category description

#### Supplier

- `SupplierID` (string) - Primary key
- `SupplierName` (string) - Supplier name
- `ContactName` (string) - Contact person name
- `ContactEmail` (string) - Contact email
- `Phone` (string) - Phone number
- `Address` (string) - Physical address

#### Warehouse

- `WarehouseID` (int) - Primary key
- `WarehouseName` (string) - Warehouse name
- `Location` (string) - Warehouse location
- `Capacity` (int) - Storage capacity

#### Inventory

- `InventoryID` (int) - Primary key
- `StockQuantity` (int) - Current stock level
- `ReorderLevel` (int) - Reorder threshold
- `ReorderQuantity` (int) - Reorder amount
- `UnitPrice` (decimal) - Price per unit
- `DateReceived` (DateOnly) - Receipt date
- `LastOrderDate` (DateOnly?) - Last order date
- `ExpirationDate` (DateOnly) - Expiration date
- `SalesVolume` (int) - Sales volume
- `InventoryTurnoverRate` (decimal) - Turnover rate
- `Status` (enum) - Inventory status (Active/BackOrdered/Discontinued)
- `ProductID` (string) - Foreign key to Product
- `WarehouseID` (int) - Foreign key to Warehouse

#### User

- `UserID` (int) - Primary key
- `Username` (string) - Username
- `Email` (string) - Email address
- `PasswordHash` (string) - Hashed password
- `Role` (string) - User role

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication:

### Registration

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "user@example.com",
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "securepassword"
}
```

### Using JWT Tokens

Include the JWT token in the Authorization header for protected endpoints:

```http
Authorization: Bearer <your-jwt-token>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Add appropriate error handling and validation
- Include unit tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include error messages, steps to reproduce, and environment details

---

**Happy coding! 🚀**
