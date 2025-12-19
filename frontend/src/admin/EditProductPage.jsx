import { useEffect, useState } from "react";
import { ArrowLeft, Upload, X, Plus, PlusIcon, ChevronDown } from "lucide-react";
import { useAdminData } from "./hooks/useAdminData";
import { supabase } from "../authResource/supabaseClient";
import {v4 as uuidv4} from 'uuid';
import { toast } from "sonner";
import { getSingleProduct } from "../hooks/services";


const cn = (...classes) => classes.filter(Boolean).join(' ');

const NativeSelect = ({children, className, ...props }) => (
  <div className="relative w-full">
    <select 
      {...props}
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

export function EditProductPage({productId ,onBack, onSave }) {
  const [productEdit, setProductEdit] = useState()
  console.log(productId)
  const [productImages, setProductImages] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    cost_per_item: "",
    stock: "",
    status: "",
    isFeatured: false,
    isSale: false,
    category_id: "",
  });

  useEffect(() => {
    async function loadProduct() {
      const data = await getSingleProduct({ params: { productId } })
      setProductEdit(data)
      
      setProduct({
        name: data.name || "",
        description: data.description || "",
        price: data.price || "",
        originalPrice: data.originalPrice || "",
        cost_per_item: data.cost_per_item || "",
        stock: data.stock || "",
        status: data.status || "active",
        isFeatured: data.isFeatured || false,
        isSale: data.isSale || false,
        category_id: data.category_id || "",
        containers: data.containers || "",
      });

      setProductImages(data.images)
        
    }
    loadProduct();
  }, [])

  const [packagings, setPackagings] = useState(["glass", "plastic", "paper"]);
  const [newPackaging, setNewPackaging] = useState("");

  const { categories } = useAdminData();





  const handleAddPackaging = () => {
    if (newPackaging.trim() && !packagings.includes(newPackaging.trim())) {
      setPackagings([...packagings, newPackaging.trim()]);
      setNewPackaging('');
    }
  }


  const handleRemovePackaging = (packaging) => {
    setPackagings(packagings.filter((c) => c !== packaging));
  };

  const handleSave = () => {
    // Collect form data and pass to parent
    const payload = {
      ...product,
      colors,
      sizes,
      main_image : productImages.length > 0 ? productImages[0] : null,
    }

    console.log(payload)
  };

  const handleChange = (e) => {
    const {id, value, type, checked} = e.target;

    setProduct((p) => ({ 
      ...p, 
      [id]: type == 'checkbox' ? checked: value }));
  };


  async function uploadImage(e) {
    let file = e.target.files[0];

    const {data, error} = await supabase.storage.from('Ecommerce').upload(uuidv4(), file);

    if (error) {
      toast.error('Upload failed:', error.message);
      return; 
    }

    if (data) {
      const {data: publicUrlData} = await supabase.storage.from('Ecommerce').getPublicUrl(data.path);

      if (publicUrlData) {
        setProductImages([...productImages, publicUrlData.publicUrl])
      }
    }
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="px-3 py-2 text-sm hover:bg-[#FFE6A7]/30 rounded-md flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
      </div>

      <div>
        <h1 className="text-[#333333] text-2xl font-semibold">Edit Product</h1>
        <p className="text-[#717182] mt-1">
          Edit an existing product listing in your store
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="border border-[#F0F0F0] rounded-lg bg-white">
            <div className="border-b border-[#F0F0F0] p-6">
              <h3 className="text-[#333333] font-semibold">Basic Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-[#333333]">Product Name</label>
                <input
                  id="name"
                  value={product.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-[#333333]">Description</label>
                <textarea
                  id="description"
                  value={product.description}
                  onChange={handleChange}
                  placeholder="Describe your product..."
                  className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white min-h-32"
                />
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="border border-[#F0F0F0] rounded-lg bg-white">
            <div className="border-b border-[#F0F0F0] p-6">
              <h3 className="text-[#333333] font-semibold">Product Images</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {productImages.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg bg-[#F0F0F0] overflow-hidden group">
                      <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setProductImages(productImages.filter((_, i) => i !== index))}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <input 
                    type="file" 
                    className="hidden" 
                    id="file-upload" 
                    onChange={uploadImage} 
                  />
                  <label
                    htmlFor="file-upload"
                    className="aspect-square rounded-lg border-2 border-dashed border-[#99582A] bg-[#FFE6A7]/20 hover:bg-[#FFE6A7]/40 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-[#99582A]" />
                    <span className="text-sm text-[#99582A]">Upload</span>
                  </label>
                  
                </div>
                <p className="text-sm text-[#717182]">
                  Upload up to 8 images. Recommended size: 800x800px (JPG, PNG)
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="border border-[#F0F0F0] rounded-lg bg-white">
            <div className="border-b border-[#F0F0F0] p-6">
              <h3 className="text-[#333333] font-semibold">Pricing & Inventory</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="price" className="block text-sm font-medium text-[#333333]">Price</label>
                  <input
                    id="price"
                    value={product.price}
                    onChange={handleChange}
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="originalPrice" className="block text-sm font-medium text-[#333333]">Compare at Price</label>
                  <input
                    id="originalPrice"
                    value={product.originalPrice}
                    onChange={handleChange}
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="cost_per_item" className="block text-sm font-medium text-[#333333]">Cost per Item</label>
                  <input
                    id="cost_per_item"
                    value={product.cost_per_item}
                    onChange={handleChange}
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
                  />
                </div>
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="sku" className="block text-sm font-medium text-[#333333]">SKU</label>
                  <input
                    id="sku"
                    placeholder="SKU-12345"
                    className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="barcode" className="block text-sm font-medium text-[#333333]">Barcode</label>
                  <input
                    id="barcode"
                    placeholder="123456789012"
                    className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
                  />
                </div>
              </div> */}

              <div className="space-y-2">
                <label htmlFor="stock" className="block text-sm font-medium text-[#333333]">Stock</label>
                <input
                  id="stock"
                  value={product.stock}
                  onChange={handleChange}
                  type="number"
                  placeholder="0"
                  defaultValue="0"
                  className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="border border-[#F0F0F0] rounded-lg bg-white">
            <div className="border-b border-[#F0F0F0] p-6">
              <h3 className="text-[#333333] font-semibold">Status</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-medium text-[#333333]">Product Status</label>
                <NativeSelect
                  id="status"
                  value={product.status}
                  onChange={handleChange}
                  className="w-full"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </NativeSelect>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#FFE6A7]/10">
                <div>
                  <p className="text-sm text-[#333333]">Featured Product</p>
                  <p className="text-xs text-[#717182]">Show on homepage</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input id="isFeatured" type="checkbox" className="sr-only peer" checked={product.isFeatured} onChange={handleChange} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#99582A]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#99582A]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#FFE6A7]/10">
                <div>
                  <p className="text-sm text-[#333333]">Sale</p>
                  <p className="text-xs text-[#717182]">Product on discounted Sale</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input id='isSale' type="checkbox" className="sr-only peer" checked={product.isSale} onChange={handleChange} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#99582A]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#99582A]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="border border-[#F0F0F0] rounded-lg bg-white">
            <div className="border-b border-[#F0F0F0] p-6">
              <h3 className="text-[#333333] font-semibold">Category</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-4 flex-col">
                {categories && (
                   <NativeSelect
                    id="category_id"
                    value = {product.category_id}
                    onChange={handleChange}
                    className="w-full"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                    {/* <option value="outerwear">Outerwear</option>
                    <option value="footwear">Footwear</option>
                    <option value="knitwear">Knitwear</option>
                    <option value="accessories">Accessories</option>
                    <option value="bottoms">Bottoms</option>
                    <option value="basics">Basics</option> */}
                  </NativeSelect>
                )}
                {/* <button
                  onClick={handleAddTag}
                  className="px-4 flex justify-center gap-2 py-2 bg-[#99582A] hover:bg-[#7d4622] text-white rounded-md"
                >
                  <PlusIcon />
                  Create new Category
                </button> */}
              </div>
            </div>
          </div>


          <div className="border border-[#F0F0F0] rounded-lg bg-white">
            <div className="border-b border-[#F0F0F0] p-6">
              <h3 className="text-[#333333] font-semibold">Packaging Options</h3>
            </div>
            {/* packaging  */}
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                {packagings.map((packaging) => (
                  <span
                    key={packaging}
                    className="inline-flex items-center px-2 py-1 rounded bg-[#FFE6A7] text-[#99582A] text-sm"
                  >
                    {packaging}
                    <button
                      onClick={() => handleRemovePackaging(packaging)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  placeholder="Add option..."
                  value={newPackaging}
                  onChange={(e) => setNewPackaging(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddPackaging()}
                  className="flex-1 px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
                />
                <button
                  onClick={handleAddPackaging}
                  className="px-4 py-2 bg-[#99582A] hover:bg-[#7d4622] text-white rounded-md"
                >
                  Add Option
                </button>
              </div>
            </div>
          </div>


          {/* SEO */}
          {/* <div className="border border-[#F0F0F0] rounded-lg bg-white">
            <div className="border-b border-[#F0F0F0] p-6">
              <h3 className="text-[#333333] font-semibold">SEO</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="metaTitle" className="block text-sm font-medium text-[#333333]">Meta Title</label>
                <input
                  id="metaTitle"
                  placeholder="Product meta title"
                  className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="metaDescription" className="block text-sm font-medium text-[#333333]">Meta Description</label>
                <textarea
                  id="metaDescription"
                  placeholder="Product meta description"
                  className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white min-h-20"
                />
              </div>
            </div>
          </div> */}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleSave}
              className="w-full bg-[#99582A] hover:bg-[#7d4622] text-white px-4 py-2 rounded-md"
            >
              Save Product
            </button>
            <button
              onClick={onBack}
              className="w-full border border-[#F0F0F0] hover:border-[#99582A] px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}