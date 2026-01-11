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
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, User, Code } from 'lucide-react'; 


const Navbar = () => {
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    const navItems = [
        { name: '首頁', path: '/', target: 'hero', icon: <Home size={18} /> },
        { name: '編輯器', path: '/editor', icon: <Code size={18} /> },
        { name: '個人檔案', path: '/login', icon: <User size={18} /> },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-6 pointer-events-none select-none">
            <motion.div 
                initial={{ y: -100 }} animate={{ y: 0 }}
                className="flex items-center gap-1 px-4 py-2 rounded-full pointer-events-auto border bg-white/10 border-white/20 backdrop-blur-2xl shadow-lg"
            >
                {navItems.map((item) => (
                    <RouterLink
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white/80 hover:bg-white/10 transition-all ${location.pathname === item.path ? 'bg-white/20 text-white' : ''}`}
                    >
                        {item.icon}
                        <span className="hidden md:block">{item.name}</span>
                    </RouterLink>
                ))}
            </motion.div>
        </nav>
    );
};

export default Navbar;

