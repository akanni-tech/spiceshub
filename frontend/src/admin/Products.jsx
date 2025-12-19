import { useState, useEffect, useMemo } from "react";
import { Search, Plus, MoreVertical, ChevronDown, Pencil } from "lucide-react";
import { getProducts } from "../hooks/services";
import { AddProductPage } from "./AddProductPage";
import { EditProductDialog } from "./components/EditProductDialog";
import { DashboardProductCardSkeleton } from "./components/DashboardProductCardSkeleton";
import { EditProductPage } from "./EditProductPage";

const cn = (...classes) => classes.filter(Boolean).join(' ');

const statusConfig = {
  active: { label: "Active", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  "low-stock": { label: "Low Stock", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
  "out-of-stock": { label: "Out of Stock", className: "bg-red-100 text-red-700 hover:bg-red-100" },
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
};

const NativeSelect = ({ value, onChange, children, className }) => (
  <div className="relative w-full">
    <select 
      value={value} 
      onChange={onChange}
      className={cn(
        "appearance-none block w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#DDA15E] focus:border-[#DDA15E] pr-8",
        className
      )}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
);

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      const transformedData = data.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category?.name || "Uncategorized",
        price: `ksh ${(product.price).toFixed(2)}`,
        stock: product.stock,
        status: product.status,
        sales: 50, //change to remove data from orders
        image: product.main_image,
      }));
      setProducts(transformedData);
      setLoading(false);
    }
    loadProducts();
  }, []);

  // Derived filtered + searched list
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  // Categories from product list (unique)
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ["all", ...unique];
  }, [products]);

  if (showAddProduct) {
    return (
      <AddProductPage
        onBack={() => setShowAddProduct(false)}
        onSave={(product) => {
          console.log("Product saved:", product);
          setShowAddProduct(false);
        }}
      />
    );
  }

  if (showEditProduct) {
    return (
      <EditProductPage
        onBack={() => setShowEditProduct(false)}
        open={showEditProduct}
        onOpenChange={setShowEditProduct}
        productId={selectedProduct.id}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[#333333] text-2xl font-semibold">Products</h1>
          <p className="text-[#717182] mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setShowAddProduct(true)}
          className="bg-[#99582A] hover:bg-[#7d4622] text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-[#F0F0F0] rounded-lg bg-white p-4">
          <p className="text-sm text-[#717182]">Total Products</p>
          <h3 className="mt-1 text-[#333333] text-xl font-semibold">
            {products.length}
          </h3>
        </div>
        <div className="border border-[#F0F0F0] rounded-lg bg-white p-4">
          <p className="text-sm text-[#717182]">Active</p>
          <h3 className="mt-1 text-[#333333] text-xl font-semibold">
            {products.filter((p) => p.status === "active").length}
          </h3>
        </div>
        <div className="border border-[#F0F0F0] rounded-lg bg-white p-4">
          <p className="text-sm text-[#717182]">Low Stock</p>
          <h3 className="mt-1 text-[#333333] text-xl font-semibold">
            {products.filter((p) => p.stock < 20).length}
          </h3>
        </div>
        <div className="border border-[#F0F0F0] rounded-lg bg-white p-4">
          <p className="text-sm text-[#717182]">Out of Stock</p>
          <h3 className="mt-1 text-[#333333] text-xl font-semibold">
            {products.filter((p) => p.stock === 0).length}
          </h3>
        </div>
      </div>

      {/* Filters */}
      <div className="border border-[#F0F0F0] rounded-lg bg-white p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717182]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md"
          >
            <option value="all">All Status</option>
            {Object.keys(statusConfig).map((key) => (
              <option key={key} value={key}>
                {statusConfig[key].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <DashboardProductCardSkeleton key={i} />
            ))
          : filteredProducts.map((product) => (
              <div
                key={product.id}
                
                className="border border-[#F0F0F0] rounded-lg bg-white hover:border-[#99582A]/30 transition-colors group"
              >
                <div className="p-0">
                  <div className="relative aspect-square bg-[#FFE6A7]/20 rounded-t-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="h-8 w-8 p-0 bg-white hover:bg-white shadow-md rounded flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowEditProduct(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-[#333333] line-clamp-1">
                          {product.name}
                        </h4>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusConfig[product.status].className}`}
                        >
                          {statusConfig[product.status].label}
                        </span>
                      </div>
                      <p className="text-sm text-[#717182]">{product.category}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F0F0F0]">
                      <div>
                        <p className="text-[#333333]">{product.price}</p>
                        <p className="text-xs text-[#717182]">
                          {product.sales} sales
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#717182]">Stock</p>
                        <p className="text-[#333333]">{product.stock}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>

      
    </div>
  );
}
