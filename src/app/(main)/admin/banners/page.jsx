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
      status: banner.status
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
    const headers = ["ID", "Title", "Position", "Link", "Status",  "Created At"];
    const csvData = banners.map(banner => [
      banner.id,
      banner.name,
      banner.position,
      banner.link,
      banner.status,
    
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
        return "bg-purple-500/20 text-purple-400";
      case "SIDEBAR":
        return "bg-blue-500/20 text-blue-400";
      case "FOOTER":
        return "bg-green-500/20 text-green-400";
      case "POPUP":
        return "bg-orange-500/20 text-orange-400";
      case "MOBILE":
        return "bg-pink-500/20 text-pink-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    return status === "active" 
      ? "bg-green-500/20 text-green-400" 
      : "bg-red-500/20 text-red-400";
  };

  const activeBanners = banners.filter(b => b.status === "active").length;

  // Modal component
  const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
    if (!isOpen) return null;
    const sizes = {
      sm: "max-w-md",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl"
    };
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className={`bg-slate-800 rounded-xl border border-white/10 w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
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
          <h1 className="text-2xl font-bold text-white">Banners</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your homepage banners and promotions</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 lg:w-64">
            <Eye className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search banners..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add Banner
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

      
      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">
          Showing <span className="text-white">{filteredBanners.length > 0 ? startIndex + 1 : 0}</span> to{" "}
          <span className="text-white">{Math.min(endIndex, filteredBanners.length)}</span> of{" "}
          <span className="text-white">{filteredBanners.length}</span> banners
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

      {/* Banners Grid */}
      <div className="grid grid-cols-1 gap-4">
        {currentBanners.length > 0 ? (
          currentBanners.map((banner) => (
            <div
              key={banner.id}
              className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-teal-500/30 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-4">
                {/* Left side - Banner Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-sm text-gray-400 font-mono w-12">
                    #{banner.id}
                  </div>
                  
                  {/* Banner Preview */}
                  <div 
                    onClick={() => openPreviewModal(banner)}
                    className="cursor-pointer"
                  >
                    <div className="w-32 h-20 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-lg flex items-center justify-center text-3xl border border-white/10 hover:scale-105 transition-transform">
                      <img
  src={banner.image}
  alt={banner.name}
  className="w-full h-full object-cover rounded-lg"
/>
                    </div>
                  </div>
                  
                  {/* Banner Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-medium text-white">{banner.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPositionBadge(banner.position)}`}>
                        {banner.position}
                      </span>
                      <span
  className={`text-xs px-2 py-0.5 rounded-full ${
    Number(banner.status) === 1
      ? "bg-green-500/20 text-green-400"
      : "bg-red-500/20 text-red-400"
  }`}
>
  {Number(banner.status) === 1 ? "Active" : "Inactive"}
</span>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span className="text-gray-500">Link: {banner.link}</span>
                    
                     
                    </div>
                  </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-3">
                  <button 
                  onClick={() => toggleStatus(banner)}
                    className="relative w-10 h-5 bg-gray-700 rounded-full transition-colors"
                    title={Number(banner.status) === 1 ? "Active" : "Inactive"}
                  >
                    <div className={`absolute w-4 h-4 bg-teal-400 rounded-full top-0.5 transition-all duration-300 ${
                      Number(banner.status) === 1 ? "left-5" : "left-0.5"
                    }`} />
                  </button>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openPreviewModal(banner)}
                      className="p-1.5 text-gray-400 hover:text-teal-400 hover:bg-teal-500/20 rounded-lg transition-colors"
                      title="Preview Banner"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => openEditModal(banner)}
                      className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Edit Banner"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(banner)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
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
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
            <Layout size={48} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No banners found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or create a new banner</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredBanners.length > 0 && totalPages > 1 && (
        <div className="flex justify-center gap-2">
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

      {/* Add Banner Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Banner">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Banner Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter banner title"
              autoFocus
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-1">Position</label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-1">Link URL</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="/promotion-page"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-1">Banner Image</label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-teal-500/50 transition-colors">
              {formData.imagePreview ? (
                <div className="relative inline-block">
                 <div className="w-32 h-20 rounded-lg overflow-hidden">
  <img
    src={formData.imagePreview}
    alt="Banner"
    className="w-full h-full object-cover"
  />
</div>
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
            <p className="text-xs text-gray-500 mt-2">Tip: You can use an emoji as placeholder (like 🌞, 🆕, 🎉)</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <button
            onClick={handleAddBanner}
            className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
          >
            Create Banner
          </button>
        </div>
      </Modal>

      {/* Edit Banner Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Banner">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Banner Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-1">Position</label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-1">Link URL</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-1">Banner Image</label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-teal-500/50 transition-colors">
              {formData.imagePreview ? (
                <div className="relative inline-block">
                 <div className="w-32 h-20 rounded-lg overflow-hidden">
  <img
    src={formData.imagePreview}
    alt="Banner"
    className="w-full h-full object-cover"
  />
</div>
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
          
          <div>
            <label className="text-sm text-gray-400 block mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <button
            onClick={handleEditBanner}
            className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </Modal>

      {/* Delete Banner Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Banner">
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete <span className="text-white font-semibold">{selectedBanner?.title}</span>?
         
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
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
              <div className="w-full max-w-md bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-xl p-8 text-center border border-white/10">
               <img
  src={selectedBanner.image}
  alt={selectedBanner.name}
  className="w-full max-h-64 object-cover rounded-lg mb-4"
/>
                <h3 className="text-xl font-bold text-white">{selectedBanner.name}</h3>
                <p className="text-gray-400 mt-2">Position: {selectedBanner.position}</p>
                <p className="text-gray-400">Link: {selectedBanner.link}</p>
                <div className="mt-4 flex justify-center gap-4">
                 
                </div>
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-2">Banner Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Banner ID</p>
                  <p className="text-white">#{selectedBanner.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                 <span
  className={`text-xs px-2 py-0.5 rounded-full ${
    Number(selectedBanner.status) === 1
      ? "bg-green-500/20 text-green-400"
      : "bg-red-500/20 text-red-400"
  }`}
>
  {Number(selectedBanner.status) === 1 ? "Active" : "Inactive"}
</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created Date</p>
                  <p className="text-white">{selectedBanner.createdAt}</p>
                </div>
               
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}