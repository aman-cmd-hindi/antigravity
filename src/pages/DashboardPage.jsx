import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query, deleteDoc, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

const ADMIN_PASSWORD = '@Aman6227';
const GALLERY_CATEGORIES = ['Classroom', 'Events', 'Toppers', 'Activities', 'Other'];
const FACULTY_SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Other'];

// Initial data lists for auto-initialization
const INITIAL_TOPPERS = [
  { name: "Gitanjali Vishwakarma", exam: "SSC 10th Board", score: "91.20%", year: "2025", image: "/sample-profile.png" },
  { name: "Lekhraj Maurya", exam: "SSC 10th Board", score: "87.60%", year: "2025", image: "/lekhraj-maurya.jpeg" },
  { name: "Aman Vishwakarma", exam: "SSC 10th Board", score: "86.80%", year: "2025", image: "/aman-vishwakarma.jpg" },
  { name: "Aman Pal", exam: "SSC 10th Board", score: "85.20%", year: "2025", image: "/sample-profile.png" }
];

const INITIAL_FACULTY = [
  { name: "Anjali Mam", subject: "Biology", specialization: "Biology Expert", image: "/sample-profile.png" },
  { name: "Shiva Sir", subject: "Biology", specialization: "NEET Expert", image: "/sample-profile.png" },
  { name: "Santosh Sir", subject: "Chemistry", specialization: "Organic & Inorganic", image: "/sample-profile.png" },
  { name: "Manoj Sir", subject: "Mathematics", specialization: "Calculus Expert", image: "/sample-profile.png" },
  { name: "Sandeep Sir", subject: "Mathematics", specialization: "Advanced Calculus", image: "/sample-profile.png" },
  { name: "Expert Faculty", subject: "Physics", specialization: "Conceptual Mastery", image: "/sample-profile.png" }
];

const DashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [enrollments, setEnrollments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [toppers, setToppers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enrollments');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Gallery Upload States
  const [galleryMode, setGalleryMode] = useState('file'); // 'file' | 'url'
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('Classroom');
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryFilePreview, setGalleryFilePreview] = useState('');
  const [galleryImageUrl, setGalleryImageUrl] = useState('');
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState(0);
  const [galleryError, setGalleryError] = useState('');
  const [gallerySuccess, setGallerySuccess] = useState(false);

  // Toppers States
  const [topperName, setTopperName] = useState('');
  const [topperExam, setTopperExam] = useState('SSC 10th Board');
  const [topperScore, setTopperScore] = useState('');
  const [topperYear, setTopperYear] = useState('2025');
  const [topperUploadMode, setTopperUploadMode] = useState('file'); // 'file' | 'url'
  const [topperFile, setTopperFile] = useState(null);
  const [topperFilePreview, setTopperFilePreview] = useState('');
  const [topperImageUrl, setTopperImageUrl] = useState('');
  const [topperUploading, setTopperUploading] = useState(false);
  const [topperProgress, setTopperProgress] = useState(0);
  const [topperError, setTopperError] = useState('');
  const [topperSuccess, setTopperSuccess] = useState(false);
  const [topperEditingId, setTopperEditingId] = useState(null); // ID of topper being edited

  // Faculty States
  const [facultyName, setFacultyName] = useState('');
  const [facultySubject, setFacultySubject] = useState('Mathematics');
  const [facultySpecialization, setFacultySpecialization] = useState('');
  const [facultyUploadMode, setFacultyUploadMode] = useState('file'); // 'file' | 'url'
  const [facultyFile, setFacultyFile] = useState(null);
  const [facultyFilePreview, setFacultyFilePreview] = useState('');
  const [facultyImageUrl, setFacultyImageUrl] = useState('');
  const [facultyUploading, setFacultyUploading] = useState(false);
  const [facultyProgress, setFacultyProgress] = useState(0);
  const [facultyError, setFacultyError] = useState('');
  const [facultySuccess, setFacultySuccess] = useState(false);
  const [facultyEditingId, setFacultyEditingId] = useState(null); // ID of faculty being edited

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Access denied.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const enrollQ = query(collection(db, 'enrollments'), orderBy('submittedAt', 'desc'));
      const reviewQ = query(collection(db, 'reviews'), orderBy('submittedAt', 'desc'));
      const galleryQ = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const toppersQ = query(collection(db, 'toppers'), orderBy('year', 'desc'));
      const facultyQ = query(collection(db, 'faculty'), orderBy('name', 'asc'));

      const [enrollSnap, reviewSnap, gallerySnap, toppersSnap, facultySnap] = await Promise.all([
        getDocs(enrollQ),
        getDocs(reviewQ),
        getDocs(galleryQ),
        getDocs(toppersQ),
        getDocs(facultyQ)
      ]);

      const enrollList = enrollSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const reviewList = reviewSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const galleryList = gallerySnap.docs.map(d => ({ id: d.id, ...d.data() }));
      let toppersList = toppersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      let facultyList = facultySnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Auto-initialize Toppers if empty in Firestore
      if (toppersSnap.empty && toppersList.length === 0) {
        console.log("Toppers database is empty. Auto-initializing default toppers...");
        const initializedToppers = [];
        for (const topper of INITIAL_TOPPERS) {
          const docRef = await addDoc(collection(db, 'toppers'), {
            ...topper,
            createdAt: serverTimestamp()
          });
          initializedToppers.push({ id: docRef.id, ...topper });
        }
        toppersList = initializedToppers;
      }

      // Auto-initialize Faculty if empty in Firestore
      if (facultySnap.empty && facultyList.length === 0) {
        console.log("Faculty database is empty. Auto-initializing default faculty...");
        const initializedFaculty = [];
        for (const f of INITIAL_FACULTY) {
          const docRef = await addDoc(collection(db, 'faculty'), {
            ...f,
            createdAt: serverTimestamp()
          });
          initializedFaculty.push({ id: docRef.id, ...f });
        }
        facultyList = initializedFaculty;
      }

      setEnrollments(enrollList);
      setReviews(reviewList);
      setGallery(galleryList);
      setToppers(toppersList);
      setFaculty(facultyList);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  // Image previews
  useEffect(() => {
    if (!galleryFile) { setGalleryFilePreview(''); return; }
    const url = URL.createObjectURL(galleryFile);
    setGalleryFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [galleryFile]);

  useEffect(() => {
    if (!topperFile) { setTopperFilePreview(''); return; }
    const url = URL.createObjectURL(topperFile);
    setTopperFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [topperFile]);

  useEffect(() => {
    if (!facultyFile) { setFacultyFilePreview(''); return; }
    const url = URL.createObjectURL(facultyFile);
    setFacultyFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [facultyFile]);

  // General delete handler
  const handleDelete = async (collectionName, id, storagePath = null) => {
    try {
      if (storagePath) {
        try {
          const fileRef = ref(storage, storagePath);
          await deleteObject(fileRef);
        } catch (storageErr) {
          console.warn('Could not delete storage file:', storageErr);
        }
      }
      await deleteDoc(doc(db, collectionName, id));
      
      // Update state
      if (collectionName === 'enrollments') setEnrollments(prev => prev.filter(e => e.id !== id));
      else if (collectionName === 'reviews') setReviews(prev => prev.filter(r => r.id !== id));
      else if (collectionName === 'gallery') setGallery(prev => prev.filter(g => g.id !== id));
      else if (collectionName === 'toppers') setToppers(prev => prev.filter(t => t.id !== id));
      else if (collectionName === 'faculty') setFaculty(prev => prev.filter(f => f.id !== id));
      
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // ── GALLERY ACTIONS ──
  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    if (!galleryTitle.trim()) { setGalleryError('Please enter a title'); return; }
    setGalleryUploading(true);
    setGalleryError('');
    setGallerySuccess(false);

    try {
      if (galleryMode === 'file') {
        if (!galleryFile) { setGalleryError('Please select a file'); setGalleryUploading(false); return; }
        const storageRef = ref(storage, `gallery/${Date.now()}_${galleryFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, galleryFile);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setGalleryProgress(pct);
          },
          (error) => {
            setGalleryError(`Upload failed: ${error.message}`);
            setGalleryUploading(false);
          },
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            await addDoc(collection(db, 'gallery'), {
              title: galleryTitle.trim(),
              category: galleryCategory,
              url: downloadUrl,
              storagePath: storageRef.fullPath,
              createdAt: serverTimestamp()
            });
            setGalleryTitle('');
            setGalleryFile(null);
            setGalleryUploading(false);
            setGallerySuccess(true);
            fetchData();
            setTimeout(() => setGallerySuccess(false), 3000);
          }
        );
      } else {
        if (!galleryImageUrl.trim()) { setGalleryError('Please enter image URL'); setGalleryUploading(false); return; }
        await addDoc(collection(db, 'gallery'), {
          title: galleryTitle.trim(),
          category: galleryCategory,
          url: galleryImageUrl.trim(),
          createdAt: serverTimestamp()
        });
        setGalleryTitle('');
        setGalleryImageUrl('');
        setGalleryUploading(false);
        setGallerySuccess(true);
        fetchData();
        setTimeout(() => setGallerySuccess(false), 3000);
      }
    } catch (err) {
      setGalleryError(err.message);
      setGalleryUploading(false);
    }
  };

  // ── TOPPER ACTIONS (Add / Edit) ──
  const handleTopperSubmit = async (e) => {
    e.preventDefault();
    if (!topperName.trim()) { setTopperError('Name is required'); return; }
    if (!topperScore.trim()) { setTopperError('Score is required'); return; }
    
    setTopperUploading(true);
    setTopperError('');
    setTopperSuccess(false);

    try {
      let finalImageUrl = topperImageUrl;
      let finalStoragePath = null;

      // Handle file upload if file mode and file exists
      if (topperUploadMode === 'file' && topperFile) {
        const storageRef = ref(storage, `toppers/${Date.now()}_${topperFile.name}`);
        const uploadTask = await new Promise((resolve, reject) => {
          const task = uploadBytesResumable(storageRef, topperFile);
          task.on('state_changed', 
            (snap) => {
              const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
              setTopperProgress(pct);
            },
            reject,
            () => resolve(task)
          );
        });
        finalImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
        finalStoragePath = storageRef.fullPath;
      }

      const topperData = {
        name: topperName.trim(),
        exam: topperExam,
        score: topperScore.trim(),
        year: topperYear,
        image: finalImageUrl || '/sample-profile.png'
      };

      if (finalStoragePath) {
        topperData.storagePath = finalStoragePath;
      }

      if (topperEditingId) {
        // Edit existing topper
        const docRef = doc(db, 'toppers', topperEditingId);
        await updateDoc(docRef, topperData);
        setTopperSuccess(true);
      } else {
        // Add new topper
        await addDoc(collection(db, 'toppers'), {
          ...topperData,
          createdAt: serverTimestamp()
        });
        setTopperSuccess(true);
      }

      // Reset Form
      setTopperName('');
      setTopperScore('');
      setTopperFile(null);
      setTopperImageUrl('');
      setTopperEditingId(null);
      setTopperUploading(false);
      fetchData();
      setTimeout(() => setTopperSuccess(false), 3000);
    } catch (err) {
      setTopperError(`Failed to save topper: ${err.message}`);
      setTopperUploading(false);
    }
  };

  const startEditTopper = (topper) => {
    setTopperEditingId(topper.id);
    setTopperName(topper.name);
    setTopperExam(topper.exam);
    setTopperScore(topper.score);
    setTopperYear(topper.year);
    setTopperImageUrl(topper.image);
    setTopperUploadMode('url'); // Default to URL mode so existing image path is loaded
    setTopperFile(null);
  };

  const cancelEditTopper = () => {
    setTopperEditingId(null);
    setTopperName('');
    setTopperScore('');
    setTopperImageUrl('');
    setTopperFile(null);
  };

  // ── FACULTY ACTIONS (Add / Edit) ──
  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    if (!facultyName.trim()) { setFacultyError('Name is required'); return; }
    if (!facultySpecialization.trim()) { setFacultyError('Specialization is required'); return; }
    
    setFacultyUploading(true);
    setFacultyError('');
    setFacultySuccess(false);

    try {
      let finalImageUrl = facultyImageUrl;
      let finalStoragePath = null;

      // Handle file upload if file mode and file exists
      if (facultyUploadMode === 'file' && facultyFile) {
        const storageRef = ref(storage, `faculty/${Date.now()}_${facultyFile.name}`);
        const uploadTask = await new Promise((resolve, reject) => {
          const task = uploadBytesResumable(storageRef, facultyFile);
          task.on('state_changed', 
            (snap) => {
              const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
              setFacultyProgress(pct);
            },
            reject,
            () => resolve(task)
          );
        });
        finalImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
        finalStoragePath = storageRef.fullPath;
      }

      const facultyData = {
        name: facultyName.trim(),
        subject: facultySubject,
        specialization: facultySpecialization.trim(),
        image: finalImageUrl || '/sample-profile.png'
      };

      if (finalStoragePath) {
        facultyData.storagePath = finalStoragePath;
      }

      if (facultyEditingId) {
        // Edit existing faculty
        const docRef = doc(db, 'faculty', facultyEditingId);
        await updateDoc(docRef, facultyData);
        setFacultySuccess(true);
      } else {
        // Add new faculty
        await addDoc(collection(db, 'faculty'), {
          ...facultyData,
          createdAt: serverTimestamp()
        });
        setFacultySuccess(true);
      }

      // Reset Form
      setFacultyName('');
      setFacultySpecialization('');
      setFacultyFile(null);
      setFacultyImageUrl('');
      setFacultyEditingId(null);
      setFacultyUploading(false);
      fetchData();
      setTimeout(() => setFacultySuccess(false), 3000);
    } catch (err) {
      setFacultyError(`Failed to save faculty: ${err.message}`);
      setFacultyUploading(false);
    }
  };

  const startEditFaculty = (f) => {
    setFacultyEditingId(f.id);
    setFacultyName(f.name);
    setFacultySubject(f.subject);
    setFacultySpecialization(f.specialization);
    setFacultyImageUrl(f.image);
    setFacultyUploadMode('url');
    setFacultyFile(null);
  };

  const cancelEditFaculty = () => {
    setFacultyEditingId(null);
    setFacultyName('');
    setFacultySpecialization('');
    setFacultyImageUrl('');
    setFacultyFile(null);
  };

  const formatDate = (ts) => {
    if (!ts) return 'N/A';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  };

  // ── LOGIN SCREEN ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-2xl shadow-blue-500/30">
              🔐
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/30 text-sm">Tiwari Tutorials · Restricted Access</p>
          </div>

          <form onSubmit={handleLogin} className="glass-card p-10 rounded-[40px] space-y-6 shadow-2xl border border-white/5">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="off"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-14 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors text-lg"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-400 text-xs font-bold px-1 flex items-center gap-2">
                  <span>⚠️</span> {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl transition-all shadow-xl text-sm uppercase tracking-[0.2em] active:scale-95 cursor-pointer"
            >
              Access Dashboard
            </button>

            <Link to="/" className="block text-center text-xs text-white/20 hover:text-white/40 transition-colors font-bold uppercase tracking-widest">
              ← Back to Website
            </Link>
          </form>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──
  const currentData = activeTab === 'enrollments' ? enrollments : reviews;

  return (
    <div className="min-h-screen px-4 md:px-10 py-10">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-black">T</div>
            <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Admin Dashboard</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Tiwari Tutorials</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="px-4 py-2 glass border border-white/10 text-white/60 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
          >
            🔒 Logout
          </button>
          <Link to="/" className="px-4 py-2 glass border border-white/10 text-white/60 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
            ← Website
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8 relative z-10">
        {[
          { label: 'Total Enrollments', value: enrollments.length, icon: '📋', color: 'blue' },
          { label: 'Total Reviews', value: reviews.length, icon: '⭐', color: 'yellow' },
          { label: 'Gallery Images', value: gallery.length, icon: '📷', color: 'purple' },
          { label: 'Toppers List', value: toppers.length, icon: '🏆', color: 'amber' },
          { label: 'Faculty List', value: faculty.length, icon: '👥', color: 'green' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl border border-white/5">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-extrabold text-white">{stat.value}</div>
            <div className="text-xs text-white/30 font-bold uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6 relative z-10">
        {['enrollments', 'reviews', 'gallery', 'toppers', 'faculty'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 font-extrabold'
                : 'glass border border-white/10 text-white/40 hover:text-white'
            }`}
          >
            {tab === 'enrollments' && `📋 Enrollments (${enrollments.length})`}
            {tab === 'reviews' && `⭐ Reviews (${reviews.length})`}
            {tab === 'gallery' && `📷 Gallery (${gallery.length})`}
            {tab === 'toppers' && `🏆 Toppers (${toppers.length})`}
            {tab === 'faculty' && `👥 Faculty (${faculty.length})`}
          </button>
        ))}
      </div>

      {/* Conditional Tabs Rendering */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Uploader */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-8 rounded-3xl border border-white/5">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span>📷</span> Add Gallery Image
              </h2>
              <form onSubmit={handleGalleryUpload} className="space-y-5">
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  {['file', 'url'].map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setGalleryMode(mode)}
                      className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                        galleryMode === mode ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white/80'
                      }`}
                    >
                      {mode === 'file' ? 'Upload File' : 'Paste URL'}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">Image Title</label>
                  <input
                    type="text" required value={galleryTitle} onChange={(e) => setGalleryTitle(e.target.value)}
                    placeholder="Enter image description"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">Category</label>
                  <select
                    value={galleryCategory} onChange={(e) => setGalleryCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                  >
                    {GALLERY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {galleryMode === 'file' ? (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">File</label>
                    <div className="relative border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center hover:border-blue-500 bg-white/3">
                      <input type="file" accept="image/*" onChange={(e) => setGalleryFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                      {galleryFilePreview ? (
                        <div className="w-full aspect-video rounded-lg overflow-hidden border border-white/10">
                          <img src={galleryFilePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <span className="text-2xl mb-1 block">🖼️</span>
                          <span className="text-xs text-white/40">Click to Select File</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">Image URL</label>
                    <input
                      type="url" required value={galleryImageUrl} onChange={(e) => setGalleryImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all font-mono"
                    />
                  </div>
                )}
                {galleryError && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-bold">⚠️ {galleryError}</div>}
                {gallerySuccess && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-bold">✓ Added to Gallery!</div>}
                {galleryUploading && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-white/40"><span>Uploading...</span><span>{galleryProgress}%</span></div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden"><div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${galleryProgress}%` }} /></div>
                  </div>
                )}
                <button type="submit" disabled={galleryUploading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer">
                  Upload Image
                </button>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8 rounded-3xl border border-white/5">
              <h2 className="text-lg font-bold text-white mb-6">📷 Current Gallery ({gallery.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map(img => (
                  <div key={img.id} className="glass rounded-2xl overflow-hidden border border-white/5">
                    <div className="aspect-video bg-slate-900 overflow-hidden relative">
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-slate-950/75 px-2 py-0.5 rounded text-[8px] font-black uppercase text-blue-400">{img.category}</div>
                    </div>
                    <div className="p-4 space-y-3">
                      <h4 className="text-white font-bold text-xs truncate">{img.title}</h4>
                      <div className="flex items-center justify-between text-[10px] text-white/30 font-semibold font-mono">
                        <span>{formatDate(img.createdAt)}</span>
                        {deleteConfirm === img.id ? (
                          <div className="flex gap-1.5 z-10 relative">
                            <button onClick={() => handleDelete('gallery', img.id, img.storagePath)} className="px-2 py-0.5 bg-red-600 text-white rounded text-[9px] font-black cursor-pointer">Yes</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-2 py-0.5 glass text-white rounded text-[9px] font-black cursor-pointer">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(img.id)} className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-[9px] font-bold cursor-pointer">Delete</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOPPERS MANAGER */}
      {activeTab === 'toppers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Uploader Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-8 rounded-3xl border border-white/5">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span>🏆</span> {topperEditingId ? 'Edit Topper Details' : 'Add New Topper'}
              </h2>
              <form onSubmit={handleTopperSubmit} className="space-y-5">
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  {['file', 'url'].map(mode => (
                    <button
                      key={mode} type="button" onClick={() => setTopperUploadMode(mode)}
                      className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                        topperUploadMode === mode ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white/80'
                      }`}
                    >
                      {mode === 'file' ? 'Upload Photo' : 'Photo URL'}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">Topper Name</label>
                  <input
                    type="text" required value={topperName} onChange={(e) => setTopperName(e.target.value)}
                    placeholder="Enter student name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">Exam</label>
                    <select
                      value={topperExam} onChange={(e) => setTopperExam(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                    >
                      <option value="SSC 10th Board">SSC 10th</option>
                      <option value="HSC 12th Board">HSC 12th</option>
                      <option value="IIT JEE Achieve">IIT JEE</option>
                      <option value="NEET Achieve">NEET</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">Score / %</label>
                    <input
                      type="text" required value={topperScore} onChange={(e) => setTopperScore(e.target.value)}
                      placeholder="e.g. 91.20% or 99.4 percentile"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">Batch Year</label>
                  <input
                    type="text" required value={topperYear} onChange={(e) => setTopperYear(e.target.value)}
                    placeholder="e.g. 2025"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                  />
                </div>

                {topperUploadMode === 'file' ? (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">Photo</label>
                    <div className="relative border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center hover:border-blue-500 bg-white/3">
                      <input type="file" accept="image/*" onChange={(e) => setTopperFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                      {topperFilePreview ? (
                        <div className="w-full aspect-square rounded-lg overflow-hidden border border-white/10">
                          <img src={topperFilePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <span className="text-2xl mb-1 block">👤</span>
                          <span className="text-xs text-white/40">Select Photo File</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">Photo URL</label>
                    <input
                      type="url" value={topperImageUrl} onChange={(e) => setTopperImageUrl(e.target.value)}
                      placeholder="e.g. /sample-profile.png or external link"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none font-mono"
                    />
                  </div>
                )}

                {topperError && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-bold">⚠️ {topperError}</div>}
                {topperSuccess && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-bold">✓ Successfully saved topper details!</div>}
                {topperUploading && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-white/40"><span>Saving Topper...</span><span>{topperProgress}%</span></div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden"><div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${topperProgress}%` }} /></div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button type="submit" disabled={topperUploading} className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer">
                    {topperEditingId ? 'Save Changes' : 'Add Topper'}
                  </button>
                  {topperEditingId && (
                    <button type="button" onClick={cancelEditTopper} className="px-4 py-3.5 glass border border-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List of Toppers */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8 rounded-3xl border border-white/5">
              <h2 className="text-lg font-bold text-white mb-6">🏆 Current Achievers ({toppers.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {toppers.map(t => (
                  <div key={t.id} className="glass rounded-2xl overflow-hidden border border-white/5 relative group">
                    <div className="aspect-square bg-slate-900 overflow-hidden relative">
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-slate-950/75 border border-primary/20 text-primary px-2.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">{t.score}</div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{t.exam} ({t.year})</span>
                        <h4 className="text-white font-bold text-sm truncate mt-0.5">{t.name}</h4>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/30 border-t border-white/5 pt-3">
                        <button onClick={() => startEditTopper(t)} className="text-blue-400 hover:text-blue-300 font-bold uppercase cursor-pointer">Edit</button>
                        {deleteConfirm === t.id ? (
                          <div className="flex gap-1.5">
                            <button onClick={() => handleDelete('toppers', t.id, t.storagePath)} className="px-1.5 py-0.5 bg-red-600 text-white rounded text-[9px] font-black cursor-pointer">Yes</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-1.5 py-0.5 glass text-white rounded text-[9px] font-black cursor-pointer">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(t.id)} className="text-red-400 hover:text-red-300 font-bold uppercase cursor-pointer">Delete</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FACULTY MANAGER */}
      {activeTab === 'faculty' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Uploader Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-8 rounded-3xl border border-white/5">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span>👥</span> {facultyEditingId ? 'Edit Teacher Details' : 'Add New Teacher'}
              </h2>
              <form onSubmit={handleFacultySubmit} className="space-y-5">
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  {['file', 'url'].map(mode => (
                    <button
                      key={mode} type="button" onClick={() => setFacultyUploadMode(mode)}
                      className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                        facultyUploadMode === mode ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white/80'
                      }`}
                    >
                      {mode === 'file' ? 'Upload Photo' : 'Photo URL'}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">Teacher Name</label>
                  <input
                    type="text" required value={facultyName} onChange={(e) => setFacultyName(e.target.value)}
                    placeholder="e.g. Manoj Sir"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">Subject</label>
                  <select
                    value={facultySubject} onChange={(e) => setFacultySubject(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                  >
                    {FACULTY_SUBJECTS.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">Specialization</label>
                  <input
                    type="text" required value={facultySpecialization} onChange={(e) => setFacultySpecialization(e.target.value)}
                    placeholder="e.g. Calculus Expert or NEET Trainer"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                  />
                </div>

                {facultyUploadMode === 'file' ? (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">Photo</label>
                    <div className="relative border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center hover:border-blue-500 bg-white/3">
                      <input type="file" accept="image/*" onChange={(e) => setFacultyFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                      {facultyFilePreview ? (
                        <div className="w-full aspect-square rounded-lg overflow-hidden border border-white/10">
                          <img src={facultyFilePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <span className="text-2xl mb-1 block">👤</span>
                          <span className="text-xs text-white/40">Select Photo File</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">Photo URL</label>
                    <input
                      type="url" value={facultyImageUrl} onChange={(e) => setFacultyImageUrl(e.target.value)}
                      placeholder="e.g. /sample-profile.png or external link"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none font-mono"
                    />
                  </div>
                )}

                {facultyError && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-bold">⚠️ {facultyError}</div>}
                {facultySuccess && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-bold">✓ Successfully saved teacher details!</div>}
                {facultyUploading && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-white/40"><span>Saving Teacher...</span><span>{facultyProgress}%</span></div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden"><div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${facultyProgress}%` }} /></div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button type="submit" disabled={facultyUploading} className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer">
                    {facultyEditingId ? 'Save Changes' : 'Add Teacher'}
                  </button>
                  {facultyEditingId && (
                    <button type="button" onClick={cancelEditFaculty} className="px-4 py-3.5 glass border border-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List of Faculty */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8 rounded-3xl border border-white/5">
              <h2 className="text-lg font-bold text-white mb-6">👥 Current Teachers ({faculty.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {faculty.map(f => (
                  <div key={f.id} className="glass rounded-2xl overflow-hidden border border-white/5 relative group">
                    <div className="aspect-square bg-slate-900 overflow-hidden relative">
                      <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-slate-950/75 text-primary px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">{f.subject}</div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="text-white font-bold text-sm truncate">{f.name}</h4>
                        <p className="text-[10px] text-white/30 font-medium truncate mt-0.5">{f.specialization}</p>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/30 border-t border-white/5 pt-3">
                        <button onClick={() => startEditFaculty(f)} className="text-blue-400 hover:text-blue-300 font-bold uppercase cursor-pointer">Edit</button>
                        {deleteConfirm === f.id ? (
                          <div className="flex gap-1.5">
                            <button onClick={() => handleDelete('faculty', f.id, f.storagePath)} className="px-1.5 py-0.5 bg-red-600 text-white rounded text-[9px] font-black cursor-pointer">Yes</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-1.5 py-0.5 glass text-white rounded text-[9px] font-black cursor-pointer">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(f.id)} className="text-red-400 hover:text-red-300 font-bold uppercase cursor-pointer">Delete</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORIGINAL TABS: Enrollments or Reviews Table */}
      {(activeTab === 'enrollments' || activeTab === 'reviews') && (
        <div className="glass-card rounded-3xl border border-white/5 overflow-hidden relative z-10">
          {loading ? (
            <div className="p-20 text-center">
              <div className="text-4xl animate-spin mb-4 inline-block">⟳</div>
              <p className="text-white/30 font-bold">Loading data...</p>
            </div>
          ) : currentData.length === 0 ? (
            <div className="p-20 text-center">
              <div className="text-5xl mb-4 opacity-30">{activeTab === 'enrollments' ? '📋' : '⭐'}</div>
              <p className="text-white/30 font-bold text-lg">No {activeTab} yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {activeTab === 'enrollments' ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['#', 'Name', 'Phone', 'Email', 'Standard', 'Course/Exam', 'Date', 'Action'].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((e, idx) => (
                      <tr key={e.id} className="border-b border-white/5 hover:bg-white/3 transition-colors group">
                        <td className="px-6 py-4 text-white/30 font-bold">{idx + 1}</td>
                        <td className="px-6 py-4 text-white font-bold whitespace-nowrap">{e.name}</td>
                        <td className="px-6 py-4 text-blue-400 font-bold whitespace-nowrap">
                          <a href={`tel:${e.phone}`} className="hover:underline">{e.phone}</a>
                        </td>
                        <td className="px-6 py-4 text-white/60 whitespace-nowrap">{e.email || '—'}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-[10px] font-bold uppercase whitespace-nowrap">
                            {e.standard === '1-10' ? `Class ${e.specificClass || '1-10'}` : 
                             e.standard === 'School Boards (Class 1-9)' ? `School: Class ${e.specificClass || '1-9'}` :
                             e.standard === 'Pre Foundation (Class 1-9)' ? `Pre-Found: Class ${e.specificClass || '1-9'}` :
                             e.standard}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white/60 whitespace-nowrap">
                          {e.standard === 'NEET' || e.standard === 'IIT JEE' 
                            ? `${e.standard} (${e.specificClass || '—'})` 
                            : e.competitiveExam || e.course || '—'}
                        </td>
                        <td className="px-6 py-4 text-white/30 text-xs whitespace-nowrap">{formatDate(e.submittedAt)}</td>
                        <td className="px-6 py-4">
                          {deleteConfirm === e.id ? (
                            <div className="flex gap-2">
                              <button onClick={() => handleDelete('enrollments', e.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold cursor-pointer">Yes</button>
                              <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 glass border border-white/10 text-white/60 rounded-lg text-xs font-bold cursor-pointer">No</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(e.id)} className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 rounded-lg text-xs font-bold transition-all cursor-pointer">Delete</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['#', 'Name', 'Course', 'Rating', 'Review', 'Date', 'Action'].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((r, idx) => (
                      <tr key={r.id} className="border-b border-white/5 hover:bg-white/3 transition-colors group">
                        <td className="px-6 py-4 text-white/30 font-bold">{idx + 1}</td>
                        <td className="px-6 py-4 text-white font-bold whitespace-nowrap">{r.name}</td>
                        <td className="px-6 py-4 text-white/60 whitespace-nowrap">{r.standard || '—'}</td>
                        <td className="px-6 py-4">
                          <span className="text-yellow-400 font-bold">{'★'.repeat(Number(r.rating || 0))}{'☆'.repeat(5 - Number(r.rating || 0))}</span>
                        </td>
                        <td className="px-6 py-4 text-white/50 max-w-xs">
                          <p className="truncate max-w-[200px]" title={r.review}>{r.review}</p>
                        </td>
                        <td className="px-6 py-4 text-white/30 text-xs whitespace-nowrap">{formatDate(r.submittedAt)}</td>
                        <td className="px-6 py-4">
                          {deleteConfirm === r.id ? (
                            <div className="flex gap-2">
                              <button onClick={() => handleDelete('reviews', r.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold cursor-pointer">Yes</button>
                              <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 glass border border-white/10 text-white/60 rounded-lg text-xs font-bold cursor-pointer">No</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(r.id)} className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 rounded-lg text-xs font-bold transition-all cursor-pointer">Delete</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
