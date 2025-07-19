BEGIN;

-- Categories Table
CREATE TABLE IF NOT EXISTS public."Categories" (
    "CategoryID" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "CategoryName" VARCHAR NOT NULL
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS public."Suppliers" (
    "SupplierID" VARCHAR(11) PRIMARY KEY,
    "SupplierName" VARCHAR NOT NULL
);

-- Warehouses Table
CREATE TABLE IF NOT EXISTS public."Warehouses" (
    "WarehouseID" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "WarehouseName" VARCHAR NOT NULL
);

-- Products Table
CREATE TABLE IF NOT EXISTS public."Products" (
    "ProductID" VARCHAR(11) PRIMARY KEY,
    "ProductName" VARCHAR NOT NULL,
    "CategoryID" INTEGER NOT NULL,
    "SupplierID" VARCHAR(11) NOT NULL,
    FOREIGN KEY ("CategoryID") REFERENCES public."Categories" ("CategoryID"),
    FOREIGN KEY ("SupplierID") REFERENCES public."Suppliers" ("SupplierID")
);

-- Inventories Table
CREATE TABLE IF NOT EXISTS public."Inventories" (
    "InventoryID" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "StockQuantity" INTEGER NOT NULL,
    "ReorderLevel" INTEGER NOT NULL,
    "ReorderQuantity" INTEGER NOT NULL,
    "UnitPrice" NUMERIC NOT NULL,
    "DateReceived" DATE NOT NULL,
    "LastOrderDate" DATE NOT NULL,
    "ExpirationDate" DATE NOT NULL,
    "SalesVolume" INTEGER NOT NULL,
    "InventoryTurnoverRate" INTEGER NOT NULL,
    "Status" VARCHAR NOT NULL,
    "ProductID" VARCHAR(11) NOT NULL,
    "WarehouseID" INTEGER NOT NULL,
    FOREIGN KEY ("ProductID") REFERENCES public."Products" ("ProductID"),
    FOREIGN KEY ("WarehouseID") REFERENCES public."Warehouses" ("WarehouseID")
);

END;
