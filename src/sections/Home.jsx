import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Plus, Code2, Clock, ArrowRight, Trash2, Search, X, AlertTriangle, Copy } from 'lucide-react';
import toast from 'react-hot-toast';


const Home = () => {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const [userSnippets, setUserSnippets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        const fetchUserSnippets = async () => {
            if (!user) {
                setUserSnippets([]);
                return;
            }
            setLoading(true);
            try {
                const q = query(
                    collection(db, "snippets"),
                    where("authorId", "==", user.uid),
                    orderBy("updatedAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                const fetched = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        displayDate: data.updatedAt ? data.updatedAt.toDate().toLocaleDateString() : 'Just now'
                    };
                });
                setUserSnippets(fetched);
            } catch (error) {
                console.error("Error fetching user snippets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserSnippets();
    }, [user]);

    const filteredSnippets = useMemo(() => {
        return userSnippets.filter(s => 
            s.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (s.language && s.language.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, userSnippets]);

    const handleCopyLink = (e, snippetId) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}${window.location.pathname}#/editor?id=${snippetId}`;

        navigator.clipboard.writeText(shareUrl);
        toast.success('連結已複製到剪貼簿', {
            icon: '🔗',
            style: {
                borderRadius: '12px',
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(59, 130, 246, 0.2)'
            }
        });
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        
        try {
            await deleteDoc(doc(db, "snippets", deleteTarget));
            setUserSnippets(prev => prev.filter(s => s.id !== deleteTarget));
            toast.success('代碼已成功刪除');
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error('刪除失敗，請檢查權限');
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <div id="hero" className="min-h-screen pt-40 pb-20 px-6 md:px-20 max-w-7xl mx-auto relative overflow-hidden">
            <AnimatePresence>
                {deleteTarget && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card p-8 max-w-sm w-full border-red-500/20 text-center"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">確認要刪除嗎？</h3>
                            <p className="text-white/40 text-sm mb-8 font-mono">[{deleteTarget}]</p>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setDeleteTarget(null)} 
                                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-bold"
                                >
                                    取消
                                </button>
                                <button 
                                    onClick={handleConfirmDelete} 
                                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition-colors text-sm font-bold text-white"
                                >
                                    確定刪除
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                <h1 className="text-5xl md:text-6xl font-black mb-4 shimmer-text tracking-tighter">Dev-Share</h1>
                <p className="text-gray-400 text-lg">
                    {user ? `歡迎回來，${user.displayName}。你的靈感都在這裡。` : "快速編寫、儲存、並分享你的代碼靈感。"}
                </p>
            </motion.div>

            {user && (
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="relative max-w-md mb-12 group"
                >
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="搜尋 ID 或 程式語言..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                            <X size={16} />
                        </button>
                    )}
                </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -10, borderColor: "rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/editor?id=new-file`)}
                    className="glass-card group p-8 min-h-[220px] flex flex-col justify-center items-center border-dashed border-2 border-white/10 cursor-pointer"
                >
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all">
                        <Plus className="text-blue-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">新增代碼</h3>
                    <p className="text-gray-500 text-[10px] mt-2 font-mono">從空白頁面開始建立</p>
                </motion.div>

                <AnimatePresence mode='popLayout'>
                    {filteredSnippets.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -10 }}
                            onClick={() => navigate(`/editor?id=${item.id}`)}
                            className="glass-card group p-8 min-h-[220px] flex flex-col justify-between cursor-pointer relative"
                        >
                            <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
                                <button 
                                    onClick={(e) => handleCopyLink(e, item.id)}
                                    className="p-2 rounded-xl text-white/20 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300 opacity-0 group-hover:opacity-100"
                                    title="複製分享連結"
                                >
                                    <Copy size={16} />
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        setDeleteTarget(item.id);
                                    }}
                                    className="p-2 rounded-xl text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest">
                                        {item.language || 'text'}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 truncate group-hover:text-blue-400 transition-colors duration-300">
                                    {item.id}
                                </h3>
                                <div className="flex items-center gap-2 text-white/20 text-xs font-mono">
                                    <Clock size={12} />
                                    <span>{item.displayDate}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <span className="text-[9px] font-mono text-white/20 tracking-[0.2em] uppercase truncate max-w-[120px]">
                                    ID: {item.id}
                                </span>
                                <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 text-xs font-black">
                                    EDIT <ArrowRight size={14} />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 h-[2px] bg-blue-500/50 w-0 group-hover:w-full transition-all duration-500" />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {!user && (
                    <div className="col-span-full py-20 text-center opacity-20 italic font-mono tracking-widest">
                        — 請登入以查看您儲存過的代碼 —
                    </div>
                )}
                {user && !loading && filteredSnippets.length === 0 && (
                    <div className="col-span-full py-20 text-center opacity-20 italic font-mono tracking-widest text-sm">
                        {searchQuery ? "— 找不到符合條件的代碼 —" : "— 目前沒有儲存任何代碼 —"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;

