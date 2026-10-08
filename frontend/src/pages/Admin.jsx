import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FiDatabase, FiFileText, FiHeadphones, FiCheckCircle, FiEdit2,
  FiTrash2, FiPlus, FiArrowLeft, FiVolume2, FiMic,
  FiAlertCircle, FiSettings, FiLogOut, FiUser, FiMail, FiLock,
  FiKey, FiEye, FiEyeOff, FiX, FiGlobe
} from 'react-icons/fi';
import axios from 'axios';
import Upscaler from 'upscaler';
import defaultModel from '@upscalerjs/default-model';
import { useAuth } from '../context/AuthContext';

// Local model definition to avoid CDN dependency and work 100% offline
const localModelConfig = {
  ...defaultModel,
  path: '/models/default-model/model.json'
};

let upscalerInstance = null;

const getUpscaler = async () => {
  if (!upscalerInstance) {
    try {
      upscalerInstance = new Upscaler({
        model: localModelConfig
      });
      await upscalerInstance.ready;
    } catch (localErr) {
      console.warn("Local Upscaler model loading failed, trying default CDN:", localErr);
      try {
        upscalerInstance = new Upscaler();
        await upscalerInstance.ready;
      } catch (cdnErr) {
        console.error("All Upscaler initializations failed:", cdnErr);
        upscalerInstance = null;
        throw cdnErr;
      }
    }
  }
  return upscalerInstance;
};

// 10 Objek Pemajuan Kebudayaan (OPK)
const KATEGORI_LIST = [
  'Tradisi Lisan',
  'Manuskrip',
  'Adat Istiadat',
  'Ritus',
  'Pengetahuan Tradisional',
  'Teknologi Tradisional',
  'Seni',
  'Bahasa',
  'Permainan Rakyat',
  'Olahraga Tradisional',
];

// Maximum working dimension for AI Super-Resolution preprocessing to preserve sharp camera details while avoiding browser hang
const MAX_AI_DIMENSION = 1400;

/**
 * High-definition fallback upscaler: Performs 2x bicubic super-sampling
 * combined with manuscript contrast sharpening if neural network encounters memory/device limit.
 */
const fallbackSuperSampleEnhance = (imageSource) => {
  return new Promise((resolve) => {
    const origWidth = imageSource.naturalWidth || imageSource.width || 1200;
    const origHeight = imageSource.naturalHeight || imageSource.height || 600;

    // 2x Super-Resolution via high quality canvas scaling
    const targetWidth = origWidth * 2;
    const targetHeight = origHeight * 2;

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(imageSource, 0, 0, targetWidth, targetHeight);
      const dataUrl = canvas.toDataURL('image/png');
      canvas.width = 0;
      canvas.height = 0;
      resolve(dataUrl);
    } else {
      resolve(imageSource.src || imageSource);
    }
  });
};

/**
 * Pre-processes image to a safe working dimension before passing into AI Super-Resolution (UpscalerJS).
 * Uses lossless PNG canvas rendering to preserve delicate manuscript stroke details.
 * Original image file (foto_halaman) is preserved untouched.
 */
const getSafeImageForAi = (dataUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let { width, height } = img;

      // If already within safe dimension, use directly without resizing
      if (width <= MAX_AI_DIMENSION && height <= MAX_AI_DIMENSION) {
        resolve({ imageSource: img, isResized: false, width, height });
        return;
      }

      // Calculate safe proportional dimensions maintaining aspect ratio
      if (width > height) {
        height = Math.round((height * MAX_AI_DIMENSION) / width);
        width = MAX_AI_DIMENSION;
      } else {
        width = Math.round((width * MAX_AI_DIMENSION) / height);
        height = MAX_AI_DIMENSION;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ imageSource: img, isResized: false, width: img.width, height: img.height });
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Use lossless PNG to prevent lossy compression blur on thin text strokes
      const resizedDataUrl = canvas.toDataURL('image/png');

      // Memory cleanup for canvas
      canvas.width = 0;
      canvas.height = 0;

      const safeImg = new Image();
      safeImg.crossOrigin = 'anonymous';
      safeImg.onload = () => {
        resolve({ imageSource: safeImg, isResized: true, width, height });
      };
      safeImg.onerror = reject;
      safeImg.src = resizedDataUrl;
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};

/**
 * Post-processes the AI-upscaled image with an unsharp-mask kernel and adaptive manuscript contrast curve.
 * This recovers crisp etched letter strokes (aksara) and enhances the contrast between dark soot/incisions
 * and the amber/golden palm leaf without creating artificial noise.
 */
const enhanceManuscriptClarity = (dataUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      // Copy buffer for convolution neighborhood sampling
      const buffer = new Uint8ClampedArray(data);

      // Unsharp Mask / Sharpening weights: center 2.4, adjacent neighbors -0.35
      const centerWeight = 2.4;
      const neighborWeight = -0.35;

      for (let y = 1; y < height - 1; y++) {
        const yOffset = y * width;
        const prevYOffset = (y - 1) * width;
        const nextYOffset = (y + 1) * width;

        for (let x = 1; x < width - 1; x++) {
          const idx = (yOffset + x) * 4;

          for (let c = 0; c < 3; c++) {
            const center = buffer[idx + c];
            const up = buffer[(prevYOffset + x) * 4 + c];
            const down = buffer[(nextYOffset + x) * 4 + c];
            const left = buffer[(yOffset + (x - 1)) * 4 + c];
            const right = buffer[(yOffset + (x + 1)) * 4 + c];

            // 1. Convolutional edge sharpening
            let val = center * centerWeight + (up + down + left + right) * neighborWeight;

            // 2. Adaptive Manuscript Contrast Curve (strengthens dark ink grooves vs bright leaf surface)
            let norm = val / 255;
            norm = (norm - 0.5) * 1.25 + 0.5;
            if (norm < 0.45) {
              // Deepen dark incised characters for maximum legibility
              norm = Math.pow(Math.max(0, norm), 1.12);
            }

            data[idx + c] = Math.min(255, Math.max(0, Math.round(norm * 255)));
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const sharpenedDataUrl = canvas.toDataURL('image/png');

      // Cleanup canvas memory
      canvas.width = 0;
      canvas.height = 0;

      resolve(sharpenedDataUrl);
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};

const Admin = () => {
  const { user, logout, updateUser } = useAuth();

  // Tabs: 'naskah' (manajemen naskah), 'halaman' (manajemen lembar per naskah)
  const [activeTab, setActiveTab] = useState('naskah');
  const [selectedManuscript, setSelectedManuscript] = useState(null);

  // Lists
  const [manuscripts, setManuscripts] = useState([]);
  const [pages, setPages] = useState([]);

  // Loading & Toast message
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formErrors, setFormErrors] = useState({});

  // Manuscript Form State
  const [manuscriptForm, setManuscriptForm] = useState({
    kode_naskah: '',
    judul: '',
    desa_asal: '',
    perkiraan_tahun: '',
    bahasa: '',
    kondisi: 'Baik',
    kategori: 'Tradisi Lisan',
    ringkasan: '',
    foto_sampul: null
  });
  const [editManuscriptId, setEditManuscriptId] = useState(null);
  const [manuscriptCoverPreview, setManuscriptCoverPreview] = useState(null);

  // Page Form State
  const [pageForm, setPageForm] = useState({
    nomor_lembar: '',
    judul_halaman: '',
    kondisi: 'Baik',
    penjelasan: '',
    catatan: '',
    nama_pembaca: '',
    audio_verified: false,
    foto_halaman: null,
    foto_enhanced: null,
    audio_file: null
  });
  const [editPageId, setEditPageId] = useState(null);
  const [pagePhotoPreview, setPagePhotoPreview] = useState(null);
  const [pageAudioPreview, setPageAudioPreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceProgress, setEnhanceProgress] = useState(0);

  // Ref to track and revoke object URLs for memory management
  const pagePhotoBlobUrlRef = useRef(null);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const audioChunks = useRef([]);

  // Stats
  const [stats, setStats] = useState({
    totalNaskah: 0,
    totalLembar: 0,
    audioVerified: 0
  });

  // Account Settings Modal State
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountForm, setAccountForm] = useState({
    name: '',
    email: '',
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  const [accountErrors, setAccountErrors] = useState({});
  const [accountSubmitting, setAccountSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchManuscripts();
    return () => {
      // Cleanup any active object URLs on unmount
      if (pagePhotoBlobUrlRef.current) {
        URL.revokeObjectURL(pagePhotoBlobUrlRef.current);
      }
    };
  }, []);

  // Error Component Helper
  const ErrorMsg = ({ field }) => {
    if (!formErrors[field]) return null;
    return <p className="text-red-500 text-[10px] font-semibold mt-1">{formErrors[field][0]}</p>;
  };

  // Show Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Fetch manuscripts
  const fetchManuscripts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/lontars');
      const list = Array.isArray(res.data) ? res.data : [];
      setManuscripts(list);

      // Calculate Stats
      const totalNaskah = list.length;
      let totalLembar = 0;
      list.forEach(m => totalLembar += (m.pages_count || 0));

      setStats({
        totalNaskah,
        totalLembar,
        audioVerified: list.reduce((acc, curr) => acc + (curr.pages ? curr.pages.filter(p => p.audio_verified).length : 0), 0)
      });
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data naskah', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch pages for a specific manuscript
  const fetchManuscriptPages = async (id) => {
    try {
      const res = await axios.get(`/api/lontars/${id}`);
      setPages(res.data.pages || []);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat daftar lembar', 'error');
    }
  };

  // Switch to Kelola Halaman View
  const handleKelolaHalaman = (manuscript) => {
    setSelectedManuscript(manuscript);
    setPages(manuscript.pages || []);
    fetchManuscriptPages(manuscript.id);
    setActiveTab('halaman');
    resetPageForm();
  };

  // Back to Manuscript View
  const handleBackToManuscripts = () => {
    setSelectedManuscript(null);
    setPages([]);
    setActiveTab('naskah');
    fetchManuscripts();
  };

  // ── MANUSCRIPT CRUD ACTIONS ──

  const handleManuscriptInputChange = (e) => {
    const { name, value } = e.target;
    setManuscriptForm(prev => ({ ...prev, [name]: value }));
  };

  const handleManuscriptFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast(`Ukuran foto sampul terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)} MB). Batas maksimal adalah 10 MB.`, 'error');
        e.target.value = '';
        return;
      }
      setManuscriptForm(prev => ({ ...prev, foto_sampul: file }));
      setManuscriptCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleManuscriptSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({});

    const data = new FormData();
    Object.keys(manuscriptForm).forEach(key => {
      if (manuscriptForm[key] !== null && manuscriptForm[key] !== '') {
        data.append(key, manuscriptForm[key]);
      }
    });

    try {
      if (editManuscriptId) {
        data.append('_method', 'PUT');
        await axios.post(`/api/admin/lontars/${editManuscriptId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Naskah berhasil diperbarui!');
      } else {
        await axios.post('/api/admin/lontars', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Naskah baru berhasil ditambahkan!');
      }
      resetManuscriptForm();
      fetchManuscripts();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 422) {
        setFormErrors(err.response.data.errors || {});
        showToast('Gagal menyimpan: Periksa kembali data form naskah', 'error');
      } else {
        showToast(err.response?.data?.message || 'Terjadi kesalahan pada server saat menyimpan naskah', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditManuscript = (m) => {
    setEditManuscriptId(m.id);
    setManuscriptForm({
      kode_naskah: m.kode_naskah || '',
      judul: m.judul || '',
      desa_asal: m.desa_asal || '',
      perkiraan_tahun: m.perkiraan_tahun || '',
      bahasa: m.bahasa || '',
      kondisi: m.kondisi || 'Baik',
      kategori: m.kategori || 'Tradisi Lisan',
      ringkasan: m.ringkasan || '',
      foto_sampul: null
    });
    setManuscriptCoverPreview(m.foto_sampul);
  };

  const handleDeleteManuscript = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus naskah ini? Semua lembar di dalamnya juga akan terhapus.')) {
      setLoading(true);
      try {
        await axios.delete(`/api/admin/lontars/${id}`);
        showToast('Naskah berhasil dihapus');
        fetchManuscripts();
      } catch (err) {
        console.error(err);
        showToast('Gagal menghapus naskah', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetManuscriptForm = () => {
    setEditManuscriptId(null);
    setFormErrors({});
    setManuscriptForm({
      kode_naskah: '',
      judul: '',
      desa_asal: '',
      perkiraan_tahun: '',
      bahasa: '',
      kondisi: 'Baik',
      kategori: 'Tradisi Lisan',
      ringkasan: '',
      foto_sampul: null
    });
    setManuscriptCoverPreview(null);
    // Reset file input
    const input = document.getElementById('cover-upload');
    if (input) input.value = '';
  };

  // ── LEMBAR/PAGE CRUD ACTIONS ──

  const handlePageInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPageForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast(`Ukuran foto lembar terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)} MB). Batas maksimal adalah 10 MB.`, 'error');
        e.target.value = '';
        return;
      }

      // Revoke previous blob URL if any to prevent memory leaks
      if (pagePhotoBlobUrlRef.current) {
        URL.revokeObjectURL(pagePhotoBlobUrlRef.current);
      }
      const previewUrl = URL.createObjectURL(file);
      pagePhotoBlobUrlRef.current = previewUrl;

      setPageForm(prev => ({ ...prev, foto_halaman: file, foto_enhanced: null }));
      setPagePhotoPreview(previewUrl);
      setEnhanceProgress(0);

      // AI Quality Enhancement Preview Setup
      const reader = new FileReader();
      reader.onload = (evt) => {
        setOriginalImage(evt.target.result);
        setEnhancedImage(null); // reset enhancement
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePageAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast(`Ukuran file audio/video terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)} MB). Batas maksimal adalah 10 MB.`, 'error');
        e.target.value = '';
        return;
      }

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      const previewUrl = URL.createObjectURL(file);
      setPageForm(prev => ({ ...prev, audio_file: file }));
      setPageAudioPreview(previewUrl);
      // Reset live recording state if user uploads a file
      setAudioBlob(null);
      setAudioUrl(null);
    }
  };

  // AI Edge Computing Image Enhancement (TFJS Upscaler + Manuscript Crispness & Contrast Tuning)
  const processImageEdgeComputing = async () => {
    if (!originalImage) return;
    setIsEnhancing(true);
    setEnhanceProgress(10);

    try {
      // 1. Lossless safe preprocessing: scale down working image to <= 1400px if needed to preserve details & prevent browser freeze
      const { imageSource } = await getSafeImageForAi(originalImage);
      setEnhanceProgress(25);

      let rawAiDataUrl = null;

      // 2. Perform actual AI Super-Resolution (ESRGAN 2x) on the safe image
      try {
        const upscaler = await getUpscaler();
        if (upscaler) {
          rawAiDataUrl = await upscaler.upscale(imageSource, {
            patchSize: 128,
            padding: 4,
            awaitNextFrame: true,
            progress: (percent) => {
              const p = Math.min(85, Math.max(25, Math.round(percent * 100)));
              setEnhanceProgress(p);
            }
          });
        }
      } catch (aiErr) {
        console.warn("Neural Upscaler fallback activated:", aiErr);
        setEnhanceProgress(60);
        rawAiDataUrl = await fallbackSuperSampleEnhance(imageSource);
      }

      if (!rawAiDataUrl) {
        rawAiDataUrl = await fallbackSuperSampleEnhance(imageSource);
      }

      setEnhanceProgress(88);

      // 3. Apply Manuscript Crispness & Contrast Enhancement to sharpen blurred AI edges and pop out dark aksara
      const enhancedDataUrl = await enhanceManuscriptClarity(rawAiDataUrl);
      setEnhanceProgress(94);

      // 4. Convert dataUrl back to Blob / File for backend upload
      const res = await fetch(enhancedDataUrl);
      const blob = await res.blob();
      const fileName = (pageForm.foto_halaman?.name ? 'enhanced_ai_' + pageForm.foto_halaman.name : `enhanced_ai_lembar_${pageForm.nomor_lembar || 'page'}.png`);
      const enhancedFile = new File([blob], fileName, { type: 'image/png' });

      setEnhancedImage(enhancedDataUrl);
      setPageForm(prev => ({ ...prev, foto_enhanced: enhancedFile }));
      setEnhanceProgress(100);

      // Brief delay so user sees 100% completion before hiding loader
      setTimeout(() => {
        setIsEnhancing(false);
        showToast('Peningkatan AI berhasil diterapkan!', 'success');
      }, 300);

    } catch (err) {
      console.error("AI Enhancement failed:", err);
      setIsEnhancing(false);
      setEnhanceProgress(0);
      showToast('Gagal memproses peningkatan AI. Foto original tetap aman.', 'error');
    }
  };

  // Microphone Recording Methods
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Map to page form file representation
        const audioFile = new File([blob], `recorded_audio_${Date.now()}.webm`, { type: 'audio/webm' });
        setPageForm(prev => ({ ...prev, audio_file: audioFile }));
        setPageAudioPreview(url);

        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert('Gagal mengakses mikrofon browser. Pastikan izin telah diberikan.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setPageAudioPreview(null);
    setPageForm(prev => ({ ...prev, audio_file: null }));
    const input = document.getElementById('audio-upload');
    if (input) input.value = '';
  };

  const handlePageSubmit = async (e) => {
    e.preventDefault();
    if (!selectedManuscript) return;
    setLoading(true);
    setUploadPercent(0);
    setFormErrors({});

    const data = new FormData();
    data.append('lontar_id', selectedManuscript.id);

    Object.keys(pageForm).forEach(key => {
      if (pageForm[key] !== null && pageForm[key] !== '') {
        if (key === 'audio_verified') {
          data.append(key, pageForm[key] ? '1' : '0');
        } else {
          data.append(key, pageForm[key]);
        }
      }
    });

    // If there is recorded audio directly
    if (audioBlob) {
      data.append('audio_tipe', 'rekam_langsung');
    } else if (pageForm.audio_file) {
      data.append('audio_tipe', 'upload');
    }

    try {
      const axiosConfig = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadPercent(percentCompleted);
          }
        }
      };

      if (editPageId) {
        data.append('_method', 'PUT');
        await axios.post(`/api/admin/lontar-pages/${editPageId}`, data, axiosConfig);
        showToast('Lembaran naskah berhasil diperbarui!');
      } else {
        await axios.post('/api/admin/lontar-pages', data, axiosConfig);
        showToast('Lembaran baru berhasil ditambahkan!');
      }
      resetPageForm();
      fetchManuscriptPages(selectedManuscript.id);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 422) {
        setFormErrors(err.response.data.errors || {});
        showToast('Gagal menyimpan: Periksa kembali data form lembar', 'error');
      } else if (err.response && err.response.status === 413) {
        showToast('Gagal: Ukuran file terlalu besar untuk server.', 'error');
      } else {
        showToast(err.response?.data?.message || 'Terjadi kesalahan saat mengunggah media lembar', 'error');
      }
    } finally {
      setLoading(false);
      setUploadPercent(0);
    }
  };

  const handleEditPage = (page) => {
    if (pagePhotoBlobUrlRef.current) {
      URL.revokeObjectURL(pagePhotoBlobUrlRef.current);
      pagePhotoBlobUrlRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setEditPageId(page.id);
    setPageForm({
      nomor_lembar: page.nomor_lembar || '',
      judul_halaman: page.judul_halaman || '',
      kondisi: page.kondisi || 'Baik',
      penjelasan: page.penjelasan || '',
      catatan: page.catatan || '',
      nama_pembaca: page.nama_pembaca || '',
      audio_verified: !!page.audio_verified,
      foto_halaman: null,
      foto_enhanced: null,
      audio_file: null
    });
    setPagePhotoPreview(page.foto_halaman);
    setPageAudioPreview(page.audio_file || null);
    setOriginalImage(page.foto_halaman || null);
    setEnhancedImage(page.foto_enhanced || null);
    setEnhanceProgress(0);
    // Reset recording states only
    setAudioBlob(null);
    setAudioUrl(null);
    const audioInput = document.getElementById('audio-upload');
    if (audioInput) audioInput.value = '';
  };

  const handleDeletePage = async (pageId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus lembaran ini?')) {
      setLoading(true);
      try {
        await axios.delete(`/api/admin/lontar-pages/${pageId}`);
        showToast('Lembaran berhasil dihapus');
        fetchManuscriptPages(selectedManuscript.id);
      } catch (err) {
        console.error(err);
        showToast('Gagal menghapus lembaran', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetPageForm = () => {
    if (pagePhotoBlobUrlRef.current) {
      URL.revokeObjectURL(pagePhotoBlobUrlRef.current);
      pagePhotoBlobUrlRef.current = null;
    }
    setEditPageId(null);
    setFormErrors({});
    setPageForm({
      nomor_lembar: '',
      judul_halaman: '',
      kondisi: 'Baik',
      penjelasan: '',
      catatan: '',
      nama_pembaca: '',
      audio_verified: false,
      foto_halaman: null,
      foto_enhanced: null,
      audio_file: null
    });
    setPagePhotoPreview(null);
    setPageAudioPreview(null);
    setOriginalImage(null);
    setEnhancedImage(null);
    setEnhanceProgress(0);
    deleteRecording();
    // Reset file inputs
    const photoInput = document.getElementById('photo-upload');
    if (photoInput) photoInput.value = '';
    const audioInput = document.getElementById('audio-upload');
    if (audioInput) audioInput.value = '';
  };

  const openAccountModal = () => {
    setAccountForm({
      name: user?.name || '',
      email: user?.email || '',
      current_password: '',
      password: '',
      password_confirmation: ''
    });
    setAccountErrors({});
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsAccountModalOpen(true);
  };

  const closeAccountModal = () => {
    setIsAccountModalOpen(false);
    setAccountErrors({});
  };

  const handleAccountInputChange = (e) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({ ...prev, [name]: value }));
    if (accountErrors[name]) {
      setAccountErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setAccountSubmitting(true);
    setAccountErrors({});

    try {
      const payload = {
        name: accountForm.name.trim(),
        email: accountForm.email.trim(),
      };

      if (accountForm.password) {
        payload.current_password = accountForm.current_password;
        payload.password = accountForm.password;
        payload.password_confirmation = accountForm.password_confirmation;
      }

      const res = await axios.put('/api/auth/account', payload);

      if (res.data && res.data.user) {
        updateUser(res.data.user);
        showToast(res.data.message || 'Pengaturan akun berhasil disimpan!', 'success');
        closeAccountModal();
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setAccountErrors(err.response.data.errors || {});
        showToast(err.response.data.message || 'Periksa kembali data yang dimasukkan.', 'error');
      } else {
        showToast(err.response?.data?.message || 'Gagal menyimpan perubahan akun.', 'error');
      }
    } finally {
      setAccountSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-lg border-gray-300 bg-gray-50/50 shadow-sm focus:border-unesco-blue focus:ring-unesco-blue sm:text-sm p-3 border transition-colors focus:bg-white";

  return (
    <div className="bg-background min-h-screen pb-16">

      {/* ── Top Header ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-unesco-blue to-blue-800 rounded flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
              GR
            </div>
            <h1 className="text-base sm:text-xl font-bold text-gray-900 tracking-tight">Dashboard Admin</h1>
            <Link
              to="/"
              title="Buka Halaman Utama Website"
              className="hidden md:inline-flex items-center gap-1.5 ml-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
            >
              <FiGlobe size={13} />
              <span>Lihat Web</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[11px] text-gray-500 leading-tight">
                {user?.email || 'admin@rinjanigeopark.com'}
              </span>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 text-unesco-blue flex items-center justify-center font-bold text-sm uppercase flex-shrink-0">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <button
              onClick={openAccountModal}
              title="Pengaturan Akun & Password"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 border border-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              <FiKey size={14} className="text-gray-500" />
              <span className="hidden sm:inline">Ganti Akun & Password</span>
              <span className="sm:hidden">Akun</span>
            </button>
            <button
              onClick={logout}
              title="Keluar dari sesi admin"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <FiLogOut size={14} />
              <span className="hidden xs:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Floating Toast Notification */}
        {toast.show && (
          <div className="fixed top-5 right-5 z-50 max-w-md shadow-2xl animate-fade-in pointer-events-auto">
            <div className={`p-4 rounded-xl border flex items-center gap-3 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-500/30'
                : 'bg-rose-600 text-white border-rose-700 shadow-rose-500/30'
            }`}>
              {toast.type === 'success' ? <FiCheckCircle className="flex-shrink-0" size={20} /> : <FiAlertCircle className="flex-shrink-0" size={20} />}
              <span className="font-semibold text-sm leading-snug">{toast.message}</span>
              <button
                onClick={() => setToast({ show: false, message: '', type: 'success' })}
                className="ml-auto text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex items-center gap-5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 smooth-transition"><FiDatabase size={100} /></div>
            <div className="w-14 h-14 rounded-full bg-blue-50 text-unesco-blue flex items-center justify-center"><FiDatabase size={24} /></div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Total Naskah</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalNaskah}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex items-center gap-5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 smooth-transition"><FiFileText size={100} /></div>
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><FiFileText size={24} /></div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Total Lembar</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalLembar}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex items-center gap-5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 smooth-transition"><FiHeadphones size={100} /></div>
            <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><FiHeadphones size={24} /></div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Audio Terverifikasi</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.audioVerified}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex items-center gap-5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 smooth-transition"><FiSettings size={100} /></div>
            <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center"><FiSettings size={24} /></div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Status Database</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">Terhubung (MySQL)</h3>
            </div>
          </div>
        </div>

        {/* ── TAB 1: KELOLA NASKAH ── */}
        {activeTab === 'naskah' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in">
            {/* Form Naskah */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h2 className="text-lg font-bold text-gray-900">{editManuscriptId ? 'Edit Naskah Lontar' : 'Tambah Naskah Baru'}</h2>
                  {!editManuscriptId && <span className="bg-blue-100 text-unesco-blue px-2.5 py-1 rounded text-xs font-bold uppercase flex items-center"><FiPlus className="mr-1" /> Baru</span>}
                </div>

                <form onSubmit={handleManuscriptSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Kode Naskah *</label>
                    <input type="text" name="kode_naskah" required value={manuscriptForm.kode_naskah} onChange={handleManuscriptInputChange} className={inputClass} placeholder="Contoh: LMB-001" />
                    <ErrorMsg field="kode_naskah" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Judul Naskah *</label>
                    <input type="text" name="judul" required value={manuscriptForm.judul} onChange={handleManuscriptInputChange} className={inputClass} placeholder="Contoh: Asal-usul Desa Pempek" />
                    <ErrorMsg field="judul" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Kategori</label>
                      <select name="kategori" value={manuscriptForm.kategori} onChange={handleManuscriptInputChange} className={inputClass}>
                        {KATEGORI_LIST.map((kat) => (
                          <option key={kat} value={kat}>{kat}</option>
                        ))}
                      </select>
                      <ErrorMsg field="kategori" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Kondisi</label>
                      <select name="kondisi" value={manuscriptForm.kondisi} onChange={handleManuscriptInputChange} className={inputClass}>
                        <option value="Baik">Baik</option>
                        <option value="Perlu Perawatan">Perlu Perawatan</option>
                        <option value="Rusak">Rusak</option>
                      </select>
                      <ErrorMsg field="kondisi" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Lokasi Asal</label>
                      <input type="text" name="desa_asal" value={manuscriptForm.desa_asal} onChange={handleManuscriptInputChange} className={inputClass} placeholder="Contoh: Lombok Tengah" />
                      <ErrorMsg field="desa_asal" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tahun / Abad</label>
                      <input type="text" name="perkiraan_tahun" value={manuscriptForm.perkiraan_tahun} onChange={handleManuscriptInputChange} className={inputClass} placeholder="Contoh: ± 1890" />
                      <ErrorMsg field="perkiraan_tahun" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bahasa</label>
                    <input type="text" name="bahasa" value={manuscriptForm.bahasa} onChange={handleManuscriptInputChange} className={inputClass} placeholder="Contoh: Sasak Kawi" />
                    <ErrorMsg field="bahasa" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Ringkasan Naskah</label>
                    <textarea name="ringkasan" rows="3" value={manuscriptForm.ringkasan} onChange={handleManuscriptInputChange} className={inputClass} placeholder="Tulis deskripsi atau ringkasan isi naskah secara umum..."></textarea>
                    <ErrorMsg field="ringkasan" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Foto Sampul Naskah</label>
                    <input id="cover-upload" type="file" accept="image/*" onChange={handleManuscriptFileChange} className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:cursor-pointer cursor-pointer" />
                    {manuscriptCoverPreview && (
                      <div className="mt-3 relative rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-50 flex items-center justify-center">
                        <img src={manuscriptCoverPreview} alt="Cover Preview" className="h-full object-contain" />
                      </div>
                    )}
                    <ErrorMsg field="foto_sampul" />
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                    {editManuscriptId && (
                      <button type="button" onClick={resetManuscriptForm} disabled={loading} className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-xs font-semibold shadow-sm disabled:opacity-50">
                        Batal
                      </button>
                    )}
                    <button type="submit" disabled={loading} className="w-full sm:w-auto px-5 py-2.5 bg-unesco-blue text-white rounded-lg hover:bg-blue-800 text-xs font-semibold shadow-md disabled:opacity-50 flex items-center justify-center">
                      {loading ? 'Menyimpan...' : (editManuscriptId ? 'Simpan Perubahan' : 'Tambah Naskah')}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Tabel Daftar Naskah */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-lg font-bold text-gray-900">Manajemen Naskah Lontar</h2>
                </div>

                <div className="table-scroll-container flex-1">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider w-16">Sampul</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kode & Judul</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Info Detail</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Halaman</th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                      {manuscripts.map(m => (
                        <tr key={m.id} className="hover:bg-gray-50/80 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                              {m.foto_sampul ? (
                                <img src={m.foto_sampul} alt="cover" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xl">📜</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-unesco-blue font-bold tracking-widest mb-0.5 uppercase">{m.kode_naskah || 'NO-CODE'}</div>
                            <div className="text-sm font-semibold text-gray-900 line-clamp-1">{m.judul}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-xs text-gray-500">📍 {m.desa_asal || '–'}</div>
                            <div className="text-xs text-gray-400">🏷️ {m.kategori} • Kondisi: <span className="font-semibold text-gray-600">{m.kondisi}</span></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                              {m.pages_count || 0} Lembar
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleKelolaHalaman(m)}
                                className="px-3 py-1.5 bg-blue-50 text-unesco-blue hover:bg-blue-100 rounded-lg text-xs font-bold transition-all"
                              >
                                Kelola Lembar
                              </button>
                              <button onClick={() => handleEditManuscript(m)} className="p-2 text-gray-500 hover:text-unesco-blue hover:bg-blue-50 rounded-lg smooth-transition" title="Edit">
                                <FiEdit2 size={16} />
                              </button>
                              <button onClick={() => handleDeleteManuscript(m.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg smooth-transition" title="Hapus">
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {manuscripts.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-6 py-16 text-center text-gray-400 text-sm">
                            <FiDatabase className="mx-auto h-8 w-8 mb-3 opacity-20" />
                            Belum ada data naskah lontar.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: KELOLA LEMBAR/HALAMAN ── */}
        {activeTab === 'halaman' && selectedManuscript && (
          <div className="animate-fade-in space-y-6">

            {/* Navigasi Kembali */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <button
                onClick={handleBackToManuscripts}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft size={16} /> Kembali ke Manajemen Naskah
              </button>
              <div className="text-right">
                <span className="text-[10px] font-bold text-unesco-blue uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                  {selectedManuscript.kode_naskah}
                </span>
                <h2 className="text-base font-bold text-gray-900">{selectedManuscript.judul}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Form Lembar */}
              <div className="xl:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="text-base font-bold text-gray-900">{editPageId ? 'Edit Lembar Lontar' : 'Tambah Lembar Lontar'}</h3>
                    {!editPageId && <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded text-xs font-bold uppercase flex items-center"><FiPlus className="mr-1" /> Lembar</span>}
                  </div>

                  <form onSubmit={handlePageSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nomor Lembar *</label>
                        <input type="number" name="nomor_lembar" required min="1" value={pageForm.nomor_lembar} onChange={handlePageInputChange} className={inputClass} placeholder="Misal: 1" />
                        <ErrorMsg field="nomor_lembar" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Kondisi Lembar</label>
                        <select name="kondisi" value={pageForm.kondisi} onChange={handlePageInputChange} className={inputClass}>
                          <option value="Baik">Baik</option>
                          <option value="Perlu Perawatan">Perlu Perawatan</option>
                          <option value="Rusak">Rusak</option>
                        </select>
                        <ErrorMsg field="kondisi" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Judul Halaman / Lembar</label>
                      <input type="text" name="judul_halaman" value={pageForm.judul_halaman} onChange={handlePageInputChange} className={inputClass} placeholder="Contoh: Pembukaan Naskah" />
                      <ErrorMsg field="judul_halaman" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Penjelasan Isi Lembar</label>
                      <textarea name="penjelasan" rows="3" value={pageForm.penjelasan} onChange={handlePageInputChange} className={inputClass} placeholder="Tuliskan isi ringkas atau penjelasan halaman ini..."></textarea>
                      <ErrorMsg field="penjelasan" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Catatan Tambahan</label>
                      <textarea name="catatan" rows="2" value={pageForm.catatan} onChange={handlePageInputChange} className={inputClass} placeholder="Catatan kondisi tulisan, bagian sobek, dll..."></textarea>
                      <ErrorMsg field="catatan" />
                    </div>

                    {/* 1. BAGIAN FOTO LEMBAR (GAMBAR) */}
                    <div className="p-4 rounded-xl border-2 border-emerald-100 bg-emerald-50/30 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                            📷
                          </span>
                          <label className="text-xs font-bold text-gray-900">
                            Foto Lembar Lontar (Gambar / Foto)
                          </label>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          Khusus Foto / JPG / PNG (Maks. 10 MB)
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 -mt-2">
                        Upload foto fisik lembaran daun lontar (maks. 10 MB) untuk diproses dengan AI Super-Resolution & OpenSeadragon.
                      </p>

                      <div>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={handlePageFileChange}
                          className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 file:cursor-pointer cursor-pointer"
                        />
                        <ErrorMsg field="foto_halaman" />
                      </div>

                      {originalImage && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="relative rounded-lg overflow-hidden border border-gray-200 h-24 bg-black flex items-center justify-center">
                              <span className="absolute top-1 left-1 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded z-10">Original</span>
                              <img src={originalImage} alt="original" className="h-full object-contain" />
                            </div>
                            <div className="relative rounded-lg overflow-hidden border border-gray-200 h-24 bg-black flex items-center justify-center">
                              <span className="absolute top-1 left-1 bg-indigo-600/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded z-10">AI Enhanced</span>
                              {isEnhancing ? (
                                <div className="flex flex-col items-center justify-center px-2 w-full text-center">
                                  <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1.5 overflow-hidden">
                                    <div
                                      className="bg-indigo-500 h-1.5 rounded-full transition-all duration-200"
                                      style={{ width: `${enhanceProgress}%` }}
                                    />
                                  </div>
                                  <span className="text-[9px] text-indigo-300 font-semibold animate-pulse">
                                    Memproses AI ({enhanceProgress}%)
                                  </span>
                                </div>
                              ) : enhancedImage ? (
                                <img src={enhancedImage} alt="enhanced" className="h-full object-contain" />
                              ) : (
                                <button
                                  type="button"
                                  onClick={processImageEdgeComputing}
                                  className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-sm cursor-pointer"
                                >
                                  Tingkatkan (AI)
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {!originalImage && pagePhotoPreview && (
                        <div className="relative rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100 flex items-center justify-center">
                          <img src={pagePhotoPreview} alt="current page" className="h-full object-contain" />
                        </div>
                      )}
                    </div>

                    {/* 2. BAGIAN AUDIO PEMBACAAN (SUARA / VIDEO) */}
                    <div className="p-4 rounded-xl border-2 border-indigo-100 bg-indigo-50/30 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                            🎧
                          </span>
                          <label className="text-xs font-bold text-gray-900">
                            Audio Pembacaan Ahli (Suara / Video MP4)
                          </label>
                        </div>
                        <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                          MP4 / MP3 / WAV / M4A (Maks. 10 MB)
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 -mt-2">
                        Upload rekaman suara pelafalan aksara Sasak (maks. 10 MB) atau rekam langsung lewat mikrofon.
                      </p>

                      {/* Upload Audio File */}
                      <div className="bg-white p-3 rounded-lg border border-indigo-100">
                        <span className="block text-[10px] font-bold text-indigo-700 uppercase mb-1.5">
                          Metode 1: Pilih File Audio / Video dari Laptop (Maks. 10 MB)
                        </span>
                        <input
                          id="audio-upload"
                          type="file"
                          accept=".mp3,.mp4,.wav,.m4a,.webm,.ogg,.aac,.flac,.mov,.3gp,.m4v,audio/*,video/*"
                          onChange={handlePageAudioChange}
                          className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer cursor-pointer"
                        />
                        <ErrorMsg field="audio_file" />
                      </div>

                      <div className="relative flex items-center py-0.5">
                        <div className="flex-grow border-t border-indigo-200"></div>
                        <span className="flex-shrink-0 mx-2 text-[9px] text-indigo-400 font-bold">ATAU</span>
                        <div className="flex-grow border-t border-indigo-200"></div>
                      </div>

                      {/* Record Live */}
                      <div>
                        <span className="block text-[10px] font-bold text-indigo-700 uppercase mb-1.5">
                          Metode 2: Rekam Langsung via Mikrofon
                        </span>
                        {!isRecording && !audioUrl && (
                          <button
                            type="button"
                            onClick={startRecording}
                            className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <FiMic size={14} /> Mulai Rekam dari Browser
                          </button>
                        )}

                        {isRecording && (
                          <div className="flex items-center justify-between bg-red-50 p-2.5 rounded-lg border border-red-200">
                            <span className="flex items-center text-xs text-red-600 font-bold animate-pulse">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-600 mr-2"></span> Sedang Merekam Suara...
                            </span>
                            <button
                              type="button"
                              onClick={stopRecording}
                              className="px-3 py-1 bg-red-600 text-white rounded-md text-xs font-bold hover:bg-red-700 cursor-pointer shadow-sm"
                            >
                              Selesai & Simpan
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Preview Player / Action */}
                      {pageAudioPreview && (
                        <div className="pt-3 border-t border-indigo-200 space-y-2 bg-white p-3 rounded-lg border">
                          <div className="flex items-center justify-between">
                            <span className="block text-[10px] text-gray-700 font-bold">🎵 Uji Putar Audio Terpilih:</span>
                            {pageForm.audio_file?.name && (
                              <span className="text-[10px] text-indigo-600 font-bold truncate max-w-[200px]" title={pageForm.audio_file.name}>
                                {pageForm.audio_file.name}
                              </span>
                            )}
                          </div>
                          <audio src={pageAudioPreview} controls className="w-full h-8" />
                          <button
                            type="button"
                            onClick={deleteRecording}
                            className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold transition-colors cursor-pointer border border-red-100"
                          >
                            Hapus Audio Ini
                          </button>
                        </div>
                      )}

                      <div className="pt-2 border-t border-indigo-200/60 space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Pembaca Ahli</label>
                          <input
                            type="text"
                            name="nama_pembaca"
                            value={pageForm.nama_pembaca}
                            onChange={handlePageInputChange}
                            className="w-full rounded-md border-gray-300 p-2 text-xs border bg-white"
                            placeholder="Contoh: Lalu Mamiq Sasak"
                          />
                          <ErrorMsg field="nama_pembaca" />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="audio_verified"
                            id="audio_verified"
                            checked={pageForm.audio_verified}
                            onChange={handlePageInputChange}
                            className="rounded text-unesco-blue border-gray-300 focus:ring-unesco-blue h-4 w-4"
                          />
                          <label htmlFor="audio_verified" className="text-xs font-semibold text-gray-700 select-none cursor-pointer">
                            Pembacaan telah diverifikasi oleh ahli
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                      {editPageId && (
                        <button type="button" onClick={resetPageForm} disabled={loading} className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-xs font-semibold shadow-sm disabled:opacity-50">
                          Batal
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-5 py-2.5 bg-unesco-blue text-white rounded-lg hover:bg-blue-800 text-xs font-semibold shadow-md disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>{uploadPercent > 0 ? `Mengunggah Media (${uploadPercent}%)...` : 'Menyimpan...'}</span>
                          </>
                        ) : (
                          editPageId ? 'Simpan Lembar' : 'Tambah Lembar'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Tabel Daftar Halaman */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
                  <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-base font-bold text-gray-900">Daftar Lembar / Halaman</h3>
                  </div>

                  <div className="table-scroll-container flex-1">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider w-16">Lembar</th>
                          <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Halaman</th>
                          <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kondisi</th>
                          <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Audio</th>
                          <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-50">
                        {pages.map(page => (
                          <tr key={page.id} className="hover:bg-gray-50/80 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-extrabold text-unesco-blue">
                                Lembar {page.nomor_lembar}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-gray-900">{page.judul_halaman || 'Tanpa Judul'}</div>
                              {page.penjelasan && (
                                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{page.penjelasan}</p>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${page.kondisi === 'Baik' ? 'bg-green-50 text-green-700 border-green-200' :
                                page.kondisi === 'Perlu Perawatan' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                  'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                {page.kondisi || 'Baik'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {page.audio_file ? (
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${page.audio_verified ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                                  }`}>
                                  <FiVolume2 /> {page.nama_pembaca || 'Ada'} {page.audio_verified && '✓'}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleEditPage(page)} className="p-2 text-gray-500 hover:text-unesco-blue hover:bg-blue-50 rounded-lg smooth-transition" title="Edit">
                                  <FiEdit2 size={16} />
                                </button>
                                <button onClick={() => handleDeletePage(page.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg smooth-transition" title="Hapus">
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {pages.length === 0 && (
                          <tr>
                            <td colSpan="5" className="px-6 py-16 text-center text-gray-400 text-sm">
                              <FiFileText className="mx-auto h-8 w-8 mb-3 opacity-20" />
                              Belum ada lembaran untuk naskah ini.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ── Modal Pengaturan Akun & Password ── */}
      {isAccountModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget && !accountSubmitting) closeAccountModal();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden my-auto max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-unesco-blue to-blue-900 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <FiKey size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold">Pengaturan Akun & Password</h3>
                  <p className="text-xs text-blue-100">Ubah username, email, atau password admin sewaktu-waktu</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeAccountModal}
                disabled={accountSubmitting}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Tutup"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleAccountSubmit} className="p-6 space-y-5 overflow-y-auto">
              
              {/* Username / Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Nama / Username Admin *
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FiUser size={16} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={accountForm.name}
                    onChange={handleAccountInputChange}
                    disabled={accountSubmitting}
                    placeholder="Adminweblontar"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-300 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-unesco-blue focus:border-unesco-blue transition-all"
                  />
                </div>
                {accountErrors.name && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1">{accountErrors.name[0]}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Alamat Email *
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FiMail size={16} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={accountForm.email}
                    onChange={handleAccountInputChange}
                    disabled={accountSubmitting}
                    placeholder="admin@rinjanigeopark.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-300 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-unesco-blue focus:border-unesco-blue transition-all"
                  />
                </div>
                {accountErrors.email && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1">{accountErrors.email[0]}</p>
                )}
              </div>

              {/* Password Section Divider */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Ganti Password (Opsional)</span>
                  <span className="text-[10px] text-gray-400">Isi hanya bila ingin mengganti</span>
                </div>
              </div>

              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Password Saat Ini {accountForm.password && <span className="text-red-500">*</span>}
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FiLock size={16} />
                  </div>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="current_password"
                    value={accountForm.current_password}
                    onChange={handleAccountInputChange}
                    disabled={accountSubmitting}
                    placeholder="Masukkan password saat ini untuk verifikasi"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-unesco-blue focus:border-unesco-blue transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showCurrentPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {accountErrors.current_password && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1">{accountErrors.current_password[0]}</p>
                )}
              </div>

              {/* New Password & Confirmation Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Password Baru
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FiKey size={16} />
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="password"
                      value={accountForm.password}
                      onChange={handleAccountInputChange}
                      disabled={accountSubmitting}
                      placeholder="Min. 4 karakter"
                      className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-gray-300 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-unesco-blue focus:border-unesco-blue transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showNewPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>
                  {accountErrors.password && (
                    <p className="text-red-500 text-[11px] font-semibold mt-1">{accountErrors.password[0]}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Ulangi Password
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FiKey size={16} />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="password_confirmation"
                      value={accountForm.password_confirmation}
                      onChange={handleAccountInputChange}
                      disabled={accountSubmitting}
                      placeholder="Ulangi password baru"
                      className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-gray-300 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-unesco-blue focus:border-unesco-blue transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showConfirmPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAccountModal}
                  disabled={accountSubmitting}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={accountSubmitting}
                  className="px-5 py-2.5 bg-unesco-blue hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {accountSubmitting ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
