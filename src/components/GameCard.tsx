import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradientClass: string;
  path: string;
  delay: number;
}

export const GameCard = ({ title, description, icon: Icon, gradientClass, path, delay }: GameCardProps) => {
  // Odak Avcısı için özel animasyon
  const isFocusGame = title === "Odak Avcısı";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, type: "spring", bounce: 0.4 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={path}>
        <div className={`${gradientClass} p-6 rounded-fun shadow-fun cursor-pointer group overflow-hidden relative`}>
          <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          
          <motion.div 
            className="relative z-10 text-center text-white"
            whileHover={{ y: -5 }}
          >
            <motion.div
              animate={isFocusGame ? { 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1]
              } : { rotate: [0, 10, -10, 0] }}
              transition={isFocusGame ? { 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut"
              } : { 
                repeat: Infinity, 
                duration: 4, 
                ease: "easeInOut" 
              }}
              className="inline-block mb-4"
            >
              <Icon size={48} className="mx-auto drop-shadow-lg" />
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-2 font-fun drop-shadow-md">{title}</h3>
            <p className="text-lg opacity-90 font-fun">{description}</p>
            
            <motion.div 
              className="mt-4 inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.3)" }}
              animate={isFocusGame ? {
                boxShadow: [
                  "0 0 0px rgba(255,255,255,0.3)",
                  "0 0 20px rgba(255,255,255,0.6)",
                  "0 0 0px rgba(255,255,255,0.3)"
                ]
              } : {}}
              transition={isFocusGame ? {
                repeat: Infinity,
                duration: 2
              } : {}}
            >
              Oynamaya Başla! 🎮
            </motion.div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};