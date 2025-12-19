import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", 
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async () => {
  const response = await api.get("/products/products");
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/category/categories");
  return response.data;
};

export const addCategory = async (payload) => {
  const response = await api.post("/category/categories", payload);
  return response.data;
};

export const addProduct = async (payload) => {
  const response = await api.post("/products/products", payload);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get("/orders/orders");
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/users/users");
  return response.data;
};

export const getTopProducts = async () => {
  const response = await api.get("/orders/orders/items/topProducts");
  return response.data;
};

export const getCategorySales = async () => {
  const response = await api.get("/orders/orders/items/categorySales");
  return response.data;
};