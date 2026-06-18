"use client";
import { useState, useMemo, useEffect } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Image as ImageIcon,
  Layout,
  Eye,
  GripVertical,
  AlertCircle
} from "lucide-react";


 const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
    if (!isOpen) return null;
    const sizes = {
      sm: "max-w-md",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl"
    };
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className={`bg-white rounded-xl border border-gray-200 w-full ${sizes[size]} max-h-[90vh] overflow-y-auto shadow-2xl`}>
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


export default function BannersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: "",
    position: "HEADER",
    link: "",
    image: null,
    imagePreview: null,
    status: "active"
  });

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Position options
  const positions = ["HEADER", "SIDEBAR", "FOOTER", "POPUP", "MOBILE"];
  
  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/banner/get_banner.php",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        setBanners(result.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Filter banners
  const filteredBanners = useMemo(() => {
    let filtered = banners;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(banner => 
        banner.name.toLowerCase().includes(query) ||
        banner.position.toLowerCase().includes(query) ||
        banner.id.toString().includes(query)
      );
    }
    return filtered;
  }, [searchQuery, banners]);

  // Pagination
  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBanners = filteredBanners.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAddBanner = async () => {
    if (!formData.title.trim()) {
      alert("Banner name is required");
      return;
    }
    if (!formData.imagePreview) {
      alert("Banner image is required");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/banner/create_banner.php",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.title,
            image: formData.imagePreview,
            link: formData.link,
            status: formData.status === "active" ? 1 : 0,
            sort_order: 0,
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setShowAddModal(false);
        setFormData({
          title: "",
          position: "HEADER",
          link: "",
          image: null,
          imagePreview: null,
          status: "active",
        });
        fetchBanners();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditBanner = async () => {
    if (!formData.title.trim()) {
      alert("Banner name is required");
      return;
    }
    if (!formData.imagePreview) {
      alert("Banner image is required");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/banner/update_banner.php",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            banner_id: selectedBanner.id,
            name: formData.title,
            image: formData.imagePreview,
            link: formData.link,
            sort_order: 0,
            status: formData.status === "active" ? 1 : 0,
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setShowEditModal(false);
        setSelectedBanner(null);
        fetchBanners();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBanner = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/banner/delete_banner.php",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            banner_id: selectedBanner.id,
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setShowDeleteModal(false);
        setSelectedBanner(null);
        fetchBanners();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleStatus = async (banner) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/banner/update_banner_status.php",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            banner_id: banner.id,
            status: Number(banner.status) === 1 ? 0 : 1,
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        fetchBanners();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Open modals
  const openPreviewModal = (banner) => {
    setSelectedBanner(banner);
    setShowPreviewModal(true);
  };

  const openEditModal = (banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.name,
      position: banner.position,
      link: banner.link,
      image: null,
      imagePreview: banner.image,
      status: Number(banner.status) === 1 ? "active" : "inactive"
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (banner) => {
    setSelectedBanner(banner);
    setShowDeleteModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const token = localStorage.getItem("access_token");
      const uploadData = new FormData();
      uploadData.append("image", file);

      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/banner/upload_banner_image.php",
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
    const headers = ["ID", "Title", "Position", "Link", "Status", "Created At"];
    const csvData = banners.map(banner => [
      banner.id,
      banner.name,
      banner.position,
      banner.link,
      Number(banner.status) === 1 ? "Active" : "Inactive",
      banner.createdAt
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `banners_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get position badge color
  const getPositionBadge = (position) => {
    switch(position) {
      case "HEADER":
        return "bg-purple-100 text-purple-700";
      case "SIDEBAR":
        return "bg-blue-100 text-blue-700";
      case "FOOTER":
        return "bg-green-100 text-green-700";
      case "POPUP":
        return "bg-orange-100 text-orange-700";
      case "MOBILE":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Modal component
 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your homepage banners and promotions</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 lg:w-64">
            <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search banners..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all"
          >
            <Plus size={16} />
            Add Banner
          </button>
          
          <button 
            onClick={handleExportCSV}
            className="bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors border border-gray-200 hover:border-purple-300"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
          <p className="text-2xl font-bold text-gray-900">{banners.length}</p>
          <p className="text-xs text-gray-500">Total Banners</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
          <p className="text-2xl font-bold text-emerald-600">{banners.filter(b => Number(b.status) === 1).length}</p>
          <p className="text-xs text-gray-500">Active Banners</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
          <p className="text-2xl font-bold text-red-500">{banners.filter(b => Number(b.status) === 0).length}</p>
          <p className="text-xs text-gray-500">Inactive Banners</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
          <p className="text-2xl font-bold text-purple-600">{new Set(banners.map(b => b.position)).size}</p>
          <p className="text-xs text-gray-500">Positions Used</p>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing <span className="text-gray-900">{filteredBanners.length > 0 ? startIndex + 1 : 0}</span> to{" "}
          <span className="text-gray-900">{Math.min(endIndex, filteredBanners.length)}</span> of{" "}
          <span className="text-gray-900">{filteredBanners.length}</span> banners
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

      {/* Banners Grid */}
      <div className="grid grid-cols-1 gap-4">
        {currentBanners.length > 0 ? (
          currentBanners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-4">
                {/* Left side - Banner Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="text-sm text-gray-400 font-mono w-12 flex-shrink-0">
                    #{banner.id}
                  </div>
                  
                  {/* Banner Preview */}
                  <div 
                    onClick={() => openPreviewModal(banner)}
                    className="cursor-pointer flex-shrink-0"
                  >
                    <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 hover:scale-105 transition-transform overflow-hidden">
                      <img
                        src={banner.image}
                        alt={banner.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                  
                  {/* Banner Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-medium text-gray-900">{banner.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPositionBadge(banner.position)}`}>
                        {banner.position}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          Number(banner.status) === 1
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {Number(banner.status) === 1 ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span className="text-gray-500 truncate">Link: {banner.link || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button 
                    onClick={() => toggleStatus(banner)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      Number(banner.status) === 1 ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                    title={Number(banner.status) === 1 ? "Active" : "Inactive"}
                  >
                    <div className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all duration-300 shadow-sm ${
                      Number(banner.status) === 1 ? "left-5" : "left-0.5"
                    }`} />
                  </button>
                  
                  <div className="flex gap-1">
                    <button 
                      onClick={() => openPreviewModal(banner)}
                      className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Preview Banner"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => openEditModal(banner)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Banner"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(banner)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Banner"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Layout size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No banners found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or create a new banner</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredBanners.length > 0 && totalPages > 1 && (
        <div className="flex justify-center gap-2">
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
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                currentPage === page
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

      {/* Add Banner Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Banner">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Banner Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter banner title"
              autoFocus
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Position</label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Link URL</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="/promotion-page"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Banner Image <span className="text-red-500">*</span></label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
              {formData.imagePreview ? (
                <div className="relative inline-block">
                  <div className="w-32 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={formData.imagePreview}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, imagePreview: null})}
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
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <button
            onClick={handleAddBanner}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white rounded-lg transition-all"
          >
            Create Banner
          </button>
        </div>
      </Modal>

      {/* Edit Banner Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Banner">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Banner Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Position</label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Link URL</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Banner Image <span className="text-red-500">*</span></label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
              {formData.imagePreview ? (
                <div className="relative inline-block">
                  <div className="w-32 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={formData.imagePreview}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, imagePreview: null})}
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
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <button
            onClick={handleEditBanner}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white rounded-lg transition-all"
          >
            Save Changes
          </button>
        </div>
      </Modal>

      {/* Delete Banner Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Banner">
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <span className="text-gray-900 font-semibold">{selectedBanner?.name}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteBanner}
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* Preview Banner Modal */}
      <Modal isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)} title="Banner Preview" size="lg">
        {selectedBanner && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-full max-w-md bg-gradient-to-br from-purple-50 to-orange-50 rounded-xl p-8 text-center border border-gray-200">
                <img
                  src={selectedBanner.image}
                  alt={selectedBanner.name}
                  className="w-full max-h-64 object-cover rounded-lg mb-4 border border-gray-200"
                />
                <h3 className="text-xl font-bold text-gray-900">{selectedBanner.name}</h3>
                <p className="text-gray-500 mt-2">Position: {selectedBanner.position}</p>
                <p className="text-gray-500">Link: {selectedBanner.link || "—"}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Banner Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Banner ID</p>
                  <p className="text-gray-900">#{selectedBanner.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      Number(selectedBanner.status) === 1
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {Number(selectedBanner.status) === 1 ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Created Date</p>
                  <p className="text-gray-900">{selectedBanner.createdAt || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}