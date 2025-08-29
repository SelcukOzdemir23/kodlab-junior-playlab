import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, CheckCircle, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

interface ColorShape {
  id: string;
  color: string;
  shape: 'circle' | 'square' | 'triangle' | 'hexagon';
  name: string;
}

const TasarimOyunu = () => {
  const shapes: ColorShape[] = [
    { id: '1', color: '#FF6B6B', shape: 'circle', name: 'Kırmızı Daire' },
    { id: '2', color: '#4ECDC4', shape: 'square', name: 'Turkuaz Kare' },
    { id: '3', color: '#45B7D1', shape: 'triangle', name: 'Mavi Üçgen' },
    { id: '4', color: '#96CEB4', shape: 'hexagon', name: 'Yeşil Altıgen' },
    { id: '5', color: '#FFEAA7', shape: 'circle', name: 'Sarı Daire' },
    { id: '6', color: '#DDA0DD', shape: 'square', name: 'Mor Kare' },
    { id: '7', color: '#98D8C8', shape: 'triangle', name: 'Mint Üçgen' },
    { id: '8', color: '#F7DC6F', shape: 'hexagon', name: 'Altın Altıgen' }
  ];

  const [targetShape, setTargetShape] = useState<ColorShape | null>(null);
  const [options, setOptions] = useState<ColorShape[]>([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const shuffleArray = (array: ColorShape[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const generateQuestion = () => {
    const shuffled = shuffleArray(shapes);
    const correct = shuffled[0];
    const incorrect = shuffled.slice(1, 4);
    
    setTargetShape(correct);
    setOptions(shuffleArray([correct, ...incorrect]));
  };

  const handleAnswer = (selectedShape: ColorShape) => {
    const isCorrect = selectedShape.id === targetShape?.id;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setShowFeedback(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    setTotalQuestions(totalQuestions + 1);
    
    setTimeout(() => {
      setShowFeedback(false);
      generateQuestion();
    }, 2000);
  };

  const resetGame = () => {
    setScore(0);
    setTotalQuestions(0);
    setFeedback(null);
    setShowFeedback(false);
    generateQuestion();
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const renderShape = (shape: ColorShape, size: number = 80) => {
    const baseClasses = `inline-block transition-all duration-300`;
    const style = { backgroundColor: shape.color, width: size, height: size };

    switch (shape.shape) {
      case 'circle':
        return (
          <div 
            className={`${baseClasses} rounded-full`}
            style={style}
          />
        );
      case 'square':
        return (
          <div 
            className={`${baseClasses} rounded-lg`}
            style={style}
          />
        );
      case 'triangle':
        return (
          <div 
            className={`${baseClasses}`}
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid ${shape.color}`,
            }}
          />
        );
      case 'hexagon':
        return (
          <div 
            className={`${baseClasses} relative`}
            style={{
              width: size * 0.866,
              height: size,
              backgroundColor: shape.color,
              margin: `${size * 0.25}px 0`,
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)'
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-design font-fun relative overflow-hidden">
      {/* Feedback Animation */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          >
            <motion.div
              animate={{ 
                rotate: feedback === 'correct' ? [0, 10, -10, 0] : [0, -5, 5, -5, 5, 0],
                scale: feedback === 'correct' ? [1, 1.1, 1] : [1, 0.9, 1.1, 0.9, 1]
              }}
              transition={{ repeat: 2, duration: 0.5 }}
              className="bg-white rounded-3xl p-8 text-center shadow-2xl"
            >
              {feedback === 'correct' ? (
                <>
                  <CheckCircle className="w-20 h-20 mx-auto text-secondary mb-4" />
                  <h3 className="text-3xl font-bold text-secondary mb-2">Mükemmel! 🎨</h3>
                  <p className="text-lg text-muted-foreground">Harika tasarım gözün var!</p>
                </>
              ) : (
                <>
                  <Palette className="w-20 h-20 mx-auto text-destructive mb-4" />
                  <h3 className="text-3xl font-bold text-destructive mb-2">Tekrar Dene! 🎯</h3>
                  <p className="text-lg text-muted-foreground">Doğru şekli bul!</p>
                </>
              )}
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
            Yeni Oyun
          </Button>
        </div>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 inline-block mb-4">
            <span className="text-2xl font-bold text-white">
              Skor: {score}/{totalQuestions} 🎨
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-xl">
            Tasarım Ustası 🎭
          </h1>
          <p className="text-xl text-white/90 drop-shadow-lg">
            Şekilleri ve renkleri eşleştir! Tasarım becerinı geliştir.
          </p>
        </motion.div>

        {/* Game Area */}
        <div className="max-w-2xl mx-auto">
          {targetShape && (
            <motion.div
              key={targetShape.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center mb-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                Bu şekli bul! 👆
              </h3>
              
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="flex justify-center mb-4"
              >
                {renderShape(targetShape, 120)}
              </motion.div>
              
              <p className="text-lg text-white/90 font-bold">
                {targetShape.name}
              </p>
            </motion.div>
          )}

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            {options.map((shape, index) => (
              <motion.div
                key={`${shape.id}-${index}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(shape)}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 cursor-pointer hover:bg-white/30 transition-all duration-300 text-center"
              >
                <div className="flex justify-center mb-3">
                  {renderShape(shape, 80)}
                </div>
                <p className="text-white font-semibold text-sm">
                  {shape.name}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="text-white/80 text-center mt-8 text-sm">
            💡 İpucu: Şekil ve rengi birlikte kontrol et!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TasarimOyunu;