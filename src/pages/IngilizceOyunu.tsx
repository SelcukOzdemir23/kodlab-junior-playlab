import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Map, Heart, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

interface AdventureScenario {
  id: string;
  scene: string;
  description: string;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    response: string;
  }[];
  emoji: string;
}

interface GameState {
  currentScenario: number;
  score: number;
  lives: number;
  position: number;
  islandComplete: boolean;
  level: number;
}

const IngilizceOyunu = () => {
  const scenarios: AdventureScenario[] = [
    {
      id: '1',
      scene: 'Sahilde',
      description: 'Kodlab Junior bir adada kayboldu! Sahilde yürürken bir hazine sandığı buldu.',
      question: 'What did Junior find?',
      options: [
        { text: 'A treasure chest', isCorrect: true, response: 'Perfect! You found the treasure!' },
        { text: 'A big rock', isCorrect: false, response: 'Not quite! Try again.' },
        { text: 'A tree', isCorrect: false, response: 'That\'s not right!' },
        { text: 'A boat', isCorrect: false, response: 'Close, but no!' }
      ],
      emoji: '🏖️'
    },
    {
      id: '2',
      scene: 'Ormanda',
      description: 'Junior ormana girdi ve aç bir ayıyla karşılaştı!',
      question: 'The bear is... what?',
      options: [
        { text: 'Hungry', isCorrect: true, response: 'Yes! The bear wants food!' },
        { text: 'Happy', isCorrect: false, response: 'Not exactly...' },
        { text: 'Sleeping', isCorrect: false, response: 'No, it\'s awake!' },
        { text: 'Small', isCorrect: false, response: 'This bear is big!' }
      ],
      emoji: '🌲'
    },
    {
      id: '3',
      scene: 'Dağda',
      description: 'Dağın tepesinde Junior bir köprü gördü ama çok yüksekti.',
      question: 'The bridge is very...',
      options: [
        { text: 'High', isCorrect: true, response: 'Correct! It\'s very high up!' },
        { text: 'Low', isCorrect: false, response: 'No, it\'s the opposite!' },
        { text: 'Wide', isCorrect: false, response: 'That\'s not the problem...' },
        { text: 'Short', isCorrect: false, response: 'Not quite!' }
      ],
      emoji: '⛰️'
    },
    {
      id: '4',
      scene: 'Nehirde',
      description: 'Junior nehrin yanında durdu. Su çok soğuktu.',
      question: 'The water is very...',
      options: [
        { text: 'Cold', isCorrect: true, response: 'Right! Brrr, it\'s cold!' },
        { text: 'Hot', isCorrect: false, response: 'No, it\'s the opposite!' },
        { text: 'Sweet', isCorrect: false, response: 'Water isn\'t sweet!' },
        { text: 'Loud', isCorrect: false, response: 'Water doesn\'t make noise!' }
      ],
      emoji: '🏞️'
    },
    {
      id: '5',
      scene: 'Limanda',
      description: 'Sonunda Junior limana vardı! Orada kurtarma gemisi vardı.',
      question: 'At the port, there is a rescue...',
      options: [
        { text: 'Ship', isCorrect: true, response: 'Yes! The ship will save Junior!' },
        { text: 'Car', isCorrect: false, response: 'Cars don\'t work in water!' },
        { text: 'Plane', isCorrect: false, response: 'Planes don\'t dock at ports!' },
        { text: 'Train', isCorrect: false, response: 'Trains don\'t go on water!' }
      ],
      emoji: '🚢'
    }
  ];

  const [gameState, setGameState] = useState<GameState>({
    currentScenario: 0,
    score: 0,
    lives: 3,
    position: 0,
    islandComplete: false,
    level: 1
  });

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleAnswerSelect = (optionIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(optionIndex);
    const currentScenario = scenarios[gameState.currentScenario];
    const selectedOption = currentScenario.options[optionIndex];
    const isCorrect = selectedOption.isCorrect;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setFeedbackMessage(selectedOption.response);
    setShowFeedback(true);
    
    setTimeout(() => {
      if (isCorrect) {
        const newScore = gameState.score + 20;
        const newPosition = gameState.position + 1;
        
        if (gameState.currentScenario + 1 >= scenarios.length) {
          // Macera tamamlandı
          setGameState(prev => ({
            ...prev,
            score: newScore,
            position: newPosition,
            islandComplete: true
          }));
        } else {
          // Sonraki senaryoya geç
          setGameState(prev => ({
            ...prev,
            currentScenario: prev.currentScenario + 1,
            score: newScore,
            position: newPosition
          }));
        }
      } else {
        // Yanlış cevap - can kaybı
        const newLives = gameState.lives - 1;
        if (newLives <= 0) {
          // Oyun bitti
          resetGame();
        } else {
          setGameState(prev => ({ ...prev, lives: newLives, position: Math.max(0, prev.position - 1) }));
        }
      }
      
      setShowFeedback(false);
      setSelectedAnswer(null);
      setFeedbackMessage('');
    }, 2500);
  };

  const resetGame = () => {
    setGameState({
      currentScenario: 0,
      score: 0,
      lives: 3,
      position: 0,
      islandComplete: false,
      level: 1
    });
    setSelectedAnswer(null);
    setFeedback(null);
    setShowFeedback(false);
    setFeedbackMessage('');
  };

  const nextAdventure = () => {
    setGameState(prev => ({
      currentScenario: 0,
      score: prev.score,
      lives: 3,
      position: 0,
      islandComplete: false,
      level: prev.level + 1
    }));
  };

  const currentScenario = scenarios[gameState.currentScenario];

  return (
    <div className="min-h-screen bg-gradient-english font-fun relative overflow-hidden">
      {/* Feedback Animation */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          >
            <motion.div
              animate={{ 
                rotate: feedback === 'correct' ? [0, 10, -10, 0] : [0, -5, 5, -5, 5, 0],
                scale: feedback === 'correct' ? [1, 1.1, 1] : [1, 0.9, 1.1, 0.9, 1]
              }}
              transition={{ repeat: 2, duration: 0.5 }}
              className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md mx-4"
            >
              {feedback === 'correct' ? (
                <>
                  <CheckCircle className="w-20 h-20 mx-auto text-secondary mb-4" />
                  <h3 className="text-3xl font-bold text-secondary mb-2">Great! 🎉</h3>
                </>
              ) : (
                <>
                  <XCircle className="w-20 h-20 mx-auto text-destructive mb-4" />
                  <h3 className="text-3xl font-bold text-destructive mb-2">Oops! 😅</h3>
                </>
              )}
              <p className="text-lg text-muted-foreground">{feedbackMessage}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Adventure Complete Modal */}
      <AnimatePresence>
        {gameState.islandComplete && (
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
              <h3 className="text-3xl font-bold text-primary mb-4">Adventure Complete! 🏝️</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Harika! Kodlab Junior'ı kurtardın! 🎉
              </p>
              <div className="flex gap-3">
                <Button onClick={nextAdventure} className="flex-1">
                  Yeni Macera
                </Button>
                <Button onClick={resetGame} variant="outline" className="flex-1">
                  Tekrar Oyna
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
            Yeni Macera
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
                Score: {gameState.score} 🏆
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
              <span className="text-xl font-bold text-white">
                Lives: {'❤️'.repeat(gameState.lives)}
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-xl">
            Island Adventure 🏝️
          </h1>
          <p className="text-xl text-white/90 drop-shadow-lg">
            Kodlab Junior'ı kurtarmak için İngilizce sorularını cevaplayın!
          </p>
        </motion.div>

        {/* Adventure Path */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              Macera Yolu 🗺️
            </h3>
            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
              {scenarios.map((scenario, index) => (
                <motion.div
                  key={scenario.id}
                  className={`
                    w-16 h-16 rounded-full flex flex-col items-center justify-center text-xs font-bold
                    ${index < gameState.position 
                      ? 'bg-secondary text-white' 
                      : index === gameState.currentScenario
                        ? 'bg-yellow-400 text-black animate-pulse scale-110'
                        : 'bg-white/20 text-white'
                    }
                  `}
                  animate={index === gameState.currentScenario ? { scale: [1.1, 1.2, 1.1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <div className="text-lg">{scenario.emoji}</div>
                  <div className="text-xs">{index + 1}</div>
                </motion.div>
              ))}
            </div>
            <div className="text-center text-white/80 text-sm">
              {gameState.position}/{scenarios.length} lokasyon keşfedildi
            </div>
          </div>
        </div>

        {/* Current Scenario */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            key={currentScenario.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center"
          >
            <div className="text-6xl mb-4">{currentScenario.emoji}</div>
            
            <h3 className="text-3xl font-bold text-white mb-4">
              {currentScenario.scene}
            </h3>
            
            <p className="text-lg text-white/90 mb-6 leading-relaxed">
              {currentScenario.description}
            </p>
            
            <div className="bg-white/10 rounded-2xl p-6 mb-6">
              <h4 className="text-xl font-bold text-yellow-300 mb-4">
                {currentScenario.question}
              </h4>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentScenario.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: selectedAnswer === null ? 1.03 : 1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`
                    p-4 rounded-2xl text-lg font-semibold transition-all duration-300
                    ${selectedAnswer === index
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
                  {option.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <p className="text-white/80 text-center mt-8 text-sm">
          💡 İpucu: Doğru İngilizce cevapları seçerek Junior'ın macerasında ilerleyin!
        </p>
      </div>
    </div>
  );
};

export default IngilizceOyunu;