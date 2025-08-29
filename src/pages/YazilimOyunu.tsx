import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, CheckCircle, Code, Play, ArrowUp, ArrowDown, ArrowLeftIcon, ArrowRightIcon, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

interface CodeBlock {
  id: string;
  command: string;
  icon: React.ComponentType<any>;
  action: string;
  color: string;
}

interface GameState {
  playerX: number;
  playerY: number;
  targetX: number;
  targetY: number;
  maze: number[][];
  isWon: boolean;
  level: number;
}

const YazilimOyunu = () => {
  const commands: CodeBlock[] = [
    { id: '1', command: 'İleri Git', icon: ArrowUp, action: 'MOVE_FORWARD', color: 'bg-blue-500' },
    { id: '2', command: 'Sağa Dön', icon: ArrowRightIcon, action: 'TURN_RIGHT', color: 'bg-green-500' },
    { id: '3', command: 'Sola Dön', icon: ArrowLeftIcon, action: 'TURN_LEFT', color: 'bg-yellow-500' },
    { id: '4', command: 'Zıpla', icon: Zap, action: 'JUMP', color: 'bg-purple-500' }
  ];

  const mazes = [
    // Level 1 - Basit
    [
      [1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1],
      [1,0,1,0,1,2,1],
      [1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1]
    ],
    // Level 2 - Orta
    [
      [1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,1],
      [1,0,1,0,1,0,1,1,1],
      [1,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,1],
      [1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,0,2,1],
      [1,1,1,1,1,1,1,1,1]
    ]
  ];

  const [sequence, setSequence] = useState<CodeBlock[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    playerX: 1,
    playerY: 1,
    targetX: 5,
    targetY: 4,
    maze: mazes[0],
    isWon: false,
    level: 1
  });
  const [playerDirection, setPlayerDirection] = useState(0); // 0: kuzey, 1: doğu, 2: güney, 3: batı
  const [isExecuting, setIsExecuting] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const executeSequence = async () => {
    if (isExecuting || sequence.length === 0) return;
    
    setIsExecuting(true);
    let currentX = gameState.playerX;
    let currentY = gameState.playerY;
    let currentDirection = playerDirection;
    
    for (const command of sequence) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      switch (command.action) {
        case 'MOVE_FORWARD':
          const directions = [
            { x: 0, y: -1 }, // kuzey
            { x: 1, y: 0 },  // doğu
            { x: 0, y: 1 },  // güney
            { x: -1, y: 0 }  // batı
          ];
          const dir = directions[currentDirection];
          const newX = currentX + dir.x;
          const newY = currentY + dir.y;
          
          if (gameState.maze[newY] && gameState.maze[newY][newX] !== 1) {
            currentX = newX;
            currentY = newY;
          }
          break;
        case 'TURN_RIGHT':
          currentDirection = (currentDirection + 1) % 4;
          break;
        case 'TURN_LEFT':
          currentDirection = (currentDirection + 3) % 4;
          break;
        case 'JUMP':
          // Zıplama mantığı - bir engeli atlayabilir
          const jumpDir = [
            { x: 0, y: -2 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: -2, y: 0 }
          ][currentDirection];
          const jumpX = currentX + jumpDir.x;
          const jumpY = currentY + jumpDir.y;
          
          if (gameState.maze[jumpY] && gameState.maze[jumpY][jumpX] !== 1) {
            currentX = jumpX;
            currentY = jumpY;
          }
          break;
      }
      
      setGameState(prev => ({ ...prev, playerX: currentX, playerY: currentY }));
      setPlayerDirection(currentDirection);
    }
    
    // Hedefe varacağını kontrol et
    const targetFound = gameState.maze.find((row, y) =>
      row.find((cell, x) => cell === 2 && x === currentX && y === currentY)
    );
    
    if (targetFound) {
      setFeedback('correct');
      setScore(score + 100 * gameState.level);
      setGameState(prev => ({ ...prev, isWon: true }));
    } else {
      setFeedback('incorrect');
    }
    
    setShowFeedback(true);
    setIsExecuting(false);
    
    setTimeout(() => {
      setShowFeedback(false);
      if (targetFound && gameState.level < mazes.length) {
        nextLevel();
      } else if (targetFound) {
        resetGame();
      }
    }, 2000);
  };

  const nextLevel = () => {
    const newLevel = gameState.level + 1;
    const maze = mazes[newLevel - 1];
    const target = maze.find((row, y) => 
      row.find((cell, x) => cell === 2 ? { x, y } : null)
    );
    
    let targetX = 0, targetY = 0;
    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 2) {
          targetX = x;
          targetY = y;
        }
      });
    });

    setGameState({
      playerX: 1,
      playerY: 1,
      targetX,
      targetY,
      maze,
      isWon: false,
      level: newLevel
    });
    setPlayerDirection(0);
    setSequence([]);
  };

  const resetMaze = () => {
    setGameState(prev => ({
      ...prev,
      playerX: 1,
      playerY: 1,
      isWon: false
    }));
    setPlayerDirection(0);
    setSequence([]);
  };

  const addToSequence = (command: CodeBlock) => {
    if (sequence.length < 15) {
      setSequence([...sequence, command]);
    }
  };

  const removeFromSequence = (index: number) => {
    setSequence(sequence.filter((_, i) => i !== index));
  };

  const resetGame = () => {
    setScore(0);
    setSequence([]);
    setFeedback(null);
    setShowFeedback(false);
    setGameState({
      playerX: 1,
      playerY: 1,
      targetX: 5,
      targetY: 4,
      maze: mazes[0],
      isWon: false,
      level: 1
    });
    setPlayerDirection(0);
  };

  const getDirectionSymbol = () => {
    const symbols = ['↑', '→', '↓', '←'];
    return symbols[playerDirection];
  };

  return (
    <div className="min-h-screen bg-gradient-coding font-fun relative overflow-hidden">
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
                  <h3 className="text-3xl font-bold text-secondary mb-2">Harika! 🎉</h3>
                  <p className="text-lg text-muted-foreground">Kodlab Junior'ı kurtardın!</p>
                </>
              ) : (
                <>
                  <Code className="w-20 h-20 mx-auto text-destructive mb-4" />
                  <h3 className="text-3xl font-bold text-destructive mb-2">Denemeye Devam! 🤖</h3>
                  <p className="text-lg text-muted-foreground">Algoritmanı gözden geçir!</p>
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
              Skor: {score} | Level: {gameState.level} 🤖
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-xl">
            Labirent Kurtarma 🏰
          </h1>
          <p className="text-xl text-white/90 drop-shadow-lg">
            Kodlab Junior'ı labirentten çıkar! Komutları sırala ve algoritma oluştur.
          </p>
        </motion.div>

        {/* Game Area */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Maze */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              Labirent Haritası 🗺️
            </h3>
            <div className="grid gap-1 max-w-md mx-auto" style={{ gridTemplateColumns: `repeat(${gameState.maze[0].length}, 1fr)` }}>
              {gameState.maze.map((row, y) =>
                row.map((cell, x) => {
                  const isPlayer = gameState.playerX === x && gameState.playerY === y;
                  const isTarget = cell === 2;
                  
                  return (
                    <motion.div
                      key={`${x}-${y}`}
                      className={`
                        w-8 h-8 rounded-sm relative flex items-center justify-center text-xs font-bold
                        ${cell === 1 ? 'bg-gray-800' : 'bg-white/20'}
                        ${isTarget ? 'bg-yellow-400' : ''}
                      `}
                      animate={isPlayer ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ repeat: isPlayer ? Infinity : 0, duration: 1 }}
                    >
                      {isPlayer && (
                        <motion.div
                          className="absolute inset-0 bg-blue-500 rounded-sm flex items-center justify-center text-white text-lg"
                          animate={{ rotate: playerDirection * 90 }}
                        >
                          {getDirectionSymbol()}
                        </motion.div>
                      )}
                      {isTarget && !isPlayer && (
                        <div className="text-white text-lg">🏆</div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Command Area */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Player Sequence */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Algoritman 📝
              </h3>
              <div className="min-h-[120px] bg-white/5 rounded-2xl p-4 mb-4">
                {sequence.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {sequence.map((cmd, index) => (
                      <motion.div
                        key={`seq-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => removeFromSequence(index)}
                        className={`${cmd.color} text-white px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2`}
                      >
                        <cmd.icon className="w-4 h-4" />
                        {index + 1}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60 text-center py-12">
                    Komutları ekle ve algoritmanı oluştur! 👆
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={executeSequence}
                  disabled={sequence.length === 0 || isExecuting}
                  className="bg-secondary hover:bg-secondary/80 text-white font-bold py-2 px-6 rounded-2xl flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {isExecuting ? 'Çalışıyor...' : 'Algoritmayı Çalıştır!'}
                </Button>
                <Button
                  onClick={() => setSequence([])}
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-primary"
                >
                  Temizle
                </Button>
              </div>
            </div>

            {/* Command Blocks */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                Komut Blokları 🧩
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {commands.map((cmd) => (
                  <motion.div
                    key={cmd.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToSequence(cmd)}
                    className={`${cmd.color} text-white p-4 rounded-2xl cursor-pointer hover:opacity-80 transition-opacity text-center font-semibold text-sm flex flex-col items-center gap-2`}
                  >
                    <cmd.icon className="w-6 h-6" />
                    {cmd.command}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <p className="text-white/80 text-center mt-8 text-sm">
          💡 İpucu: Kodlab Junior'ı 🏆 işaretine götürmek için adım adım komutlar oluştur!
        </p>
      </div>
    </div>
  );
};

export default YazilimOyunu;