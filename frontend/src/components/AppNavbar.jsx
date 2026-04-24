import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scan, History, Home as HomeIcon } from 'lucide-react';

const AppNavbar = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: "Scan", path: "/scan", icon: Scan },
    { name: "History", path: "/history", icon: History },
  ];

  return (
    <nav className="sticky top-0 z-[100] w-full px-6 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        <motion.button
          onClick={() => navigate('/')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-primary/20">
            <HomeIcon className="w-6 h-6 text-black" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-bold text-primary leading-none">Carbon</h1>
            <p className="text-[10px] text-primary/50 tracking-widest uppercase">Crunch</p>
          </div>
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 p-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-black shadow-lg shadow-primary/20'
                    : 'text-primary/60 hover:text-primary hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          ))}
        </motion.div>
      </div>
    </nav>
  );
};

export default AppNavbar;
