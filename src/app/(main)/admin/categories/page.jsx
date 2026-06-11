// app/(main)/categories/page.jsx
"use client";
import { useState, useMemo , useEffect} from "react";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Package,
  Grid,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Image as ImageIcon,
  FolderTree
} from "lucide-react";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
 
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    imagePreview: null
  });

  const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);

  // Filter categories
  const filteredCategories = useMemo(() => {
    let filtered = categories;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cat => 
        cat.name.toLowerCase().includes(query) ||
        cat.id.toString().includes(query)
      );
    }
    
    return filtered;
  }, [searchQuery, categories]);

const fetchCategories = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      "https://namami-infotech.com/Stepkaro/src/category/get_categories.php",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      setCategories(result.data || []);
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchCategories();
}, []);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
const handleAddCategory = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!formData.name.trim()) {
  alert("Category name is required");
  return;
}

if (!formData.imagePreview) {
  alert("Category image is required");
  return;
}

    const response = await fetch(
      "https://namami-infotech.com/Stepkaro/src/category/create_category.php",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          image: formData.imagePreview || null,
          status: 1,
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      setShowAddModal(false);

      setFormData({
        name: "",
        image: null,
        imagePreview: null,
      });

      fetchCategories();
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.log(error);
  }
};

 const handleEditCategory = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!formData.name.trim()) {
  alert("Category name is required");
  return;
}

if (!formData.imagePreview) {
  alert("Category image is required");
  return;
}

    const response = await fetch(
      "https://namami-infotech.com/Stepkaro/src/category/update_category.php",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_id: selectedCategory.id,
          name: formData.name,
          image: formData.imagePreview ||null,
          status: selectedCategory.status || 1,
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      setShowEditModal(false);
      setSelectedCategory(null);

      fetchCategories();
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.log(error);
  }
};

  

  // Open edit modal
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      image: null,
      imagePreview: category.image
    });
    setShowEditModal(true);
  };

 
const handleImageUpload = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  try {
    const token = localStorage.getItem("access_token");

    const uploadData = new FormData();

    uploadData.append("image", file);

    const response = await fetch(
      "https://namami-infotech.com/Stepkaro/src/category/upload_category_image.php",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      }
    );

    const result = await response.json();

    if (result.success) {
      setFormData({
        ...formData,
        imagePreview: result.image_url,
      });
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.log(error);
  }
};
  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Category Name", "Products", "Sub Categories", "Created At"];
    const csvData = categories.map(cat => [
      cat.id,
      cat.name,
      cat.products,
      cat.sub,
      cat.createdAt
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `categories_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Modal component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-slate-800 rounded-xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your product categories</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Create New
          </button>
          
          <button 
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-700 text-gray-300 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors border border-white/10"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 rounded-lg">
              <FolderTree size={20} className="text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{categories.length}</p>
              <p className="text-xs text-gray-400">Total Categories</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Package size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {categories.reduce((sum, cat) => sum + cat.products, 0)}
              </p>
              <p className="text-xs text-gray-400">Total Products</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Grid size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {categories.reduce((sum, cat) => sum + cat.sub, 0)}
              </p>
              <p className="text-xs text-gray-400">Sub Categories</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">
          Showing <span className="text-white">{filteredCategories.length > 0 ? startIndex + 1 : 0}</span> to{" "}
          <span className="text-white">{Math.min(endIndex, filteredCategories.length)}</span> of{" "}
          <span className="text-white">{filteredCategories.length}</span> categories
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Show:</span>
          <select 
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-sm text-gray-300"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Products</th>
                {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sub Categories</th> */}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentCategories.length > 0 ? (
                currentCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">{category.id}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-lg flex items-center justify-center text-xl border border-white/10">
                      {category.image ? (
  <img
    src={category.image}
    alt={category.name}
    className="w-10 h-10 rounded-lg object-cover"
  />
) : (
  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
    <ImageIcon size={18} className="text-gray-400" />
  </div>
)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-white">{category.name}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="text-sm text-white">{category.products}</span>
                    </td>
                    
                    {/* <td className="px-6 py-4">
                      <span className="text-sm text-white">{category.sub}</span>
                    </td> */}
                    
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">{category.created_at}</span>
                    </td>
                    
                    <td className="px-6 py-4">
  <button
    onClick={() => openEditModal(category)}
    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"
  >
    <Edit size={16} />
  </button>
</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <FolderTree size={48} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No categories found</p>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting your search or create a new category</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredCategories.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/10 flex justify-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-teal-500/20 text-teal-400"
                    : "bg-slate-800 hover:bg-slate-700 text-gray-400"
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Category">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter category name"
              autoFocus
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-1">Category Icon</label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-teal-500/50 transition-colors">
              {formData.imagePreview ? (
                <div className="relative inline-block">
                 <img
  src={formData.imagePreview}
  alt="Preview"
  className="w-16 h-16 rounded-lg object-cover"
/>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, imagePreview: null})}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <ImageIcon size={32} className="text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Click to upload image or use emoji</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Tip: You can paste an emoji (like 👕, 👟, 👗) as icon</p>
          </div>
          
          <button
            onClick={handleAddCategory}
             disabled={!formData.name.trim() || !formData.imagePreview}
            className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
          >
            Create Category
          </button>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Category">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-1">Category Icon</label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-teal-500/50 transition-colors">
              {formData.imagePreview ? (
                <div className="relative inline-block">
                  <img
  src={formData.imagePreview}
  alt="Preview"
  className="w-16 h-16 rounded-lg object-cover"
/>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, imagePreview: null})}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <ImageIcon size={32} className="text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Click to upload new image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          
          <button
            onClick={handleEditCategory}
            disabled={!formData.name.trim() || !formData.imagePreview}
            className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </Modal>

      
    </div>
  );
}