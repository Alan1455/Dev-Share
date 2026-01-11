import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Home from './sections/Home';
import Login from './sections/Login';
import EditorPage from './sections/Editor';
import NotFound from './sections/NotFound';


function App() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 select-none">
            <Toaster 
                position="bottom-right" 
                reverseOrder={false}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'rgba(20, 20, 20, 0.8)',
                        color: '#fff',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        padding: '12px 20px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#3b82f6',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            <Navbar />
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/editor" element={<EditorPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AnimatePresence>

            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}


export default App;

