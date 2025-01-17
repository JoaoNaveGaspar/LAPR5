﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MDWM.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Deliveries",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    date__date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    weight__Weight = table.Column<double>(type: "float", nullable: true),
                    destinationWarehouseId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    packagingTime__LoadTime = table.Column<int>(type: "int", nullable: true),
                    packagingTime__UnloadTime = table.Column<int>(type: "int", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Deliveries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Warehouses",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    address_Street = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    address_City = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    address_Country = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    coordinates_Latitude = table.Column<double>(type: "float", nullable: true),
                    coordinates_Longitude = table.Column<double>(type: "float", nullable: true),
                    coordinates_Altitude = table.Column<double>(type: "float", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Warehouses", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Deliveries");

            migrationBuilder.DropTable(
                name: "Warehouses");
        }
    }
}
