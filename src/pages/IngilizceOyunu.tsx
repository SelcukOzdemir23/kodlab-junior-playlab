import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

interface WordPair {
  english: string;
  turkish: string;
  id: string;
}

const IngilizceOyunu = () => {
  const wordPairs: WordPair[] = [
    { id: '1', english: 'Cat', turkish: 'Kedi' },
    { id: '2', english: 'Dog', turkish: 'Köpek' },
    { id: '3', english: 'Book', turkish: 'Kitap' },
    { id: '4', english: 'House', turkish: 'Ev' },
    { id: '5', english: 'Car', turkish: 'Araba' },
    { id: '6', english: 'Apple', turkish: 'Elma' },
    { id: '7', english: 'Water', turkish: 'Su' },
    { id: '8', english: 'Sun', turkish: 'Güneş' }
  ];

  const [currentPairs, setCurrentPairs] = useState<WordPair[]>([]);
  const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
  const [selectedTurkish, setSelectedTurkish] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const startNewRound = () => {
    const roundPairs = shuffleArray(wordPairs).slice(0, 4);
    setCurrentPairs(roundPairs);
    setMatchedPairs([]);
    setSelectedEnglish(null);
    setSelectedTurkish(null);
    setIsComplete(false);
  };

  const checkMatch = () => {
    if (selectedEnglish && selectedTurkish) {
      const englishWord = currentPairs.find(pair => pair.id === selectedEnglish);
      const turkishWord = currentPairs.find(pair => pair.id === selectedTurkish);
      
      if (englishWord && turkishWord && englishWord.id === turkishWord.id) {
        setFeedback('correct');
        setMatchedPairs([...matchedPairs, englishWord.id]);
        setScore(score + 1);
        
        if (matchedPairs.length + 1 === currentPairs.length) {
          setIsComplete(true);
        }
      } else {
        setFeedback('incorrect');
      }
      
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedEnglish(null);
        setSelectedTurkish(null);
        if (feedback === 'correct' && matchedPairs.length + 1 === currentPairs.length) {
          setTimeout(startNewRound, 1000);
        }
      }, 1500);
    }
  };

  useEffect(() => {
    if (selectedEnglish && selectedTurkish) {
      checkMatch();
    }
  }, [selectedEnglish, selectedTurkish]);

  useEffect(() => {
    startNewRound();
  }, []);

  const resetGame = () => {
    setScore(0);
    setFeedback(null);
    setShowFeedback(false);
    startNewRound();
  };

  const englishWords = shuffleArray(currentPairs);
  const turkishWords = shuffleArray(currentPairs);

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
              className="bg-white rounded-3xl p-8 text-center shadow-2xl"
            >
              {feedback === 'correct' ? (
                <>
                  <CheckCircle className="w-20 h-20 mx-auto text-secondary mb-4" />
                  <h3 className="text-3xl font-bold text-secondary mb-2">Perfect! 🎉</h3>
                  <p className="text-lg text-muted-foreground">Harika eşleştirme!</p>
                </>
              ) : (
                <>
                  <XCircle className="w-20 h-20 mx-auto text-destructive mb-4" />
                  <h3 className="text-3xl font-bold text-destructive mb-2">Try Again! 😅</h3>
                  <p className="text-lg text-muted-foreground">Tekrar dene!</p>
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
              Score: {score} 🏆
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-xl">
            English Words 📚
          </h1>
          <p className="text-xl text-white/90 drop-shadow-lg">
            İngilizce kelimeleri Türkçe karşılıkları ile eşleştir!
          </p>
        </motion.div>

        {/* Game Area */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* English Words */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white text-center mb-6">
                English 🇺🇸
              </h3>
              {englishWords.map((pair) => (
                <motion.div
                  key={`en-${pair.id}`}
                  layout
                  whileHover={{ scale: matchedPairs.includes(pair.id) ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    p-4 rounded-2xl cursor-pointer transition-all duration-300 text-center
                    ${matchedPairs.includes(pair.id) 
                      ? 'bg-secondary text-white opacity-50 cursor-not-allowed' 
                      : selectedEnglish === pair.id
                        ? 'bg-white text-primary scale-105 shadow-glow'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }
                  `}
                  onClick={() => {
                    if (!matchedPairs.includes(pair.id) && !selectedTurkish) {
                      setSelectedEnglish(selectedEnglish === pair.id ? null : pair.id);
                    }
                  }}
                >
                  <span className="text-xl font-bold">{pair.english}</span>
                  {matchedPairs.includes(pair.id) && (
                    <CheckCircle className="w-6 h-6 mx-auto mt-2 text-white" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Turkish Words */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white text-center mb-6">
                Türkçe 🇹🇷
              </h3>
              {turkishWords.map((pair) => (
                <motion.div
                  key={`tr-${pair.id}`}
                  layout
                  whileHover={{ scale: matchedPairs.includes(pair.id) ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    p-4 rounded-2xl cursor-pointer transition-all duration-300 text-center
                    ${matchedPairs.includes(pair.id) 
                      ? 'bg-secondary text-white opacity-50 cursor-not-allowed' 
                      : selectedTurkish === pair.id
                        ? 'bg-white text-primary scale-105 shadow-glow'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }
                  `}
                  onClick={() => {
                    if (!matchedPairs.includes(pair.id) && !selectedEnglish) {
                      setSelectedTurkish(selectedTurkish === pair.id ? null : pair.id);
                    }
                  }}
                >
                  <span className="text-xl font-bold">{pair.turkish}</span>
                  {matchedPairs.includes(pair.id) && (
                    <CheckCircle className="w-6 h-6 mx-auto mt-2 text-white" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-white/80 text-center mt-8 text-sm">
            💡 İpucu: Önce İngilizce kelimeye, sonra Türkçe karşılığına tıkla!
          </p>
        </div>
      </div>
    </div>
  );
};

export default IngilizceOyunu;