import { motion } from 'framer-motion';
import { Code, Calculator, BookOpen, Palette } from 'lucide-react';
import { GameCard } from '../components/GameCard';
import kodlabMascot from '../assets/kodlab-mascot.png';

const Index = () => {
  const games = [
    {
      title: "Yazılım",
      description: "Blokları doğru sıraya koy!",
      icon: Code,
      gradientClass: "bg-gradient-coding",
      path: "/yazilim",
      delay: 0.1
    },
    {
      title: "Matematik", 
      description: "Sayıları keşfet ve hesapla!",
      icon: Calculator,
      gradientClass: "bg-gradient-math",
      path: "/matematik",
      delay: 0.2
    },
    {
      title: "İngilizce",
      description: "Kelimeleri eşleştir!",
      icon: BookOpen, 
      gradientClass: "bg-gradient-english",
      path: "/ingilizce",
      delay: 0.3
    },
    {
      title: "Tasarım",
      description: "Renkleri ve şekilleri keşfet!",
      icon: Palette,
      gradientClass: "bg-gradient-design",
      path: "/tasarim",
      delay: 0.4
    }
  ];

  return (
    <div className="min-h-screen bg-background font-fun">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-fun py-12 px-4">
        <div className="absolute inset-0 bg-white/5" />
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.6 }}
          >
            <motion.img
              src={kodlabMascot}
              alt="Kodlab Junior Mascot"
              className="w-32 h-32 mx-auto mb-6 drop-shadow-2xl"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-xl">
              Kodlab Junior
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-2 drop-shadow-lg">
              Öğrenmeyi Oyuna Dönüştürüyoruz! 🚀
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto drop-shadow-md">
              Yazılım, Matematik, İngilizce ve Tasarım derslerini eğlenceli oyunlarla öğren!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 flex justify-center space-x-4"
          >
            {['🎮', '🎯', '⭐', '🏆'].map((emoji, index) => (
              <motion.div
                key={emoji}
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2 + index * 0.5,
                  ease: "easeInOut"
                }}
                className="text-3xl"
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Games Section */}
      <div className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hangi Oyunu Oynamak İstiyorsun? 🎲
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Her oyun farklı bir becerini geliştirmek için tasarlandı. Hadi başlayalım!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {games.map((game) => (
            <GameCard key={game.title} {...game} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="bg-primary text-primary-foreground py-8 mt-12"
      >
        <div className="container mx-auto text-center px-4">
          <p className="text-lg font-fun mb-2">
            Kodlab Junior ile öğrenmek çok eğlenceli! 🌟
          </p>
          <p className="text-sm opacity-80">
            Geliştirici dostu • Çocuk güvenli • Eğlenceli öğrenme
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;