﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GroceryInventoryAPI.Migrations
{
    /// <inheritdoc />
    public partial class ConvertedInventoryTurnoverRateToDecimal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "InventoryTurnoverRate",
                table: "Inventories",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "InventoryTurnoverRate",
                table: "Inventories",
                type: "integer",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");
        }
    }
}
