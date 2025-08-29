import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Apple, Banana, Cherry, Grape, Pizza, Rocket, Sun, Anchor, Bird, Bomb, Bone, Book, Briefcase, 
  Car, Cat, Cloud, Clover, Coffee, Cookie, Crown, Diamond, Dog, Droplet, Egg, Fish, Flag, FlaskConical, 
  Gift, Glasses, Globe, Heart, Home, Key, Leaf, Lightbulb, Lock, Map, Mic, Moon, Mouse, Music, 
  Package, Paintbrush, Palmtree, Plane, Puzzle, Rat, School, Scissors, Shell, Ship, Shirt, ShoppingCart, 
  Smile, Snowflake, Speaker, Star, Store, Sword, ToyBrick, Train, Trash, TreePine, Trophy, Umbrella, 
  Wallet, Watch, Wind, Wine, Zap 
} from 'lucide-react';

// --- TYPES --- //
type GameObject = { id: number; Icon: React.ElementType; };
type GameState = 'start' | 'memorize' | 'play' | 'result' | 'gameOver';
type ResultDetails = { correctSelections: number[]; incorrectSelections: number[]; missed: number[]; };

// --- CONSTANTS --- //
const ALL_ICONS = [
  Apple, Banana, Cherry, Grape, Pizza, Rocket, Sun, Anchor, Bird, Bomb, Bone, Book, Briefcase, Car, Cat, 
  Cloud, Clover, Coffee, Cookie, Crown, Diamond, Dog, Droplet, Egg, Fish, Flag, FlaskConical, Gift, 
  Glasses, Globe, Heart, Home, Key, Leaf, Lightbulb, Lock, Map, Mic, Moon, Mouse, Music, Package, 
  Paintbrush, Palmtree, Plane, Puzzle, Rat, School, Scissors, Shell, Ship, Shirt, ShoppingCart, Smile, 
  Snowflake, Speaker, Star, Store, Sword, ToyBrick, Train, Trash, TreePine, Trophy, Umbrella, Wallet, 
  Watch, Wind, Wine, Zap
];

const GAME_CONFIG = {
  memorizeTime: 5,
  numObjects: 6,
  numChanged: 1,
  totalLives: 5
};

// --- COMPONENT --- //
const OdakAvcisi = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(GAME_CONFIG.totalLives);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.memorizeTime);

  const [memorizeObjects, setMemorizeObjects] = useState<GameObject[]>([]);
  const [playObjects, setPlayObjects] = useState<GameObject[]>([]);
  const [addedObjects, setAddedObjects] = useState<number[]>([]);
  
  const [userSelection, setUserSelection] = useState<number[]>([]);
  const [resultDetails, setResultDetails] = useState<ResultDetails | null>(null);

  const setupGame = useCallback(() => {
    const config = GAME_CONFIG;
    
    const shuffledIcons = [...ALL_ICONS].sort(() => 0.5 - Math.random());
    
    const initialIcons = shuffledIcons.slice(0, config.numObjects);
    const newIconsForAdding = shuffledIcons.slice(config.numObjects, config.numObjects + config.numChanged);

    const initialGameObjects = initialIcons.map((Icon, i) => ({ id: i, Icon }));
    const removedObjectIndices = [...Array(initialGameObjects.length).keys()].sort(() => 0.5 - Math.random()).slice(0, config.numChanged);
    const removedObjects = initialGameObjects.filter((_, i) => removedObjectIndices.includes(i));
    
    const keptObjects = initialGameObjects.filter((o) => !removedObjects.some(r => r.id === o.id));
    const addedGameObjects = newIconsForAdding.map((Icon, i) => ({ id: 1000 + i, Icon })); // Use high IDs to ensure uniqueness

    setMemorizeObjects(initialGameObjects);
    setAddedObjects(addedGameObjects.map(o => o.id));
    setPlayObjects([...keptObjects, ...addedGameObjects].sort(() => 0.5 - Math.random()));
    
    setUserSelection([]);
    setResultDetails(null);
    setTimeLeft(config.memorizeTime);
    setGameState('memorize');
  }, []);

  // Memorize Timer Effect
  useEffect(() => {
    if (gameState === 'memorize' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'memorize' && timeLeft === 0) {
      setGameState('play');
    }
  }, [gameState, timeLeft]);

  const handleObjectClick = (id: number) => {
    // Buton titremesi efekti için animasyon tetikleyicisi
    const button = document.getElementById(`icon-${id}`);
    if (button) {
      button.classList.add('animate-pulse');
      setTimeout(() => {
        button.classList.remove('animate-pulse');
      }, 300);
    }
    
    setUserSelection(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const correctSelections = userSelection.filter(id => addedObjects.includes(id));
    const incorrectSelections = userSelection.filter(id => !addedObjects.includes(id));
    const missed = addedObjects.filter(id => !userSelection.includes(id));

    // Temel puanlama: doğru seçim +10, yanlış seçim -5
    const baseScore = (correctSelections.length * 10) - (incorrectSelections.length * 5);
    
    // Minimum puan 0 olacak şekilde ayarla
    const finalScore = Math.max(0, baseScore);
    
    setScore(s => s + finalScore);
    setResultDetails({ correctSelections, incorrectSelections, missed });
    
    // Can kontrolü
    const isCorrect = correctSelections.length === GAME_CONFIG.numChanged && 
                     incorrectSelections.length === 0;
    
    if (!isCorrect) {
      // Yanlış cevap verildiğinde can azalt
      setLives(prevLives => {
        const newLives = prevLives - 1;
        if (newLives <= 0) {
          // Canlar bitti, oyun bitti
          setGameState('gameOver');
        } else {
          // Hala can var, sonuç ekranına git
          setGameState('result');
        }
        return newLives;
      });
    } else {
      // Doğru cevap verildiğinde doğrudan sonuç ekranına git
      setGameState('result');
    }
  };

  const handleRestart = () => {
    setScore(0);
    setLives(GAME_CONFIG.totalLives);
    setGameState('start');
  };

  const renderGrid = (objects: GameObject[], clickable: boolean, showResults: boolean) => (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      {objects.map(({ id, Icon }) => {
        const isSelected = userSelection.includes(id);
        let resultClass = '';
        if (showResults) {
          if (resultDetails?.correctSelections.includes(id)) resultClass = 'ring-4 ring-green-500 bg-green-100 dark:bg-green-900';
          else if (resultDetails?.incorrectSelections.includes(id)) resultClass = 'ring-4 ring-red-500 bg-red-100 dark:bg-red-900';
          else if (resultDetails?.missed.includes(id)) resultClass = 'ring-4 ring-yellow-500';
        }

        return (
          <motion.div 
            key={id} 
            layout 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            whileHover={clickable ? { scale: 1.05 } : {}}
            whileTap={clickable ? { scale: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button
              id={`icon-${id}`}
              variant="outline"
              onClick={() => clickable && handleObjectClick(id)}
              className={cn(
                'w-full h-full aspect-square flex items-center justify-center p-4 transition-all duration-200 rounded-2xl shadow-lg',
                clickable && 'cursor-pointer hover:shadow-xl',
                isSelected && !showResults && 'ring-4 ring-blue-500 bg-blue-100 dark:bg-blue-900',
                resultClass
              )}
              style={{ minHeight: '100px', minWidth: '100px' }}
            >
              <Icon 
                className={cn(
                  'transition-all duration-200',
                  showResults && resultDetails?.missed.includes(id) && 'opacity-50'
                )} 
                strokeWidth={1.5} 
                style={{ width: '60px', height: '60px' }} 
              />
            </Button>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-2 md:p-4 font-fun relative overflow-hidden">
      {/* Dekoratif arka plan öğeleri */}
      <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-purple-300/30 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-blue-300/30 blur-xl"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-pink-300/30 blur-xl"></div>
      
      <Card className="w-full max-w-4xl shadow-2xl rounded-3xl overflow-hidden border-0 bg-white/90 dark:bg-gray-800/95 backdrop-blur-lg relative z-10">
        <CardHeader className="text-center pb-2 pt-5 relative">
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1, duration: 2 }}
          >
            <div className="text-8xl font-bold text-purple-500/10 select-none">👁️</div>
          </motion.div>
          
          <CardTitle className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 relative z-10">
            Odak Avcısı
          </CardTitle>
          <div className="flex justify-center gap-7 mt-4">
            <motion.div 
              className="bg-green-100 dark:bg-green-900/50 px-4 py-2 rounded-full"
              whileHover={{ scale: 1.1 }}
            >
              <span className="font-bold text-green-700 dark:text-green-300">Skor: {score}</span>
            </motion.div>
            {gameState !== 'start' && (
              <motion.div 
                className="bg-red-100 dark:bg-red-900/50 px-3 py-2 rounded-full flex items-center"
                whileHover={{ scale: 1.1 }}
              >
                {[...Array(GAME_CONFIG.totalLives)].map((_, i) => (
                  <Heart 
                    key={i} 
                    className={`w-5 h-5 ${i < lives ? 'text-red-500 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                  />
                ))}
              </motion.div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[450px] py-6">
          <AnimatePresence mode="wait">
            {gameState === 'start' && (
              <motion.div 
                key="start" 
                className="text-center flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h2 
                  className="text-2xl md:text-3xl mb-5 font-bold text-gray-700 dark:text-gray-300 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  Odak Avcısına Hoş Geldin!
                </motion.h2>
                <div className="mb-5 text-lg">
                  <p className="mb-2 font-semibold">3x3 ızgarada gösterilen 6 ikonu ezberle</p>
                  <p className="mb-2 font-semibold">Sonra yeni gelen ikonu bul</p>
                  <p className="font-semibold">5 canın var, dikkatli ol!</p>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    onClick={setupGame}
                    className="px-10 py-7 text-2xl rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg"
                  >
                    Oyunu Başlat
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {gameState === 'memorize' && (
              <motion.div 
                key="memorize" 
                className="w-full text-center flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.h2 
                  className="text-2xl md:text-3xl mb-5 font-bold text-gray-700 dark:text-gray-300 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
                  animate={{ scale: timeLeft <= 3 ? [1, 1.1, 1] : 1 }}
                  transition={{ repeat: timeLeft <= 3 ? Infinity : 0, duration: 0.5 }}
                >
                  Bu nesneleri ezberle!{" "}
                  <motion.span 
                    className="text-red-500 font-bold"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      textShadow: [
                        "0 0 0px rgba(239, 68, 68, 0)",
                        "0 0 10px rgba(239, 68, 68, 0.5)",
                        "0 0 0px rgba(239, 68, 68, 0)"
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    Süre: {timeLeft}s
                  </motion.span>
                </motion.h2>
                <div className="mb-4">
                  <div className="inline-flex flex-wrap justify-center gap-2 bg-purple-100 dark:bg-purple-900/50 px-4 py-2 rounded-full">
                    <span className="font-bold">
                      Nesne: <span className="text-blue-600">{GAME_CONFIG.numObjects}</span>
                    </span>
                    <span className="font-bold">
                      Değişen: <span className="text-red-600">{GAME_CONFIG.numChanged}</span>
                    </span>
                  </div>
                </div>
                <div className="mb-5">
                  {renderGrid(memorizeObjects, false, false)}
                </div>
              </motion.div>
            )}

            {gameState === 'play' && (
              <motion.div 
                key="play" 
                className="w-full text-center flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl md:text-3xl mb-5 font-bold text-gray-700 dark:text-gray-300 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">Yeni eklenen nesneleri seç.</h2>
                <div className="mb-4">
                  <div className="inline-flex flex-wrap justify-center gap-2 bg-purple-100 dark:bg-purple-900/50 px-4 py-2 rounded-full">
                    <span className="font-bold">
                      Bulman gereken: <span className="text-red-600">{GAME_CONFIG.numChanged}</span>
                    </span>
                  </div>
                </div>
                <div className="mb-5">
                  {renderGrid(playObjects, true, false)}
                </div>
                <Button 
                  size="lg" 
                  onClick={handleSubmit} 
                  className="mt-4 px-8 py-6 text-2xl rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  Seçimleri Onayla
                </Button>
              </motion.div>
            )}

            {gameState === 'result' && (
              <motion.div 
                key="result" 
                className="w-full text-center flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h2 
                  className="text-2xl md:text-3xl mb-5 font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  Sonuçlar
                </motion.h2>
                <div className="mb-5">
                  <p className="text-lg font-bold">
                    Skor: <span className="text-green-600">{score}</span>
                  </p>
                  <div className="mt-3 flex justify-center gap-4 text-sm">
                    <span className="bg-green-100 dark:bg-green-900/50 px-3 py-1 rounded font-bold">
                      Doğru: {resultDetails?.correctSelections.length || 0}
                    </span>
                    <span className="bg-red-100 dark:bg-red-900/50 px-3 py-1 rounded font-bold">
                      Yanlış: {resultDetails?.incorrectSelections.length || 0}
                    </span>
                    <span className="bg-yellow-100 dark:bg-yellow-900/50 px-3 py-1 rounded font-bold">
                      Kaçırılan: {resultDetails?.missed.length || 0}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <div className="bg-red-100 dark:bg-red-900/50 px-4 py-2 rounded-full inline-flex items-center">
                      {[...Array(GAME_CONFIG.totalLives)].map((_, i) => (
                        <Heart 
                          key={i} 
                          className={`w-5 h-5 ${i < lives ? 'text-red-500 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  {lives > 0 ? (
                    <p className="mt-4 text-lg font-bold text-green-600">
                      {resultDetails?.correctSelections.length === GAME_CONFIG.numChanged && resultDetails?.incorrectSelections.length === 0 
                        ? "Harika! Doğru bildin!" 
                        : "Hay aksi! Bir can kaybettin."}
                    </p>
                  ) : (
                    <p className="mt-4 text-lg font-bold text-red-600">
                      Canların bitti! Oyun sona erdi.
                    </p>
                  )}
                </div>
                <div className="mb-5">
                  {renderGrid(playObjects, false, true)}
                </div>
                <motion.div 
                  className="mt-6 flex flex-col sm:flex-row gap-5 justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      onClick={setupGame}
                      className="px-8 py-6 text-2xl rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg"
                    >
                      Sonraki Tur
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      onClick={handleRestart}
                      className="px-8 py-6 text-2xl rounded-full bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 shadow-lg"
                    >
                      Ana Menü
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {gameState === 'gameOver' && (
              <motion.div 
                key="gameOver" 
                className="text-center flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h2 
                  className="text-3xl md:text-4xl mb-6 font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  Oyun Bitti!
                </motion.h2>
                <div className="mb-6 text-xl">
                  <p className="mb-3 font-bold">Toplam Skor: <span className="text-green-600">{score}</span></p>
                  <p className="mb-3 font-bold">
                    Can: 
                    {Array.from({ length: GAME_CONFIG.totalLives }).map((_, i) => (
                      <Heart 
                        key={i} 
                        className={`w-6 h-6 inline mx-1 ${i < lives ? 'text-red-500 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                      />
                    ))}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-5 mt-7">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      onClick={handleRestart}
                      className="px-10 py-7 text-2xl rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg"
                    >
                      Yeniden Oyna
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default OdakAvcisi;