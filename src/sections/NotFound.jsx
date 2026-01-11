import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertCircle, ChevronLeft } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-12 rounded-[3rem] w-full max-w-lg text-center shadow-2xl border-white/5 relative z-10"
            >
                <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                    <AlertCircle size={48} className="text-red-500" />
                </div>

                <h1 className="text-8xl font-black mb-4 text-white tracking-tighter">404</h1>
                <h2 className="text-2xl font-bold mb-4 text-white/90">找不到此頁面</h2>

                <p className="text-white/40 mb-10 text-sm leading-relaxed max-w-xs mx-auto">
                    您嘗試訪問的代碼片段可能已被刪除，或者連結網址有誤。
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest text-white/60"
                    >
                        <ChevronLeft size={16} /> 回上一頁
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-bold text-xs uppercase tracking-widest text-white shadow-lg shadow-blue-600/20"
                    >
                        <Home size={16} /> 返回主畫面
                    </button>
                </div>
            </motion.div>

            <div className="absolute bottom-10 left-10 font-mono text-[10px] text-white/5 select-none pointer-events-none text-left">
                <p>const error = new Error("Page Not Found");</p>
                <p>status: 404,</p>
                <p>message: "Dev-Share redirection required"</p>
            </div>
        </div>
    );
};

export default NotFound;

