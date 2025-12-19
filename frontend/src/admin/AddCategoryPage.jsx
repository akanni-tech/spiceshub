import { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { supabase } from '../authResource/supabaseClient';
import {v4 as uuidv4} from 'uuid';
import { toast } from 'sonner';
import { addCategory } from './hooks/adminServices';

export default function AddCategoryPage({ categoryId, onNavigate, onBack, onSave }) {
  const isEditMode = !!categoryId;
  const [showInMenu, setShowInMenu] = useState(true);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [categoryImages, setCategoryImages] = useState([]);
  const [category, setCategory] = useState({
    name: '',
    image: '',
    description: '',
    status: 'active',
    isFeatured: false,
  })

  const handleSaveCategory = async () => {
    if (!category.name) return alert('Enter a category name');
    const payload = {
      ...category,
      image : categoryImages.length > 0 ? categoryImages[0] : null,
    }

    response = await addCategory(payload)
    
    if (response) {
      toast.success("Category created")
    }

    // console.log(payload)
    // toast.success(isEditMode ? 'Category updated!' : 'Category created!');
  };

  const handleChange = (e) => {
    const {id, value, type, checked} = e.target;

    setCategory((p) => ({ 
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
          setCategoryImages([...categoryImages, publicUrlData.publicUrl])
        }
      }

      
    }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hover:bg-gray-100 rounded">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[#2C2C2C]">{isEditMode ? 'Edit Category' : 'Back to Categories'}</h1>
          </div>
        </div>

        <div className="flex gap-3">
          {/* <button onClick={handleSaveDraft} className="px-4 py-2 border-gray-200 border rounded">
            Save as Draft
          </button> */}
          
        </div>
      </div>

      <div>
        <h1 className="text-[#333333] text-2xl font-semibold">{isEditMode ? 'Edit Category' : 'Categories'}</h1>
        <p className="text-[#717182] mt-1">
          {isEditMode ? 'Update category information' : 'view categories'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border-gray-200 border rounded">
            <div className='border-b border-[#F0F0F0] p-6'>
              <h2 className="text-lg font-semibold text-[#2C2C2C]">Basic Information</h2>
            </div>

            <div className='p-6 space-y-4'>
              <div>
                <label className="block mb-1">Category Name <span className='text-red-500'>*</span></label>
                <input
                  className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
                  placeholder="e.g., Furniture"
                  id = 'name'
                  value={category.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
                  rows="5"
                  id = 'description'
                  value={category.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="border-gray-200 border rounded">
            <div className='border-b border-[#F0F0F0] p-6'>
              <h2 className="text-lg font-semibold text-[#2C2C2C]">Category Image</h2>
            </div>
            <div className='p-6 space-y-4'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {categoryImages.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg bg-[#F0F0F0] overflow-hidden group">
                    <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setCategoryImages(categoryImages.filter((_, i) => i !== index))}
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
            </div>
          </div>

          {/* <div className="border-gray-200 border rounded p-5 space-y-4">
            <h2 className="text-lg font-semibold text-[#2C2C2C]">SEO Settings</h2>

            <div>
              <label className="block mb-1">Meta Title</label>
              <input
                className="w-full border-gray-200 border p-2 rounded"
                maxLength={60}
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
              <p className="text-xs text-gray-500">{metaTitle.length}/60</p>
            </div>

            <div>
              <label className="block mb-1">Meta Description</label>
              <textarea
                className="w-full border-gray-200 border p-2 rounded"
                rows="3"
                maxLength={160}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
              <p className="text-xs text-gray-500">{metaDescription.length}/160</p>
            </div>
          </div> */}
        </div>

        <div className="space-y-6">
          <div className="border-gray-200 border rounded">
            <div className='border-b border-[#F0F0F0] p-6'>
              <h2 className="text-lg font-semibold text-[#2C2C2C]">Status</h2>
            </div>

            <div className='p-4 space-y-2'>
              <select
                className="w-full border-gray-200 border p-2 rounded"
                id='status'
                value={category.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="border-gray-200 border rounded">
            <div className='border-b border-[#F0F0F0] p-6'>
              <h2 className="text-lg font-semibold text-[#2C2C2C]">Display Options</h2>
            </div>

            {/* <div className="flex justify-between items-center border-gray-200 border p-3 rounded">
              <div>
                <p className="text-sm">Show in Menu</p>
              </div>
              <input type="checkbox" checked={showInMenu} onChange={(e) => setShowInMenu(e.target.checked)} />
            </div> */}

            <div className='p-4 space-y-2'>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#FFE6A7]/10">
                <div>
                  <p className="text-sm text-[#333333]">Featured Category</p>
                  <p className="text-xs text-[#717182]">Show on category page</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input id="isFeatured" type="checkbox" className="sr-only peer" checked={category.isFeatured} onChange={handleChange} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#99582A]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#99582A]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* <div className="border-gray-200 border p-5 rounded">
            <h2 className="text-lg font-semibold text-[#2C2C2C]">URL Preview</h2>
            <div className="p-3 bg-gray-100 rounded mt-2">
              <p className="text-sm text-[#99582A]">{categoryName || 'Category Name'}</p>
              <p className="text-xs text-gray-500">yourstore.com/category/{slug || 'category-url'}</p>
            </div>
          </div> */}

          <button onClick={handleSaveCategory} className="px-4 w-full py-2 bg-[#99582A] text-white rounded">
            {isEditMode ? 'Update Category' : 'Create Category'}
          </button>
        </div>
      </div>
    </div>
  );
}