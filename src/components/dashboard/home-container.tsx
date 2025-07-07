"use client";
import { useEffect, useState } from "react";
import Loader from "../loader";
import { useGetHomeDataQuery } from "@/api/services/homeApi";

interface IHomeData {
  message: string;
  month: string;
  purchases_per_month: number;
  total_products: number;
  total_stock?: string;
}

export default function HomeContainer() {
  const getHomeViewData = useGetHomeDataQuery();

  const homeData = getHomeViewData.currentData

  if (homeData) {
    const {
      month: currentMonth,
      purchasesPerMonth: sales,
      totalProducts: totalProducts,
      totalStock: stock,
    } = homeData;

    return (
      <div className="home-card-grid">
        <div className="home-card products">
          <h4>Productos en venta</h4>
          <span>{totalProducts} productos</span>
        </div>
        <div className="home-card purchases">
          <h4>Ventas realizadas este mes</h4>
          <div className="home-card-row">
            <span>{sales}</span>
            <span>{currentMonth}</span>
          </div>
        </div>
        <div className="home-card stock">
          <h4>Stock total</h4>
          <span>{stock} productos</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loader />
    </div>
  );
}
