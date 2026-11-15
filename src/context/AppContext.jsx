import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Public Data
  const [pages, setPages] = useState(null);
  const [settings, setSettings] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [perks, setPerks] = useState([]);
  const [tariff, setTariff] = useState(null);
  const [travel, setTravel] = useState(null);
  const [designTokens, setDesignTokens] = useState(null);

  // Loading & Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin & Preview Mode State
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('msr_admin_token') || '');
  const [adminUser, setAdminUser] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [guestsList, setGuestsList] = useState([]);

  // Backend User Management State (Super Admin)
  const [backendUsers, setBackendUsers] = useState([]);
  const [backendUsersCounts, setBackendUsersCounts] = useState({
    total: 0,
    superadmin: 0,
    admin: 0,
    staff: 0,
    active: 0,
    inactive: 0
  });
  const [usersLoading, setUsersLoading] = useState(false);

  // Guest Authentication & Customer Account State
  const [guestToken, setGuestToken] = useState(() => localStorage.getItem('msr_guest_token') || '');
  const [guestUser, setGuestUser] = useState(null);
  const [guestAuthModalOpen, setGuestAuthModalOpen] = useState(false);
  const [myBookingsModalOpen, setMyBookingsModalOpen] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [guestLoading, setGuestLoading] = useState(false);

  // Modals & Navigation state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingPrefill, setBookingPrefill] = useState({ roomId: '', checkIn: '', checkOut: '', guests: 2 });
  const [lightboxState, setLightboxState] = useState({ open: false, index: 0, items: [] });
  const [policyModal, setPolicyModal] = useState(null); // 'privacy' | 'terms' | null

  // Safely inject dynamic CSS design tokens
  const applyDesignTokens = useCallback((tokens) => {
    if (!tokens) return;
    let styleTag = document.getElementById('dynamic-design-tokens');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-design-tokens';
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
      :root {
        ${tokens.headingFont ? `--font-heading: ${tokens.headingFont};` : ''}
        ${tokens.bodyFont ? `--font-body: ${tokens.bodyFont};` : ''}
        ${tokens.colorHeaderBg ? `--color-header-bg: ${tokens.colorHeaderBg};` : ''}
        ${tokens.colorFooterBg ? `--color-footer-bg: ${tokens.colorFooterBg};` : ''}
        ${tokens.colorAccentGold ? `--gold-primary: ${tokens.colorAccentGold};` : ''}
        ${tokens.colorGoldLight ? `--gold-light: ${tokens.colorGoldLight};` : ''}
        ${tokens.colorPageBg ? `--cream-bg: ${tokens.colorPageBg};` : ''}
        ${tokens.sectionPaddingDesktop ? `--section-pad-desk: ${tokens.sectionPaddingDesktop};` : ''}
        ${tokens.sectionPaddingMobile ? `--section-pad-mob: ${tokens.sectionPaddingMobile};` : ''}
      }
    `;
  }, []);

  // Fetch safe helper with anti-cache timestamping
  const fetchSafe = async (url, fallback, options = {}) => {
    try {
      const sep = url.includes('?') ? '&' : '?';
      const cacheBustUrl = `${url}${sep}_t=${Date.now()}`;
      const res = await fetch(cacheBustUrl, {
        cache: 'no-store',
        ...options
      });
      if (!res.ok) return fallback;
      const text = await res.text();
      if (!text || !text.trim()) return fallback;
      return JSON.parse(text);
    } catch (e) {
      console.warn(`Fetch fallback for ${url}:`, e);
      return fallback;
    }
  };

  // Load all public website data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const contentUrl = previewMode && adminToken
        ? '/api/content/pages?preview=true'
        : '/api/content/pages';

      const contentHeaders = previewMode && adminToken
        ? { Authorization: `Bearer ${adminToken}` }
        : {};

      const [pagesRes, settingsRes, roomsRes, galleryRes, expRes, testRes, perksRes, tariffRes, travelRes, designRes] = await Promise.all([
        fetchSafe(contentUrl, null, { headers: contentHeaders }),
        fetchSafe('/api/settings', null),
        fetchSafe('/api/rooms', []),
        fetchSafe('/api/gallery', []),
        fetchSafe('/api/experiences', []),
        fetchSafe('/api/testimonials', []),
        fetchSafe('/api/perks', []),
        fetchSafe('/api/tariff', null),
        fetchSafe('/api/travel', null),
        fetchSafe('/api/design', null)
      ]);

      if (pagesRes?.pages) {
        setPages(pagesRes.pages);
      }
      if (settingsRes) setSettings(settingsRes);
      setRooms(Array.isArray(roomsRes) ? roomsRes : []);
      setGallery(Array.isArray(galleryRes) ? galleryRes : []);
      setExperiences(Array.isArray(expRes) ? expRes : []);
      setTestimonials(Array.isArray(testRes) ? testRes : []);
      setPerks(Array.isArray(perksRes) ? perksRes : []);
      setTariff(tariffRes);
      setTravel(travelRes);
      if (designRes) {
        setDesignTokens(designRes);
        applyDesignTokens(designRes);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching website data:', err);
      setError('Failed to connect to backend server. Make sure the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, [previewMode, adminToken, applyDesignTokens]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Check admin session validity on mount
  useEffect(() => {
    const verifyStoredToken = async () => {
      if (!adminToken) return;
      try {
        const res = await fetch('/api/auth/verify', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        const data = await res.json();
        if (data.valid && data.user) {
          setAdminUser(data.user);
        } else {
          // Token invalid or expired
          setAdminToken('');
          setAdminUser(null);
          localStorage.removeItem('msr_admin_token');
        }
      } catch (err) {
        console.warn('Admin token check failed:', err);
      }
    };
    verifyStoredToken();
  }, [adminToken]);

  // Detect Google OAuth callback parameters in URL (?auth=success&token=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const auth = urlParams.get('auth');
    const authError = urlParams.get('auth_error');

    if (authError) {
      console.warn('[AUTH] Google OAuth error returned:', authError);
      urlParams.delete('auth_error');
      const newSearch = urlParams.toString();
      const currentHash = window.location.hash;
      const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '') + currentHash;
      window.history.replaceState({}, document.title, newUrl);
      return;
    }

    if (auth === 'success' && token) {
      localStorage.setItem('msr_guest_token', token);
      setGuestToken(token);
      urlParams.delete('token');
      urlParams.delete('auth');
      urlParams.delete('guestName');
      const newSearch = urlParams.toString();
      const currentHash = window.location.hash;
      const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '') + currentHash;
      window.history.replaceState({}, document.title, newUrl);

      // Restore user flow based on return hash
      if (currentHash === '#reserve') {
        setBookingModalOpen(true);
      } else if (currentHash === '#my-bookings') {
        setMyBookingsModalOpen(true);
      }
    }
  }, []);

  // Load Personal Guest Bookings
  const loadMyBookings = useCallback(async (tokenToUse) => {
    const token = tokenToUse || guestToken;
    if (!token) {
      setMyBookings([]);
      return;
    }
    try {
      const res = await fetch(`/api/inquiries/my-bookings?_t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyBookings(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load guest bookings:', err);
    }
  }, [guestToken]);

  // Check guest session on mount / token change
  useEffect(() => {
    const verifyGuest = async () => {
      if (!guestToken) {
        setGuestUser(null);
        return;
      }
      try {
        setGuestLoading(true);
        const res = await fetch(`/api/auth/me?_t=${Date.now()}`, {
          headers: { Authorization: `Bearer ${guestToken}` }
        });
        const data = await res.json();
        if (data.authenticated && data.user) {
          setGuestUser(data.user);
          loadMyBookings(guestToken);
          // If signed-in user is owner or admin, also grant admin session
          if (['superadmin', 'admin', 'manager', 'staff'].includes(data.user.role)) {
            setAdminToken(guestToken);
            setAdminUser(data.user);
            localStorage.setItem('msr_admin_token', guestToken);
          }
        } else {
          setGuestToken('');
          setGuestUser(null);
          localStorage.removeItem('msr_guest_token');
        }
      } catch (err) {
        console.warn('Guest verification failed:', err);
      } finally {
        setGuestLoading(false);
      }
    };
    verifyGuest();
  }, [guestToken, loadMyBookings]);

  // Load Admin Inquiries
  const loadInquiries = useCallback(async (status = 'all', search = '') => {
    if (!adminToken) return;
    try {
      const q = new URLSearchParams();
      if (status && status !== 'all') q.set('status', status);
      if (search) q.set('search', search);

      const res = await fetch(`/api/inquiries?${q.toString()}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error loading inquiries:', err);
    }
  }, [adminToken]);

  // Cancel Booking (Guest or Admin)
  const cancelBooking = useCallback(async (bookingId) => {
    try {
      const token = guestToken || adminToken;
      const res = await fetch(`/api/inquiries/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        if (guestToken) loadMyBookings(guestToken);
        if (adminToken) loadInquiries();
        return { success: true, inquiry: data.inquiry };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [guestToken, adminToken, loadMyBookings, loadInquiries]);

  // Modify Booking (Guest or Admin)
  const modifyBooking = useCallback(async (bookingId, updates) => {
    try {
      const token = guestToken || adminToken;
      const res = await fetch(`/api/inquiries/${bookingId}/modify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (res.ok) {
        if (guestToken) loadMyBookings(guestToken);
        if (adminToken) loadInquiries();
        return { success: true, inquiry: data.inquiry };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [guestToken, adminToken, loadMyBookings, loadInquiries]);

  // Create Manual Booking (Admin)
  const createManualBooking = useCallback(async (bookingData) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/inquiries/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();
      if (res.ok) {
        loadInquiries();
        return { success: true, inquiry: data.inquiry };
      } else {
        return { success: false, error: data.error, conflicts: data.conflicts };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [adminToken, loadInquiries]);

  // Update Booking (Admin)
  const updateBooking = useCallback(async (bookingId, updates) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch(`/api/inquiries/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (res.ok) {
        loadInquiries();
        return { success: true, inquiry: data.inquiry };
      } else {
        return { success: false, error: data.error, conflicts: data.conflicts };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [adminToken, loadInquiries]);

  // Load Media Library
  const loadMedia = useCallback(async (category = 'All', search = '') => {
    if (!adminToken) return;
    try {
      const q = new URLSearchParams();
      if (category && category !== 'All') q.set('category', category);
      if (search) q.set('search', search);

      const res = await fetch(`/api/media?${q.toString()}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMediaList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error loading media library:', err);
    }
  }, [adminToken]);

  // Load Audit Logs
  const loadAuditLogs = useCallback(async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/auth/logs', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error loading audit logs:', err);
    }
  }, [adminToken]);

  // Load Registered Guests (Admin only)
  const loadGuests = useCallback(async (search = '') => {
    if (!adminToken) return;
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      const sep = q ? '&' : '?';
      const res = await fetch(`/api/guests${q}${sep}_t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGuestsList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error loading guests list:', err);
    }
  }, [adminToken]);

  // Load Backend Users (Super Admin only)
  const loadBackendUsers = useCallback(async (search = '', role = 'all', status = 'all') => {
    if (!adminToken) return;
    setUsersLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (role && role !== 'all') params.append('role', role);
      if (status && status !== 'all') params.append('status', status);
      params.append('_t', Date.now());

      const res = await fetch(`/api/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBackendUsers(data.users || []);
        if (data.counts) setBackendUsersCounts(data.counts);
      }
    } catch (err) {
      console.error('Error loading backend users:', err);
    } finally {
      setUsersLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminToken) {
      loadInquiries();
      loadMedia();
      loadAuditLogs();
      loadGuests();
      loadBackendUsers();
    }
  }, [adminToken, loadInquiries, loadMedia, loadAuditLogs, loadGuests, loadBackendUsers]);

  // --- AUTHENTICATION METHODS ---
  const adminLogin = async (username, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setAdminToken(data.token);
        setAdminUser(data.user);
        localStorage.setItem('msr_admin_token', data.token);
        loadInquiries();
        loadMedia();
        loadAuditLogs();
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: 'Server connection error: ' + err.message };
    }
  };

  const adminLogout = async () => {
    try {
      if (adminToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` }
        });
      }
    } catch {}
    setAdminToken('');
    setAdminUser(null);
    setPreviewMode(false);
    localStorage.removeItem('msr_admin_token');
    setInquiries([]);
    setMediaList([]);
    setAuditLogs([]);
    setGuestsList([]);
    setBackendUsers([]);
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!adminToken) return { success: false, message: 'Unauthorized' };
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const resetPasswordWithToken = async (token, newPassword) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // --- CONTENT MANAGEMENT METHODS ---
  const updatePageContent = async (pageId, content, publishImmediately = true) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch(`/api/content/pages/${pageId}?publishImmediately=${publishImmediately}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ ...content, publishImmediately })
      });
      const data = await res.json();
      if (res.ok) {
        setPages(prev => ({ ...prev, [pageId]: data.content }));
        await loadData();
        loadAuditLogs();
        return { success: true, content: data.content };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const publishAllContent = async () => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/content/publish', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPages(data.pages);
        setPreviewMode(false);
        loadAuditLogs();
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const discardDraftContent = async () => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/content/discard-draft', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPages(data.pages);
        setPreviewMode(false);
        loadAuditLogs();
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // --- DESIGN TOKENS METHOD ---
  const updateDesignTokens = async (tokens) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/design', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(tokens)
      });
      const data = await res.json();
      if (res.ok) {
        setDesignTokens(data.tokens);
        applyDesignTokens(data.tokens);
        loadAuditLogs();
        return { success: true, tokens: data.tokens };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // --- MEDIA METHODS ---
  const uploadMedia = async (dataUrl, metadata = {}) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ dataUrl, ...metadata })
      });
      const data = await res.json();
      if (res.ok) {
        loadMedia();
        loadAuditLogs();
        return { success: true, media: data.media };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const replaceMedia = async (id, dataUrl, filename) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch(`/api/media/${id}/replace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ dataUrl, filename })
      });
      const data = await res.json();
      if (res.ok) {
        loadMedia();
        loadData(); // reload content in case page references updated
        loadAuditLogs();
        return { success: true, message: data.message, media: data.media };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteMedia = async (id) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        loadMedia();
        loadAuditLogs();
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateMediaMetadata = async (id, metadata) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(metadata)
      });
      const data = await res.json();
      if (res.ok) {
        loadMedia();
        return { success: true, media: data.media };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // --- ROOMS CRUD ---
  const saveRoom = async (roomData, isEdit = false) => {
    const url = isEdit ? `/api/rooms/${roomData.id}` : '/api/rooms';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify(roomData)
    });
    const data = await res.json();
    if (res.ok) {
      loadData();
      loadAuditLogs();
      return { success: true, room: data.room };
    }
    return { success: false, error: data.error };
  };

  const deleteRoom = async (roomId) => {
    const res = await fetch(`/api/rooms/${roomId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.ok) {
      loadData();
      loadAuditLogs();
      return { success: true };
    }
    return { success: false };
  };

  // --- EXPERIENCES CRUD ---
  const saveExperience = async (expData, isEdit = false) => {
    const url = isEdit ? `/api/experiences/${expData.id}` : '/api/experiences';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify(expData)
    });
    const data = await res.json();
    if (res.ok) {
      loadData();
      loadAuditLogs();
      return { success: true, experience: data.experience };
    }
    return { success: false, error: data.error };
  };

  const deleteExperience = async (expId) => {
    const res = await fetch(`/api/experiences/${expId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.ok) {
      loadData();
      loadAuditLogs();
      return { success: true };
    }
    return { success: false };
  };

  // --- GALLERY CRUD ---
  const saveGalleryPhoto = async (photoData, isEdit = false) => {
    const url = isEdit ? `/api/gallery/${photoData.id}` : '/api/gallery';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify(photoData)
    });
    const data = await res.json();
    if (res.ok) {
      loadData();
      loadAuditLogs();
      return { success: true, photo: data.photo };
    }
    return { success: false, error: data.error };
  };

  const deleteGalleryPhoto = async (id) => {
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.ok) {
      loadData();
      loadAuditLogs();
      return { success: true };
    }
    return { success: false };
  };

  // --- GUEST AUTHENTICATION METHODS ---
  const guestLoginWithGoogle = async (credential) => {
    try {
      setGuestLoading(true);
      const res = await fetch('/api/auth/google/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setGuestToken(data.token);
        setGuestUser(data.user);
        localStorage.setItem('msr_guest_token', data.token);
        setGuestAuthModalOpen(false);
        loadMyBookings(data.token);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Google verification failed' };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setGuestLoading(false);
    }
  };

  const guestLogout = async () => {
    try {
      if (guestToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${guestToken}` }
        });
      }
    } catch {}
    setGuestToken('');
    setGuestUser(null);
    setMyBookings([]);
    setMyBookingsModalOpen(false);
    localStorage.removeItem('msr_guest_token');
  };

  const updateGuestProfile = async ({ name, phone }) => {
    if (!guestToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/auth/guest/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${guestToken}`
        },
        body: JSON.stringify({ name, phone })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGuestUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Failed to update profile' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // --- INQUIRIES MANAGEMENT ---
  const submitInquiry = async (formData) => {
    if (!guestToken) {
      setGuestAuthModalOpen(true);
      return {
        success: false,
        requireAuth: true,
        error: 'Please sign in with your Google account before submitting a reservation inquiry.'
      };
    }

    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${guestToken}`
      },
      body: JSON.stringify(formData)
    });
    const result = await res.json();
    if (!res.ok) {
      if (res.status === 401) {
        setGuestAuthModalOpen(true);
      }
      throw new Error(result.error || 'Failed to submit inquiry');
    }
    loadMyBookings();
    if (adminToken) {
      loadInquiries();
      loadGuests();
    }
    return result;
  };

  const addInquiryNote = async (inquiryId, note) => {
    if (!adminToken) return { success: false };
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ note })
      });
      if (res.ok) {
        loadInquiries();
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const exportInquiriesCSV = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/inquiries/export-csv?_t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mineral-springs-reservations-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('CSV export failed:', err);
    }
  };

  const updateInquiryStatus = async (inquiryId, status) => {
    const res = await fetch(`/api/inquiries/${inquiryId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      loadInquiries();
      loadAuditLogs();
      return { success: true };
    }
    return { success: false };
  };

  const deleteInquiry = async (inquiryId) => {
    const res = await fetch(`/api/inquiries/${inquiryId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.ok) {
      loadInquiries();
      loadAuditLogs();
      return { success: true };
    }
    return { success: false };
  };

  const updateInquiryPaymentStatus = async (inquiryId, paymentStatus) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ paymentStatus })
      });
      if (res.ok) {
        loadInquiries();
        loadAuditLogs();
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // User Management Operations (Super Admin)
  const createBackendUser = async (userData) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await loadBackendUsers();
        loadAuditLogs();
        return data;
      }
      return { success: false, error: data.error || 'Failed to create user' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateBackendUser = async (userId, userData) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await loadBackendUsers();
        loadAuditLogs();
        return data;
      }
      return { success: false, error: data.error || 'Failed to update user' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const toggleUserStatus = async (userId) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await loadBackendUsers();
        loadAuditLogs();
        return data;
      }
      return { success: false, error: data.error || 'Failed to update user status' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const resetUserPassword = async (userId, newPassword) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch(`/api/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        loadAuditLogs();
        return data;
      }
      return { success: false, error: data.error || 'Failed to reset password' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteBackendUser = async (userId) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await loadBackendUsers();
        loadAuditLogs();
        return data;
      }
      return { success: false, error: data.error || 'Failed to delete user' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // WhatsApp Notification API Integrations
  const getWhatsAppConfig = async () => {
    if (!adminToken) return null;
    try {
      const res = await fetch(`/api/whatsapp/config?_t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Error fetching WhatsApp config:', err);
    }
    return null;
  };

  const updateWhatsAppConfig = async (config) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/whatsapp/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(config)
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const sendTestWhatsAppNotification = async (payload = {}) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/whatsapp/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const resendBookingWhatsAppNotification = async (inquiryId) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch(`/api/whatsapp/resend/${inquiryId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        loadInquiries();
      }
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Modals & Navigation
  const openBooking = (roomId = '', prefillDates = {}) => {
    setBookingPrefill({
      roomId: roomId || '',
      checkIn: prefillDates.checkIn || '',
      checkOut: prefillDates.checkOut || '',
      guests: prefillDates.guests || 2
    });
    setBookingModalOpen(true);
  };

  const closeBooking = () => setBookingModalOpen(false);

  const openLightbox = (index, items = null) => {
    setLightboxState({
      open: true,
      index,
      items: items || gallery
    });
  };

  const closeLightbox = () => setLightboxState(prev => ({ ...prev, open: false }));

  const nextLightbox = () => {
    setLightboxState(prev => ({
      ...prev,
      index: (prev.index + 1) % prev.items.length
    }));
  };

  const prevLightbox = () => {
    setLightboxState(prev => ({
      ...prev,
      index: (prev.index - 1 + prev.items.length) % prev.items.length
    }));
  };

  return (
    <AppContext.Provider
      value={{
        // Public & Content State
        pages,
        settings,
        rooms,
        gallery,
        experiences,
        testimonials,
        perks,
        tariff,
        travel,
        designTokens,
        loading,
        error,
        loadData,
        // Draft Preview
        previewMode,
        setPreviewMode,
        updatePageContent,
        publishAllContent,
        discardDraftContent,
        updateDesignTokens,
        // Media Library
        mediaList,
        loadMedia,
        uploadMedia,
        replaceMedia,
        deleteMedia,
        updateMediaMetadata,
        // Rooms CRUD
        saveRoom,
        deleteRoom,
        // Experiences CRUD
        saveExperience,
        deleteExperience,
        // Gallery CRUD
        saveGalleryPhoto,
        deleteGalleryPhoto,
        // Inquiries Management
        inquiries,
        loadInquiries,
        submitInquiry,
        updateInquiryStatus,
        updateInquiryPaymentStatus,
        deleteInquiry,
        addInquiryNote,
        exportInquiriesCSV,
        // Backend User Management (Super Admin)
        backendUsers,
        backendUsersCounts,
        usersLoading,
        loadBackendUsers,
        createBackendUser,
        updateBackendUser,
        toggleUserStatus,
        resetUserPassword,
        deleteBackendUser,
        // WhatsApp Notifications
        getWhatsAppConfig,
        updateWhatsAppConfig,
        sendTestWhatsAppNotification,
        resendBookingWhatsAppNotification,
        // Guest Authentication & Customer Area
        guestToken,
        guestUser,
        guestLoading,
        guestAuthModalOpen,
        setGuestAuthModalOpen,
        myBookingsModalOpen,
        setMyBookingsModalOpen,
        myBookings,
        loadMyBookings,
        cancelBooking,
        modifyBooking,
        createManualBooking,
        updateBooking,
        guestLoginWithGoogle,
        guestLogout,
        updateGuestProfile,
        // Admin Guest Management
        guestsList,
        loadGuests,
        // Auth & Admin
        adminToken,
        adminUser,
        adminLogin,
        adminLogout,
        changePassword,
        requestPasswordReset,
        resetPasswordWithToken,
        auditLogs,
        loadAuditLogs,
        adminOpen,
        setAdminOpen,
        // Modals & Lightbox
        selectedRoom,
        setSelectedRoom,
        bookingModalOpen,
        bookingPrefill,
        openBooking,
        closeBooking,
        lightboxState,
        openLightbox,
        closeLightbox,
        nextLightbox,
        prevLightbox,
        policyModal,
        setPolicyModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
