import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query, deleteDoc, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { db, storage, auth } from '../firebase';
import { Lock, Eye, EyeOff, RefreshCw, LogOut, ArrowLeft, ClipboardList, Star, Image as ImageIcon, Trophy, Users, AlertTriangle, ShieldCheck } from 'lucide-react';

// Pre-computed SHA-256 hash of the administrative key (Security through Obscurity fallback)
const ADMIN_HASH = '3d71fbedca959944b53f34769a6326ba4d8f464d5db25e181f4777821b954494';
const LOCKOUT_KEY = '__sec_gate_lock';
const ATTEMPTS_KEY = '__sec_gate_att';
const SESSION_KEY = '__sec_adm_session';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

async function hashKey(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const GALLERY_CATEGORIES = ['Classroom', 'Events', 'Toppers', 'Activities', 'Other'];
const FACULTY_SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Other'];

// Initial data lists for auto-initialization
const INITIAL_TOPPERS = [
  { name: "Gitanjali Vishwakarma", exam: "SSC 10th Board", score: "91.20%", year: "2025", image: "/sample-profile.png" },
  { name: "Lekhraj Maurya", exam: "SSC 10th Board", score: "87.60%", year: "2025", image: "/lekhraj-maurya.jpeg" },
  { name: "Aman Vishwakarma", exam: "SSC 10th Board", score: "86.80%", year: "2025", image: "/sample-profile.png" },
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'active' || !!auth?.currentUser;
  });
  const [adminEmail, setAdminEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState('key'); // 'key' | 'firebase'

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        sessionStorage.setItem(SESSION_KEY, 'active');
      }
    });
    return () => unsubscribe();
  }, []);

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

  const getLockoutRemaining = () => {
    const lockUntil = Number(sessionStorage.getItem(LOCKOUT_KEY) || 0);
    const diff = lockUntil - Date.now();
    return diff > 0 ? Math.ceil(diff / 1000) : 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const remaining = getLockoutRemaining();
    if (remaining > 0) {
      setPasswordError(`Access suspended due to repeated failures. Try again in ${remaining}s.`);
      return;
    }

    try {
      // Direct Firebase Email / Password sign-in
      if (authMode === 'firebase' && adminEmail) {
        await signInWithEmailAndPassword(auth, adminEmail.trim(), password);
        sessionStorage.setItem(SESSION_KEY, 'active');
        setIsAuthenticated(true);
        setPasswordError('');
        return;
      }

      // Security Key verification + Firebase authenticated session
      const enteredHash = await hashKey(password);
      if (enteredHash === ADMIN_HASH) {
        try {
          await signInAnonymously(auth);
        } catch {
          // If anonymous disabled, session storage protects interface
        }
        sessionStorage.setItem(SESSION_KEY, 'active');
        sessionStorage.removeItem(ATTEMPTS_KEY);
        sessionStorage.removeItem(LOCKOUT_KEY);
        setIsAuthenticated(true);
        setPasswordError('');
      } else {
        const attempts = Number(sessionStorage.getItem(ATTEMPTS_KEY) || 0) + 1;
        sessionStorage.setItem(ATTEMPTS_KEY, String(attempts));
        if (attempts >= MAX_ATTEMPTS) {
          sessionStorage.setItem(LOCKOUT_KEY, String(Date.now() + LOCKOUT_DURATION_MS));
          setPasswordError('Maximum invalid attempts reached. Portal suspended for 5 minutes.');
        } else {
          setPasswordError(`Invalid key. Access denied (${MAX_ATTEMPTS - attempts} attempt(s) left).`);
        }
      }
    } catch (err) {
      setPasswordError(err.message || 'Verification failed.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
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
    let isSubscribed = true;
    if (isAuthenticated) {
      Promise.resolve().then(() => {
        if (isSubscribed) fetchData();
      });
    }
    return () => { isSubscribed = false; };
  }, [isAuthenticated]);

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview('');
    }
  };


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
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4 font-mono">
        <div className="w-full max-w-sm relative z-10">
          <div className="text-center mb-6">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-700 rounded-sm flex items-center justify-center text-zinc-200 mx-auto mb-3">
              <Lock className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">SECURITY ACCESS GATEWAY</div>
            <h1 className="text-xl font-bold text-zinc-100 mb-1">Administrative Terminal</h1>
            <p className="text-zinc-500 text-xs">Tiwari Tutorials · Restricted Access</p>
          </div>

          <form onSubmit={handleLogin} className="bg-[#0d0e12] border border-zinc-800 p-6 rounded-md space-y-4 shadow-xl">
            {/* Mode Selector */}
            <div className="flex border border-zinc-800 rounded p-0.5 bg-zinc-900/50">
              <button
                type="button"
                onClick={() => { setAuthMode('key'); setPasswordError(''); }}
                className={`flex-1 py-1.5 text-[10px] uppercase font-mono tracking-wider rounded transition-colors ${
                  authMode === 'key' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Security Key
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('firebase'); setPasswordError(''); }}
                className={`flex-1 py-1.5 text-[10px] uppercase font-mono tracking-wider rounded transition-colors flex items-center justify-center gap-1 ${
                  authMode === 'firebase' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-indigo-400" /> Firebase Auth
              </button>
            </div>

            {authMode === 'firebase' && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500">Admin Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@tiwaritutorials.com"
                  autoComplete="email"
                  required
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-sm px-3 py-2 text-xs text-zinc-100 focus:border-zinc-500 outline-none transition-colors"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                {authMode === 'firebase' ? 'Firebase Password' : 'Administrative Key'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={authMode === 'firebase' ? 'Enter Firebase password' : 'Enter administrative key'}
                  autoComplete="off"
                  required
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-sm px-3 py-2 pr-10 text-xs text-zinc-100 focus:border-zinc-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-400 text-xs flex items-center gap-1.5 pt-1">
                  <AlertTriangle className="w-3.5 h-3.5" strokeWidth={1.5} /> {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-2.5 text-xs rounded-sm cursor-pointer"
            >
              {authMode === 'firebase' ? 'Authenticate via Firebase' : 'Verify & Enter Terminal'}
            </button>

            <Link to="/" className="block text-center text-xs text-zinc-500 hover:text-zinc-300 transition-colors pt-2">
              ← Return to Main Web
            </Link>
          </form>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──
  const currentData = activeTab === 'enrollments' ? enrollments : reviews;

  return (
    <div className="min-h-screen bg-[#09090b] px-4 md:px-8 py-8 font-mono text-zinc-400">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-zinc-900 border border-zinc-700 rounded-sm flex items-center justify-center text-xs text-zinc-200 font-bold">T</div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">ADMINISTRATIVE CORE // v2.6</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-100">Telemetry & Operations Control</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="btn-secondary px-3 py-1.5 rounded-sm text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-zinc-400" strokeWidth={1.5} />
            <span>Sync</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-950/30 border border-red-900/60 text-red-300 hover:bg-red-950/60 rounded-sm text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3 h-3 text-red-400" strokeWidth={1.5} />
            <span>Exit</span>
          </button>
          <Link to="/" className="btn-secondary px-3 py-1.5 rounded-sm text-xs flex items-center gap-1.5">
            <ArrowLeft className="w-3 h-3 text-zinc-400" strokeWidth={1.5} />
            <span>Public Site</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total Enrollments', value: enrollments.length, icon: ClipboardList },
          { label: 'Total Reviews', value: reviews.length, icon: Star },
          { label: 'Gallery Images', value: gallery.length, icon: ImageIcon },
          { label: 'Toppers List', value: toppers.length, icon: Trophy },
          { label: 'Faculty List', value: faculty.length, icon: Users },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#0d0e12] border border-zinc-800 p-4 rounded-md flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-500 mb-2">
                <span className="text-[10px] uppercase tracking-wider">{stat.label}</span>
                <Icon className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
              </div>
              <div className="text-2xl font-bold text-zinc-100">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6 pb-2 border-b border-zinc-800/80">
        {[
          { id: 'enrollments', label: 'Enrollments', count: enrollments.length, icon: ClipboardList },
          { id: 'reviews', label: 'Reviews', count: reviews.length, icon: Star },
          { id: 'gallery', label: 'Gallery', count: gallery.length, icon: ImageIcon },
          { id: 'toppers', label: 'Toppers', count: toppers.length, icon: Trophy },
          { id: 'faculty', label: 'Faculty', count: faculty.length, icon: Users },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border ${
                activeTab === tab.id
                  ? 'bg-zinc-100 text-zinc-950 font-medium border-zinc-200'
                  : 'bg-[#0d0e12] border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <Icon className="w-3 h-3" strokeWidth={1.5} />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1 rounded-xs ${activeTab === tab.id ? 'bg-zinc-300 text-zinc-900' : 'bg-zinc-800 text-zinc-400'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
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
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setGalleryFile, setGalleryFilePreview)} className="absolute inset-0 opacity-0 cursor-pointer" />
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
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setTopperFile, setTopperFilePreview)} className="absolute inset-0 opacity-0 cursor-pointer" />
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
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setFacultyFile, setFacultyFilePreview)} className="absolute inset-0 opacity-0 cursor-pointer" />
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
