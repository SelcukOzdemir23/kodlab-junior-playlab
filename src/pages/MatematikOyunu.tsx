import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

interface Question {
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
}

const MatematikOyunu = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question>({ num1: 0, num2: 0, operator: '+', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 30) + 1;
    const operator = Math.random() > 0.5 ? '+' : '-';
    
    let answer;
    if (operator === '+') {
      answer = num1 + num2;
    } else {
      // Negatif sonuç olmasın diye büyük sayıdan küçüğünü çıkaralım
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      answer = larger - smaller;
      setCurrentQuestion({ num1: larger, num2: smaller, operator, answer });
      return;
    }
    
    setCurrentQuestion({ num1, num2, operator, answer });
  };

  const checkAnswer = () => {
    const userNum = parseInt(userAnswer);
    const isCorrect = userNum === currentQuestion.answer;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setShowFeedback(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    setTotalQuestions(totalQuestions + 1);
    
    setTimeout(() => {
      setShowFeedback(false);
      setUserAnswer('');
      generateQuestion();
    }, 2000);
  };

  const resetGame = () => {
    setScore(0);
    setTotalQuestions(0);
    setUserAnswer('');
    setFeedback(null);
    setShowFeedback(false);
    generateQuestion();
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleNumberClick = (num: number) => {
    if (userAnswer.length < 3) {
      setUserAnswer(userAnswer + num);
    }
  };

  const clearAnswer = () => {
    setUserAnswer('');
  };

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
                  <CheckCircle className="w-20 h-20 mx-auto text-secondary mb-4" />
                  <h3 className="text-3xl font-bold text-secondary mb-2">Doğru! 🎉</h3>
                  <p className="text-lg text-muted-foreground">Harika hesaplama!</p>
                </>
              ) : (
                <>
                  <XCircle className="w-20 h-20 mx-auto text-destructive mb-4" />
                  <h3 className="text-3xl font-bold text-destructive mb-2">Yanlış 😅</h3>
                  <p className="text-lg text-muted-foreground">
                    Doğru cevap: {currentQuestion.answer}
                  </p>
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
              Skor: {score}/{totalQuestions} 🏆
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-xl">
            Matematik Ustası 🔢
          </h1>
          <p className="text-xl text-white/90 drop-shadow-lg">
            Matematik sorularını çöz ve puanını artır!
          </p>
        </motion.div>

        {/* Game Area */}
        <div className="max-w-lg mx-auto">
          <motion.div
            key={`${currentQuestion.num1}-${currentQuestion.num2}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-6xl font-bold text-white mb-8"
            >
              {currentQuestion.num1} {currentQuestion.operator} {currentQuestion.num2} = ?
            </motion.div>
            
            <div className="mb-6">
              <div className="bg-white rounded-2xl p-4 text-3xl font-bold text-primary min-h-[60px] flex items-center justify-center">
                {userAnswer || '?'}
              </div>
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleNumberClick(num)}
                  className="bg-white/20 text-white text-xl font-bold py-4 rounded-xl hover:bg-white/30 transition-colors"
                >
                  {num}
                </motion.button>
              ))}
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNumberClick(0)}
                className="flex-1 bg-white/20 text-white text-xl font-bold py-4 rounded-xl hover:bg-white/30 transition-colors"
              >
                0
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={clearAnswer}
                className="flex-1 bg-destructive text-white text-xl font-bold py-4 rounded-xl hover:bg-destructive/80 transition-colors"
              >
                Sil
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={checkAnswer}
              disabled={!userAnswer}
              className="w-full mt-6 bg-secondary text-white text-xl font-bold py-4 rounded-xl hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cevapla! ✨
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MatematikOyunu;