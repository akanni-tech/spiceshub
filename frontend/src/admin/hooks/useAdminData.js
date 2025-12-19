import { useState, useEffect } from "react";
import { getProducts, getCategories, getOrders, getUsers, getTopProducts, getCategorySales } from "../hooks/adminServices";

export const useAdminData = () => {
  const [data, setData] = useState({
    products: [],
    categories: [],
    orders: [],
    users: [],
    topProducts: [],
    categorySales: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all admin data in parallel
        const [productsRes, categoriesRes, ordersRes, usersRes, topProductsRes, categorySalesRes] = await Promise.all([
          getProducts(),
          getCategories(),
          getOrders(),
          getUsers(),
          getTopProducts(),
          getCategorySales()
        ]);

        // Set all at once to minimize re-renders
        setData({
          products: productsRes || [],
          categories: categoriesRes || [],
          orders: ordersRes || [],
          users: usersRes || [],
          topProducts: topProductsRes || [],
          categorySales: categorySalesRes || []
        });
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError(err.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { ...data, loading, error };
};
