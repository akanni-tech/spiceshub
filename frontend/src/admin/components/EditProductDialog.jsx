import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

export function EditProductDialog({ open, onOpenChange, product }) {
  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    price: product.price.replace("$", ""),
    stock: product.stock.toString(),
    status: product.status,
    description: "High-quality product with excellent craftsmanship and attention to detail.",
  });

  const handleSave = () => {
    toast.success("Product updated successfully!", {
      description: `${formData.name} has been updated.`,
    });
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[#333333] text-xl font-semibold">Edit Product</h2>
              <p className="text-sm text-[#717182] mt-1">
                Update product information and inventory details
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-[#F0F0F0] rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-[#717182]" />
            </button>
          </div>

          <div className="space-y-4 py-4">
            {/* Product Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-[#333333]">Product Name</label>
              <input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-[#333333]">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white transition-colors resize-none"
              />
            </div>

            {/* Category and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium text-[#333333]">Category</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white transition-colors"
                >
                  <option value="Outerwear">Outerwear</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Knitwear">Knitwear</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Basics">Basics</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium text-[#333333]">Price ($)</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Stock and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="stock" className="text-sm font-medium text-[#333333]">Stock Quantity</label>
                <input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium text-[#333333]">Status</label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* SKU and Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="sku" className="text-sm font-medium text-[#333333]">SKU</label>
                <input
                  id="sku"
                  placeholder="PRD-12345"
                  defaultValue={`PRD-${product.id.toString().padStart(5, "0")}`}
                  className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="weight" className="text-sm font-medium text-[#333333]">Weight (kg)</label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="0.5"
                  defaultValue="0.5"
                  className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-[#F0F0F0]">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 px-4 py-2 border border-[#F0F0F0] hover:bg-[#F0F0F0] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-[#99582A] hover:bg-[#7d4622] text-white rounded-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}