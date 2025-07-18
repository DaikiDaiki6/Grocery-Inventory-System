BEGIN;

-- Category Table
CREATE TABLE IF NOT EXISTS public."Category" (
    "Category_ID" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "Category_Name" VARCHAR NOT NULL
);

-- Supplier Table
CREATE TABLE IF NOT EXISTS public."Supplier" (
    "Supplier_ID" VARCHAR(11) PRIMARY KEY,
    "Supplier_Name" VARCHAR NOT NULL
);

-- Warehouse Table
CREATE TABLE IF NOT EXISTS public."Warehouse" (
    "Warehouse_ID" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "Warehouse_Name" VARCHAR NOT NULL
);

-- Product Table
CREATE TABLE IF NOT EXISTS public."Product" (
    "Product_ID" VARCHAR(11) PRIMARY KEY,
    "Product_Name" VARCHAR NOT NULL,
    "Category_ID" INTEGER NOT NULL,
    "Supplier_ID" VARCHAR(11) NOT NULL,
    FOREIGN KEY ("Category_ID") REFERENCES public."Category" ("Category_ID"),
    FOREIGN KEY ("Supplier_ID") REFERENCES public."Supplier" ("Supplier_ID")
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS public."Inventory" (
    "Inventory_ID" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "Stock_Quantity" INTEGER NOT NULL,
    "Reorder_Level" INTEGER NOT NULL,
    "Reorder_Quantity" INTEGER NOT NULL,
    "Unit_Price" NUMERIC NOT NULL,
    "Date_Received" DATE NOT NULL,
    "Last_Order_Date" DATE NOT NULL,
    "Expiration_Date" DATE NOT NULL,
    "Sales_Volume" INTEGER NOT NULL,
    "Inventory_Turnover_Rate" INTEGER NOT NULL,
    "Status" VARCHAR NOT NULL,
    "Product_ID" VARCHAR(11) NOT NULL,
    "Warehouse_ID" INTEGER NOT NULL,
    FOREIGN KEY ("Product_ID") REFERENCES public."Product" ("Product_ID"),
    FOREIGN KEY ("Warehouse_ID") REFERENCES public."Warehouse" ("Warehouse_ID")
);

END;
