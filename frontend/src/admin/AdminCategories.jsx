import { useState } from 'react';
import { Plus, Search, Edit, Trash2, MoreVertical, MoreHorizontal } from 'lucide-react';
import AddCategoryPage from './AddCategoryPage';
import { useAdminData } from './hooks/useAdminData';
import EditCategoryPage from './EditCategoryPage';

export function AdminCategories({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');

  const [openMenu, setOpenMenu] = useState(null);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null)

  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  // const categories = [
  //   {
  //     id: 'CAT-001',
  //     name: 'Furniture',
  //     slug: 'furniture',
  //     products: 45,
  //     status: 'Active',
  //     image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop'
  //   },
  // ];

  const {categories} = useAdminData();

  if (showAddCategory) {
    return (
      <AddCategoryPage
        onBack={() => setShowAddCategory(false)}
        onSave={(category) => {
          console.log("Category saved:", category);
          setShowAddCategory(false);
        }}
      />
    );
  }

  if (showEditCategory) {
    return (
      <EditCategoryPage
        onBack={() => setShowEditCategory(false)}
        categorySelect = {selectedCategory}
      />
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="mb-2 text-[#2C2C2C] text-2xl font-semibold">Categories</h1>
          <p className="text-gray-500">Manage your product categories</p>
        </div>

        <button
          className="flex items-center px-4 py-2 bg-[#99582A] text-white rounded hover:bg-[#99582A]/90"
          onClick={() => setShowAddCategory(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-[#2C2C2C]/80 mb-1">Total Categories</p>
          <p className="text-2xl text-[#2C2C2C]">{categories.length}</p>
        </div>
        {/* <div className="p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Active</p>
          <p className="text-2xl text-green-600">{categories.filter(c => c.status === 'Active').length}</p>
        </div>
        <div className="p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Draft</p>
          <p className="text-2xl text-gray-600">{categories.filter(c => c.status === 'Draft').length}</p>
        </div>
        <div className="p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total Products</p>
          <p className="text-2xl text-[#2C2C2C]">{categories.reduce((sum, c) => sum + c.products, 0)}</p>
        </div> */}
      </div>

      {/* Categories Table */}
      <div className="border border-[#F0F0F0] rounded-lg bg-white">
        <div className="border-b border-[#F0F0F0] p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-[#333333] text-lg font-semibold">All Categories</h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717182]" />
                <input
                  type="text"
                  placeholder="Search category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="bg-[#FFE6A7]/20 hover:bg-[#FFE6A7]/20">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                {/* <th className="p-3 text-left">Slug</th> */}
                <th className="p-3 text-left">Products</th>
                {/* <th className="p-3 text-left">Status</th> */}
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                    </div>
                  </td>

                  <td className="p-3">
                    <p className="text-[#2C2C2C] font-medium">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.id}</p>
                  </td>

                  {/* <td className="p-3">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">/{category.slug}</code>
                  </td> */}

                  <td className="p-3 text-[#2C2C2C]">{category.products.length}</td>

                  {/* <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        category.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.status}
                    </span>
                  </td> */}

                  {/* ✅ Actions Dropdown Added */}
                  <td className="p-3 text-right relative">
                    <button
                      className="p-2 hover:bg-gray-100 rounded"
                      onClick={() => toggleMenu(category.id)}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {openMenu === category.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-400 rounded shadow-lg z-10">
                        {/* <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => onNavigate('single-category', { categoryId: category.slug })}
                        >
                          View Products
                        </button> */}

                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                          onClick={() => {
                            setShowEditCategory(true)
                            setSelectedCategory(category)
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </button>

                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                  {/* END ACTIONS */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="bg-[#FFE6A7] rounded-lg p-4">
        <p className="text-sm text-[#2C2C2C]">
          💡 <strong>Tip:</strong> Well-organized categories help customers find products easily and improve your store's navigation.
        </p>
      </div>
    </div>
  );
}
