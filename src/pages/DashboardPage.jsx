import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const ADMIN_PASSWORD = '@Aman6227';

const DashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [enrollments, setEnrollments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enrollments');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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

      const [enrollSnap, reviewSnap] = await Promise.all([
        getDocs(enrollQ),
        getDocs(reviewQ)
      ]);

      setEnrollments(enrollSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setReviews(reviewSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const handleDelete = async (collectionName, id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      if (collectionName === 'enrollments') {
        setEnrollments(prev => prev.filter(e => e.id !== id));
      } else {
        setReviews(prev => prev.filter(r => r.id !== id));
      }
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
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
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl transition-all shadow-xl text-sm uppercase tracking-[0.2em] active:scale-95"
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
            className="px-4 py-2 glass border border-white/10 text-white/60 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
          >
            🔒 Logout
          </button>
          <Link to="/" className="px-4 py-2 glass border border-white/10 text-white/60 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
            ← Website
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
        {[
          { label: 'Total Enrollments', value: enrollments.length, icon: '📋', color: 'blue' },
          { label: 'Total Reviews', value: reviews.length, icon: '⭐', color: 'yellow' },
          { label: 'Avg Rating', value: reviews.length ? (reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length).toFixed(1) : '—', icon: '📊', color: 'green' },
          {
            label: 'This Month', value: enrollments.filter(e => {
              if (!e.submittedAt) return false;
              const d = e.submittedAt.toDate ? e.submittedAt.toDate() : new Date(e.submittedAt);
              return d.getMonth() === new Date().getMonth();
            }).length, icon: '📅', color: 'purple'
          },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl border border-white/5">
            <div className="text-2xl mb-3">{stat.icon}</div>
            <div className="text-2xl font-extrabold text-white">{stat.value}</div>
            <div className="text-xs text-white/30 font-bold uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 relative z-10">
        {['enrollments', 'reviews'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'glass border border-white/10 text-white/40 hover:text-white'
              }`}
          >
            {tab === 'enrollments' ? `📋 Enrollments (${enrollments.length})` : `⭐ Reviews (${reviews.length})`}
          </button>
        ))}
      </div>

      {/* Table */}
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
                            <button onClick={() => handleDelete('enrollments', e.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold">Yes</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 glass border border-white/10 text-white/60 rounded-lg text-xs font-bold">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(e.id)} className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 rounded-lg text-xs font-bold transition-all">Delete</button>
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
                            <button onClick={() => handleDelete('reviews', r.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold">Yes</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 glass border border-white/10 text-white/60 rounded-lg text-xs font-bold">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(r.id)} className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 rounded-lg text-xs font-bold transition-all">Delete</button>
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
    </div>
  );
};

export default DashboardPage;
