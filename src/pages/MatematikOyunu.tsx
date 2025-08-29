import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Hammer, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

interface BridgePiece {
  id: string;
  question: string;
  answer: number;
  options: number[];
  isCorrect?: boolean;
}

interface GameState {
  bridgePieces: BridgePiece[];
  currentPiece: number;
  collectedPieces: BridgePiece[];
  lives: number;
  score: number;
  level: number;
}

const MatematikOyunu = () => {
  const [gameState, setGameState] = useState<GameState>({
    bridgePieces: [],
    currentPiece: 0,
    collectedPieces: [],
    lives: 3,
    score: 0,
    level: 1
  });

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const generateQuestion = (level: number) => {
    const maxNum = level * 20;
    const minNum = level * 5;
    
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * (level >= 3 ? 3 : 2))];
    
    let num1, num2, answer, question;
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * maxNum) + minNum;
        num2 = Math.floor(Math.random() * maxNum) + minNum;
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case '-':
        num1 = Math.floor(Math.random() * maxNum) + minNum;
        num2 = Math.floor(Math.random() * (num1 - minNum)) + minNum;
        answer = num1 - num2;
        question = `${num1} - ${num2}`;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 12) + 2;
        num2 = Math.floor(Math.random() * 12) + 2;
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
      default:
        num1 = 0;
        num2 = 0;
        answer = 0;
        question = '';
    }

    // Yanlış seçenekler oluştur
    const wrongOptions = [];
    for (let i = 0; i < 3; i++) {
      let wrong;
      do {
        wrong = answer + (Math.floor(Math.random() * 20) - 10);
      } while (wrong === answer || wrong < 0 || wrongOptions.includes(wrong));
      wrongOptions.push(wrong);
    }

    const options = [answer, ...wrongOptions].sort((a, b) => Math.random() - 0.5);

    return {
      id: Math.random().toString(36).substr(2, 9),
      question,
      answer,
      options
    };
  };

  const generateBridgePieces = (level: number) => {
    const pieces = [];
    const pieceCount = Math.min(5 + level, 8);
    
    for (let i = 0; i < pieceCount; i++) {
      pieces.push(generateQuestion(level));
    }
    
    return pieces;
  };

  const initializeGame = () => {
    const pieces = generateBridgePieces(gameState.level);
    setGameState(prev => ({
      ...prev,
      bridgePieces: pieces,
      currentPiece: 0,
      collectedPieces: []
    }));
    setSelectedAnswer(null);
    setIsComplete(false);
  };

  const handleAnswerSelect = (answer: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const currentQuestion = gameState.bridgePieces[gameState.currentPiece];
    const isCorrect = answer === currentQuestion.answer;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setShowFeedback(true);
    
    setTimeout(() => {
      if (isCorrect) {
        // Doğru cevap - köprü parçası topla
        const newCollectedPieces = [...gameState.collectedPieces, { ...currentQuestion, isCorrect: true }];
        const newScore = gameState.score + (gameState.level * 10);
        
        if (gameState.currentPiece + 1 >= gameState.bridgePieces.length) {
          // Level tamamlandı
          setIsComplete(true);
          setGameState(prev => ({
            ...prev,
            collectedPieces: newCollectedPieces,
            score: newScore,
            level: prev.level + 1
          }));
        } else {
          // Sonraki soruya geç
          setGameState(prev => ({
            ...prev,
            collectedPieces: newCollectedPieces,
            currentPiece: prev.currentPiece + 1,
            score: newScore
          }));
        }
      } else {
        // Yanlış cevap - can kaybı
        const newLives = gameState.lives - 1;
        if (newLives <= 0) {
          // Oyun bitti
          resetGame();
        } else {
          setGameState(prev => ({ ...prev, lives: newLives }));
        }
      }
      
      setShowFeedback(false);
      setSelectedAnswer(null);
    }, 2000);
  };

  const nextLevel = () => {
    initializeGame();
    setIsComplete(false);
  };

  const resetGame = () => {
    setGameState({
      bridgePieces: [],
      currentPiece: 0,
      collectedPieces: [],
      lives: 3,
      score: 0,
      level: 1
    });
    setSelectedAnswer(null);
    setFeedback(null);
    setShowFeedback(false);
    setIsComplete(false);
    setTimeout(initializeGame, 100);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  if (gameState.bridgePieces.length === 0) {
    return <div className="min-h-screen bg-gradient-math font-fun flex items-center justify-center">
      <div className="text-white text-2xl">Köprü inşa ediliyor... 🏗️</div>
    </div>;
  }

  const currentQuestion = gameState.bridgePieces[gameState.currentPiece];

  return (
    <div className="min-h-screen bg-gradient-math font-fun relative overflow-hidden">
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
                  <Hammer className="w-20 h-20 mx-auto text-secondary mb-4" />
                  <h3 className="text-3xl font-bold text-secondary mb-2">Harika! 🔨</h3>
                  <p className="text-lg text-muted-foreground">Köprü parçası kazandın!</p>
                </>
              ) : (
                <>
                  <XCircle className="w-20 h-20 mx-auto text-destructive mb-4" />
                  <h3 className="text-3xl font-bold text-destructive mb-2">Köprü Yıkıldı! 💥</h3>
                  <p className="text-lg text-muted-foreground">
                    Doğru cevap: {currentQuestion.answer}
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Complete Modal */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md mx-4"
            >
              <CheckCircle className="w-20 h-20 mx-auto text-secondary mb-4" />
              <h3 className="text-3xl font-bold text-primary mb-4">Köprü Tamamlandı! 🌉</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Level {gameState.level - 1} başarıyla tamamlandı!
              </p>
              <div className="flex gap-3">
                <Button onClick={nextLevel} className="flex-1">
                  Sonraki Level
                </Button>
                <Button onClick={resetGame} variant="outline" className="flex-1">
                  Yeni Oyun
                </Button>
              </div>
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

        {/* Score & Stats */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center gap-4 mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
              <span className="text-xl font-bold text-white">
                Skor: {gameState.score} 🏆
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
              <span className="text-xl font-bold text-white">
                Level: {gameState.level}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
              <span className="text-xl font-bold text-white">
                Can: {'❤️'.repeat(gameState.lives)}
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-xl">
            Köprü İnşaatçısı 🌉
          </h1>
          <p className="text-xl text-white/90 drop-shadow-lg">
            Matematik sorularını çözerek köprüyü tamamla!
          </p>
        </motion.div>

        {/* Bridge Visualization */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              Köprü İnşaatı 🏗️
            </h3>
            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
              {gameState.bridgePieces.map((piece, index) => (
                <motion.div
                  key={piece.id}
                  className={`
                    w-12 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                    ${index < gameState.collectedPieces.length 
                      ? 'bg-secondary text-white' 
                      : index === gameState.currentPiece
                        ? 'bg-yellow-400 text-black animate-pulse'
                        : 'bg-white/20 text-white'
                    }
                  `}
                  animate={index === gameState.currentPiece ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {index < gameState.collectedPieces.length ? '✓' : index + 1}
                </motion.div>
              ))}
            </div>
            <div className="text-center text-white/80 text-sm">
              {gameState.collectedPieces.length}/{gameState.bridgePieces.length} parça toplandı
            </div>
          </div>
        </div>

        {/* Current Question */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center mb-6"
          >
            <div className="mb-6">
              <span className="text-sm text-white/70 font-semibold">
                Soru {gameState.currentPiece + 1}/{gameState.bridgePieces.length}
              </span>
            </div>
            
            <motion.div
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-5xl md:text-6xl font-bold text-white mb-8"
            >
              {currentQuestion.question} = ?
            </motion.div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                  className={`
                    p-6 rounded-2xl text-2xl font-bold transition-all duration-300
                    ${selectedAnswer === option
                      ? feedback === 'correct' 
                        ? 'bg-secondary text-white scale-105' 
                        : 'bg-destructive text-white scale-105'
                      : selectedAnswer === null
                        ? 'bg-white/20 text-white hover:bg-white/30'
                        : 'bg-white/10 text-white/50'
                    }
                    disabled:cursor-not-allowed
                  `}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <p className="text-white/80 text-center mt-8 text-sm">
          💡 İpucu: Doğru cevapları vererek köprü parçalarını topla! Yanlış cevap köprüyü yıkar.
        </p>
      </div>
    </div>
  );
};

export default MatematikOyunu;