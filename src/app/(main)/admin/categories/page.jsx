// app/(main)/categories/page.jsx
"use client";
import { useState, useMemo, useEffect } from "react";
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
  FolderTree,
  Loader2
} from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`bg-white rounded-xl border border-gray-200 w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

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
    sort_order: "",
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
            sort_order: formData.sort_order,
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
          sort_order: "",
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
            sort_order: formData.sort_order,
            name: formData.name,
            image: formData.imagePreview || null,
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
      sort_order: category.sort_order,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product categories</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all"
          >
            <Plus size={16} />
            Create New
          </button>

          {/* <button
            onClick={handleExportCSV}
            className="bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors border border-gray-200 hover:border-purple-300"
          >
            <Download size={16} />
            Export CSV
          </button> */}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FolderTree size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              <p className="text-xs text-gray-500">Total Categories</p>
            </div>
          </div>
        </div>

        {/* <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {categories.reduce((sum, cat) => sum + (cat.products || 0), 0)}
              </p>
              <p className="text-xs text-gray-500">Total Products</p>
            </div>
          </div>
        </div> */}

        {/* <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Grid size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {categories.reduce((sum, cat) => sum + (cat.sub || 0), 0)}
              </p>
              <p className="text-xs text-gray-500">Sub Categories</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing <span className="text-gray-900">{filteredCategories.length > 0 ? startIndex + 1 : 0}</span> to{" "}
          <span className="text-gray-900">{Math.min(endIndex, filteredCategories.length)}</span> of{" "}
          <span className="text-gray-900">{filteredCategories.length}</span> categories
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentCategories.length > 0 ? (
                currentCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{category.id}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ImageIcon size={20} className="text-gray-400" />
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{category.sort_order || 0}</span>
                    </td>

                    {/* <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{category.status || "—"}</span>
                    </td> */}

                    <td className="px-6 py-4">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Category"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <FolderTree size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No categories found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search or create a new category</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredCategories.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${currentPage === page
                  ? "bg-purple-600 text-white"
                  : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
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
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value.toUpperCase(),
                })
              }
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter category name"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Position
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sort_order: e.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter position"
              min="1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Category Image <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
              {formData.imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imagePreview: null })}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <ImageIcon size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload image</p>
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
            onClick={handleAddCategory}
            disabled={!formData.name.trim() || !formData.imagePreview}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Category
          </button>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Category">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value.toUpperCase(),
                })
              }
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter category name"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Position
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sort_order: e.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter position"
              min="1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Category Image <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
              {formData.imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imagePreview: null })}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <ImageIcon size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload new image</p>
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
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </Modal>
    </div>
  );
}