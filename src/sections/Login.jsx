/*
 * Copyright (C) 2026 Alan1455
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */


import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'framer-motion';
import { LogIn, LogOut, User, Crown, ShieldCheck, Zap, Github } from 'lucide-react';
import toast from 'react-hot-toast';


const Login = () => {
    const [user, loading] = useAuthState(auth);
    const [liveProfile, setLiveProfile] = useState(null);

    useEffect(() => {
        if (user) {
            const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
                if (doc.exists()) setLiveProfile(doc.data());
            });
            return () => unsub();
        }
    }, [user]);

    const handlePremium = () => {
        toast('此功能尚未完成！', { icon: '😅' });
    };

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const userRef = doc(db, "users", result.user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    uid: result.user.uid,
                    displayName: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                    level: 'member',
                    createdAt: serverTimestamp()
                });
                toast.success("歡迎使用Dev-Share!");
            } else {
                toast.success(`歡迎回來，${result.user.displayName}`);
            }
        } catch (error) {
            toast.error("登入失敗");
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-white/20 font-mono italic animate-pulse">Establishing a secure connection...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-[#050505]">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-10 rounded-[3rem] w-full max-w-md text-center shadow-2xl border-white/5 relative overflow-hidden"
            >
                {user ? (
                    <div className="relative z-10">
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <img src={user.photoURL} alt="Avatar" className="rounded-3xl border-2 border-white/10 shadow-2xl shadow-blue-500/20" />
                            <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl border-4 border-[#0a0a0a]">
                                <ShieldCheck size={16} className="text-white" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-1 tracking-tight text-white">{user.displayName}</h2>
                        <p className="text-white/30 text-sm mb-8 font-mono select-text">{user.email}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-left">
                                <p className="text-[10px] uppercase text-white/30 font-black mb-1 tracking-widest">用戶等級</p>
                                <p className="text-blue-400 font-black flex items-center gap-2">
                                     {liveProfile?.level === 'premium' ? <Crown size={14} className="text-amber-400"/> : <Zap size={14}/>}
                                     {liveProfile?.level?.toUpperCase() || 'LOADING...'}
                                </p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-left">
                                <p className="text-[10px] uppercase text-white/30 font-black mb-1 tracking-widest">單篇字數上限</p>
                                <p className="text-white font-bold font-mono">
                                    {liveProfile?.level === 'premium' ? '100,000' : '5,000'} 字
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            {liveProfile?.level !== 'premium' && (
                                <button 
                                    onClick={handlePremium}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all font-bold text-xs text-white uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">
                                    <Crown size={14} /> Upgrade to Premium
                                </button>
                            )}
                            <button 
                                onClick={() => signOut(auth)}
                                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-xs uppercase tracking-widest text-white/40"
                            >
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                            <User size={40} className="text-blue-500" />
                        </div>
                        <h2 className="text-4xl font-black mb-4 shimmer-text tracking-tighter">Dev-Share</h2>
                        <p className="text-white/40 mb-10 text-sm leading-relaxed font-medium">
                            登入以解除 <span className="text-blue-400">Guest</span> 限制。<br/>享受雲端同步與更高的字數配額。
                        </p>
                        <button 
                            onClick={handleLogin}
                            className="group relative flex items-center justify-center gap-4 w-full py-5 rounded-2xl bg-white text-black hover:bg-blue-50 transition-all font-black text-sm overflow-hidden active:scale-95"
                        >
                            <LogIn size={20} /> Continue with Google
                        </button>
                    </div>
                )}
            </motion.div>
            <footer className="fixed bottom-8 left-0 w-full flex flex-col items-center gap-4 z-20">
                <motion.a 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    href="https://github.com/Alan1455/Dev-Share"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md hover:bg-white hover:border-white transition-all duration-500"
                >
                    <Github size={14} className="text-white/40 group-hover:text-black transition-colors" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 group-hover:text-black transition-colors">
                        Source Code
                    </span>
                </motion.a>
                <div className="text-center">
                    <p className="text-[11px] font-mono text-white/40 tracking-[0.4em]">
                        ©2026 Alan1455.
                    </p>
                    <p className="text-[10px] font-mono text-white/40 tracking-[0.2em] mt-1">
                        All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Login;

