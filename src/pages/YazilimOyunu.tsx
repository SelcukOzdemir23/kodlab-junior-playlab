import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

interface CodeBlock {
  id: string;
  text: string;
  order: number;
}

const YazilimOyunu = () => {
  const correctOrder = [
    { id: '1', text: '1. Problemi Anla 🤔', order: 1 },
    { id: '2', text: '2. Çözümü Planla 📝', order: 2 },
    { id: '3', text: '3. Kodu Yaz 💻', order: 3 },
    { id: '4', text: '4. Test Et ✅', order: 4 },
    { id: '5', text: '5. Hatalar Varsa Düzelt 🔧', order: 5 }
  ];

  const [blocks, setBlocks] = useState<CodeBlock[]>([
    { id: '3', text: '3. Kodu Yaz 💻', order: 3 },
    { id: '1', text: '1. Problemi Anla 🤔', order: 1 },
    { id: '5', text: '5. Hatalar Varsa Düzelt 🔧', order: 5 },
    { id: '2', text: '2. Çözümü Planla 📝', order: 2 },
    { id: '4', text: '4. Test Et ✅', order: 4 }
  ]);

  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const checkOrder = () => {
    const isCorrect = blocks.every((block, index) => 
      block.order === correctOrder[index].order
    );
    
    if (isCorrect) {
      setIsComplete(true);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    setBlocks(newBlocks);
    setSelectedBlock(null);
    setTimeout(checkOrder, 300);
  };

  const resetGame = () => {
    setBlocks([
      { id: '3', text: '3. Kodu Yaz 💻', order: 3 },
      { id: '1', text: '1. Problemi Anla 🤔', order: 1 },
      { id: '5', text: '5. Hatalar Varsa Düzelt 🔧', order: 5 },
      { id: '2', text: '2. Çözümü Planla 📝', order: 2 },
      { id: '4', text: '4. Test Et ✅', order: 4 }
    ]);
    setSelectedBlock(null);
    setIsComplete(false);
  };

  return (
    <div className="min-h-screen bg-gradient-coding font-fun relative overflow-hidden">
      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: 3, duration: 0.5 }}
              className="bg-white rounded-3xl p-8 text-center shadow-2xl"
            >
              <CheckCircle className="w-20 h-20 mx-auto text-secondary mb-4" />
              <h3 className="text-3xl font-bold text-primary mb-2">Tebrikler! 🎉</h3>
              <p className="text-lg text-muted-foreground">Kodlama adımlarını doğru sıraladın!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto py-8 px-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </Link>
          
          <Button 
            onClick={resetGame}
            variant="outline" 
            className="text-white border-white hover:bg-white hover:text-primary"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Tekrar Oyna
          </Button>
        </div>

        {/* Game Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-xl">
            Yazılım Geliştirme Adımları 👨‍💻
          </h1>
          <p className="text-xl text-white/90 drop-shadow-lg max-w-2xl mx-auto">
            Kod blokları doğru sıraya koy! Yazılım geliştirmenin temel adımlarını öğren.
          </p>
        </motion.div>

        {/* Game Area */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Blokları Doğru Sıraya Koy! 🧩
            </h3>
            
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <motion.div
                  key={block.id}
                  layout
                  whileHover={{ scale: selectedBlock ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    p-4 rounded-2xl cursor-pointer transition-all duration-300
                    ${selectedBlock === block.id 
                      ? 'bg-white text-primary scale-105 shadow-glow' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                    }
                    ${isComplete ? 'bg-secondary/80 text-white' : ''}
                  `}
                  onClick={() => {
                    if (!isComplete) {
                      if (selectedBlock === null) {
                        setSelectedBlock(block.id);
                      } else if (selectedBlock === block.id) {
                        setSelectedBlock(null);
                      } else {
                        const fromIndex = blocks.findIndex(b => b.id === selectedBlock);
                        moveBlock(fromIndex, index);
                      }
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{block.text}</span>
                    {isComplete && block.order === correctOrder[index].order && (
                      <CheckCircle className="w-6 h-6 text-white" />
                    )}
                    {isComplete && block.order !== correctOrder[index].order && (
                      <XCircle className="w-6 h-6 text-red-300" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {!isComplete && (
              <p className="text-white/80 text-center mt-6 text-sm">
                💡 İpucu: Önce bir bloğa tıkla, sonra yerine koymak istediğin yere tıkla!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YazilimOyunu;