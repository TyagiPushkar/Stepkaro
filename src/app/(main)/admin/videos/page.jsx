"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Plus,
    Edit,
    Trash2,
    X,
    CheckCircle,
    XCircle,
    PlayCircle,
    Link as LinkIcon,
} from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
    if (!isOpen) return null;
    const sizes = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                className={`bg-white rounded-xl border border-gray-200 w-full ${sizes[size]} max-h-[90vh] overflow-y-auto shadow-2xl`}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

export default function VideosPage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedVideo, setSelectedVideo] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        video_link: "",
        sort_order: "",
    });

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return "";

        // Regex handles watch, shorts, embed, and youtu.be URLs
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);

        return (match && match[2].length === 11)
            ? `https://www.youtube.com/embed/${match[2]}`
            : url;
    };
    const fetchVideos = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get(
                "https://namami-infotech.com/Stepkaro/src/videos/get_add_promotion_video.php",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.data.success) {
                setVideos(response.data.data || []);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleAddVideo = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.video_link) {
            alert("Title and video link are required.");
            return;
        }
        try {
            const token = localStorage.getItem("access_token");
            const payload = {
                title: formData.title,
                video_link: formData.video_link,
                sort_order: formData.sort_order || 0,
            };
            const response = await axios.post(
                "https://namami-infotech.com/Stepkaro/src/videos/get_add_promotion_video.php",
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.data.success) {
                setShowAddModal(false);
                setFormData({ title: "", video_link: "", sort_order: "" });
                fetchVideos();
                showToast("Video added successfully");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log(error);
            showToast("Failed to add video", "error");
        }
    };

    const handleEditVideo = async (e) => {
        e.preventDefault();
        if (!formData.video_link) {
            alert("Video link is required.");
            return;
        }
        try {
            const token = localStorage.getItem("access_token");
            const payload = {
                id: selectedVideo.id,
                title: formData?.title || "Promotional Videos",
                video_link: formData.video_link,
                sort_order: formData.sort_order || 0,
            };
            // Sometimes APIs can be named update_video.php
            const response = await axios.post(
                "https://namami-infotech.com/Stepkaro/src/videos/edit_promotion_video.php",
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.data.success) {
                setShowEditModal(false);
                setSelectedVideo(null);
                fetchVideos();
                showToast("Video updated successfully");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log(error);
            showToast("Failed to update video", "error");
        }
    };

    const handleDeleteVideo = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.post(
                "https://namami-infotech.com/Stepkaro/src/videos/delete_promotion_video.php",
                { id: selectedVideo.id },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.data.success) {
                setShowDeleteModal(false);
                setSelectedVideo(null);
                fetchVideos();
                showToast("Video deleted successfully");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log(error);
            showToast("Failed to delete video", "error");
        }
    };

    const openEditModal = (video) => {
        setSelectedVideo(video);
        setFormData({
            title: video.title || "",
            video_link: video.video_link || "",
            sort_order: video.sort_order || "",
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (video) => {
        setSelectedVideo(video);
        setShowDeleteModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 flex h-[100%] w-[100%] flex-col mt-[40px]">
            {toast && (
                <div
                    className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg text-white ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
                        }`}
                >
                    {toast.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage YouTube videos and tutorials</p>
                </div>
                <button
                    onClick={() => {
                        setFormData({ title: "", video_link: "", sort_order: "" });
                        setShowAddModal(true);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all"
                >
                    <Plus size={16} />
                    Add Video
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                    <div
                        key={video.id}
                        className="bg-white border text-center border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-purple-300 transition-all duration-300"
                    >
                        {/* Embedded Youtube Player */}
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center relative">
                            {video.video_link ? (
                                <iframe
                                    className="w-full h-full"
                                    src={getYoutubeEmbedUrl(video.video_link)}
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <PlayCircle size={40} className="text-gray-300" />
                            )}
                        </div>

                        <div className="p-4 flex flex-col items-center">
                            <h3 className="font-semibold text-gray-900 border-b pb-2 w-[100%] mb-2 line-clamp-1">{video.title}</h3>
                            <div className="flex justify-between items-center text-sm text-gray-600 mb-4 w-full px-2">
                                <span className="flex items-center gap-1 border border-purple-200 shadow-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-lg">
                                    Order: <span className="font-semibold">{video.sort_order || 0}</span>
                                </span>
                                {/* <span className="flex items-center gap-1 font-mono text-gray-400 bg-gray-50 rounded-lg border px-3 py-1">
                                    #{video.id}
                                </span> */}
                            </div>

                            <div className="flex items-center gap-2 mt-2 pt-4 border-t border-gray-100 w-full">
                                <button
                                    onClick={() => openEditModal(video)}
                                    className="flex-1 bg-purple-50 text-purple-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit size={16} /> Edit
                                </button>
                                {/* <button
                                    onClick={() => openDeleteModal(video)}
                                    className="px-3 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={16} /> Delete
                                </button> */}
                            </div>
                        </div>
                    </div>
                ))}
                {videos.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <PlayCircle size={56} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium text-lg">No videos found</p>
                        <p className="text-sm text-gray-400 mt-2">Click Add Video to create your first tutorial or video link.</p>
                    </div>
                )}
            </div>

            {/* Add / Edit Modal */}
            <Modal
                isOpen={showAddModal || showEditModal}
                onClose={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                }}
                title={showEditModal ? "Edit Video" : "Add Video"}
            >
                <form onSubmit={showEditModal ? handleEditVideo : handleAddVideo} className="space-y-4">
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-inner"
                            placeholder="e.g. Platform Tutorial"
                        />
                    </div> */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            YouTube Link <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={formData.video_link}
                                onChange={(e) => setFormData({ ...formData, video_link: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-inner"
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                        </div>
                        {formData.video_link && (
                            <div className="mt-3 h-40 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden relative shadow-sm">
                                <iframe
                                    className="w-full h-full absolute inset-0"
                                    src={getYoutubeEmbedUrl(formData.video_link)}
                                    title="Preview"
                                    frameBorder="0"
                                ></iframe>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                        <input
                            type="number"
                            value={formData.sort_order}
                            onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-inner"
                            placeholder="0"
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t mt-6 border-gray-100">
                        <button
                            type="button"
                            onClick={() => {
                                setShowAddModal(false);
                                setShowEditModal(false);
                            }}
                            className="flex-1 bg-white text-gray-700 border border-gray-200 shadow-sm px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-md border border-transparent px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            {showEditModal ? "Update Video" : "Add Video"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete video?"
                size="sm"
            >
                <div className="text-center py-4 px-2">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
                        <Trash2 size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Delete "{selectedVideo?.title}"?</h3>
                    <p className="text-sm text-gray-500 mb-6 px-4">
                        This action cannot be undone. Are you totally sure you want to proceed?
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="flex-1 bg-white text-gray-700 border border-gray-200 shadow-sm px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteVideo}
                            className="flex-1 bg-red-600 text-white shadow-md px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
