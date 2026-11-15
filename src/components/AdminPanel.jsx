import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import BookingCalendar from './admin/BookingCalendar';
import {
  X, Lock, Shield, Trash2, Edit3, Plus, BedDouble, Calendar, CalendarDays,
  MessageSquare, ExternalLink, LogOut, Upload, Sparkles, Image as ImageIcon,
  Type, Sliders, CheckCircle, AlertCircle, RefreshCw, KeyRound, Eye, EyeOff,
  ChevronRight, ArrowUpRight, Search, Filter, Save, Layers, Compass, BookOpen,
  Users, Download, FileText, History, Send, Smartphone, CheckCheck, Check, Bell, Radio,
  UserPlus, UserCheck, UserX, ShieldCheck, ShieldAlert, DollarSign, CreditCard, TrendingUp, Crown
} from 'lucide-react';

const RETREAT_LIBRARY_PHOTOS = [
  { id: 'lib-1', url: '/images/mineral-springs/dawaipani-balcony-valley-vista.jpg', title: 'Balcony Valley Vista', category: 'Views' },
  { id: 'lib-2', url: '/images/mineral-springs/retreat-wooden-balcony-guitar.jpg', title: 'Balcony with Guitar', category: 'Property' },
  { id: 'lib-3', url: '/images/mineral-springs/retreat-main-cottage-facade.jpg', title: 'Main Cottage Facade', category: 'Property' },
  { id: 'lib-4', url: '/images/mineral-springs/room-double-sharing-balcony.jpg', title: 'Double Sharing Bedroom', category: 'Rooms' },
  { id: 'lib-5', url: '/images/mineral-springs/room-group-family-suite.jpg', title: 'Group Family Suite', category: 'Rooms' },
  { id: 'lib-6', url: '/images/mineral-springs/room-twin-balcony-view.jpg', title: 'Twin Balcony Room', category: 'Rooms' },
  { id: 'lib-7', url: '/images/mineral-springs/room-cozy-pine-bedroom.jpg', title: 'Pine Wood Bedroom', category: 'Rooms' },
  { id: 'lib-8', url: '/images/mineral-springs/room-reading-nook-corner.jpg', title: 'Reading Nook Corner', category: 'Rooms' },
  { id: 'lib-9', url: '/images/mineral-springs/room-misty-balcony-morning.jpg', title: 'Misty Balcony Morning', category: 'Views' },
  { id: 'lib-10', url: '/images/mineral-springs/retreat-covered-porch-lantern.jpg', title: 'Covered Porch with Lantern', category: 'Property' },
  { id: 'lib-11', url: '/images/mineral-springs/retreat-hillside-eco-cottage.jpg', title: 'Hillside Eco-Cottage', category: 'Property' },
  { id: 'lib-12', url: '/images/mineral-springs/retreat-cottages-mountain-slope.jpg', title: 'Terraced Cottages', category: 'Property' },
  { id: 'lib-13', url: '/images/mineral-springs/retreat-patio-deck-lounge.jpg', title: 'Patio Deck Lounge', category: 'Property' },
  { id: 'lib-14', url: '/images/mineral-springs/retreat-verandah-corridor-view.jpg', title: 'Verandah Corridor', category: 'Property' },
  { id: 'lib-15', url: '/images/mineral-springs/retreat-balcony-cushion-corner.jpg', title: 'Balcony Cushion Corner', category: 'Property' },
  { id: 'lib-16', url: '/images/mineral-springs/dawaipani-clouds-balcony.jpg', title: 'Clouds Rolling by Balcony', category: 'Views' },
  { id: 'lib-17', url: '/images/mineral-springs/kanchenjunga-valley-vista.jpg', title: 'Kanchenjunga Vista', category: 'Views' },
  { id: 'lib-18', url: '/images/mineral-springs/tea-garden-landscape.jpg', title: 'Tea Garden Slopes', category: 'Nature' },
  { id: 'lib-19', url: '/images/mineral-springs/village-trail-vista.jpg', title: 'Village Trail', category: 'Nature' },
  { id: 'lib-20', url: '/images/mineral-springs/dawaipani-balcony-sunset-clouds.jpg', title: 'Golden Sunset Clouds from Balcony', category: 'Views' },
  { id: 'lib-21', url: '/images/mineral-springs/mineral-springs-retreat-complex-facade.jpg', title: 'Main Eco-Retreat Complex Facade', category: 'Property' },
  { id: 'lib-22', url: '/images/mineral-springs/dawaipani-kanchenjunga-snow-peaks.jpg', title: 'Mt. Kanchenjunga Snow Peaks Panorama', category: 'Views' },
  { id: 'lib-23', url: '/images/mineral-springs/dawaipani-darjeeling-night-lights.jpg', title: 'Darjeeling Town Night Lights Over Cloud Sea', category: 'Views' },
  { id: 'lib-24', url: '/images/mineral-springs/mineral-springs-waterfall-stream.jpg', title: 'Mineral Springs Waterfall & River Rocks', category: 'Nature' },
  { id: 'lib-25', url: '/images/mineral-springs/guest-mindfulness-mountain-river.jpg', title: 'Guest Relaxation on Riverbed Boulders', category: 'Experiences' },
  { id: 'lib-26', url: '/images/mineral-springs/dawaipani-drone-canopy-aerial.jpg', title: '90° Top-Down Drone Canopy Aerial', category: 'Views' },
  { id: 'lib-27', url: '/images/mineral-springs/dawaipani-golden-tea-slopes-sunrise.jpg', title: 'Golden Sunrise Over Terraced Tea Slopes', category: 'Nature' },
  { id: 'lib-28', url: '/images/mineral-springs/darjeeling-unesco-steam-locomotive.jpg', title: 'UNESCO Heritage DHR Steam Toy Train', category: 'Culture' },
  { id: 'lib-29', url: '/images/mineral-springs/darjeeling-toy-train-tracks.jpg', title: 'Narrow-Gauge Mountain Rail Trail', category: 'Experiences' },
  { id: 'lib-30', url: '/images/mineral-springs/dawaipani-tibetan-prayer-flags.jpg', title: 'Tibetan Prayer Flags & Hillside Grounds', category: 'Culture' },
  { id: 'lib-31', url: '/images/mineral-springs/darjeeling-tea-macro-dewdrops.jpg', title: 'Macro Dewdrop Organic Tea Leaves', category: 'Nature' },
  { id: 'lib-32', url: '/images/mineral-springs/darjeeling-tea-gardens-panoramic.jpg', title: 'Panoramic Rolling Tea Terraces', category: 'Nature' },
  { id: 'lib-33', url: '/images/mineral-springs/darjeeling-tea-leaves-fresh-tip.jpg', title: 'Two Leaves and a Bud Green Tea Shoot', category: 'Nature' },
  { id: 'lib-34', url: '/images/mineral-springs/dawaipani-forest-trail-walk.jpg', title: 'Cardamom Forest Trail to Cottages', category: 'Property' },
  { id: 'lib-35', url: '/images/mineral-springs/retreat-wooden-verandah-balcony.jpg', title: 'Pine Timber Verandah & Blue Guitar', category: 'Property' },
  { id: 'lib-36', url: '/images/mineral-springs/retreat-cottage-hillside-canopy.jpg', title: 'Hillside Cottage in Pine Canopy', category: 'Property' },
  { id: 'lib-37', url: '/images/mineral-springs/mineral-springs-crystal-stream.jpg', title: 'Crystal Mountain Stream Water', category: 'Nature' },
  { id: 'lib-38', url: '/images/mineral-springs/mineral-springs-boulder-riverbed.jpg', title: 'Boulder Riverbed at Mineral Springs', category: 'Nature' },
  { id: 'lib-39', url: '/images/mineral-springs/host-founder-portrait.jpg', title: 'Retreat Founder - Himalayan Hospitality', category: 'Culture' },
  { id: 'lib-40', url: '/images/mineral-springs/host-co-founder-portrait.jpg', title: 'Retreat Co-Founder & Resident Hostess', category: 'Culture' },
  { id: 'lib-41', url: '/images/mineral-springs/host-hospitality-portrait.jpg', title: 'Warm Homestay Welcome Portrait', category: 'Culture' },
  { id: 'lib-42', url: '/images/mineral-springs/dawaipani-misty-valley-morning.jpg', title: 'Misty Morning Valley Drift from Balcony', category: 'Views' },
  { id: 'lib-43', url: '/videos/dawaipani-reel.mp4', title: 'Dawaipani Rolling Clouds & Valley (Desktop Hero Video)', category: 'Views', type: 'video' },
  { id: 'lib-44', url: '/images/mineral-springs/meditation-waterfall-river-rocks.webp', title: 'Mindful Meditation on Mountain River Rocks', category: 'Experiences' },
  { id: 'lib-45', url: '/images/mineral-springs/forest-railway-nature-walk.webp', title: 'Forest Railway & Nature Walk Stroll', category: 'Experiences' }
];

function ImageFieldWithPicker({
  label,
  value,
  onChange,
  onPick,
  onUploadDirect
}) {
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result;
      if (dataUrl && onUploadDirect) {
        onUploadDirect(dataUrl, file.name);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block">
          {label}
        </label>
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-[#FAF7F2] border border-[#D5C9B8] rounded-xl">
        {/* Thumbnail Preview */}
        <div className="w-20 h-16 rounded-lg bg-neutral-900 border border-[#D5C9B8] overflow-hidden shrink-0 shadow-xs relative">
          {value ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/images/mineral-springs/retreat-main-cottage-facade.jpg'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px] text-center px-1">
              No Image
            </div>
          )}
        </div>

        {/* Input & Action Buttons */}
        <div className="flex-1 w-full space-y-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/mineral-springs/..."
            className="w-full px-3 py-1.5 bg-white border border-[#D5C9B8] text-xs rounded-lg font-mono text-[#17251D]"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onPick}
              className="px-3 py-1.5 bg-[#17251D] text-[#B89A70] hover:bg-black rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Choose from Media Library</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white border border-[#D5C9B8] text-[#17251D] hover:bg-[#FAF7F2] rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-[#B89A70]" />
              <span>Upload New File</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MediaPickerModal({
  open,
  onClose,
  onSelect,
  title = 'Choose Photograph',
  mediaList = [],
  uploadMedia,
  showToast
}) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const uploadInputRef = useRef(null);

  if (!open) return null;

  const allPhotos = [
    ...(mediaList || []).map(m => ({
      id: m.id,
      url: m.url,
      title: m.title || m.filename,
      category: m.category || 'Uploaded'
    })),
    ...RETREAT_LIBRARY_PHOTOS.filter(rp => !(mediaList || []).some(m => m.url === rp.url))
  ];

  const categories = ['All', 'Uploaded', 'Rooms', 'Property', 'Views', 'Nature', 'General'];

  const filtered = allPhotos.filter(item => {
    const matchCat = activeCategory === 'All' || item.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = !search || item.title?.toLowerCase().includes(search.toLowerCase()) || item.url?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleUploadFromPicker = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const dataUrl = evt.target?.result;
      if (dataUrl && uploadMedia) {
        const res = await uploadMedia(dataUrl, {
          filename: file.name,
          category: 'Uploaded',
          title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
        });
        if (res.success && res.media?.url) {
          showToast?.(`Uploaded '${file.name}'`);
          onSelect(res.media.url);
          onClose();
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#EAE4DB] rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE4DB] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#17251D] text-[#B89A70] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-roman text-lg text-[#17251D] uppercase leading-tight font-semibold">
                {title}
              </h3>
              <p className="text-[11px] text-[#555D56]">
                Click any photograph to select it for this section.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => uploadInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-[#17251D] text-[#B89A70] hover:bg-black rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New Photo</span>
            </button>
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadFromPicker}
            />
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="px-6 py-3 border-b border-[#EAE4DB] bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search photographs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#FAF7F2] border border-[#D5C9B8] rounded-xl text-xs"
            />
          </div>
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#17251D] text-[#B89A70]'
                    : 'text-[#555D56] hover:bg-[#FAF7F2]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Thumbnail Gallery Grid */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#FAF7F2]">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-xs">
              No matching photographs found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item.url);
                    onClose();
                  }}
                  className="group relative bg-white border border-[#EAE4DB] hover:border-[#B89D70] rounded-xl overflow-hidden shadow-xs hover:shadow-md cursor-pointer transition-all duration-200"
                >
                  <div className="aspect-[4/3] bg-neutral-900 overflow-hidden relative">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="px-3 py-1.5 bg-[#17251D] text-[#B89A70] rounded-lg text-xs font-semibold shadow-md flex items-center space-x-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Use This Photo</span>
                      </span>
                    </div>
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[#B89A70] text-[9px] uppercase font-bold tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-2.5">
                    <div className="text-xs font-semibold text-[#1A1A1A] truncate" title={item.title}>
                      {item.title}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate font-mono mt-0.5">
                      {item.url}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#EAE4DB] bg-white flex items-center justify-between text-xs text-neutral-500">
          <span>{filtered.length} photographs available</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-[#D5C9B8] text-[#17251D] hover:bg-[#FAF7F2] font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function generateRandomPassword(length = 12) {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const special = '!@#$%&*';
  const all = upper + lower + digits + special;
  const pwd = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    special[Math.floor(Math.random() * special.length)]
  ];
  for (let i = pwd.length; i < length; i++) {
    pwd.push(all[Math.floor(Math.random() * all.length)]);
  }
  return pwd.sort(() => Math.random() - 0.5).join('');
}

export default function AdminPanel({ isStandalone = false, onClose }) {
  const {
    adminOpen, setAdminOpen, adminToken, adminUser, adminLogin, adminLogout,
    changePassword, requestPasswordReset, resetPasswordWithToken,
    pages, updatePageContent, publishAllContent, discardDraftContent,
    previewMode, setPreviewMode,
    rooms, saveRoom, deleteRoom,
    experiences, saveExperience, deleteExperience,
    gallery, saveGalleryPhoto, deleteGalleryPhoto,
    inquiries, updateInquiryStatus, updateInquiryPaymentStatus, deleteInquiry, loadInquiries,
    exportInquiriesCSV, addInquiryNote,
    getWhatsAppConfig, updateWhatsAppConfig, sendTestWhatsAppNotification, resendBookingWhatsAppNotification,
    backendUsers, backendUsersCounts, usersLoading, loadBackendUsers,
    createBackendUser, updateBackendUser, toggleUserStatus, resetUserPassword, deleteBackendUser,
    guestsList, loadGuests,
    mediaList, loadMedia, uploadMedia, replaceMedia, deleteMedia, updateMediaMetadata,
    designTokens, updateDesignTokens,
    auditLogs, loadAuditLogs
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // overview | inquiries | guests | rooms | users | whatsapp | content | media | experiences | gallery | design | security
  const [contentSubTab, setContentSubTab] = useState('home'); // home | about | dawaipani | stay | experiences | gallery | travel | reservation | header | footer

  // Role checks
  const isSuperAdmin = adminUser?.role === 'superadmin';
  const isAdminOrAbove = adminUser?.role === 'superadmin' || adminUser?.role === 'admin' || adminUser?.role === 'manager';
  const isStaff = adminUser?.role === 'staff';

  // Backend User Management state (Super Admin)
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [userModalOpen, setUserModalOpen] = useState(false); // 'create' | 'edit' | false
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    role: 'staff',
    status: 'active'
  });
  const [savingUser, setSavingUser] = useState(false);
  const [userResetModalOpen, setUserResetModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState(null);
  const [resetUserPassInput, setResetUserPassInput] = useState('');
  const [resettingUserPass, setResettingUserPass] = useState(false);
  const [generatedUserPassNotice, setGeneratedUserPassNotice] = useState(null);

  const handleOpenCreateUser = () => {
    setUserForm({
      name: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      role: 'staff',
      status: 'active'
    });
    setSelectedUserForEdit(null);
    setUserModalOpen('create');
  };

  const handleOpenEditUser = (user) => {
    setSelectedUserForEdit(user);
    setUserForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      username: user.username || '',
      password: '',
      role: user.role || 'staff',
      status: user.status || 'active'
    });
    setUserModalOpen('edit');
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.name.trim()) {
      showToast('Please enter full name', 'error');
      return;
    }
    if (!userForm.username || userForm.username.trim().length < 3) {
      showToast('Username must be at least 3 characters', 'error');
      return;
    }
    if (!userForm.email || !userForm.email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (userModalOpen === 'create' && userForm.password && userForm.password.trim().length < 8) {
      showToast('Password must be at least 8 characters long', 'error');
      return;
    }
    setSavingUser(true);
    try {
      if (userModalOpen === 'create') {
        const res = await createBackendUser(userForm);
        if (res.success) {
          showToast(`User '${res.user.username}' created successfully!`);
          setUserModalOpen(false);
          const tempPwd = res.generatedPassword || res.temporaryPassword || userForm.password;
          if (tempPwd) {
            setGeneratedUserPassNotice({
              username: res.user.username,
              password: tempPwd
            });
          }
        } else {
          showToast(res.error || 'Failed to create user', 'error');
        }
      } else if (userModalOpen === 'edit' && selectedUserForEdit) {
        const payload = {
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone,
          username: userForm.username,
          role: userForm.role,
          status: userForm.status
        };
        const res = await updateBackendUser(selectedUserForEdit.id, payload);
        if (res.success) {
          showToast(`User '${res.user.username}' updated successfully!`);
          setUserModalOpen(false);
        } else {
          showToast(res.error || 'Failed to update user', 'error');
        }
      }
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setSavingUser(false);
    }
  };

  const handleToggleUserStatus = async (user) => {
    if (user.id === adminUser?.id) {
      showToast('You cannot deactivate your own logged-in account', 'error');
      return;
    }
    const res = await toggleUserStatus(user.id);
    if (res.success) {
      showToast(`User '${user.username}' status updated to ${res.status}`);
    } else {
      showToast(res.error || 'Failed to toggle status', 'error');
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.id === adminUser?.id) {
      showToast('You cannot delete your own logged-in account', 'error');
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete user '${user.username}' (${user.name})? This action cannot be undone.`)) {
      return;
    }
    const res = await deleteBackendUser(user.id);
    if (res.success) {
      showToast(`User '${user.username}' deleted successfully`);
    } else {
      showToast(res.error || 'Failed to delete user', 'error');
    }
  };

  const handleOpenResetUserPassword = (user) => {
    setSelectedUserForReset(user);
    setResetUserPassInput('');
    setUserResetModalOpen(true);
  };

  const handleExecuteResetUserPassword = async (e) => {
    e.preventDefault();
    if (!selectedUserForReset) return;
    setResettingUserPass(true);
    try {
      const res = await resetUserPassword(selectedUserForReset.id, resetUserPassInput);
      if (res.success) {
        showToast(`Password reset for '${selectedUserForReset.username}'!`);
        setUserResetModalOpen(false);
        if (res.temporaryPassword) {
          setGeneratedUserPassNotice({
            username: selectedUserForReset.username,
            password: res.temporaryPassword
          });
        }
      } else {
        showToast(res.error || 'Failed to reset password', 'error');
      }
    } catch (err) {
      showToast('Error resetting password: ' + err.message, 'error');
    } finally {
      setResettingUserPass(false);
    }
  };

  // Guest Management & Notes state
  const [guestSearch, setGuestSearch] = useState('');
  const [selectedGuestForModal, setSelectedGuestForModal] = useState(null);
  const [activeNotesInquiry, setActiveNotesInquiry] = useState(null);
  const [inquiryNoteInput, setInquiryNoteInput] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Auth form states
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authView, setAuthView] = useState('login'); // login | forgot | reset
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [generatedResetToken, setGeneratedResetToken] = useState('');
  const [resetTokenInput, setResetTokenInput] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMessage, setPassMessage] = useState({ type: '', text: '' });

  // Notifications
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success' });

  // Content Editor local state (cloned from pages)
  const [pageDraft, setPageDraft] = useState({});

  // Media Library state
  const [mediaCategory, setMediaCategory] = useState('All');
  const [mediaSearch, setMediaSearch] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [replacingMediaId, setReplacingMediaId] = useState(null);

  // Visual Media Picker Modal state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerCallback, setMediaPickerCallback] = useState(null);
  const [mediaPickerTitle, setMediaPickerTitle] = useState('Choose Photograph');

  const openMediaPicker = (title, onSelect) => {
    setMediaPickerTitle(title || 'Choose Photograph');
    setMediaPickerCallback(() => onSelect);
    setMediaPickerOpen(true);
  };

  const handleDirectUploadForField = async (dataUrl, filename, assignCallback) => {
    const res = await uploadMedia(dataUrl, {
      filename,
      category: 'Uploaded',
      title: filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
    });
    if (res.success && res.media?.url) {
      showToast(`Uploaded '${filename}'`);
      assignCallback(res.media.url);
    } else {
      showToast('Upload failed: ' + (res.error || 'Server error'), 'error');
    }
  };

  // Room modal state
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomModalOpen, setRoomModalOpen] = useState(false);

  // Experience modal state
  const [editingExp, setEditingExp] = useState(null);
  const [expModalOpen, setExpModalOpen] = useState(false);

  // Gallery modal state
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  // Inquiries filter
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');
  const [inquirySearch, setInquirySearch] = useState('');

  // Design Tokens form state
  const [designForm, setDesignForm] = useState(null);

  // WhatsApp Notification State
  const [waConfig, setWaConfig] = useState(null);
  const [waLoading, setWaLoading] = useState(false);
  const [waSaving, setWaSaving] = useState(false);
  const [waTesting, setWaTesting] = useState(false);
  const [waTestResponse, setWaTestResponse] = useState(null);
  const [waResendingId, setWaResendingId] = useState(null);
  const [waShowToken, setWaShowToken] = useState(false);
  const [waTokenInput, setWaTokenInput] = useState('');
  const [selectedWaMessageInquiry, setSelectedWaMessageInquiry] = useState(null);

  const loadWhatsAppConfigData = async () => {
    if (!adminToken) return;
    setWaLoading(true);
    try {
      const data = await getWhatsAppConfig();
      if (data) {
        setWaConfig(data);
      }
    } catch (err) {
      console.error('Failed to load WhatsApp config:', err);
    } finally {
      setWaLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken && (activeTab === 'whatsapp' || activeTab === 'inquiries')) {
      loadWhatsAppConfigData();
    }
  }, [adminToken, activeTab]);

  useEffect(() => {
    if (adminToken && isSuperAdmin && (activeTab === 'users' || activeTab === 'overview')) {
      loadBackendUsers(userSearch, userRoleFilter, userStatusFilter);
    }
  }, [adminToken, isSuperAdmin, activeTab, userSearch, userRoleFilter, userStatusFilter, loadBackendUsers]);

  const handleSaveWaConfig = async (e) => {
    e?.preventDefault();
    if (!waConfig) return;
    if (!isSuperAdmin) {
      showToast('Only Super Admin can update WhatsApp configuration', 'error');
      return;
    }
    setWaSaving(true);
    try {
      const payload = {
        enabled: waConfig.enabled,
        hostPhone: waConfig.hostPhone,
        phoneNumberId: waConfig.phoneNumberId,
        businessAccountId: waConfig.businessAccountId,
        apiVersion: waConfig.apiVersion || 'v21.0'
      };
      if (waTokenInput && waTokenInput.trim()) {
        payload.accessToken = waTokenInput.trim();
      }
      const res = await updateWhatsAppConfig(payload);
      if (res?.success) {
        showToast('WhatsApp notification settings saved successfully!');
        setWaTokenInput('');
        loadWhatsAppConfigData();
      } else {
        showToast(res?.error || 'Failed to update WhatsApp settings', 'error');
      }
    } catch (err) {
      showToast('Error saving settings: ' + err.message, 'error');
    } finally {
      setWaSaving(false);
    }
  };

  const handleSendWaTest = async () => {
    setWaTesting(true);
    setWaTestResponse(null);
    try {
      const payload = {
        hostPhone: waConfig?.hostPhone,
        phoneNumberId: waConfig?.phoneNumberId
      };
      if (waTokenInput && waTokenInput.trim()) {
        payload.accessToken = waTokenInput.trim();
      }
      const res = await sendTestWhatsAppNotification(payload);
      setWaTestResponse(res);
      if (res?.success) {
        showToast(res.simulated ? 'Test verified in simulated mode!' : 'Live WhatsApp test delivered!');
      } else {
        showToast(res?.error || 'Test notification failed', 'error');
      }
    } catch (err) {
      setWaTestResponse({ success: false, error: err.message });
      showToast('Test failed: ' + err.message, 'error');
    } finally {
      setWaTesting(false);
    }
  };

  const handleResendWa = async (inquiryId) => {
    setWaResendingId(inquiryId);
    try {
      const res = await resendBookingWhatsAppNotification(inquiryId);
      if (res?.success) {
        showToast(`WhatsApp notification dispatched for booking ${inquiryId}!`);
      } else {
        showToast(res?.error || 'Failed to dispatch WhatsApp message', 'error');
      }
    } catch (err) {
      showToast('Resend failed: ' + err.message, 'error');
    } finally {
      setWaResendingId(null);
    }
  };

  const formatBookingPreviewText = (booking) => {
    if (!booking) return '';
    const specialRequests = booking.specialRequests && booking.specialRequests.trim()
      ? booking.specialRequests.trim()
      : 'None';
    const adults = booking.adults !== undefined ? booking.adults : 1;
    const children = booking.children !== undefined ? booking.children : 0;
    const numRooms = booking.numRooms || booking.rooms || 1;
    const status = booking.status || 'Pending';

    return (
      `*NEW ROOM BOOKING – MINERAL SPRINGS RETREAT*\n\n` +
      `A new booking request has been received.\n\n` +
      `*Guest Details:*\n` +
      `- Name: ${booking.guestName || 'Guest'}\n` +
      `- Phone: ${booking.phone || 'Phone'}\n` +
      `- Email: ${booking.email || 'Email'}\n\n` +
      `*Booking Details:*\n` +
      `- Booking ID: ${booking.id || 'MSR-XXXXX'}\n` +
      `- Check-in: ${booking.checkIn || 'YYYY-MM-DD'}\n` +
      `- Check-out: ${booking.checkOut || 'YYYY-MM-DD'}\n` +
      `- Adults: ${adults}\n` +
      `- Children: ${children}\n` +
      `- Room Type: ${booking.room || 'Deluxe Valley View Room'}\n` +
      `- Number of Rooms: ${numRooms}\n` +
      `- Special Requests: ${specialRequests}\n\n` +
      `*Booking Status:* ${status}\n\n` +
      `Please log in to your admin dashboard to review this booking.`
    );
  };

  // Initialize pageDraft from pages
  useEffect(() => {
    if (pages) {
      setPageDraft(JSON.parse(JSON.stringify(pages)));
    }
  }, [pages]);

  // Initialize designForm from designTokens
  useEffect(() => {
    if (designTokens) {
      setDesignForm({ ...designTokens });
    }
  }, [designTokens]);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage({ text: '', type: 'success' }), 4000);
  };

  if (!isStandalone && !adminOpen) return null;

  const handleClose = () => {
    if (onClose) onClose();
    else setAdminOpen(false);
  };

  // --- LOGIN SUBMIT ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    const res = await adminLogin(loginUsername, loginPassword);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      setLoginPassword('');
      showToast('Welcome back, Administrator!');
    }
  };

  // --- FORGOT PASSWORD SUBMIT ---
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    const res = await requestPasswordReset(forgotEmail);
    if (res.success) {
      setForgotMessage(res.message);
      if (res.resetToken) {
        setGeneratedResetToken(res.resetToken);
        setResetTokenInput(res.resetToken);
        setAuthView('reset');
      }
    } else {
      setForgotMessage(res.message || 'Failed to process request');
    }
  };

  // --- RESET PASSWORD SUBMIT ---
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const res = await resetPasswordWithToken(resetTokenInput, resetNewPassword);
    if (res.success) {
      setResetSuccessMessage(res.message);
      setAuthView('login');
      setLoginPassword('');
    } else {
      setResetSuccessMessage(res.message || 'Reset failed');
    }
  };

  // --- CHANGE PASSWORD SUBMIT ---
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setPassMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    const res = await changePassword(currentPass, newPass);
    if (res.success) {
      setPassMessage({ type: 'success', text: 'Password successfully changed!' });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setPassMessage({ type: 'error', text: res.message || 'Failed to update password' });
    }
  };

  // --- SAVE & PUBLISH PAGE CONTENT TO LIVE WEBSITE ---
  const handleSavePageContent = async (pageId) => {
    const content = pageDraft[pageId];
    if (!content) return;
    const res = await updatePageContent(pageId, content, true);
    if (res.success) {
      showToast(`✓ '${pageId.toUpperCase()}' saved & published to live website!`);
    } else {
      showToast('Failed to save & publish: ' + res.error, 'error');
    }
  };

  // --- PUBLISH ALL ---
  const handlePublishAll = async () => {
    if (!confirm('Publish all draft edits to the live public website?')) return;
    const res = await publishAllContent();
    if (res.success) {
      showToast('✓ All changes are now live on the public website!');
    } else {
      showToast('Publish failed: ' + res.error, 'error');
    }
  };

  // --- DISCARD DRAFT ---
  const handleDiscardDraft = async () => {
    if (!confirm('Discard all unpublished changes and revert to the live version?')) return;
    const res = await discardDraftContent();
    if (res.success) {
      showToast('Draft reverted to live version.');
      if (pages) setPageDraft(JSON.parse(JSON.stringify(pages)));
    }
  };

  // --- MEDIA FILE UPLOAD HANDLER ---
  const handleMediaUploadInput = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const dataUrl = evt.target?.result;
        if (dataUrl) {
          const res = await uploadMedia(dataUrl, {
            filename: file.name,
            category: mediaCategory === 'All' ? 'General' : mediaCategory,
            title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
          });
          if (res.success) {
            showToast(`Uploaded '${file.name}' to Media Library`);
          }
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // --- MEDIA REPLACE HANDLER ---
  const handleMediaReplaceInput = (e, mediaId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const dataUrl = evt.target?.result;
      if (dataUrl) {
        const res = await replaceMedia(mediaId, dataUrl, file.name);
        if (res.success) {
          showToast(`Replaced photograph. All website references updated!`);
          setReplacingMediaId(null);
        } else {
          showToast('Failed to replace: ' + res.error, 'error');
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // --- SAVE DESIGN TOKENS ---
  const handleSaveDesignTokens = async (e) => {
    e.preventDefault();
    const res = await updateDesignTokens(designForm);
    if (res.success) {
      showToast('Design tokens updated and applied to website live!');
    } else {
      showToast('Error saving design tokens: ' + res.error, 'error');
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] overflow-hidden bg-[#0D130F]/90 backdrop-blur-md flex flex-col font-sans select-none text-[#1A1A1A]`}>
      
      {/* Toast Notification Banner */}
      {toastMessage.text && (
        <div className={`fixed top-4 right-4 z-[200] px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-medium tracking-wide animate-slide-down ${
          toastMessage.type === 'error' ? 'bg-rose-600 text-white' : 'bg-[#17251D] text-[#B89A70] border border-[#B89A70]/40'
        }`}>
          {toastMessage.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4 text-[#B89A70]" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Application Bar */}
      <header className="bg-[#17251D] border-b border-[#B89A70]/25 px-5 py-3.5 flex items-center justify-between shrink-0 shadow-md">
        
        {/* Brand Lockup */}
        <div className="flex items-center space-x-3.5">
          <div className="p-2 bg-[#B89A70]/15 text-[#B89A70] rounded-lg border border-[#B89A70]/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-roman text-lg sm:text-xl font-normal tracking-[0.16em] uppercase text-[#FAF7F2]">
                MINERAL SPRINGS RETREAT
              </h1>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-[#B89A70]/20 text-[#B89A70] font-medium border border-[#B89A70]/30">
                ADMIN CMS
              </span>
            </div>
            <p className="text-[11px] font-sans text-white/60 tracking-wider">
              Dawaipani, Darjeeling · Management System
            </p>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center space-x-3">
          
          {adminToken && (
            <>
              {/* Draft Preview Toggle */}
              <button
                onClick={() => {
                  const nextMode = !previewMode;
                  setPreviewMode(nextMode);
                  showToast(nextMode ? 'Draft Preview Mode Enabled' : 'Draft Preview Mode Disabled');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wider flex items-center space-x-1.5 transition-all ${
                  previewMode
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-white/10 text-white/80 hover:bg-white/15 border border-white/15'
                }`}
                title="Toggle between live website view and draft preview"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{previewMode ? 'Draft Preview: ON' : 'Draft Preview: OFF'}</span>
              </button>

              {/* Publish All Button */}
              <button
                onClick={handlePublishAll}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wider bg-[#B89A70] text-[#17251D] hover:bg-[#CBB08B] flex items-center space-x-1.5 shadow-sm transition-all"
                title="Commit all draft changes live to production"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Publish Live</span>
              </button>
            </>
          )}

          {/* View Live Site / Close Modal */}
          <button
            onClick={handleClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center space-x-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">View Live Site</span>
          </button>

          {/* Sign Out */}
          {adminToken && (
            <button
              onClick={adminLogout}
              className="p-2 text-white/60 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Close Panel */}
          <button
            onClick={handleClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Close Admin Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      {!adminToken ? (
        // ==============================================================
        // SECURE LOGIN VIEW
        // ==============================================================
        <div className="flex-1 flex items-center justify-center p-6 bg-[#FAF7F2] overflow-y-auto">
          <div className="bg-white border border-[#EAE4DB] shadow-2xl rounded-2xl p-8 sm:p-10 max-w-md w-full">
            
            <div className="w-14 h-14 bg-[#17251D] text-[#B89A70] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
              <Lock className="w-7 h-7" />
            </div>

            <h2 className="font-roman text-3xl text-center text-[#17251D] uppercase tracking-wide mb-1.5">
              Management Access
            </h2>
            <p className="text-xs text-[#555D56] text-center mb-6">
              Enter authorized administrator credentials to manage Mineral Springs Retreat.
            </p>

            {loginError && (
              <div className="p-3.5 bg-rose-50 text-rose-800 border border-rose-200 text-xs rounded-xl mb-4 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            {resetSuccessMessage && (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-xl mb-4 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{resetSuccessMessage}</span>
              </div>
            )}

            {authView === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                    Username or Email
                  </label>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="admin or email"
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#B89A70] rounded-xl transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthView('forgot')}
                      className="text-[11px] text-[#B89A70] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#B89A70] rounded-xl pr-10 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#17251D] hover:bg-[#203429] text-[#B89A70] font-sans uppercase tracking-[0.18em] text-xs font-semibold rounded-xl transition-all shadow-md mt-2"
                >
                  Sign In to Admin Console
                </button>
              </form>
            )}

            {authView === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-[#555D56] mb-2">
                  Enter your registered administrator email to receive password reset instructions.
                </p>
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="stay@mineralspringsretreat.com"
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-sm rounded-xl"
                  />
                </div>

                {forgotMessage && (
                  <p className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    {forgotMessage}
                  </p>
                )}

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#17251D] text-[#B89A70] uppercase tracking-wider text-xs font-semibold rounded-xl"
                  >
                    Generate Reset Token
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthView('login')}
                    className="px-4 py-2.5 border border-[#D5C9B8] text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {authView === 'reset' && (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs space-y-1">
                  <div className="font-semibold">Reset Token Generated:</div>
                  <div className="font-mono break-all text-[11px] select-all bg-white p-1 rounded border border-amber-300">
                    {generatedResetToken}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                    Reset Token
                  </label>
                  <input
                    type="text"
                    required
                    value={resetTokenInput}
                    onChange={(e) => setResetTokenInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs font-mono rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                    New Password (min 8 chars)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-sm rounded-xl"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#17251D] text-[#B89A70] uppercase tracking-wider text-xs font-semibold rounded-xl"
                  >
                    Set New Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthView('login')}
                    className="px-4 py-2.5 border border-[#D5C9B8] text-xs rounded-xl"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 pt-4 border-t border-[#EAE4DB] text-center">
              <span className="text-[10px] text-neutral-400 font-mono">
                Security: scrypt hash verification · Active session tracking
              </span>
            </div>
          </div>
        </div>
      ) : (
        // ==============================================================
        // AUTHENTICATED DASHBOARD VIEW
        // ==============================================================
        <div className="flex-1 flex overflow-hidden bg-[#F3EFEA]">
          
          {/* Main Sidebar Navigation */}
          <aside className="w-60 sm:w-64 bg-white border-r border-[#EAE4DB] flex flex-col justify-between shrink-0 overflow-y-auto">
            
            <nav className="p-3.5 space-y-1">
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: Layers },
                { id: 'calendar', label: 'Booking Calendar', icon: CalendarDays },
                { id: 'inquiries', label: `Reservations (${inquiries.filter(i => i.status === 'Pending').length} new)`, icon: Calendar },
                { id: 'guests', label: `Registered Guests (${guestsList.length})`, icon: Users },
                { id: 'rooms', label: `Rooms & Suites (${rooms.length})`, icon: BedDouble },
                {
                  id: 'users',
                  label: isSuperAdmin ? `User Management (${backendUsers.length})` : 'User Management',
                  icon: ShieldCheck,
                  badge: isSuperAdmin ? null : 'Owner'
                },
                { id: 'whatsapp', label: 'WhatsApp Alerts', icon: MessageSquare },
                { id: 'content', label: 'Website Content CMS', icon: Edit3 },
                { id: 'media', label: `Media Library (${mediaList.length})`, icon: ImageIcon },
                { id: 'experiences', label: `Experiences (${experiences.length})`, icon: Compass },
                { id: 'gallery', label: `Gallery Photos (${gallery.length})`, icon: Sparkles },
                { id: 'design', label: 'Typography & Design', icon: Type },
                { id: 'security', label: 'Security & Logs', icon: KeyRound },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs uppercase tracking-wider font-medium transition-colors text-left rounded-xl ${
                      isActive
                        ? 'bg-[#17251D] text-[#B89A70] shadow-sm font-semibold'
                        : 'text-[#1A1A1A] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <Icon className="w-4 h-4 shrink-0 text-[#B89A70]" />
                      <span className="truncate">{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-1.5 py-0.2 rounded shrink-0">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Sidebar User Footer */}
            <div className="p-4 border-t border-[#EAE4DB] text-xs bg-[#FAF7F2]">
              <div className="flex items-center space-x-2.5 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                  isSuperAdmin ? 'bg-[#B89A70] text-[#17251D]' : 'bg-[#17251D] text-[#B89A70]'
                }`}>
                  {adminUser?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="truncate flex-1">
                  <div className="font-semibold text-[#17251D] truncate flex items-center space-x-1">
                    <span>{adminUser?.name || adminUser?.username || 'admin'}</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate">{adminUser?.email || 'stay@mineralspringsretreat.com'}</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#EAE4DB]/60">
                <span className={`text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                  isSuperAdmin ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                  isAdminOrAbove ? 'bg-sky-100 text-sky-900 border border-sky-300' :
                  'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}>
                  {adminUser?.role === 'superadmin' ? 'Super Admin' :
                   adminUser?.role === 'admin' ? 'Manager' :
                   'Staff'}
                </span>
                <button
                  type="button"
                  onClick={adminLogout}
                  className="text-[11px] text-rose-700 hover:text-rose-900 font-semibold flex items-center space-x-1 hover:underline"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Work Area */}
          <main className="flex-1 overflow-y-auto p-6 sm:p-8">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (() => {
              const totalBookings = inquiries.length;
              const newBookings = inquiries.filter(i => i.status === 'Pending').length;
              const confirmedBookings = inquiries.filter(i => i.status === 'Confirmed').length;
              const pendingBookings = inquiries.filter(i => i.status === 'Pending').length;
              const cancelledBookings = inquiries.filter(i => i.status === 'Cancelled').length;
              const contactedBookings = inquiries.filter(i => i.status === 'Contacted').length;
              const totalGuests = guestsList.length;
              const totalRevenue = inquiries
                .filter(i => i.status === 'Confirmed' || i.paymentStatus === 'Paid' || i.paymentStatus === 'Partial (Advance Paid)')
                .reduce((sum, i) => sum + (Number(i.estimatedTotal) || 0), 0);

              const confirmedPercent = totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0;
              const pendingPercent = totalBookings > 0 ? Math.round((pendingBookings / totalBookings) * 100) : 0;
              const contactedPercent = totalBookings > 0 ? Math.round((contactedBookings / totalBookings) * 100) : 0;
              const cancelledPercent = totalBookings > 0 ? Math.round((cancelledBookings / totalBookings) * 100) : 0;

              return (
                <div className="space-y-8 max-w-6xl mx-auto">
                  {/* Dashboard Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h2 className="font-roman text-3xl sm:text-4xl text-[#17251D] uppercase tracking-wide">
                          Executive Admin Dashboard
                        </h2>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isSuperAdmin ? 'bg-amber-100 text-amber-900 border-amber-300' :
                          isAdminOrAbove ? 'bg-sky-100 text-sky-900 border-sky-300' :
                          'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}>
                          {isSuperAdmin ? '👑 Super Admin Control' : isAdminOrAbove ? '🛡️ Manager Portal' : '👤 Staff View'}
                        </span>
                      </div>
                      <p className="text-xs text-[#555D56] mt-1">
                        Welcome back, <strong>{adminUser?.name || adminUser?.username || 'Owner'}</strong>. Complete real-time control over reservations, revenue, registered guests, and retreat team operations.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2.5 flex-wrap">
                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={handleOpenCreateUser}
                          className="px-3.5 py-2 bg-[#17251D] text-[#B89A70] hover:bg-black text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm transition-colors"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Add Team User</span>
                        </button>
                      )}
                      <button
                        onClick={handlePublishAll}
                        className="px-4 py-2 bg-white hover:bg-[#FAF7F2] border border-[#D5C9B8] text-[#17251D] text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#B89A70]" />
                        <span>Publish Live</span>
                      </button>
                    </div>
                  </div>

                  {/* 7 Core KPI Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* 1. Total Revenue */}
                    <div className="p-5 bg-gradient-to-br from-[#17251D] to-[#25392F] text-white rounded-2xl shadow-sm border border-[#17251D] sm:col-span-2 lg:col-span-1">
                      <div className="flex items-center justify-between text-[#B89A70] mb-2">
                        <span className="text-[11px] uppercase tracking-wider font-semibold">
                          Total Revenue
                        </span>
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div className="font-roman text-3xl text-white font-normal">
                        ₹{totalRevenue.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-neutral-300 mt-1 flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                        <span>Active & Confirmed Bookings</span>
                      </div>
                    </div>

                    {/* 2. Total Bookings */}
                    <div className="p-5 bg-white border border-[#EAE4DB] rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between text-neutral-500 mb-2">
                        <span className="text-[11px] uppercase tracking-wider font-semibold">
                          Total Bookings
                        </span>
                        <Calendar className="w-4 h-4 text-[#B89A70]" />
                      </div>
                      <div className="font-roman text-3xl text-[#17251D] font-normal">
                        {totalBookings}
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-1">
                        All-time reservations
                      </div>
                    </div>

                    {/* 3. New Inquiries / Pending */}
                    <div className="p-5 bg-white border border-[#EAE4DB] rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between text-amber-700 mb-2">
                        <span className="text-[11px] uppercase tracking-wider font-semibold">
                          New Inquiries
                        </span>
                        <Bell className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="font-roman text-3xl text-amber-700 font-normal">
                        {newBookings}
                      </div>
                      <div className="text-[10px] text-amber-800 font-medium mt-1">
                        Awaiting host confirmation
                      </div>
                    </div>

                    {/* 4. Confirmed Bookings */}
                    <div className="p-5 bg-white border border-[#EAE4DB] rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between text-emerald-800 mb-2">
                        <span className="text-[11px] uppercase tracking-wider font-semibold">
                          Confirmed Bookings
                        </span>
                        <CheckCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="font-roman text-3xl text-emerald-800 font-normal">
                        {confirmedBookings}
                      </div>
                      <div className="text-[10px] text-emerald-700 mt-1">
                        {confirmedPercent}% conversion rate
                      </div>
                    </div>

                    {/* 5. Pending Bookings */}
                    <div className="p-5 bg-white border border-[#EAE4DB] rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between text-neutral-500 mb-2">
                        <span className="text-[11px] uppercase tracking-wider font-semibold">
                          Pending Review
                        </span>
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="font-roman text-3xl text-[#17251D] font-normal">
                        {pendingBookings}
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-1">
                        Needs guest follow-up
                      </div>
                    </div>

                    {/* 6. Cancelled Bookings */}
                    <div className="p-5 bg-white border border-[#EAE4DB] rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between text-neutral-500 mb-2">
                        <span className="text-[11px] uppercase tracking-wider font-semibold">
                          Cancelled
                        </span>
                        <X className="w-4 h-4 text-rose-500" />
                      </div>
                      <div className="font-roman text-3xl text-rose-700 font-normal">
                        {cancelledBookings}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-1">
                        {cancelledPercent}% cancellation
                      </div>
                    </div>

                    {/* 7. Total Registered Guests */}
                    <div className="p-5 bg-white border border-[#EAE4DB] rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between text-neutral-500 mb-2">
                        <span className="text-[11px] uppercase tracking-wider font-semibold">
                          Registered Guests
                        </span>
                        <Users className="w-4 h-4 text-[#B89A70]" />
                      </div>
                      <div className="font-roman text-3xl text-[#17251D] font-normal">
                        {totalGuests}
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-1">
                        Google Verified Accounts
                      </div>
                    </div>

                    {/* 8. Backend Staff & Team */}
                    <div className="p-5 bg-white border border-[#EAE4DB] rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between text-neutral-500 mb-2">
                        <span className="text-[11px] uppercase tracking-wider font-semibold">
                          Backend Team
                        </span>
                        <ShieldCheck className="w-4 h-4 text-[#B89A70]" />
                      </div>
                      <div className="font-roman text-3xl text-[#17251D] font-normal">
                        {backendUsers.length || 3}
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-1">
                        Super Admin · Admin · Staff
                      </div>
                    </div>
                  </div>

                  {/* Booking Status Distribution Bar */}
                  <div className="bg-white border border-[#EAE4DB] rounded-2xl p-5 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#17251D] uppercase tracking-wider text-[11px]">
                        Booking Status Distribution
                      </span>
                      <span className="text-neutral-500 text-[11px]">
                        {totalBookings} Total Reservations Processed
                      </span>
                    </div>
                    <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden flex shadow-inner">
                      <div style={{ width: `${confirmedPercent}%` }} className="bg-emerald-600 transition-all" title={`Confirmed: ${confirmedBookings} (${confirmedPercent}%)`} />
                      <div style={{ width: `${contactedPercent}%` }} className="bg-sky-500 transition-all" title={`Contacted: ${contactedBookings} (${contactedPercent}%)`} />
                      <div style={{ width: `${pendingPercent}%` }} className="bg-amber-500 transition-all" title={`Pending: ${pendingBookings} (${pendingPercent}%)`} />
                      <div style={{ width: `${cancelledPercent}%` }} className="bg-rose-500 transition-all" title={`Cancelled: ${cancelledBookings} (${cancelledPercent}%)`} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] pt-1 text-neutral-600">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                        <span>Confirmed ({confirmedBookings})</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                        <span>Contacted ({contactedBookings})</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Pending ({pendingBookings})</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span>Cancelled ({cancelledBookings})</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings Table with Payment Status */}
                  <div className="bg-white border border-[#EAE4DB] rounded-2xl shadow-sm p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-roman text-2xl text-[#17251D] uppercase">
                          Recent Reservations & Payment Status
                        </h3>
                        <p className="text-xs text-[#555D56] mt-0.5">
                          Live booking status, guest contact, check-in schedules, and room payments
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('inquiries')}
                        className="px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-neutral-200 text-[#17251D] border border-[#D5C9B8] text-xs font-semibold rounded-xl inline-flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
                      >
                        <span>Manage All ({totalBookings})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="overflow-x-auto border border-[#EAE4DB] rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAF7F2] uppercase text-[10px] tracking-wider text-neutral-500">
                          <tr>
                            <th className="p-3">Ref ID</th>
                            <th className="p-3">Guest</th>
                            <th className="p-3">Room</th>
                            <th className="p-3">Dates & Nights</th>
                            <th className="p-3">Booking Status</th>
                            <th className="p-3">Payment Status</th>
                            <th className="p-3">Total</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAE4DB]">
                          {inquiries.slice(0, 6).map((inq) => {
                            const payment = inq.paymentStatus || 'Pending';
                            return (
                              <tr key={inq.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                                <td className="p-3 font-mono font-semibold text-[#17251D]">{inq.id}</td>
                                <td className="p-3">
                                  <div className="font-semibold text-[#1A1A1A]">{inq.guestName}</div>
                                  <div className="text-[11px] text-neutral-500">{inq.email} · {inq.phone}</div>
                                </td>
                                <td className="p-3 text-neutral-700 font-medium">{inq.room}</td>
                                <td className="p-3">
                                  <div>{inq.checkIn} → {inq.checkOut}</div>
                                  <div className="text-[10px] text-neutral-400">{inq.nights} nights · {inq.adults} adults{inq.children > 0 ? `, ${inq.children} ch` : ''}</div>
                                </td>
                                <td className="p-3">
                                  <select
                                    value={inq.status}
                                    onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                                    className={`px-2 py-1 text-[11px] font-bold rounded-lg border bg-white cursor-pointer ${
                                      inq.status === 'Confirmed' ? 'text-emerald-800 border-emerald-300' :
                                      inq.status === 'Contacted' ? 'text-sky-800 border-sky-300' :
                                      inq.status === 'Cancelled' ? 'text-neutral-500 border-neutral-300' :
                                      'text-amber-800 border-amber-300'
                                    }`}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>
                                <td className="p-3">
                                  <select
                                    value={payment}
                                    onChange={(e) => updateInquiryPaymentStatus(inq.id, e.target.value)}
                                    className={`px-2 py-1 text-[11px] font-bold rounded-lg border bg-white cursor-pointer ${
                                      payment === 'Paid' ? 'text-emerald-800 border-emerald-300 bg-emerald-50/50' :
                                      payment.includes('Partial') ? 'text-amber-800 border-amber-300 bg-amber-50/50' :
                                      payment.includes('Homestay') ? 'text-sky-800 border-sky-300 bg-sky-50/50' :
                                      'text-neutral-600 border-neutral-300 bg-neutral-50'
                                    }`}
                                  >
                                    <option value="Pending">Payment Pending</option>
                                    <option value="Partial (Advance Paid)">Partial (Advance Paid)</option>
                                    <option value="Paid">Fully Paid</option>
                                    <option value="Pay at Homestay">Pay at Homestay</option>
                                  </select>
                                </td>
                                <td className="p-3 font-semibold text-[#17251D]">
                                  ₹{Number(inq.estimatedTotal || 0).toLocaleString('en-IN')}
                                </td>
                                <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedWaMessageInquiry(inq)}
                                    className="p-1.5 text-neutral-500 hover:text-[#17251D] hover:bg-neutral-100 rounded-lg inline-block transition-colors"
                                    title="View Formatted WhatsApp Message"
                                  >
                                    <Smartphone className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleResendWa(inq.id)}
                                    disabled={waResendingId === inq.id}
                                    className="p-1.5 text-[#B89A70] hover:text-[#17251D] hover:bg-neutral-100 rounded-lg inline-block transition-colors disabled:opacity-50"
                                    title="Send / Resend WhatsApp Notification"
                                  >
                                    <Send className={`w-3.5 h-3.5 ${waResendingId === inq.id ? 'animate-spin' : ''}`} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setActiveNotesInquiry(inq)}
                                    className="p-1.5 text-neutral-600 hover:text-[#17251D] hover:bg-neutral-100 rounded-lg inline-block transition-colors"
                                    title="Internal Team Notes"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quick Access Control Tiles */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab('calendar')}
                      className="p-4 bg-white border border-[#EAE4DB] hover:border-[#17251D] rounded-2xl shadow-xs text-left transition-all group"
                    >
                      <CalendarDays className="w-5 h-5 text-[#B89A70] mb-2 group-hover:scale-110 transition-transform" />
                      <div className="font-semibold text-xs text-[#17251D]">Booking Calendar</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">Month, week, day & availability</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('inquiries')}
                      className="p-4 bg-white border border-[#EAE4DB] hover:border-[#17251D] rounded-2xl shadow-xs text-left transition-all group"
                    >
                      <Calendar className="w-5 h-5 text-[#B89A70] mb-2 group-hover:scale-110 transition-transform" />
                      <div className="font-semibold text-xs text-[#17251D]">Manage Bookings</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">Filter, confirm, update payments</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('guests')}
                      className="p-4 bg-white border border-[#EAE4DB] hover:border-[#17251D] rounded-2xl shadow-xs text-left transition-all group"
                    >
                      <Users className="w-5 h-5 text-[#B89A70] mb-2 group-hover:scale-110 transition-transform" />
                      <div className="font-semibold text-xs text-[#17251D]">Guest Profiles</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">Google OAuth accounts</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('whatsapp')}
                      className="p-4 bg-white border border-[#EAE4DB] hover:border-[#17251D] rounded-2xl shadow-xs text-left transition-all group"
                    >
                      <MessageSquare className="w-5 h-5 text-[#B89A70] mb-2 group-hover:scale-110 transition-transform" />
                      <div className="font-semibold text-xs text-[#17251D]">WhatsApp Alerts</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">Meta API instant dispatch</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('users')}
                      className="p-4 bg-white border border-[#EAE4DB] hover:border-[#17251D] rounded-2xl shadow-xs text-left transition-all group"
                    >
                      <ShieldCheck className="w-5 h-5 text-[#B89A70] mb-2 group-hover:scale-110 transition-transform" />
                      <div className="font-semibold text-xs text-[#17251D]">User Management</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">{isSuperAdmin ? 'Full RBAC Owner Control' : 'Super Admin Protected'}</div>
                    </button>
                  </div>

                  {/* Recent System Activity Logs */}
                  <div className="bg-white border border-[#EAE4DB] rounded-2xl shadow-sm p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-roman text-xl text-[#17251D] uppercase">
                        Administrative Audit Trail
                      </h3>
                      <button
                        onClick={loadAuditLogs}
                        className="text-xs text-[#B89A70] hover:underline flex items-center space-x-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Refresh</span>
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      {auditLogs.slice(0, 6).map((log) => (
                        <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-[#FAF7F2] border border-[#EAE4DB] gap-2">
                          <div className="flex items-center space-x-2.5">
                            <span className="font-mono text-[10px] text-neutral-400 shrink-0">
                              {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[9.5px] uppercase font-bold tracking-wider bg-[#17251D]/10 text-[#17251D] shrink-0">
                              {log.action}
                            </span>
                            <span className="text-neutral-700 truncate">{log.details}</span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                            {log.username} ({log.ip})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })()}

            {/* 2. CONTENT MANAGEMENT CMS TAB */}
            {activeTab === 'content' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-roman text-3xl sm:text-4xl text-[#17251D] uppercase tracking-wide">
                      Website Content Editor
                    </h2>
                    <p className="text-xs text-[#555D56] mt-1">
                      Edit text, subtitles, lining numbers, and photographs across all 10 pages and sections.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSavePageContent(contentSubTab)}
                      className="px-4 py-2 bg-[#17251D] text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Draft</span>
                    </button>
                    <button
                      onClick={handlePublishAll}
                      className="px-4 py-2 bg-[#B89A70] text-[#17251D] text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Publish Live</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Tabs for the 10 Pages/Sections */}
                <div className="flex items-center space-x-1 overflow-x-auto pb-2 border-b border-[#EAE4DB]">
                  {[
                    { id: 'home', label: '1. Homepage' },
                    { id: 'about', label: '2. About' },
                    { id: 'dawaipani', label: '3. Dawaipani' },
                    { id: 'stay', label: '4. Stay & Rooms' },
                    { id: 'experiences', label: '5. Experiences' },
                    { id: 'gallery', label: '6. Gallery' },
                    { id: 'travel', label: '7. Travel Guide' },
                    { id: 'reservation', label: '8. Reservation' },
                    { id: 'header', label: '9. Header' },
                    { id: 'footer', label: '10. Footer' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setContentSubTab(sub.id)}
                      className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider whitespace-nowrap font-medium transition-all ${
                        contentSubTab === sub.id
                          ? 'bg-[#17251D] text-[#B89A70] font-semibold shadow-sm'
                          : 'text-[#555D56] hover:bg-white'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>

                {/* PAGE 1: HOMEPAGE CMS */}
                {contentSubTab === 'home' && pageDraft.home && (
                  <div className="bg-white border border-[#EAE4DB] rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
                    
                    {/* Hero Section */}
                    <div className="space-y-4 pb-6 border-b border-[#EAE4DB]">
                      <h3 className="font-roman text-2xl text-[#17251D] uppercase">
                        Hero Section
                      </h3>

                      <ImageFieldWithPicker
                        label="Hero Background Photograph (Mobile, Tablet & Fallback)"
                        value={pageDraft.home.hero?.image || '/images/mineral-springs/dawaipani-balcony-sunset-clouds.jpg'}
                        onChange={(url) => setPageDraft(p => ({
                          ...p,
                          home: { ...p.home, hero: { ...p.home.hero, image: url } }
                        }))}
                        onPick={() => openMediaPicker('Select Hero Background Photograph', (url) => {
                          setPageDraft(p => ({
                            ...p,
                            home: { ...p.home, hero: { ...p.home.hero, image: url } }
                          }));
                        })}
                        onUploadDirect={(dataUrl, filename) => handleDirectUploadForField(dataUrl, filename, (url) => {
                          setPageDraft(p => ({
                            ...p,
                            home: { ...p.home, hero: { ...p.home.hero, image: url } }
                          }));
                        })}
                      />

                      {/* Desktop Cinematic Video Background */}
                      <div className="p-4 bg-[#FAF7F2] border border-[#EAE4DB] rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] flex items-center gap-2">
                            <span>Desktop Hero Cinematic Video</span>
                            <span className="text-[9px] bg-[#1E2C22] text-[#DFCCA8] px-2 py-0.5 rounded font-medium tracking-normal">
                              Desktop/Laptop &ge; 1024px Only
                            </span>
                          </label>
                          {pageDraft.home.hero?.video && (
                            <button
                              type="button"
                              onClick={() => setPageDraft(p => ({
                                ...p,
                                home: { ...p.home, hero: { ...p.home.hero, video: '' } }
                              }))}
                              className="text-[11px] text-red-600 hover:text-red-700 underline"
                            >
                              Remove Video
                            </button>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={pageDraft.home.hero?.video || ''}
                            placeholder="/videos/dawaipani-reel.mp4"
                            onChange={(e) => setPageDraft(p => ({
                              ...p,
                              home: { ...p.home, hero: { ...p.home.hero, video: e.target.value } }
                            }))}
                            className="flex-1 px-4 py-2.5 bg-white border border-[#D5C9B8] text-xs rounded-xl font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => openMediaPicker('Select Desktop Hero Video', (url) => {
                              setPageDraft(p => ({
                                ...p,
                                home: { ...p.home, hero: { ...p.home.hero, video: url } }
                              }));
                            })}
                            className="px-3.5 py-2 bg-white hover:bg-[#F2ECE1] border border-[#D5C9B8] text-xs text-[#1E2C22] rounded-xl font-medium shrink-0 flex items-center gap-1.5 transition-colors"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Pick Asset</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-[#7A827B] leading-relaxed">
                          Muted looping MP4 video rendered exclusively on desktop and laptop displays (viewport &ge; 1024px). Mobile and tablet displays automatically serve the static photograph above to preserve cellular performance.
                        </p>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                          Retreat Gold Tagline Badge
                        </label>
                        <input
                          type="text"
                          value={pageDraft.home.hero?.badge || ''}
                          onChange={(e) => setPageDraft(p => ({
                            ...p,
                            home: { ...p.home, hero: { ...p.home.hero, badge: e.target.value } }
                          }))}
                          className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                            Monumental Hero Headline (supports newlines)
                          </label>
                          <textarea
                            rows={3}
                            value={pageDraft.home.hero?.title || ''}
                            onChange={(e) => setPageDraft(p => ({
                              ...p,
                              home: { ...p.home, hero: { ...p.home.hero, title: e.target.value } }
                            }))}
                            className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-sm rounded-xl font-roman"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                            Hero Subtitle
                          </label>
                          <textarea
                            rows={3}
                            value={pageDraft.home.hero?.subtitle || ''}
                            onChange={(e) => setPageDraft(p => ({
                              ...p,
                              home: { ...p.home, hero: { ...p.home.hero, subtitle: e.target.value } }
                            }))}
                            className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                          />
                        </div>
                      </div>

                      {/* 3 Lining Numbers Stats */}
                      <div className="pt-2">
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-2">
                          Signature 3 Lining Numerals (Hero Stats Bar)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {(pageDraft.home.hero?.stats || []).map((stat, idx) => (
                            <div key={idx} className="p-3.5 bg-[#FAF7F2] border border-[#D5C9B8] rounded-xl space-y-2">
                              <div className="flex space-x-2">
                                <div className="flex-1">
                                  <span className="text-[10px] text-neutral-400 uppercase">Value</span>
                                  <input
                                    type="text"
                                    value={stat.value}
                                    onChange={(e) => {
                                      const updated = [...pageDraft.home.hero.stats];
                                      updated[idx] = { ...updated[idx], value: e.target.value };
                                      setPageDraft(p => ({ ...p, home: { ...p.home, hero: { ...p.home.hero, stats: updated } } }));
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-[#D5C9B8] text-sm font-serif font-bold rounded-lg"
                                  />
                                </div>
                                <div className="w-20">
                                  <span className="text-[10px] text-neutral-400 uppercase">Unit</span>
                                  <input
                                    type="text"
                                    value={stat.unit}
                                    onChange={(e) => {
                                      const updated = [...pageDraft.home.hero.stats];
                                      updated[idx] = { ...updated[idx], unit: e.target.value };
                                      setPageDraft(p => ({ ...p, home: { ...p.home, hero: { ...p.home.hero, stats: updated } } }));
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-[#D5C9B8] text-sm font-serif rounded-lg"
                                  />
                                </div>
                              </div>
                              <div>
                                <span className="text-[10px] text-neutral-400 uppercase">Label</span>
                                <input
                                  type="text"
                                  value={stat.label}
                                  onChange={(e) => {
                                    const updated = [...pageDraft.home.hero.stats];
                                    updated[idx] = { ...updated[idx], label: e.target.value };
                                    setPageDraft(p => ({ ...p, home: { ...p.home, hero: { ...p.home.hero, stats: updated } } }));
                                  }}
                                  className="w-full px-2.5 py-1.5 bg-white border border-[#D5C9B8] text-[11px] font-sans rounded-lg"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Editorial Introduction Section */}
                    <div className="space-y-4 pb-6 border-b border-[#EAE4DB]">
                      <h3 className="font-roman text-2xl text-[#17251D] uppercase">
                        Editorial Introduction & Carousel
                      </h3>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                          Eyebrow
                        </label>
                        <input
                          type="text"
                          value={pageDraft.home.intro?.eyebrow || ''}
                          onChange={(e) => setPageDraft(p => ({
                            ...p,
                            home: { ...p.home, intro: { ...p.home.intro, eyebrow: e.target.value } }
                          }))}
                          className="w-full px-4 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                          Main Editorial Statement
                        </label>
                        <textarea
                          rows={3}
                          value={pageDraft.home.intro?.heading || ''}
                          onChange={(e) => setPageDraft(p => ({
                            ...p,
                            home: { ...p.home, intro: { ...p.home.intro, heading: e.target.value } }
                          }))}
                          className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-sm rounded-xl font-roman"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                          Editorial Narrative Paragraph
                        </label>
                        <textarea
                          rows={4}
                          value={pageDraft.home.intro?.paragraph || ''}
                          onChange={(e) => setPageDraft(p => ({
                            ...p,
                            home: { ...p.home, intro: { ...p.home.intro, paragraph: e.target.value } }
                          }))}
                          className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Facilities Section */}
                    <div className="space-y-4 pb-6 border-b border-[#EAE4DB]">
                      <h3 className="font-roman text-2xl text-[#17251D] uppercase">
                        Comforts & Essentials Section
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(pageDraft.home.facilities?.items || []).map((item, idx) => (
                          <div key={idx} className="p-3.5 bg-[#FAF7F2] border border-[#D5C9B8] rounded-xl space-y-2">
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const updated = [...pageDraft.home.facilities.items];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setPageDraft(p => ({ ...p, home: { ...p.home, facilities: { ...p.home.facilities, items: updated } } }));
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-[#D5C9B8] text-xs font-semibold rounded-lg"
                            />
                            <textarea
                              rows={2}
                              value={item.desc}
                              onChange={(e) => {
                                const updated = [...pageDraft.home.facilities.items];
                                updated[idx] = { ...updated[idx], desc: e.target.value };
                                setPageDraft(p => ({ ...p, home: { ...p.home, facilities: { ...p.home.facilities, items: updated } } }));
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-[#D5C9B8] text-xs rounded-lg"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#EAE4DB]">
                        <ImageFieldWithPicker
                          label="Facilities Feature Photo 1 (Porch / Exterior)"
                          value={pageDraft.home.facilities?.images?.[0] || '/images/mineral-springs/retreat-covered-porch-lantern.jpg'}
                          onChange={(url) => setPageDraft(p => ({
                            ...p,
                            home: { ...p.home, facilities: { ...p.home.facilities, images: [url, pageDraft.home.facilities?.images?.[1] || '/images/mineral-springs/room-cozy-pine-bedroom.jpg'] } }
                          }))}
                          onPick={() => openMediaPicker('Select Facilities Photo 1', (url) => {
                            setPageDraft(p => ({
                              ...p,
                              home: { ...p.home, facilities: { ...p.home.facilities, images: [url, pageDraft.home.facilities?.images?.[1] || '/images/mineral-springs/room-cozy-pine-bedroom.jpg'] } }
                            }));
                          })}
                          onUploadDirect={(dataUrl, filename) => handleDirectUploadForField(dataUrl, filename, (url) => {
                            setPageDraft(p => ({
                              ...p,
                              home: { ...p.home, facilities: { ...p.home.facilities, images: [url, pageDraft.home.facilities?.images?.[1] || '/images/mineral-springs/room-cozy-pine-bedroom.jpg'] } }
                            }));
                          })}
                        />

                        <ImageFieldWithPicker
                          label="Facilities Feature Photo 2 (Bedroom / Interior)"
                          value={pageDraft.home.facilities?.images?.[1] || '/images/mineral-springs/room-cozy-pine-bedroom.jpg'}
                          onChange={(url) => setPageDraft(p => ({
                            ...p,
                            home: { ...p.home, facilities: { ...p.home.facilities, images: [pageDraft.home.facilities?.images?.[0] || '/images/mineral-springs/retreat-covered-porch-lantern.jpg', url] } }
                          }))}
                          onPick={() => openMediaPicker('Select Facilities Photo 2', (url) => {
                            setPageDraft(p => ({
                              ...p,
                              home: { ...p.home, facilities: { ...p.home.facilities, images: [pageDraft.home.facilities?.images?.[0] || '/images/mineral-springs/retreat-covered-porch-lantern.jpg', url] } }
                            }));
                          })}
                          onUploadDirect={(dataUrl, filename) => handleDirectUploadForField(dataUrl, filename, (url) => {
                            setPageDraft(p => ({
                              ...p,
                              home: { ...p.home, facilities: { ...p.home.facilities, images: [pageDraft.home.facilities?.images?.[0] || '/images/mineral-springs/retreat-covered-porch-lantern.jpg', url] } }
                            }));
                          })}
                        />
                      </div>
                    </div>

                    {/* Booking Call to Action Section */}
                    <div className="space-y-4 pb-6 border-b border-[#EAE4DB]">
                      <h3 className="font-roman text-2xl text-[#17251D] uppercase">
                        Booking CTA Section
                      </h3>
                      <ImageFieldWithPicker
                        label="Booking Banner Background Photograph"
                        value={pageDraft.home.bookingCTA?.image || '/images/mineral-springs/retreat-wooden-balcony-guitar.jpg'}
                        onChange={(url) => setPageDraft(p => ({
                          ...p,
                          home: { ...p.home, bookingCTA: { ...p.home.bookingCTA, image: url } }
                        }))}
                        onPick={() => openMediaPicker('Select Booking CTA Background', (url) => {
                          setPageDraft(p => ({
                            ...p,
                            home: { ...p.home, bookingCTA: { ...p.home.bookingCTA, image: url } }
                          }));
                        })}
                        onUploadDirect={(dataUrl, filename) => handleDirectUploadForField(dataUrl, filename, (url) => {
                          setPageDraft(p => ({
                            ...p,
                            home: { ...p.home, bookingCTA: { ...p.home.bookingCTA, image: url } }
                          }));
                        })}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                            CTA Eyebrow
                          </label>
                          <input
                            type="text"
                            value={pageDraft.home.bookingCTA?.eyebrow || ''}
                            onChange={(e) => setPageDraft(p => ({
                              ...p,
                              home: { ...p.home, bookingCTA: { ...p.home.bookingCTA, eyebrow: e.target.value } }
                            }))}
                            className="w-full px-4 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                            Button Text
                          </label>
                          <input
                            type="text"
                            value={pageDraft.home.bookingCTA?.buttonText || ''}
                            onChange={(e) => setPageDraft(p => ({
                              ...p,
                              home: { ...p.home, bookingCTA: { ...p.home.bookingCTA, buttonText: e.target.value } }
                            }))}
                            className="w-full px-4 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                          Statement / Narrative
                        </label>
                        <textarea
                          rows={3}
                          value={pageDraft.home.bookingCTA?.statement || pageDraft.home.bookingCTA?.heading || ''}
                          onChange={(e) => setPageDraft(p => ({
                            ...p,
                            home: { ...p.home, bookingCTA: { ...p.home.bookingCTA, statement: e.target.value, heading: e.target.value } }
                          }))}
                          className="w-full px-4 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => handleSavePageContent('home')}
                        className="px-6 py-3 bg-[#17251D] hover:bg-black text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-2 transition-colors shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-[#B89A70]" />
                        <span>Save & Publish to Live Website</span>
                      </button>
                    </div>

                  </div>
                )}

                {/* PAGE 2: ABOUT CMS */}
                {contentSubTab === 'about' && pageDraft.about && (
                  <div className="bg-white border border-[#EAE4DB] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                    <h3 className="font-roman text-2xl text-[#17251D] uppercase">About Page Content</h3>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Hero Title</label>
                      <input
                        type="text"
                        value={pageDraft.about.heroTitle || ''}
                        onChange={(e) => setPageDraft(p => ({ ...p, about: { ...p.about, heroTitle: e.target.value } }))}
                        className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-sm rounded-xl font-roman"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Story Heading</label>
                      <input
                        type="text"
                        value={pageDraft.about.storyHeading || ''}
                        onChange={(e) => setPageDraft(p => ({ ...p, about: { ...p.about, storyHeading: e.target.value } }))}
                        className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-sm rounded-xl font-roman"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Story Narrative (Part 1)</label>
                      <textarea
                        rows={4}
                        value={pageDraft.about.storyParagraph1 || ''}
                        onChange={(e) => setPageDraft(p => ({ ...p, about: { ...p.about, storyParagraph1: e.target.value } }))}
                        className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Story Narrative (Part 2)</label>
                      <textarea
                        rows={4}
                        value={pageDraft.about.storyParagraph2 || ''}
                        onChange={(e) => setPageDraft(p => ({ ...p, about: { ...p.about, storyParagraph2: e.target.value } }))}
                        className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                      />
                    </div>

                    <ImageFieldWithPicker
                      label="Editorial Story Photograph"
                      value={pageDraft.about.image || '/images/mineral-springs/retreat-main-cottage-facade.jpg'}
                      onChange={(url) => setPageDraft(p => ({
                        ...p,
                        about: { ...p.about, image: url }
                      }))}
                      onPick={() => openMediaPicker('Select About Story Photograph', (url) => {
                        setPageDraft(p => ({
                          ...p,
                          about: { ...p.about, image: url }
                        }));
                      })}
                      onUploadDirect={(dataUrl, filename) => handleDirectUploadForField(dataUrl, filename, (url) => {
                        setPageDraft(p => ({
                          ...p,
                          about: { ...p.about, image: url }
                        }));
                      })}
                    />

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => handleSavePageContent('about')}
                        className="px-6 py-3 bg-[#17251D] hover:bg-black text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-2 transition-colors shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-[#B89A70]" />
                        <span>Save & Publish to Live Website</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* PAGE 3: DAWAIPANI CMS */}
                {contentSubTab === 'dawaipani' && pageDraft.dawaipani && (
                  <div className="bg-white border border-[#EAE4DB] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                    <h3 className="font-roman text-2xl text-[#17251D] uppercase">Dawaipani Village Feature</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Title</label>
                        <input
                          type="text"
                          value={pageDraft.dawaipani.title || ''}
                          onChange={(e) => setPageDraft(p => ({ ...p, dawaipani: { ...p.dawaipani, title: e.target.value } }))}
                          className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-sm rounded-xl font-roman"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Elevation Stat</label>
                        <input
                          type="text"
                          value={pageDraft.dawaipani.elevation || ''}
                          onChange={(e) => setPageDraft(p => ({ ...p, dawaipani: { ...p.dawaipani, elevation: e.target.value } }))}
                          className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-sm rounded-xl font-serif font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Subtitle</label>
                      <textarea
                        rows={2}
                        value={pageDraft.dawaipani.subtitle || ''}
                        onChange={(e) => setPageDraft(p => ({ ...p, dawaipani: { ...p.dawaipani, subtitle: e.target.value } }))}
                        className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Weather & Seasonal Advice</label>
                      <textarea
                        rows={2}
                        value={pageDraft.dawaipani.weatherHighlights || ''}
                        onChange={(e) => setPageDraft(p => ({ ...p, dawaipani: { ...p.dawaipani, weatherHighlights: e.target.value } }))}
                        className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                      />
                    </div>

                    <ImageFieldWithPicker
                      label="Dawaipani Full-Width Panoramic Banner Photograph"
                      value={pageDraft.dawaipani.image || '/images/mineral-springs/dawaipani-balcony-valley-vista.jpg'}
                      onChange={(url) => setPageDraft(p => ({
                        ...p,
                        dawaipani: { ...p.dawaipani, image: url }
                      }))}
                      onPick={() => openMediaPicker('Select Dawaipani Panoramic Photograph', (url) => {
                        setPageDraft(p => ({
                          ...p,
                          dawaipani: { ...p.dawaipani, image: url }
                        }));
                      })}
                      onUploadDirect={(dataUrl, filename) => handleDirectUploadForField(dataUrl, filename, (url) => {
                        setPageDraft(p => ({
                          ...p,
                          dawaipani: { ...p.dawaipani, image: url }
                        }));
                      })}
                    />

                    {/* 5 Standardized Distance Cards on Dawaipani Feature */}
                    <div className="space-y-3 pt-3 border-t border-[#EAE4DB]">
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block">
                        5 Travel Distance Cards (Standardized Alignment)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {((pageDraft.dawaipani.distanceCards && pageDraft.dawaipani.distanceCards.length > 0)
                          ? pageDraft.dawaipani.distanceCards
                          : (pageDraft.travel?.distances && pageDraft.travel.distances.length >= 5)
                            ? pageDraft.travel.distances.slice(0, 5).map(d => ({
                                title: d.destination ? d.destination.replace(/\s*\(.*?\)/, '') : d.title,
                                distance: d.distance,
                                desc: d.route || d.time || d.desc
                              }))
                            : [
                                { title: 'Darjeeling Town', distance: '15 km', desc: 'Scenic mountain drive' },
                                { title: 'Jorebunglow Junction', distance: '7 km', desc: 'Connecting ridge point' },
                                { title: 'Siliguri', distance: '~50 km', desc: 'Foothills gateway' },
                                { title: 'NJP Railway Station', distance: '~75 km', desc: 'Major rail terminus' },
                                { title: 'Bagdogra Airport (IXB)', distance: '~78 km', desc: 'Regional flight terminal' }
                              ]
                        ).map((card, idx) => (
                          <div key={idx} className="p-3 bg-[#FAF7F2] border border-[#D5C9B8] rounded-xl space-y-1.5">
                            <span className="text-[10px] text-neutral-400 uppercase font-semibold">Card 0{idx + 1}</span>
                            <input
                              type="text"
                              value={card.title}
                              placeholder="Town Name"
                              onChange={(e) => {
                                const current = pageDraft.dawaipani.distanceCards || [
                                  { title: 'Darjeeling Town', distance: '15 km', desc: 'Scenic mountain drive' },
                                  { title: 'Jorebunglow Junction', distance: '7 km', desc: 'Connecting ridge point' },
                                  { title: 'Siliguri', distance: '~50 km', desc: 'Foothills gateway' },
                                  { title: 'NJP Railway Station', distance: '~75 km', desc: 'Major rail terminus' },
                                  { title: 'Bagdogra Airport (IXB)', distance: '~78 km', desc: 'Regional flight terminal' }
                                ];
                                const updated = [...current];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setPageDraft(p => ({ ...p, dawaipani: { ...p.dawaipani, distanceCards: updated } }));
                              }}
                              className="w-full px-2 py-1 bg-white border border-[#D5C9B8] text-xs font-semibold rounded-lg"
                            />
                            <input
                              type="text"
                              value={card.distance}
                              placeholder="Distance"
                              onChange={(e) => {
                                const current = pageDraft.dawaipani.distanceCards || [
                                  { title: 'Darjeeling Town', distance: '15 km', desc: 'Scenic mountain drive' },
                                  { title: 'Jorebunglow Junction', distance: '7 km', desc: 'Connecting ridge point' },
                                  { title: 'Siliguri', distance: '~50 km', desc: 'Foothills gateway' },
                                  { title: 'NJP Railway Station', distance: '~75 km', desc: 'Major rail terminus' },
                                  { title: 'Bagdogra Airport (IXB)', distance: '~78 km', desc: 'Regional flight terminal' }
                                ];
                                const updated = [...current];
                                updated[idx] = { ...updated[idx], distance: e.target.value };
                                setPageDraft(p => ({ ...p, dawaipani: { ...p.dawaipani, distanceCards: updated } }));
                              }}
                              className="w-full px-2 py-1 bg-white border border-[#D5C9B8] text-xs font-serif font-bold rounded-lg"
                            />
                            <input
                              type="text"
                              value={card.desc}
                              placeholder="Short note"
                              onChange={(e) => {
                                const current = pageDraft.dawaipani.distanceCards || [
                                  { title: 'Darjeeling Town', distance: '15 km', desc: 'Scenic mountain drive' },
                                  { title: 'Jorebunglow Junction', distance: '7 km', desc: 'Connecting ridge point' },
                                  { title: 'Siliguri', distance: '~50 km', desc: 'Foothills gateway' },
                                  { title: 'NJP Railway Station', distance: '~75 km', desc: 'Major rail terminus' },
                                  { title: 'Bagdogra Airport (IXB)', distance: '~78 km', desc: 'Regional flight terminal' }
                                ];
                                const updated = [...current];
                                updated[idx] = { ...updated[idx], desc: e.target.value };
                                setPageDraft(p => ({ ...p, dawaipani: { ...p.dawaipani, distanceCards: updated } }));
                              }}
                              className="w-full px-2 py-1 bg-white border border-[#D5C9B8] text-[11px] rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => handleSavePageContent('dawaipani')}
                        className="px-6 py-3 bg-[#17251D] hover:bg-black text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-2 transition-colors shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-[#B89A70]" />
                        <span>Save & Publish to Live Website</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* PAGE 7: TRAVEL GUIDE CMS */}
                {contentSubTab === 'travel' && pageDraft.travel && (
                  <div className="bg-white border border-[#EAE4DB] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                    <h3 className="font-roman text-2xl text-[#17251D] uppercase">Travel & Distance Cards</h3>
                    <p className="text-xs text-[#555D56]">Manage the 5 standardized travel cards and driving routes.</p>
                    <div className="space-y-4">
                      {(pageDraft.travel.distances || []).map((card, idx) => (
                        <div key={idx} className="p-4 bg-[#FAF7F2] border border-[#D5C9B8] rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                          <div className="md:col-span-2">
                            <span className="text-[10px] text-neutral-400 uppercase font-semibold">Location</span>
                            <input
                              type="text"
                              value={card.destination}
                              onChange={(e) => {
                                const updated = [...pageDraft.travel.distances];
                                updated[idx] = { ...updated[idx], destination: e.target.value };
                                setPageDraft(p => ({ ...p, travel: { ...p.travel, distances: updated } }));
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-[#D5C9B8] text-xs font-semibold rounded-lg"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-neutral-400 uppercase font-semibold">Distance (Serif)</span>
                            <input
                              type="text"
                              value={card.distance}
                              onChange={(e) => {
                                const updated = [...pageDraft.travel.distances];
                                updated[idx] = { ...updated[idx], distance: e.target.value };
                                setPageDraft(p => ({ ...p, travel: { ...p.travel, distances: updated } }));
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-[#D5C9B8] text-xs font-serif font-bold rounded-lg"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-neutral-400 uppercase font-semibold">Duration</span>
                            <input
                              type="text"
                              value={card.time}
                              onChange={(e) => {
                                const updated = [...pageDraft.travel.distances];
                                updated[idx] = { ...updated[idx], time: e.target.value };
                                setPageDraft(p => ({ ...p, travel: { ...p.travel, distances: updated } }));
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-[#D5C9B8] text-xs rounded-lg"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => handleSavePageContent('travel')}
                        className="px-6 py-3 bg-[#17251D] hover:bg-black text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-2 transition-colors shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-[#B89A70]" />
                        <span>Save & Publish to Live Website</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* PAGE 9: HEADER CMS */}
                {contentSubTab === 'header' && pageDraft.header && (
                  <div className="bg-white border border-[#EAE4DB] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                    <h3 className="font-roman text-2xl text-[#17251D] uppercase">Header & Navigation</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Brand Main Title</label>
                        <input
                          type="text"
                          value={pageDraft.header.brandTitle || ''}
                          onChange={(e) => setPageDraft(p => ({ ...p, header: { ...p.header, brandTitle: e.target.value } }))}
                          className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-sm rounded-xl font-roman"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Brand Subtitle</label>
                        <input
                          type="text"
                          value={pageDraft.header.brandSubtitle || ''}
                          onChange={(e) => setPageDraft(p => ({ ...p, header: { ...p.header, brandSubtitle: e.target.value } }))}
                          className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-sm rounded-xl font-roman"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-2">Navigation Items Sequence</label>
                      <div className="space-y-2">
                        {(pageDraft.header.navItems || []).map((item, idx) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-[#FAF7F2] border border-[#D5C9B8] rounded-xl text-xs">
                            <span className="font-mono font-bold text-[#17251D] w-8">{idx + 1}.</span>
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => {
                                const updated = [...pageDraft.header.navItems];
                                updated[idx] = { ...updated[idx], label: e.target.value };
                                setPageDraft(p => ({ ...p, header: { ...p.header, navItems: updated } }));
                              }}
                              className="px-3 py-1 bg-white border border-[#D5C9B8] rounded-lg text-xs font-semibold uppercase flex-1 max-w-xs mx-4"
                            />
                            <label className="flex items-center space-x-2 cursor-pointer text-xs">
                              <input
                                type="checkbox"
                                checked={item.visible !== false}
                                onChange={(e) => {
                                  const updated = [...pageDraft.header.navItems];
                                  updated[idx] = { ...updated[idx], visible: e.target.checked };
                                  setPageDraft(p => ({ ...p, header: { ...p.header, navItems: updated } }));
                                }}
                                className="rounded text-[#B89A70]"
                              />
                              <span className="text-neutral-600">Visible</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => handleSavePageContent('header')}
                        className="px-6 py-3 bg-[#17251D] hover:bg-black text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-2 transition-colors shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-[#B89A70]" />
                        <span>Save & Publish to Live Website</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* PAGE 10: FOOTER CMS */}
                {contentSubTab === 'footer' && pageDraft.footer && (
                  <div className="bg-white border border-[#EAE4DB] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                    <h3 className="font-roman text-2xl text-[#17251D] uppercase">Footer & Contact Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Telephone 1 (Primary)</label>
                        <input
                          type="text"
                          value={pageDraft.footer.phone || ''}
                          onChange={(e) => setPageDraft(p => ({ ...p, footer: { ...p.footer, phone: e.target.value } }))}
                          placeholder="+91 79081 92498"
                          className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Telephone 2 (Secondary)</label>
                        <input
                          type="text"
                          value={pageDraft.footer.phone2 || ''}
                          onChange={(e) => setPageDraft(p => ({ ...p, footer: { ...p.footer, phone2: e.target.value } }))}
                          placeholder="+91 98303 55105"
                          className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">WhatsApp 1 (Primary)</label>
                        <input
                          type="text"
                          value={pageDraft.footer.whatsapp || ''}
                          onChange={(e) => setPageDraft(p => ({ ...p, footer: { ...p.footer, whatsapp: e.target.value } }))}
                          placeholder="+91 79081 92498"
                          className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">WhatsApp 2 (Secondary)</label>
                        <input
                          type="text"
                          value={pageDraft.footer.whatsapp2 || ''}
                          onChange={(e) => setPageDraft(p => ({ ...p, footer: { ...p.footer, whatsapp2: e.target.value } }))}
                          placeholder="+91 98303 55105"
                          className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Email</label>
                        <input
                          type="email"
                          value={pageDraft.footer.email || ''}
                          onChange={(e) => setPageDraft(p => ({ ...p, footer: { ...p.footer, email: e.target.value } }))}
                          className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Physical Address</label>
                      <input
                        type="text"
                        value={pageDraft.footer.address || ''}
                        onChange={(e) => setPageDraft(p => ({ ...p, footer: { ...p.footer, address: e.target.value } }))}
                        className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Bio Description</label>
                      <textarea
                        rows={3}
                        value={pageDraft.footer.bio || ''}
                        onChange={(e) => setPageDraft(p => ({ ...p, footer: { ...p.footer, bio: e.target.value } }))}
                        className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                      />
                    </div>
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => handleSavePageContent('footer')}
                        className="px-6 py-3 bg-[#17251D] hover:bg-black text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-2 transition-colors shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-[#B89A70]" />
                        <span>Save & Publish to Live Website</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Fallback for other sub-tabs */}
                {['stay', 'experiences', 'gallery', 'reservation'].includes(contentSubTab) && (
                  <div className="bg-white border border-[#EAE4DB] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
                    <h3 className="font-roman text-2xl text-[#17251D] uppercase">
                      {contentSubTab.toUpperCase()} Section Narrative
                    </h3>
                    <p className="text-xs text-[#555D56]">
                      Edit titles and overview descriptions for the {contentSubTab} section.
                    </p>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Section Title</label>
                      <input
                        type="text"
                        value={pageDraft[contentSubTab]?.title || ''}
                        onChange={(e) => setPageDraft(p => ({ ...p, [contentSubTab]: { ...p[contentSubTab], title: e.target.value } }))}
                        className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-sm rounded-xl font-roman"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Section Subtitle</label>
                      <textarea
                        rows={3}
                        value={pageDraft[contentSubTab]?.subtitle || ''}
                        onChange={(e) => setPageDraft(p => ({ ...p, [contentSubTab]: { ...p[contentSubTab], subtitle: e.target.value } }))}
                        className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                      />
                    </div>
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => handleSavePageContent(contentSubTab)}
                        className="px-6 py-3 bg-[#17251D] hover:bg-black text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-2 transition-colors shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-[#B89A70]" />
                        <span>Save & Publish to Live Website</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 3. MEDIA LIBRARY TAB */}
            {activeTab === 'media' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-roman text-3xl sm:text-4xl text-[#17251D] uppercase tracking-wide">
                      Media Library
                    </h2>
                    <p className="text-xs text-[#555D56] mt-1">
                      Upload photographs, edit alt text, search, and replace images with automated website reference updates.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <label className="px-4 py-2 bg-[#17251D] text-[#B89A70] hover:bg-[#203429] text-xs uppercase tracking-wider font-semibold rounded-xl cursor-pointer flex items-center space-x-2 shadow-sm transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photos</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleMediaUploadInput}
                      />
                    </label>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#EAE4DB] shadow-sm">
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    {['All', 'Rooms', 'Retreat', 'Vistas', 'General'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setMediaCategory(cat);
                          loadMedia(cat, mediaSearch);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                          mediaCategory === cat
                            ? 'bg-[#17251D] text-[#B89A70]'
                            : 'text-[#555D56] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search photos..."
                      value={mediaSearch}
                      onChange={(e) => {
                        setMediaSearch(e.target.value);
                        loadMedia(mediaCategory, e.target.value);
                      }}
                      className="w-full pl-9 pr-4 py-1.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl focus:outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Media Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mediaList.map((m) => (
                    <div
                      key={m.id}
                      className="group bg-white border border-[#EAE4DB] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
                    >
                      <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden cursor-pointer" onClick={() => setSelectedMedia(m)}>
                        <img
                          src={m.url}
                          alt={m.altText || m.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[#B89A70] text-[9px] uppercase font-bold tracking-wider">
                          {m.category || 'General'}
                        </div>
                      </div>

                      <div className="p-3 space-y-2">
                        <div className="text-xs font-semibold text-[#1A1A1A] truncate" title={m.title}>
                          {m.title}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate font-mono">
                          {m.filename}
                        </div>

                        <div className="pt-2 border-t border-[#EAE4DB] flex items-center justify-between">
                          {/* Replace Image Button */}
                          <label className="text-[11px] text-[#B89A70] hover:text-[#CBB08B] cursor-pointer flex items-center space-x-1 font-medium">
                            <RefreshCw className="w-3 h-3" />
                            <span>Replace</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleMediaReplaceInput(e, m.id)}
                            />
                          </label>

                          <button
                            onClick={() => {
                              if (confirm(`Delete image '${m.title}'?`)) deleteMedia(m.id);
                            }}
                            className="text-[11px] text-neutral-400 hover:text-rose-600 transition-colors"
                            title="Delete Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Media Metadata Modal */}
                {selectedMedia && (
                  <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white border border-[#EAE4DB] rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fade-in">
                      <div className="flex items-center justify-between border-b pb-3">
                        <h3 className="font-roman text-xl text-[#17251D] uppercase">Photo Details</h3>
                        <button onClick={() => setSelectedMedia(null)} className="p-1 text-neutral-400 hover:text-neutral-700">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-neutral-900">
                        <img src={selectedMedia.url} alt={selectedMedia.altText} className="w-full h-full object-contain" />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Title</label>
                          <input
                            type="text"
                            value={selectedMedia.title || ''}
                            onChange={(e) => setSelectedMedia({ ...selectedMedia, title: e.target.value })}
                            className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Alt Text (Accessibility)</label>
                          <input
                            type="text"
                            value={selectedMedia.altText || ''}
                            onChange={(e) => setSelectedMedia({ ...selectedMedia, altText: e.target.value })}
                            className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">URL Reference</label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              readOnly
                              value={selectedMedia.url}
                              className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs font-mono rounded-xl"
                            />
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(selectedMedia.url);
                                showToast('Copied URL to clipboard');
                              }}
                              className="px-3 py-1.5 bg-[#17251D] text-[#B89A70] text-xs rounded-xl font-medium"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-3 border-t">
                        <button
                          onClick={async () => {
                            await updateMediaMetadata(selectedMedia.id, {
                              title: selectedMedia.title,
                              altText: selectedMedia.altText,
                              category: selectedMedia.category
                            });
                            showToast('Updated photo metadata');
                            setSelectedMedia(null);
                          }}
                          className="px-4 py-2 bg-[#17251D] text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 4. ROOMS & SUITES TAB */}
            {activeTab === 'rooms' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-roman text-3xl sm:text-4xl text-[#17251D] uppercase tracking-wide">
                      Rooms & Accommodations
                    </h2>
                    <p className="text-xs text-[#555D56] mt-1">
                      Manage double sharing and group sharing suites, prices, included 4-meal plan specs, and photo galleries.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingRoom({
                        id: 'room-' + Date.now(),
                        name: 'New Alpine Room',
                        tagline: 'Quiet sanctuary overlooking pine hills',
                        description: 'A serene mountain eco-room with attached Western toilet and geyser.',
                        pricePerPerson: 1500,
                        pricePerNight: 3000,
                        sharingType: 'Double Sharing (~₹1,500/person)',
                        capacity: 2,
                        maxGuests: 2,
                        bed: '1 Double Bed',
                        size: '280 sq. ft.',
                        mealsIncluded: 'All 4 Meals (Breakfast, Lunch, Evening Snacks & Tea, Dinner)',
                        images: ['/images/mineral-springs/room-double-sharing-balcony.jpg'],
                        facilities: [
                          'Clean and comfortable room',
                          'Attached Western-style toilet',
                          'Geyser for 24/7 hot water',
                          'Private balcony with mountain views',
                          'All 4 home-cooked meals included'
                        ],
                        visible: true
                      });
                      setRoomModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#17251D] text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-2 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Suite</span>
                  </button>
                </div>

                {/* Rooms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rooms.map((room) => (
                    <div key={room.id} className="bg-white border border-[#EAE4DB] rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                      <div>
                        <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-neutral-900 relative">
                          <img
                            src={room.images?.[0] || '/images/mineral-springs/room-double-sharing-balcony.jpg'}
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#B89A70] text-[10px] uppercase font-bold tracking-wider">
                            ₹{room.pricePerPerson || 1500} / PERSON
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-roman text-2xl text-[#17251D] uppercase">{room.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            room.visible !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {room.visible !== false ? 'Published' : 'Draft'}
                          </span>
                        </div>

                        <div className="text-xs text-[#B89A70] font-medium mb-2">{room.sharingType}</div>
                        <p className="text-xs text-[#555D56] line-clamp-3 mb-3">{room.description}</p>

                        <div className="p-3 bg-[#FAF7F2] rounded-xl text-xs space-y-1">
                          <div className="text-neutral-700 font-medium">{room.bed} · {room.size}</div>
                          <div className="text-[11px] text-neutral-500">{room.mealsIncluded}</div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#EAE4DB] flex items-center justify-between">
                        <button
                          onClick={() => {
                            setEditingRoom({ ...room });
                            setRoomModalOpen(true);
                          }}
                          className="px-4 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE4DB] text-xs font-semibold rounded-lg text-[#17251D]"
                        >
                          Edit Details
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete suite '${room.name}'?`)) deleteRoom(room.id);
                          }}
                          className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Room Editor Modal */}
                {roomModalOpen && editingRoom && (
                  <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white border border-[#EAE4DB] rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
                      <div className="flex items-center justify-between border-b pb-3">
                        <h3 className="font-roman text-2xl text-[#17251D] uppercase">
                          {rooms.some(r => r.id === editingRoom.id) ? 'Edit Suite' : 'Add New Suite'}
                        </h3>
                        <button onClick={() => setRoomModalOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-700">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Suite Name</label>
                          <input
                            type="text"
                            value={editingRoom.name}
                            onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs font-semibold rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Sharing Type Label</label>
                          <input
                            type="text"
                            value={editingRoom.sharingType}
                            onChange={(e) => setEditingRoom({ ...editingRoom, sharingType: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Rate Per Person (₹)</label>
                          <input
                            type="number"
                            value={editingRoom.pricePerPerson}
                            onChange={(e) => setEditingRoom({ ...editingRoom, pricePerPerson: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs font-bold rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Bed Configuration</label>
                          <input
                            type="text"
                            value={editingRoom.bed}
                            onChange={(e) => setEditingRoom({ ...editingRoom, bed: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Room Size</label>
                          <input
                            type="text"
                            value={editingRoom.size}
                            onChange={(e) => setEditingRoom({ ...editingRoom, size: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={editingRoom.description}
                          onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Included Meals Notice</label>
                        <input
                          type="text"
                          value={editingRoom.mealsIncluded}
                          onChange={(e) => setEditingRoom({ ...editingRoom, mealsIncluded: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                        />
                      </div>

                      <ImageFieldWithPicker
                        label="Primary Suite Photograph"
                        value={editingRoom.images?.[0] || ''}
                        onChange={(url) => setEditingRoom({ ...editingRoom, images: [url, ...(editingRoom.images?.slice(1) || [])] })}
                        onPick={() => openMediaPicker(`Select Photograph for ${editingRoom.name}`, (url) => {
                          setEditingRoom({ ...editingRoom, images: [url, ...(editingRoom.images?.slice(1) || [])] });
                        })}
                        onUploadDirect={(dataUrl, filename) => handleDirectUploadForField(dataUrl, filename, (url) => {
                          setEditingRoom({ ...editingRoom, images: [url, ...(editingRoom.images?.slice(1) || [])] });
                        })}
                      />

                      <div className="flex items-center space-x-2 pt-2">
                        <label className="flex items-center space-x-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingRoom.visible !== false}
                            onChange={(e) => setEditingRoom({ ...editingRoom, visible: e.target.checked })}
                            className="rounded text-[#B89A70]"
                          />
                          <span className="font-semibold text-[#17251D]">Published on Website</span>
                        </label>
                      </div>

                      <div className="flex justify-end space-x-2 pt-4 border-t">
                        <button
                          onClick={async () => {
                            const isEdit = rooms.some(r => r.id === editingRoom.id);
                            await saveRoom(editingRoom, isEdit);
                            showToast(`Saved suite '${editingRoom.name}'`);
                            setRoomModalOpen(false);
                          }}
                          className="px-5 py-2.5 bg-[#17251D] text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl"
                        >
                          Save Suite
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 5. EXPERIENCES TAB */}
            {activeTab === 'experiences' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-roman text-3xl sm:text-4xl text-[#17251D] uppercase tracking-wide">
                      Retreat Experiences
                    </h2>
                    <p className="text-xs text-[#555D56] mt-1">
                      Manage curated homestay activities (balcony clouds, verandah acoustic music, garden treks).
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingExp({
                        id: 'exp-' + Date.now(),
                        title: 'New Mountain Experience',
                        category: 'Nature',
                        highlight: 'Curated Homestay Activity',
                        timing: 'Morning',
                        description: 'Immerse in the natural peace of Dawaipani.',
                        image: '/images/mineral-springs/retreat-wooden-balcony-guitar.jpg',
                        visible: true
                      });
                      setExpModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#17251D] text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-2 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Experience</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="bg-white border border-[#EAE4DB] rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                      <div>
                        <div className="w-full h-44 rounded-xl overflow-hidden mb-3 bg-neutral-900 relative">
                          <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-[#B89A70] text-[9px] uppercase font-bold tracking-wider">
                            {exp.category}
                          </div>
                        </div>

                        <h3 className="font-roman text-xl text-[#17251D] uppercase mb-1">{exp.title}</h3>
                        <div className="text-[11px] text-[#B89A70] font-semibold mb-2">{exp.highlight} · {exp.timing}</div>
                        <p className="text-xs text-[#555D56] line-clamp-3">{exp.description}</p>
                      </div>

                      <div className="pt-3 border-t border-[#EAE4DB] flex items-center justify-between">
                        <button
                          onClick={() => {
                            setEditingExp({ ...exp });
                            setExpModalOpen(true);
                          }}
                          className="px-3 py-1 bg-[#FAF7F2] text-xs font-semibold rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete experience '${exp.title}'?`)) deleteExperience(exp.id);
                          }}
                          className="text-xs text-rose-600 hover:bg-rose-50 px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Experience Modal */}
                {expModalOpen && editingExp && (
                  <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white border border-[#EAE4DB] rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
                      <div className="flex items-center justify-between border-b pb-3">
                        <h3 className="font-roman text-xl text-[#17251D] uppercase">Edit Experience</h3>
                        <button onClick={() => setExpModalOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-700">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Title</label>
                        <input
                          type="text"
                          value={editingExp.title}
                          onChange={(e) => setEditingExp({ ...editingExp, title: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs font-semibold rounded-xl"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Category</label>
                          <input
                            type="text"
                            value={editingExp.category}
                            onChange={(e) => setEditingExp({ ...editingExp, category: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Timing</label>
                          <input
                            type="text"
                            value={editingExp.timing}
                            onChange={(e) => setEditingExp({ ...editingExp, timing: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Highlight Badge</label>
                        <input
                          type="text"
                          value={editingExp.highlight}
                          onChange={(e) => setEditingExp({ ...editingExp, highlight: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                        />
                      </div>

                      <ImageFieldWithPicker
                        label="Experience Photograph"
                        value={editingExp.image || ''}
                        onChange={(url) => setEditingExp({ ...editingExp, image: url })}
                        onPick={() => openMediaPicker(`Select Photograph for ${editingExp.title}`, (url) => {
                          setEditingExp({ ...editingExp, image: url });
                        })}
                        onUploadDirect={(dataUrl, filename) => handleDirectUploadForField(dataUrl, filename, (url) => {
                          setEditingExp({ ...editingExp, image: url });
                        })}
                      />

                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={editingExp.description}
                          onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                        />
                      </div>

                      <div className="flex justify-end pt-3 border-t">
                        <button
                          onClick={async () => {
                            const isEdit = experiences.some(e => e.id === editingExp.id);
                            await saveExperience(editingExp, isEdit);
                            showToast(`Saved experience '${editingExp.title}'`);
                            setExpModalOpen(false);
                          }}
                          className="px-5 py-2.5 bg-[#17251D] text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl"
                        >
                          Save Experience
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 6. GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-roman text-3xl sm:text-4xl text-[#17251D] uppercase tracking-wide">
                      Gallery Management
                    </h2>
                    <p className="text-xs text-[#555D56] mt-1">
                      Manage visual showcases, captions, and category tagging.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingPhoto({
                        id: 'gal-' + Date.now(),
                        title: 'Homestay View',
                        category: 'Landscape',
                        aspect: 'wide',
                        image: '/images/mineral-springs/retreat-main-cottage-facade.jpg',
                        altText: 'Mineral Springs Retreat photo'
                      });
                      setPhotoModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#17251D] text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-2 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Gallery Photo</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {gallery.map((photo) => (
                    <div key={photo.id} className="bg-white border border-[#EAE4DB] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                      <div className="aspect-[4/3] bg-neutral-900 relative">
                        <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[#B89A70] text-[9px] uppercase font-bold">
                          {photo.category}
                        </span>
                      </div>
                      <div className="p-3">
                        <div className="text-xs font-semibold text-[#1A1A1A] truncate">{photo.title}</div>
                        <div className="pt-2 border-t border-[#EAE4DB] flex items-center justify-between mt-2">
                          <button
                            onClick={() => {
                              setEditingPhoto({ ...photo });
                              setPhotoModalOpen(true);
                            }}
                            className="text-[11px] text-[#B89A70] hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete '${photo.title}'?`)) deleteGalleryPhoto(photo.id);
                            }}
                            className="text-[11px] text-rose-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Photo Modal */}
                {photoModalOpen && editingPhoto && (
                  <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white border border-[#EAE4DB] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                      <div className="flex items-center justify-between border-b pb-3">
                        <h3 className="font-roman text-xl text-[#17251D] uppercase">Edit Gallery Photo</h3>
                        <button onClick={() => setPhotoModalOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-700">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Title</label>
                        <input
                          type="text"
                          value={editingPhoto.title}
                          onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Category</label>
                          <select
                            value={editingPhoto.category}
                            onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                          >
                            <option value="Landscape">Landscape</option>
                            <option value="Architecture">Architecture</option>
                            <option value="Rooms">Rooms</option>
                            <option value="Nature">Nature</option>
                            <option value="Lifestyle">Lifestyle</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">Aspect</label>
                          <select
                            value={editingPhoto.aspect}
                            onChange={(e) => setEditingPhoto({ ...editingPhoto, aspect: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                          >
                            <option value="wide">Wide (16:9)</option>
                            <option value="tall">Tall (4:5)</option>
                            <option value="square">Square (1:1)</option>
                          </select>
                        </div>
                      </div>

                      <ImageFieldWithPicker
                        label="Gallery Photograph"
                        value={editingPhoto.image || ''}
                        onChange={(url) => setEditingPhoto({ ...editingPhoto, image: url })}
                        onPick={() => openMediaPicker(`Select Photograph for ${editingPhoto.title}`, (url) => {
                          setEditingPhoto({ ...editingPhoto, image: url });
                        })}
                        onUploadDirect={(dataUrl, filename) => handleDirectUploadForField(dataUrl, filename, (url) => {
                          setEditingPhoto({ ...editingPhoto, image: url });
                        })}
                      />

                      <div className="flex justify-end pt-3 border-t">
                        <button
                          onClick={async () => {
                            const isEdit = gallery.some(g => g.id === editingPhoto.id);
                            await saveGalleryPhoto(editingPhoto, isEdit);
                            showToast(`Saved photo '${editingPhoto.title}'`);
                            setPhotoModalOpen(false);
                          }}
                          className="px-5 py-2.5 bg-[#17251D] text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl"
                        >
                          Save Photo
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 6.5 BOOKING CALENDAR TAB */}
            {activeTab === 'calendar' && (
              <BookingCalendar
                onNavigateToInquiries={(inquiryId) => {
                  setActiveTab('inquiries');
                  if (inquiryId) {
                    setInquirySearch(inquiryId);
                    loadInquiries('all', inquiryId);
                  }
                }}
              />
            )}

            {/* 7. INQUIRIES TAB */}
            {activeTab === 'inquiries' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-roman text-3xl sm:text-4xl text-[#17251D] uppercase tracking-wide">
                      Reservation Inquiries
                    </h2>
                    <p className="text-xs text-[#555D56] mt-1">
                      Manage guest inquiries, update booking status, record internal team notes, and initiate WhatsApp messages.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {isAdminOrAbove && (
                      <button
                        type="button"
                        onClick={exportInquiriesCSV}
                        className="px-3.5 py-2 bg-[#17251D] text-[#B89A70] hover:bg-black text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm transition-colors"
                        title="Download reservations as CSV (Admin/Super Admin only)"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    )}

                    <select
                      value={inquiryStatusFilter}
                      onChange={(e) => {
                        setInquiryStatusFilter(e.target.value);
                        loadInquiries(e.target.value, inquirySearch);
                      }}
                      className="px-3 py-2 bg-white border border-[#D5C9B8] text-xs rounded-xl"
                    >
                      <option value="all">All Inquiries</option>
                      <option value="Pending">Pending Review</option>
                      <option value="Contacted">Host Contacted</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Search guest or email..."
                      value={inquirySearch}
                      onChange={(e) => {
                        setInquirySearch(e.target.value);
                        loadInquiries(inquiryStatusFilter, e.target.value);
                      }}
                      className="px-3 py-2 bg-white border border-[#D5C9B8] text-xs rounded-xl w-44"
                    />
                  </div>
                </div>

                <div className="bg-white border border-[#EAE4DB] rounded-2xl shadow-sm overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] uppercase text-[10px] tracking-wider text-neutral-500">
                      <tr>
                        <th className="p-3.5">Ref</th>
                        <th className="p-3.5">Guest & Auth</th>
                        <th className="p-3.5">Room & Dates</th>
                        <th className="p-3.5">Guests & Total</th>
                        <th className="p-3.5">Booking Status</th>
                        <th className="p-3.5">Payment</th>
                        <th className="p-3.5">WhatsApp Alert</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE4DB]">
                      {inquiries.map((inq) => {
                        const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
                        const waMsg = encodeURIComponent(
                          `Hello ${inq.guestName}! This is Mineral Springs Retreat regarding your inquiry ${inq.id} for ${inq.room} (${inq.checkIn} to ${inq.checkOut}).`
                        );
                        const isVerifiedGuest = inq.googleId || inq.guestId;
                        const payment = inq.paymentStatus || 'Pending';
                        return (
                          <tr key={inq.id} className="hover:bg-[#FAF7F2]/50">
                            <td className="p-3.5 font-mono font-semibold text-[#17251D]">{inq.id}</td>
                            <td className="p-3.5">
                              <div className="font-semibold text-[#1A1A1A]">{inq.guestName}</div>
                              <div className="text-[11px] text-neutral-500">{inq.email} · {inq.phone}</div>
                              {isVerifiedGuest && (
                                <span className="inline-flex items-center space-x-1 mt-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-800 text-[9.5px] rounded-md font-semibold border border-emerald-200">
                                  <span>✓</span>
                                  <span>Google Verified Guest</span>
                                </span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <div className="font-medium text-[#17251D]">{inq.room}</div>
                              <div className="text-[11px] text-neutral-500">{inq.checkIn} → {inq.checkOut} ({inq.nights}n)</div>
                            </td>
                            <td className="p-3.5">
                              <div>{inq.adults} Adults{inq.children > 0 ? `, ${inq.children} Ch` : ''}</div>
                              <div className="font-semibold text-[#17251D]">₹{Number(inq.estimatedTotal || 0).toLocaleString('en-IN')}</div>
                            </td>
                            <td className="p-3.5">
                              <select
                                value={inq.status}
                                onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                                className={`px-2 py-1 text-[11px] font-bold rounded-lg border bg-white ${
                                  inq.status === 'Confirmed'
                                    ? 'text-emerald-800 border-emerald-300'
                                    : inq.status === 'Contacted'
                                    ? 'text-sky-800 border-sky-300'
                                    : inq.status === 'Cancelled'
                                    ? 'text-neutral-500 border-neutral-300'
                                    : 'text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="p-3.5">
                              <select
                                value={payment}
                                onChange={(e) => updateInquiryPaymentStatus(inq.id, e.target.value)}
                                className={`px-2 py-1 text-[11px] font-bold rounded-lg border bg-white ${
                                  payment === 'Paid'
                                    ? 'text-emerald-800 border-emerald-300 bg-emerald-50/40'
                                    : payment.includes('Partial')
                                    ? 'text-amber-800 border-amber-300 bg-amber-50/40'
                                    : payment.includes('Homestay')
                                    ? 'text-sky-800 border-sky-300 bg-sky-50/40'
                                    : 'text-neutral-600 border-neutral-300 bg-neutral-50'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Partial (Advance Paid)">Partial</option>
                                <option value="Paid">Fully Paid</option>
                                <option value="Pay at Homestay">Pay at Homestay</option>
                              </select>
                            </td>
                            <td className="p-3.5">
                              {inq.whatsappNotification?.status === 'sent' ? (
                                <div className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] rounded-md font-semibold border border-emerald-200" title={`Meta ID: ${inq.whatsappNotification?.messageId || 'Delivered'}`}>
                                  <CheckCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span>Delivered</span>
                                </div>
                              ) : inq.whatsappNotification?.status === 'simulated' ? (
                                <div className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] rounded-md font-semibold border border-amber-200" title="Simulated notification in development mode">
                                  <Radio className="w-3 h-3 text-amber-600 shrink-0" />
                                  <span>Simulated</span>
                                </div>
                              ) : inq.whatsappNotification?.status === 'failed' ? (
                                <div className="inline-flex items-center space-x-1 px-2 py-0.5 bg-rose-50 text-rose-800 text-[10px] rounded-md font-semibold border border-rose-200" title={inq.whatsappNotification?.error}>
                                  <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                                  <span>Failed</span>
                                </div>
                              ) : inq.whatsappNotificationSent ? (
                                <div className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] rounded-md font-semibold border border-emerald-200">
                                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span>Sent</span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center space-x-1 px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] rounded-md font-medium">
                                  <span>Pending</span>
                                </div>
                              )}
                              {inq.whatsappNotification?.sentAt && (
                                <div className="text-[9.5px] text-neutral-400 mt-0.5">
                                  {new Date(inq.whatsappNotification.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              )}
                            </td>
                            <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                              {/* Internal Notes / History Button */}
                              <button
                                type="button"
                                onClick={() => setActiveNotesInquiry(inq)}
                                className="p-1.5 inline-block text-neutral-600 hover:text-[#17251D] hover:bg-neutral-100 rounded-lg relative transition-colors"
                                title="Internal Team Notes & Status History"
                              >
                                <FileText className="w-4 h-4" />
                                {inq.internalNotes?.length > 0 && (
                                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#B89A70] text-[#17251D] text-[9px] font-bold rounded-full flex items-center justify-center">
                                    {inq.internalNotes.length}
                                  </span>
                                )}
                              </button>

                              {/* Resend WhatsApp Host Notification */}
                              <button
                                type="button"
                                onClick={() => handleResendWa(inq.id)}
                                disabled={waResendingId === inq.id}
                                className="p-1.5 inline-block text-[#B89A70] hover:text-[#17251D] hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50"
                                title="Resend Host WhatsApp Booking Notification"
                              >
                                <Send className={`w-4 h-4 ${waResendingId === inq.id ? 'animate-spin' : ''}`} />
                              </button>

                              {/* Preview Formatted WhatsApp Message */}
                              <button
                                type="button"
                                onClick={() => setSelectedWaMessageInquiry(inq)}
                                className="p-1.5 inline-block text-neutral-500 hover:text-[#17251D] hover:bg-neutral-100 rounded-lg transition-colors"
                                title="Preview WhatsApp Notification Message Format"
                              >
                                <Smartphone className="w-4 h-4" />
                              </button>

                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=${waMsg}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 inline-block text-emerald-700 hover:bg-emerald-50 rounded-lg"
                                  title="WhatsApp Guest"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </a>
                              )}

                              {isAdminOrAbove && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete inquiry ${inq.id}?`)) deleteInquiry(inq.id);
                                  }}
                                  className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg inline-block transition-colors"
                                  title="Delete Inquiry (Admin only)"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* 7B. REGISTERED GUESTS TAB */}
            {activeTab === 'guests' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-roman text-3xl sm:text-4xl text-[#17251D] uppercase tracking-wide">
                      Registered Guests
                    </h2>
                    <p className="text-xs text-[#555D56] mt-1">
                      Customer accounts authenticated via Google OAuth (Gmail). Manage guest profiles and booking history.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Search guests by name or email..."
                      value={guestSearch}
                      onChange={(e) => {
                        setGuestSearch(e.target.value);
                        loadGuests(e.target.value);
                      }}
                      className="px-3.5 py-2 bg-white border border-[#D5C9B8] text-xs rounded-xl w-60"
                    />
                  </div>
                </div>

                <div className="bg-white border border-[#EAE4DB] rounded-2xl shadow-sm overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#FAF7F2] uppercase text-[10px] tracking-wider text-neutral-500">
                      <tr>
                        <th className="p-3.5">Guest Profile</th>
                        <th className="p-3.5">Google ID (sub)</th>
                        <th className="p-3.5">Contact Details</th>
                        <th className="p-3.5">Joined Date</th>
                        <th className="p-3.5">Last Login</th>
                        <th className="p-3.5">Reservations</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE4DB]">
                      {guestsList.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="p-8 text-center text-neutral-400">
                            No registered guest accounts found matching your search.
                          </td>
                        </tr>
                      ) : (
                        guestsList.map((guest) => (
                          <tr key={guest.id} className="hover:bg-[#FAF7F2]/50">
                            <td className="p-3.5">
                              <div className="flex items-center space-x-3">
                                {guest.picture ? (
                                  <img
                                    src={guest.picture}
                                    alt={guest.name}
                                    className="w-9 h-9 rounded-full object-cover border border-[#B89A70] shrink-0"
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-[#17251D] text-[#B89A70] flex items-center justify-center font-bold text-xs shrink-0">
                                    {guest.name?.charAt(0) || 'G'}
                                  </div>
                                )}
                                <div>
                                  <div className="font-semibold text-[#17251D] flex items-center space-x-1.5">
                                    <span>{guest.name}</span>
                                    <span className="text-[9.5px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-medium border border-emerald-200">
                                      Google Auth
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-neutral-400 font-mono">ID: {guest.id}</div>
                                </div>
                              </div>
                            </td>

                            <td className="p-3.5 font-mono text-[11px] text-neutral-500">
                              <span className="bg-neutral-100 px-2 py-0.5 rounded text-[10px]" title={guest.googleId}>
                                {guest.googleId?.length > 18 ? guest.googleId.substring(0, 18) + '...' : guest.googleId}
                              </span>
                            </td>

                            <td className="p-3.5">
                              <div className="text-[#1A1A1A] font-medium">{guest.email}</div>
                              <div className="text-[11px] text-neutral-500">{guest.phone || 'No phone recorded'}</div>
                            </td>

                            <td className="p-3.5 text-neutral-500 whitespace-nowrap">
                              {guest.createdAt ? new Date(guest.createdAt).toLocaleDateString() : '—'}
                            </td>

                            <td className="p-3.5 text-neutral-500 whitespace-nowrap">
                              {guest.lastLoginAt ? new Date(guest.lastLoginAt).toLocaleString() : '—'}
                            </td>

                            <td className="p-3.5">
                              <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold rounded-full">
                                {guest.bookingsCount} booking{guest.bookingsCount !== 1 ? 's' : ''}
                              </span>
                            </td>

                            <td className="p-3.5 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setSelectedGuestForModal(guest)}
                                className="px-3 py-1.5 bg-white border border-[#D5C9B8] text-[#17251D] hover:bg-[#FAF7F2] rounded-xl text-xs font-medium transition-colors"
                              >
                                View Bookings
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Guest Associated Bookings Modal */}
            {selectedGuestForModal && (
              <div className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-3xl border border-[#D5C9B8] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
                  <div className="bg-[#17251D] px-6 py-5 flex items-center justify-between text-[#FAF7F2]">
                    <div className="flex items-center space-x-3">
                      {selectedGuestForModal.picture ? (
                        <img
                          src={selectedGuestForModal.picture}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-[#B89A70]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#B89A70] text-[#17251D] font-bold flex items-center justify-center">
                          {selectedGuestForModal.name?.charAt(0) || 'G'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-roman text-xl font-normal">{selectedGuestForModal.name}</h3>
                        <p className="text-[11px] text-[#B89A70] font-sans">{selectedGuestForModal.email} · {selectedGuestForModal.phone || 'No phone'}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedGuestForModal(null)}
                      className="p-1.5 text-white/70 hover:text-white rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-4 font-sans text-xs">
                    <h4 className="font-roman text-lg text-[#17251D] uppercase">
                      Reservation Inquiries ({selectedGuestForModal.bookings?.length || 0})
                    </h4>

                    {(!selectedGuestForModal.bookings || selectedGuestForModal.bookings.length === 0) ? (
                      <p className="text-neutral-500 py-6 text-center">No bookings submitted by this guest yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedGuestForModal.bookings.map(b => (
                          <div key={b.id} className="p-4 bg-white border border-[#EAE4DB] rounded-2xl shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-[#17251D]">{b.id}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {b.status}
                              </span>
                            </div>
                            <div className="font-semibold text-[#17251D] text-sm">{b.room}</div>
                            <div className="text-neutral-600 flex justify-between">
                              <span>Dates: {b.checkIn} → {b.checkOut} ({b.nights}n)</span>
                              <span className="font-bold text-[#17251D]">₹{Number(b.estimatedTotal || 0).toLocaleString('en-IN')}</span>
                            </div>
                            {b.specialRequests && (
                              <div className="text-[11px] text-neutral-500 bg-[#FAF7F2] p-2 rounded-lg">
                                Requests: {b.specialRequests}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Inquiry Internal Notes & Status History Modal */}
            {activeNotesInquiry && (
              <div className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-3xl border border-[#D5C9B8] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col font-sans">
                  <div className="bg-[#17251D] px-6 py-5 flex items-center justify-between text-[#FAF7F2]">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#B89A70]">
                        REF: {activeNotesInquiry.id}
                      </span>
                      <h3 className="font-roman text-xl text-white font-normal">
                        Internal Notes & Audit History
                      </h3>
                      <p className="text-[11px] text-[#FAF7F2]/70 mt-0.5">
                        Guest: {activeNotesInquiry.guestName} ({activeNotesInquiry.email})
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNotesInquiry(null)}
                      className="p-1.5 text-white/70 hover:text-white rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                    {/* Status History Thread */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-[#17251D] font-bold uppercase text-[11px]">
                        <History className="w-3.5 h-3.5 text-[#B89A70]" />
                        <span>Status Change Log</span>
                      </div>
                      <div className="bg-white border border-[#EAE4DB] rounded-2xl p-3.5 divide-y divide-[#EAE4DB]">
                        {(activeNotesInquiry.statusHistory || [
                          { status: activeNotesInquiry.status, timestamp: activeNotesInquiry.createdAt, changedBy: 'Initial Submission' }
                        ]).map((sh, idx) => (
                          <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-[#17251D]">{sh.status}</span>
                              <span className="text-[10px] text-neutral-500 block">By: {sh.changedBy || 'System'}</span>
                            </div>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {new Date(sh.timestamp).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Internal Team Notes */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-[#17251D] font-bold uppercase text-[11px]">
                        <FileText className="w-3.5 h-3.5 text-[#B89A70]" />
                        <span>Team Internal Notes</span>
                      </div>

                      {(!activeNotesInquiry.internalNotes || activeNotesInquiry.internalNotes.length === 0) ? (
                        <div className="p-4 bg-white border border-[#EAE4DB] rounded-2xl text-center text-neutral-400">
                          No internal notes recorded yet for this reservation.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {activeNotesInquiry.internalNotes.map((nt) => (
                            <div key={nt.id} className="p-3 bg-white border border-[#EAE4DB] rounded-xl space-y-1">
                              <div className="flex items-center justify-between text-[10px] text-neutral-500">
                                <span className="font-semibold text-[#17251D]">{nt.author}</span>
                                <span className="font-mono">{new Date(nt.timestamp).toLocaleString()}</span>
                              </div>
                              <p className="text-xs text-[#1A1A1A]">{nt.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add New Note */}
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!inquiryNoteInput.trim()) return;
                          setAddingNote(true);
                          await addInquiryNote(activeNotesInquiry.id, inquiryNoteInput);
                          // Update active notes object locally
                          activeNotesInquiry.internalNotes = [
                            ...(activeNotesInquiry.internalNotes || []),
                            {
                              id: 'note-' + Date.now(),
                              text: inquiryNoteInput.trim(),
                              author: adminUser?.username || 'Admin',
                              timestamp: new Date().toISOString()
                            }
                          ];
                          setInquiryNoteInput('');
                          setAddingNote(false);
                        }}
                        className="flex items-center space-x-2 pt-2"
                      >
                        <input
                          type="text"
                          value={inquiryNoteInput}
                          onChange={(e) => setInquiryNoteInput(e.target.value)}
                          placeholder="Type internal note (e.g. Guest requested airport Bolero pickup)..."
                          className="flex-1 px-3.5 py-2.5 bg-white border border-[#D5C9B8] rounded-xl text-xs"
                        />
                        <button
                          type="submit"
                          disabled={addingNote || !inquiryNoteInput.trim()}
                          className="px-4 py-2.5 bg-[#17251D] text-[#B89A70] hover:bg-black font-semibold rounded-xl text-xs shrink-0 disabled:opacity-50"
                        >
                          {addingNote ? 'Saving...' : 'Add Note'}
                        </button>
                      </form>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* 7B-2. BACKEND USER MANAGEMENT TAB (SUPER ADMIN EXCLUSIVE & RBAC) */}
            {activeTab === 'users' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                {isSuperAdmin ? (
                  <>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          <h2 className="font-roman text-3xl sm:text-4xl text-[#17251D] uppercase tracking-wide">
                            User Management
                          </h2>
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-900 text-xs font-semibold rounded-full border border-amber-200">
                            <Crown className="w-3.5 h-3.5 text-amber-600" />
                            <span>Super Admin Control</span>
                          </span>
                        </div>
                        <p className="text-xs text-[#555D56] mt-1">
                          Manage internal backend accounts, assign user roles (Super Admin, Manager, Staff), generate credentials, and control access permissions.
                        </p>
                      </div>

                      <div className="flex items-center space-x-2.5">
                        <button
                          type="button"
                          onClick={() => loadBackendUsers(userSearch, userRoleFilter, userStatusFilter)}
                          disabled={usersLoading}
                          className="px-3.5 py-2 bg-white hover:bg-[#FAF7F2] text-[#17251D] border border-[#D5C9B8] text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors disabled:opacity-50"
                          title="Refresh user list"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 text-[#B89A70] ${usersLoading ? 'animate-spin' : ''}`} />
                          <span>Refresh</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleOpenCreateUser}
                          className="px-4 py-2 bg-[#17251D] text-[#B89A70] hover:bg-black text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm transition-colors"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Add New User</span>
                        </button>
                      </div>
                    </div>

                    {/* 5 User Management KPI Metric Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                      <div className="p-4 bg-white border border-[#EAE4DB] rounded-2xl shadow-xs">
                        <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                          <span className="text-[10.5px] uppercase tracking-wider font-semibold">Total Users</span>
                          <Users className="w-3.5 h-3.5 text-neutral-400" />
                        </div>
                        <div className="font-roman text-2xl text-[#17251D]">
                          {backendUsersCounts?.total ?? backendUsers.length}
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">Active & Inactive accounts</div>
                      </div>

                      <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl shadow-xs">
                        <div className="flex items-center justify-between text-amber-800 mb-1.5">
                          <span className="text-[10.5px] uppercase tracking-wider font-semibold">Super Admins</span>
                          <Crown className="w-3.5 h-3.5 text-amber-600" />
                        </div>
                        <div className="font-roman text-2xl text-amber-900">
                          {backendUsersCounts?.superadmin ?? backendUsers.filter(u => u.role === 'superadmin').length}
                        </div>
                        <div className="text-[10px] text-amber-700/80 mt-0.5">Website owners (Full Control)</div>
                      </div>

                      <div className="p-4 bg-sky-50/60 border border-sky-200/80 rounded-2xl shadow-xs">
                        <div className="flex items-center justify-between text-sky-800 mb-1.5">
                          <span className="text-[10.5px] uppercase tracking-wider font-semibold">Managers</span>
                          <Shield className="w-3.5 h-3.5 text-sky-600" />
                        </div>
                        <div className="font-roman text-2xl text-sky-900">
                          {backendUsersCounts?.admin ?? backendUsers.filter(u => u.role === 'admin' || u.role === 'manager').length}
                        </div>
                        <div className="text-[10px] text-sky-700/80 mt-0.5">Bookings & room operations</div>
                      </div>

                      <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl shadow-xs">
                        <div className="flex items-center justify-between text-emerald-800 mb-1.5">
                          <span className="text-[10.5px] uppercase tracking-wider font-semibold">Front Desk Staff</span>
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="font-roman text-2xl text-emerald-900">
                          {backendUsersCounts?.staff ?? backendUsers.filter(u => u.role === 'staff').length}
                        </div>
                        <div className="text-[10px] text-emerald-700/80 mt-0.5">Status updates & guest notes</div>
                      </div>

                      <div className="p-4 bg-white border border-[#EAE4DB] rounded-2xl shadow-xs col-span-2 sm:col-span-1">
                        <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                          <span className="text-[10.5px] uppercase tracking-wider font-semibold">Active Status</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="font-roman text-2xl text-[#17251D]">
                          {backendUsersCounts?.active ?? backendUsers.filter(u => u.status === 'active').length}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                          {backendUsersCounts?.inactive ? `${backendUsersCounts.inactive} deactivated` : 'All accounts active'}
                        </div>
                      </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="bg-white border border-[#EAE4DB] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          placeholder="Search users by name, username, email, or phone..."
                          className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#EAE4DB] rounded-xl text-xs outline-none focus:border-[#17251D]"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Role Filter */}
                        <div className="flex items-center space-x-1.5 text-xs text-neutral-500 shrink-0">
                          <Filter className="w-3.5 h-3.5 text-[#B89A70]" />
                          <span>Role:</span>
                        </div>
                        <select
                          value={userRoleFilter}
                          onChange={(e) => setUserRoleFilter(e.target.value)}
                          className="px-3 py-2 bg-[#FAF7F2] border border-[#EAE4DB] rounded-xl text-xs text-[#17251D] font-medium outline-none focus:border-[#17251D]"
                        >
                          <option value="all">All Roles</option>
                          <option value="superadmin">Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="staff">Staff</option>
                        </select>

                        {/* Status Filter */}
                        <select
                          value={userStatusFilter}
                          onChange={(e) => setUserStatusFilter(e.target.value)}
                          className="px-3 py-2 bg-[#FAF7F2] border border-[#EAE4DB] rounded-xl text-xs text-[#17251D] font-medium outline-none focus:border-[#17251D]"
                        >
                          <option value="all">All Statuses</option>
                          <option value="active">Active Only</option>
                          <option value="inactive">Inactive Only</option>
                        </select>

                        {(userSearch || userRoleFilter !== 'all' || userStatusFilter !== 'all') && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserSearch('');
                              setUserRoleFilter('all');
                              setUserStatusFilter('all');
                            }}
                            className="text-xs text-[#B89A70] hover:underline px-2 py-1 font-medium shrink-0"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white border border-[#EAE4DB] rounded-2xl shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#FAF7F2] uppercase text-[10px] tracking-wider text-neutral-500 border-b border-[#EAE4DB]">
                            <tr>
                              <th className="p-3.5">User</th>
                              <th className="p-3.5">Contact Details</th>
                              <th className="p-3.5">Role</th>
                              <th className="p-3.5">Status</th>
                              <th className="p-3.5">Activity & Login</th>
                              <th className="p-3.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#EAE4DB]">
                            {usersLoading ? (
                              <tr>
                                <td colSpan="6" className="p-8 text-center text-neutral-500">
                                  <div className="flex items-center justify-center space-x-2">
                                    <RefreshCw className="w-4 h-4 animate-spin text-[#B89A70]" />
                                    <span>Loading team users...</span>
                                  </div>
                                </td>
                              </tr>
                            ) : backendUsers.length === 0 ? (
                              <tr>
                                <td colSpan="6" className="p-8 text-center text-neutral-500">
                                  <div className="max-w-sm mx-auto space-y-2">
                                    <Users className="w-8 h-8 text-neutral-300 mx-auto" />
                                    <div className="font-semibold text-neutral-700">No users found</div>
                                    <div className="text-xs text-neutral-500">
                                      No internal team accounts match the current search or filter criteria.
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              backendUsers.map((user) => {
                                const isSelf = user.id === adminUser?.id;
                                const isSuper = user.role === 'superadmin';
                                const isAdminRole = user.role === 'admin';
                                const isManager = user.role === 'manager';
                                const isStaffRole = user.role === 'staff';
                                const isActive = user.status === 'active';

                                return (
                                  <tr key={user.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                                    {/* User Name & Username */}
                                    <td className="p-3.5">
                                      <div className="flex items-center space-x-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                          isSuper
                                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                            : isAdminRole
                                            ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                                            : isManager
                                            ? 'bg-sky-100 text-sky-900 border border-sky-300'
                                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                        }`}>
                                          {user.name?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                          <div className="font-semibold text-[#1A1A1A] flex items-center space-x-1.5">
                                            <span>{user.name}</span>
                                            {isSelf && (
                                              <span className="text-[9.5px] px-1.5 py-0.2 bg-[#17251D] text-[#B89A70] rounded-md font-normal">
                                                You
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-[11px] font-mono text-neutral-500">
                                            @{user.username}
                                          </div>
                                        </div>
                                      </div>
                                    </td>

                                    {/* Contact Details */}
                                    <td className="p-3.5">
                                      <div className="text-[#1A1A1A] font-medium">{user.email}</div>
                                      <div className="text-[11px] text-neutral-500">
                                        {user.phone ? user.phone : <span className="italic text-neutral-400">No phone</span>}
                                      </div>
                                    </td>

                                    {/* Role Badge */}
                                    <td className="p-3.5">
                                      {isSuper ? (
                                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-50 text-amber-900 text-[10.5px] font-semibold rounded-full border border-amber-200">
                                          <Crown className="w-3 h-3 text-amber-600" />
                                          <span>Super Admin</span>
                                        </span>
                                      ) : isAdminRole ? (
                                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-indigo-50 text-indigo-900 text-[10.5px] font-semibold rounded-full border border-indigo-200">
                                          <Shield className="w-3 h-3 text-indigo-600" />
                                          <span>Admin</span>
                                        </span>
                                      ) : isManager ? (
                                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-sky-50 text-sky-900 text-[10.5px] font-semibold rounded-full border border-sky-200">
                                          <Shield className="w-3 h-3 text-sky-600" />
                                          <span>Manager</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-900 text-[10.5px] font-semibold rounded-full border border-emerald-200">
                                          <UserCheck className="w-3 h-3 text-emerald-600" />
                                          <span>Staff</span>
                                        </span>
                                      )}
                                    </td>

                                    {/* Status Badge & Inline Toggle */}
                                    <td className="p-3.5">
                                      <div className="flex items-center space-x-2">
                                        {isActive ? (
                                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded-md border border-emerald-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span>Active</span>
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-rose-50 text-rose-800 text-[10px] font-semibold rounded-md border border-rose-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                            <span>Inactive</span>
                                          </span>
                                        )}

                                        {!isSelf && (
                                          <button
                                            type="button"
                                            onClick={() => handleToggleUserStatus(user)}
                                            className="text-[10px] text-neutral-500 hover:text-[#17251D] underline font-medium cursor-pointer"
                                            title={isActive ? 'Deactivate this user' : 'Reactivate this user'}
                                          >
                                            {isActive ? 'Deactivate' : 'Activate'}
                                          </button>
                                        )}
                                      </div>
                                    </td>

                                    {/* Activity & Login */}
                                    <td className="p-3.5 text-neutral-500">
                                      <div>
                                        Last login: <span className="text-neutral-700 font-medium">
                                          {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never'}
                                        </span>
                                      </div>
                                      <div className="text-[10px] text-neutral-400">
                                        Created: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                      </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-3.5 text-right">
                                      <div className="flex items-center justify-end space-x-1.5">
                                        {/* Edit */}
                                        <button
                                          type="button"
                                          onClick={() => handleOpenEditUser(user)}
                                          className="p-1.5 text-neutral-600 hover:text-[#17251D] hover:bg-[#FAF7F2] rounded-lg border border-transparent hover:border-[#D5C9B8] transition-colors"
                                          title="Edit user info & role"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>

                                        {/* Reset Password */}
                                        <button
                                          type="button"
                                          onClick={() => handleOpenResetUserPassword(user)}
                                          className="p-1.5 text-neutral-600 hover:text-[#B89A70] hover:bg-[#FAF7F2] rounded-lg border border-transparent hover:border-[#D5C9B8] transition-colors"
                                          title="Reset password or generate temporary credentials"
                                        >
                                          <KeyRound className="w-3.5 h-3.5" />
                                        </button>

                                        {/* Delete (guarded against self) */}
                                        {!isSelf && (
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteUser(user)}
                                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
                                            title="Permanently delete user"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Gated Access View for Non-SuperAdmins (Manager / Staff) */
                  <div className="bg-white border border-[#EAE4DB] rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm space-y-6">
                    <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
                      <ShieldAlert className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold uppercase tracking-wider">
                        Super Admin Access Only
                      </div>
                      <h3 className="font-roman text-2xl sm:text-3xl text-[#17251D]">
                        User Management Restricted
                      </h3>
                      <p className="text-xs text-[#555D56] max-w-md mx-auto leading-relaxed">
                        Team account creation, password resets, role assignments, and system permission governance are reserved exclusively for the Website Owner (Super Admin).
                      </p>
                    </div>

                    <div className="bg-[#FAF7F2] border border-[#EAE4DB] rounded-2xl p-5 text-left text-xs space-y-3">
                      <div className="font-semibold text-[#17251D] flex items-center justify-between border-b border-[#EAE4DB] pb-2">
                        <span>Your Current Session:</span>
                        <span className="font-mono uppercase text-[#B89A70]">{adminUser?.role}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-600">
                        <div>
                          <strong>Account:</strong> {adminUser?.name || adminUser?.username}
                        </div>
                        <div>
                          <strong>Username:</strong> @{adminUser?.username}
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-500 pt-1">
                        If you need an account created or privileges adjusted, please contact the Website Owner directly.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('inquiries')}
                        className="px-5 py-2.5 bg-[#17251D] text-[#B89A70] hover:bg-black font-semibold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm"
                      >
                        Go to Reservations
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('overview')}
                        className="px-5 py-2.5 bg-white border border-[#D5C9B8] text-[#17251D] hover:bg-[#FAF7F2] font-semibold rounded-xl text-xs uppercase tracking-wider transition-colors"
                      >
                        Dashboard Overview
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 7C. WHATSAPP NOTIFICATIONS TAB */}
            {activeTab === 'whatsapp' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h2 className="font-roman text-3xl sm:text-4xl text-[#17251D] uppercase tracking-wide">
                        WhatsApp Notifications
                      </h2>
                      {waConfig && (
                        waConfig.enabled ? (
                          waConfig.isConfigured ? (
                            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Meta Cloud API Live</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-full border border-amber-200">
                              <Radio className="w-3.5 h-3.5 text-amber-600" />
                              <span>Simulation Mode (Dev)</span>
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-semibold rounded-full">
                            <span>Notifications Disabled</span>
                          </span>
                        )
                      )}
                    </div>
                    <p className="text-xs text-[#555D56] mt-1">
                      Automated host notifications dispatched upon new room booking submissions via the official Meta WhatsApp Business Cloud API.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <button
                      type="button"
                      onClick={handleSendWaTest}
                      disabled={waTesting || !waConfig}
                      className="px-3.5 py-2 bg-white hover:bg-[#FAF7F2] text-[#17251D] border border-[#D5C9B8] text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors disabled:opacity-50"
                      title="Send a test notification to verify credentials"
                    >
                      <Send className={`w-3.5 h-3.5 text-[#B89A70] ${waTesting ? 'animate-spin' : ''}`} />
                      <span>{waTesting ? 'Testing...' : 'Send Test Alert'}</span>
                    </button>

                    {isSuperAdmin ? (
                      <button
                        type="button"
                        onClick={handleSaveWaConfig}
                        disabled={waSaving || !waConfig}
                        className="px-4 py-2 bg-[#17251D] text-[#B89A70] hover:bg-black text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm transition-colors disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{waSaving ? 'Saving...' : 'Save Settings'}</span>
                      </button>
                    ) : (
                      <span className="px-3.5 py-2 bg-[#FAF7F2] text-neutral-500 border border-[#D5C9B8] text-xs font-semibold rounded-xl flex items-center space-x-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#B89A70]" />
                        <span>Owner Restricted</span>
                      </span>
                    )}
                  </div>
                </div>

                {!isSuperAdmin && (
                  <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-center space-x-3 text-amber-900 text-xs shadow-xs">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-semibold">Super Admin Restricted:</span> Meta WhatsApp Cloud API credentials and system configurations can only be modified by the Website Owner (Super Admin). Field values are masked for security.
                    </div>
                  </div>
                )}

                {/* Test Result Feedback Alert */}
                {waTestResponse && (
                  <div
                    className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                      waTestResponse.success
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50/80 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {waTestResponse.success ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div className="text-xs space-y-1">
                        <div className="font-bold">
                          {waTestResponse.success
                            ? waTestResponse.simulated
                              ? 'Simulation Mode Test Succeeded'
                              : 'Live WhatsApp Notification Delivered!'
                            : 'WhatsApp Test Failed'}
                        </div>
                        <div>{waTestResponse.message || waTestResponse.error}</div>
                        {waTestResponse.recipient && (
                          <div className="text-[11px] opacity-80">
                            Recipient: +{waTestResponse.recipient} · Timestamp: {new Date().toLocaleTimeString()}
                          </div>
                        )}
                        {waTestResponse.details && (
                          <div className="font-mono text-[10px] bg-white/60 p-2 rounded-lg border border-black/5 mt-1 overflow-x-auto">
                            {typeof waTestResponse.details === 'object'
                              ? JSON.stringify(waTestResponse.details, null, 2)
                              : waTestResponse.details}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWaTestResponse(null)}
                      className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Grid: Settings on Left, Preview & Info on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Configuration Form (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    <form onSubmit={handleSaveWaConfig} className="bg-white border border-[#EAE4DB] rounded-2xl p-6 shadow-sm space-y-6">
                      
                      {/* Section 1: Activation Toggle & Host Number */}
                      <div className="space-y-4 pb-6 border-b border-[#EAE4DB]">
                        <h3 className="text-xs uppercase tracking-wider font-semibold text-[#17251D] flex items-center space-x-2">
                          <Smartphone className="w-4 h-4 text-[#B89A70]" />
                          <span>Host Recipient & Dispatch Status</span>
                        </h3>

                        {/* Enable Toggle */}
                        <div className="flex items-center justify-between p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EAE4DB]">
                          <div>
                            <div className="font-semibold text-xs text-[#17251D]">
                              Automatic WhatsApp Notifications
                            </div>
                            <div className="text-[11px] text-[#555D56] mt-0.5">
                              Dispatch instant WhatsApp messages to the host when rooms are booked
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={!isSuperAdmin}
                            onClick={() =>
                              setWaConfig((prev) => ({ ...prev, enabled: !prev?.enabled }))
                            }
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                              !isSuperAdmin ? 'opacity-60 cursor-not-allowed ' : ''
                            }${
                              waConfig?.enabled ? 'bg-emerald-600 justify-end' : 'bg-neutral-300 justify-start'
                            }`}
                          >
                            <span className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform" />
                          </button>
                        </div>

                        {/* Host Phone Number */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block">
                            Host WhatsApp Number (With Country Code)
                          </label>
                          <input
                            type="text"
                            disabled={!isSuperAdmin}
                            value={waConfig?.hostPhone || ''}
                            onChange={(e) =>
                              setWaConfig((prev) => ({ ...prev, hostPhone: e.target.value }))
                            }
                            placeholder="+917908192498"
                            className="w-full px-3.5 py-2.5 bg-white border border-[#D5C9B8] text-xs font-mono rounded-xl focus:border-[#17251D] outline-none disabled:bg-neutral-100 disabled:text-neutral-500"
                            required
                          />
                          <p className="text-[10.5px] text-neutral-500">
                            Must include international country code (e.g. <code className="bg-[#FAF7F2] px-1 py-0.5 rounded text-[#17251D]">+917908192498</code> for India). The backend automatically cleans formatting for the Meta Graph API.
                          </p>
                        </div>
                      </div>

                      {/* Section 2: Meta Cloud API Credentials */}
                      <div className="space-y-4 pb-6 border-b border-[#EAE4DB]">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#17251D] flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-[#B89A70]" />
                            <span>Official Meta WhatsApp Cloud API Credentials</span>
                          </h3>
                          <span className="text-[10px] text-[#B89A70] font-semibold bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#D5C9B8]">
                            Graph API {waConfig?.apiVersion || 'v21.0'}
                          </span>
                        </div>

                        <div className="p-3 bg-[#FAF7F2] border border-[#EAE4DB] rounded-xl text-[11px] text-[#555D56] space-y-1">
                          <div className="font-semibold text-[#17251D]">Meta Business Integration</div>
                          <div>
                            Obtain these values from your <strong>Meta for Developers</strong> console under <strong>WhatsApp → API Setup</strong>. If left unconfigured, the system runs safely in simulation mode with complete audit logging.
                          </div>
                        </div>

                        {/* Phone Number ID */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block">
                            WhatsApp Phone Number ID
                          </label>
                          <input
                            type="text"
                            disabled={!isSuperAdmin}
                            value={waConfig?.phoneNumberId || ''}
                            onChange={(e) =>
                              setWaConfig((prev) => ({ ...prev, phoneNumberId: e.target.value }))
                            }
                            placeholder="e.g. 108923485720194"
                            className="w-full px-3.5 py-2.5 bg-white border border-[#D5C9B8] text-xs font-mono rounded-xl focus:border-[#17251D] outline-none disabled:bg-neutral-100 disabled:text-neutral-500"
                          />
                          <p className="text-[10.5px] text-neutral-500">
                            Identifier of the registered sender phone number within your Meta App.
                          </p>
                        </div>

                        {/* Access Token */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block">
                              WhatsApp System User Access Token
                            </label>
                            {waConfig?.hasCustomToken && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                                Active Token Stored ({waConfig?.accessTokenMasked})
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type={waShowToken ? 'text' : 'password'}
                              disabled={!isSuperAdmin}
                              value={!isSuperAdmin ? '••••••••••••••••' : waTokenInput}
                              onChange={(e) => setWaTokenInput(e.target.value)}
                              placeholder={
                                !isSuperAdmin
                                  ? 'Encrypted (Super Admin only)'
                                  : waConfig?.hasCustomToken
                                  ? 'Enter new Meta System User token to replace current token'
                                  : 'EAABw... (Meta Permanent System User Token)'
                              }
                              className="w-full px-3.5 py-2.5 pr-10 bg-white border border-[#D5C9B8] text-xs font-mono rounded-xl focus:border-[#17251D] outline-none disabled:bg-neutral-100 disabled:text-neutral-500"
                            />
                            {isSuperAdmin && (
                              <button
                                type="button"
                                onClick={() => setWaShowToken(!waShowToken)}
                                className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700"
                              >
                                {waShowToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            )}
                          </div>
                          <p className="text-[10.5px] text-neutral-500">
                            Use a permanent <strong>System User Access Token</strong> with <code className="bg-[#FAF7F2] px-1 py-0.5 rounded text-[#17251D]">whatsapp_business_messaging</code> permission.
                          </p>
                        </div>

                        {/* Business Account ID & API Version */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block">
                              WhatsApp Business Account ID (WABA ID)
                            </label>
                            <input
                              type="text"
                              disabled={!isSuperAdmin}
                              value={waConfig?.businessAccountId || ''}
                              onChange={(e) =>
                                setWaConfig((prev) => ({ ...prev, businessAccountId: e.target.value }))
                              }
                              placeholder="e.g. 102938475610293"
                              className="w-full px-3.5 py-2.5 bg-white border border-[#D5C9B8] text-xs font-mono rounded-xl focus:border-[#17251D] outline-none disabled:bg-neutral-100 disabled:text-neutral-500"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block">
                              Meta Graph API Version
                            </label>
                            <input
                              type="text"
                              disabled={!isSuperAdmin}
                              value={waConfig?.apiVersion || 'v21.0'}
                              onChange={(e) =>
                                setWaConfig((prev) => ({ ...prev, apiVersion: e.target.value }))
                              }
                              placeholder="v21.0"
                              className="w-full px-3.5 py-2.5 bg-white border border-[#D5C9B8] text-xs font-mono rounded-xl focus:border-[#17251D] outline-none disabled:bg-neutral-100 disabled:text-neutral-500"
                            />
                          </div>
                        </div>

                      </div>

                      {/* Submit Actions */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                        <div className="text-[11px] text-neutral-500">
                          Configuration is saved directly to <code className="bg-[#FAF7F2] px-1.5 py-0.5 rounded font-mono text-[#17251D]">server/data/db.json</code>.
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={handleSendWaTest}
                            disabled={waTesting || !waConfig}
                            className="px-3.5 py-2 text-xs font-semibold text-[#17251D] bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors disabled:opacity-50"
                          >
                            {waTesting ? 'Sending Test...' : 'Test Connection'}
                          </button>
                          <button
                            type="submit"
                            disabled={waSaving || !waConfig}
                            className="px-4 py-2 bg-[#17251D] text-[#B89A70] hover:bg-black text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm transition-colors disabled:opacity-50"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{waSaving ? 'Saving...' : 'Save Configuration'}</span>
                          </button>
                        </div>
                      </div>

                    </form>
                  </div>

                  {/* Right Column: Message Preview & Architecture Card (5 cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* Official Message Template (WhatsApp Chat Mockup) */}
                    <div className="bg-white border border-[#EAE4DB] rounded-2xl overflow-hidden shadow-sm">
                      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#128C7E] flex items-center justify-center text-xs font-bold shrink-0">
                          🏡
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-xs truncate">Mineral Springs Retreat</div>
                          <div className="text-[10px] text-emerald-100 truncate">Automated Host Notification Bot</div>
                        </div>
                      </div>

                      <div className="p-4 bg-[#EFEAE2] min-h-[360px] flex flex-col justify-between">
                        {/* Chat Message Bubble */}
                        <div className="bg-white rounded-xl p-3.5 shadow-xs max-w-sm ml-auto border border-[#D5C9B8]/40 space-y-2 text-[11px] text-[#1A1A1A] leading-relaxed">
                          <div className="font-bold text-[#075E54] border-b border-neutral-100 pb-1 font-mono">
                            *NEW ROOM BOOKING – MINERAL SPRINGS RETREAT*
                          </div>
                          <div className="text-neutral-700">A new booking request has been received.</div>
                          <div className="space-y-0.5 text-neutral-800">
                            <div className="font-semibold">*Guest Details:*</div>
                            <div>- Name: Sarah Jenkins</div>
                            <div>- Phone: +1 (555) 234-5678</div>
                            <div>- Email: sarah.jenkins@example.com</div>
                          </div>
                          <div className="space-y-0.5 text-neutral-800">
                            <div className="font-semibold">*Booking Details:*</div>
                            <div>- Booking ID: MSR-88329</div>
                            <div>- Check-in: 2026-11-20</div>
                            <div>- Check-out: 2026-11-23</div>
                            <div>- Adults: 2</div>
                            <div>- Children: 0</div>
                            <div>- Room Type: Deluxe Valley View Room</div>
                            <div>- Number of Rooms: 1</div>
                            <div>- Special Requests: Mountain sunrise view please.</div>
                          </div>
                          <div className="text-emerald-800 font-semibold">
                            *Booking Status:* Pending
                          </div>
                          <div className="text-[10px] text-neutral-500 italic pt-1 border-t border-neutral-100">
                            Please log in to your admin dashboard to review this booking.
                          </div>
                          <div className="flex items-center justify-end space-x-1 text-[9.5px] text-neutral-400 pt-1">
                            <span>12:35 PM</span>
                            <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />
                          </div>
                        </div>

                        <div className="text-center text-[10px] text-neutral-500 mt-3 bg-white/70 py-1 px-2.5 rounded-full mx-auto backdrop-blur-xs">
                          🔒 End-to-end encrypted · Meta Graph API
                        </div>
                      </div>
                    </div>

                    {/* Reliability & Architectural Highlights Card */}
                    <div className="bg-white border border-[#EAE4DB] rounded-2xl p-5 shadow-sm space-y-3">
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-[#17251D] flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-[#B89A70]" />
                        <span>System Architecture & Reliability</span>
                      </h4>
                      <ul className="text-xs space-y-2.5 text-[#555D56]">
                        <li className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span><strong>Backend Dispatched:</strong> Notifications trigger strictly from Express server (<code className="font-mono text-[10px] bg-[#FAF7F2] px-1 py-0.5 rounded">server/routes/inquiries.js</code>) after database write.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span><strong>Strict Idempotency:</strong> Built-in <code className="font-mono text-[10px] bg-[#FAF7F2] px-1 py-0.5 rounded">whatsappNotificationSent</code> protection eliminates duplicate messages.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span><strong>Zero Reservation Loss:</strong> Fail-safe asynchronous architecture ensures Meta API downtime will never cancel or drop a booking.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span><strong>Secure Secrets:</strong> Meta access tokens are stored securely in backend storage or environment variables, never sent to public clients.</span>
                        </li>
                      </ul>
                    </div>

                  </div>

                </div>

                {/* Section: Recent Notifications & Delivery Log */}
                <div className="bg-white border border-[#EAE4DB] rounded-2xl shadow-sm p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#17251D] flex items-center space-x-2">
                        <History className="w-4 h-4 text-[#B89A70]" />
                        <span>Recent Booking Notifications & Dispatch Log</span>
                      </h3>
                      <p className="text-xs text-[#555D56] mt-0.5">
                        Audit trail of automated WhatsApp alerts sent to host (+{waConfig?.cleanHostPhone || '917908192498'})
                      </p>
                    </div>
                    <div className="text-xs text-neutral-500 font-medium">
                      Total Bookings: {inquiries.length}
                    </div>
                  </div>

                  <div className="border border-[#EAE4DB] rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF7F2] uppercase text-[10px] tracking-wider text-neutral-500">
                        <tr>
                          <th className="p-3">Booking ID</th>
                          <th className="p-3">Guest</th>
                          <th className="p-3">Host Number</th>
                          <th className="p-3">Dispatch Status</th>
                          <th className="p-3">Timestamp</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAE4DB]">
                        {inquiries.slice(0, 10).map((inq) => {
                          const status = inq.whatsappNotification?.status;
                          return (
                            <tr key={inq.id} className="hover:bg-[#FAF7F2]/60">
                              <td className="p-3 font-mono font-semibold text-[#17251D]">{inq.id}</td>
                              <td className="p-3">
                                <div className="font-semibold text-[#1A1A1A]">{inq.guestName}</div>
                                <div className="text-[11px] text-neutral-500">{inq.room} · ₹{Number(inq.estimatedTotal || 0).toLocaleString('en-IN')}</div>
                              </td>
                              <td className="p-3 font-mono text-[11px] text-neutral-600">
                                {inq.whatsappNotification?.recipient ? `+${inq.whatsappNotification.recipient}` : `+${waConfig?.cleanHostPhone || '917908192498'}`}
                              </td>
                              <td className="p-3">
                                {status === 'sent' ? (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded-md border border-emerald-200">
                                    <CheckCheck className="w-3 h-3 text-emerald-600" />
                                    <span>Delivered (Meta API)</span>
                                  </span>
                                ) : status === 'simulated' ? (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-semibold rounded-md border border-amber-200">
                                    <Radio className="w-3 h-3 text-amber-600" />
                                    <span>Simulated (Dev)</span>
                                  </span>
                                ) : status === 'failed' ? (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-rose-50 text-rose-800 text-[10px] font-semibold rounded-md border border-rose-200" title={inq.whatsappNotification?.error}>
                                    <AlertCircle className="w-3 h-3 text-rose-600" />
                                    <span>Failed</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-medium rounded-md">
                                    <span>Pending</span>
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-[11px] text-neutral-500">
                                {inq.whatsappNotification?.sentAt
                                  ? new Date(inq.whatsappNotification.sentAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                                  : inq.createdAt
                                  ? new Date(inq.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                                  : '—'}
                              </td>
                              <td className="p-3 text-right space-x-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedWaMessageInquiry(inq)}
                                  className="px-2.5 py-1 text-[11px] font-semibold bg-[#FAF7F2] hover:bg-neutral-200 text-[#17251D] border border-[#D5C9B8] rounded-lg transition-colors inline-flex items-center space-x-1"
                                >
                                  <Smartphone className="w-3 h-3 text-[#B89A70]" />
                                  <span>View Message</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleResendWa(inq.id)}
                                  disabled={waResendingId === inq.id}
                                  className="px-2.5 py-1 text-[11px] font-semibold bg-[#17251D] text-[#B89A70] hover:bg-black rounded-lg transition-colors disabled:opacity-50 inline-flex items-center space-x-1"
                                >
                                  <Send className={`w-3 h-3 ${waResendingId === inq.id ? 'animate-spin' : ''}`} />
                                  <span>{waResendingId === inq.id ? 'Resending...' : 'Resend'}</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 8. TYPOGRAPHY & DESIGN TAB */}
            {activeTab === 'design' && designForm && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-roman text-3xl sm:text-4xl text-[#17251D] uppercase tracking-wide">
                      Typography & Design System
                    </h2>
                    <p className="text-xs text-[#555D56] mt-1">
                      Configure heading and body typography, lining numerals, brand palette, and spacing tokens safely.
                    </p>
                  </div>

                  <button
                    onClick={handleSaveDesignTokens}
                    className="px-4 py-2 bg-[#17251D] text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Apply Tokens Live</span>
                  </button>
                </div>

                <form onSubmit={handleSaveDesignTokens} className="bg-white border border-[#EAE4DB] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                  
                  {/* Font Families */}
                  <div className="space-y-4 pb-6 border-b border-[#EAE4DB]">
                    <h3 className="font-roman text-xl text-[#17251D] uppercase">Font Families</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                          Heading & Display Font
                        </label>
                        <select
                          value={designForm.headingFont}
                          onChange={(e) => setDesignForm({ ...designForm, headingFont: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                        >
                          <option value="'Cormorant Garamond', Georgia, serif">Cormorant Garamond (Default Luxury Serif)</option>
                          <option value="'Playfair Display', serif">Playfair Display</option>
                          <option value="'Cinzel', serif">Cinzel</option>
                          <option value="'DM Serif Display', serif">DM Serif Display</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                          Body & UI Font
                        </label>
                        <select
                          value={designForm.bodyFont}
                          onChange={(e) => setDesignForm({ ...designForm, bodyFont: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl"
                        >
                          <option value="'DM Sans', sans-serif">DM Sans (Default Clean Sans)</option>
                          <option value="'Lato', sans-serif">Lato</option>
                          <option value="'Inter', sans-serif">Inter</option>
                          <option value="'Montserrat', sans-serif">Montserrat</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Brand Palette */}
                  <div className="space-y-4 pb-6 border-b border-[#EAE4DB]">
                    <h3 className="font-roman text-xl text-[#17251D] uppercase">Color Tokens</h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                          Header Deep Green
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={designForm.colorHeaderBg || '#17251D'}
                            onChange={(e) => setDesignForm({ ...designForm, colorHeaderBg: e.target.value })}
                            className="w-8 h-8 rounded border border-neutral-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={designForm.colorHeaderBg || '#17251D'}
                            onChange={(e) => setDesignForm({ ...designForm, colorHeaderBg: e.target.value })}
                            className="px-2 py-1.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs font-mono rounded-lg flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                          Accent Antique Gold
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={designForm.colorAccentGold || '#B89A70'}
                            onChange={(e) => setDesignForm({ ...designForm, colorAccentGold: e.target.value })}
                            className="w-8 h-8 rounded border border-neutral-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={designForm.colorAccentGold || '#B89A70'}
                            onChange={(e) => setDesignForm({ ...designForm, colorAccentGold: e.target.value })}
                            className="px-2 py-1.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs font-mono rounded-lg flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                          Page Cream Background
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={designForm.colorPageBg || '#FAF7F2'}
                            onChange={(e) => setDesignForm({ ...designForm, colorPageBg: e.target.value })}
                            className="w-8 h-8 rounded border border-neutral-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={designForm.colorPageBg || '#FAF7F2'}
                            onChange={(e) => setDesignForm({ ...designForm, colorPageBg: e.target.value })}
                            className="px-2 py-1.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs font-mono rounded-lg flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setDesignForm({
                          headingFont: "'Cormorant Garamond', Georgia, serif",
                          bodyFont: "'DM Sans', sans-serif",
                          colorHeaderBg: "#17251D",
                          colorFooterBg: "#111613",
                          colorAccentGold: "#B89A70",
                          colorGoldLight: "#CBB08B",
                          colorBodyDark: "#1A1A1A",
                          colorPageBg: "#FAF7F2",
                          colorSectionLight: "#F3EFEA",
                          sectionPaddingDesktop: "96px",
                          sectionPaddingMobile: "64px"
                        });
                        showToast('Reset tokens to Mineral Springs luxury defaults');
                      }}
                      className="px-4 py-2 border border-[#D5C9B8] text-xs rounded-xl text-neutral-600 hover:bg-[#FAF7F2]"
                    >
                      Reset Defaults
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#17251D] text-[#B89A70] text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Design Tokens</span>
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* 9. SECURITY & AUDIT LOGS TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-roman text-3xl sm:text-4xl text-[#17251D] uppercase tracking-wide">
                      Security & System Logs
                    </h2>
                    <p className="text-xs text-[#555D56] mt-1">
                      Manage administrator credentials, scrypt password hashing, and review security audit trails.
                    </p>
                  </div>
                </div>

                {/* Change Password Card */}
                <div className="bg-white border border-[#EAE4DB] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
                  <h3 className="font-roman text-xl text-[#17251D] uppercase">
                    Change Administrator Password
                  </h3>

                  {passMessage.text && (
                    <div className={`p-3 rounded-xl text-xs font-medium ${
                      passMessage.type === 'error' ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {passMessage.text}
                    </div>
                  )}

                  <form onSubmit={handleChangePasswordSubmit} className="space-y-3 max-w-md">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-sm rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                        New Password (minimum 8 characters)
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-sm rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C9B8] text-sm rounded-xl"
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-2.5 px-5 bg-[#17251D] text-[#B89A70] uppercase tracking-wider text-xs font-semibold rounded-xl"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                {/* Audit Logs Table */}
                <div className="bg-white border border-[#EAE4DB] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-roman text-xl text-[#17251D] uppercase">
                      Security Audit Trail
                    </h3>
                    <button
                      onClick={loadAuditLogs}
                      className="text-xs text-[#B89A70] hover:underline flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF7F2] uppercase text-[10px] tracking-wider text-neutral-500">
                        <tr>
                          <th className="p-2.5">Timestamp</th>
                          <th className="p-2.5">Action</th>
                          <th className="p-2.5">User</th>
                          <th className="p-2.5">IP</th>
                          <th className="p-2.5">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAE4DB]">
                        {auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-[#FAF7F2]/50">
                            <td className="p-2.5 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#17251D]/10 text-[#17251D]">
                                {log.action}
                              </span>
                            </td>
                            <td className="p-2.5 font-semibold text-[#1A1A1A]">{log.username}</td>
                            <td className="p-2.5 font-mono text-[11px] text-neutral-500">{log.ip}</td>
                            <td className="p-2.5 text-neutral-700">{log.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </main>
        </div>
      )}

      {/* Visual Media Picker Modal */}
      <MediaPickerModal
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          if (mediaPickerCallback) mediaPickerCallback(url);
          setMediaPickerOpen(false);
        }}
        title={mediaPickerTitle}
        mediaList={mediaList}
        uploadMedia={uploadMedia}
        showToast={showToast}
      />

      {/* WhatsApp Message Preview Modal */}
      {selectedWaMessageInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#D5C9B8]">
            <div className="bg-[#075E54] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-[#128C7E] flex items-center justify-center text-sm font-bold shrink-0">
                  🏡
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Host WhatsApp Notification</h3>
                  <p className="text-[10px] text-emerald-100">
                    Booking Ref: {selectedWaMessageInquiry.id} · {selectedWaMessageInquiry.guestName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWaMessageInquiry(null)}
                className="text-white/80 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 bg-[#EFEAE2] space-y-4">
              <div className="text-[11px] text-neutral-600 bg-white/70 p-2.5 rounded-lg border border-[#D5C9B8]/40">
                <strong>Recipient:</strong> +{waConfig?.cleanHostPhone || '917908192498'} (Host Phone)
              </div>

              {/* Message Bubble */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-[#D5C9B8]/40 space-y-2 text-xs text-[#1A1A1A] leading-relaxed whitespace-pre-wrap font-sans">
                {formatBookingPreviewText(selectedWaMessageInquiry)}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(formatBookingPreviewText(selectedWaMessageInquiry));
                    showToast('WhatsApp message text copied to clipboard!');
                  }}
                  className="px-3.5 py-2 bg-white text-[#17251D] hover:bg-[#FAF7F2] border border-[#D5C9B8] text-xs font-semibold rounded-xl transition-colors"
                >
                  Copy Message Text
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleResendWa(selectedWaMessageInquiry.id);
                      setSelectedWaMessageInquiry(null);
                    }}
                    className="px-4 py-2 bg-[#17251D] text-[#B89A70] hover:bg-black text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    Resend to Host
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedWaMessageInquiry(null)}
                    className="px-4 py-2 bg-neutral-200 text-neutral-800 hover:bg-neutral-300 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit User Modal */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#D5C9B8]">
            <div className="bg-[#17251D] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#B89A70]/20 flex items-center justify-center text-[#B89A70]">
                  {userModalOpen === 'create' ? <UserPlus className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-roman text-lg text-white">
                    {userModalOpen === 'create' ? 'Add New Team User' : `Edit User: @${selectedUserForEdit?.username}`}
                  </h3>
                  <p className="text-[11px] text-[#B89A70]">
                    {userModalOpen === 'create' ? 'Create internal retreat staff or manager credentials' : 'Update profile details, role, and active status'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUserModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl focus:border-[#17251D] outline-none"
                />
              </div>

              {/* Username & Role Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={userForm.username}
                    onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') }))}
                    placeholder="e.g. rajesh_sharma"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs font-mono rounded-xl focus:border-[#17251D] outline-none"
                  />
                  <p className="text-[10px] text-neutral-400">Lowercase letters, numbers, underscores</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block">
                    Role *
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs font-semibold rounded-xl focus:border-[#17251D] outline-none"
                  >
                    <option value="staff">Staff (Front Desk & Operations)</option>
                    <option value="manager">Manager (Property & Bookings)</option>
                    <option value="admin">Admin (System Operations)</option>
                    {isSuperAdmin && (
                      <option value="superadmin">Super Admin (Website Owner - Full Access)</option>
                    )}
                  </select>
                  <p className="text-[10px] text-neutral-400">Controls permissions across dashboard</p>
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="name@retreat.com"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl focus:border-[#17251D] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={userForm.phone}
                    onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 79081 92498"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs rounded-xl focus:border-[#17251D] outline-none"
                  />
                </div>
              </div>

              {/* Status Select */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block">
                  Account Status
                </label>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 text-xs text-[#17251D] cursor-pointer">
                    <input
                      type="radio"
                      name="userStatus"
                      value="active"
                      checked={userForm.status === 'active'}
                      onChange={() => setUserForm(prev => ({ ...prev, status: 'active' }))}
                      className="accent-[#17251D]"
                    />
                    <span>Active (Can sign in)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs text-neutral-600 cursor-pointer">
                    <input
                      type="radio"
                      name="userStatus"
                      value="inactive"
                      checked={userForm.status === 'inactive'}
                      onChange={() => setUserForm(prev => ({ ...prev, status: 'inactive' }))}
                      className="accent-[#17251D]"
                    />
                    <span>Inactive (Sign-in disabled)</span>
                  </label>
                </div>
              </div>

              {/* Password field for creation */}
              {userModalOpen === 'create' && (
                <div className="space-y-1.5 pt-2 border-t border-[#EAE4DB]">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block">
                      Password (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const pwd = generateRandomPassword(12);
                        setUserForm(prev => ({ ...prev, password: pwd }));
                      }}
                      className="text-[10.5px] text-[#B89A70] hover:underline flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-Generate Secure Password</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={userForm.password}
                      onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Leave blank to auto-generate a 12-char secure password"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs font-mono rounded-xl focus:border-[#17251D] outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400">
                    If left blank, the server will automatically generate a secure 12-character temporary password.
                  </p>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#EAE4DB]">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2 bg-[#17251D] text-[#B89A70] hover:bg-black text-xs uppercase tracking-wider font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {savingUser && <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#B89A70]" />}
                  <span>{savingUser ? 'Creating User...' : userModalOpen === 'create' ? 'Create User' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {userResetModalOpen && selectedUserForReset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#D5C9B8]">
            <div className="bg-[#17251D] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-[#B89A70]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-roman text-lg text-white">Reset User Password</h3>
                  <p className="text-[11px] text-[#B89A70]">
                    User: @{selectedUserForReset.username} ({selectedUserForReset.name})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUserResetModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteResetUserPassword} className="p-6 space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                Resetting the password will immediately invalidate all active sessions for <strong>@{selectedUserForReset.username}</strong>.
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#555D56] block">
                    New Password (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetUserPassInput(generateRandomPassword(12));
                    }}
                    className="text-[10.5px] text-[#B89A70] hover:underline flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={resetUserPassInput}
                  onChange={(e) => setResetUserPassInput(e.target.value)}
                  placeholder="Leave blank to generate secure 12-char password"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C9B8] text-xs font-mono rounded-xl focus:border-[#17251D] outline-none"
                />
                <p className="text-[10px] text-neutral-400">
                  Minimum 8 characters if provided, or leave empty to auto-generate.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#EAE4DB]">
                <button
                  type="button"
                  onClick={() => setUserResetModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resettingUserPass}
                  className="px-5 py-2 bg-[#17251D] text-[#B89A70] hover:bg-black text-xs uppercase tracking-wider font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50"
                >
                  {resettingUserPass ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generated Password Notice Modal */}
      {generatedUserPassNotice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-emerald-200 animate-in fade-in zoom-in duration-200">
            <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-emerald-200">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Credentials Ready</h3>
                  <p className="text-[10.5px] text-emerald-200">Temporary password generated</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGeneratedUserPassNotice(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-neutral-600">
                Please copy and share these login credentials with the user. This temporary password will not be displayed again.
              </p>

              <div className="bg-[#FAF7F2] border border-[#D5C9B8] rounded-2xl p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 uppercase text-[10px] tracking-wider font-sans">Username:</span>
                  <span className="font-bold text-[#17251D] text-sm">@{generatedUserPassNotice.username}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#EAE4DB] pt-2">
                  <span className="text-neutral-500 uppercase text-[10px] tracking-wider font-sans">Temporary Password:</span>
                  <span className="font-bold text-emerald-800 text-sm tracking-wider select-all bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {generatedUserPassNotice.password}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = `Mineral Springs Retreat Backend Login\nUsername: ${generatedUserPassNotice.username}\nPassword: ${generatedUserPassNotice.password}\nLogin URL: http://localhost:3000/#admin`;
                    navigator.clipboard.writeText(text);
                    showToast('Credentials copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-white text-[#17251D] hover:bg-[#FAF7F2] border border-[#D5C9B8] text-xs font-semibold rounded-xl transition-colors"
                >
                  Copy Credentials
                </button>
                <button
                  type="button"
                  onClick={() => setGeneratedUserPassNotice(null)}
                  className="px-5 py-2 bg-[#17251D] text-[#B89A70] hover:bg-black text-xs uppercase tracking-wider font-semibold rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
