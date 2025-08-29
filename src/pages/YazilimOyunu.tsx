import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, RotateCcw, RotateCw, Play, Bot, Trophy, Square, ChevronsRight } from 'lucide-react';
import { toast } from "sonner"

// --- Tipler ve Sabitler ---
const GRID_SIZE = 11; // Tek sayı olmalı ki kenarlarda duvar kalsın
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Command = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT';
type Cell = {
  x: number;
  y: number;
  isWall: boolean;
  isFinish: boolean;
};
type GameState = 'idle' | 'running' | 'success' | 'fail';

const directionVectors = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const YazilimOyunu = () => {
  // --- State Tanımlamaları ---
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [playerDir, setPlayerDir] = useState<Direction>('RIGHT');
  const [commands, setCommands] = useState<Command[]>([]);
  const [gameState, setGameState] = useState<GameState>('idle');

  // --- Oyun Mantığı ---
  const resetGame = useCallback(() => {
    setPlayerPos({ x: 1, y: 1 });
    setPlayerDir('RIGHT');
    setCommands([]);
    setGameState('idle');
  }, []);

  // --- Labirent Üretimi ---
  const generateNewMaze = useCallback(() => {
    const newGrid: Cell[][] = Array(GRID_SIZE).fill(null).map((_, y) =>
      Array(GRID_SIZE).fill(null).map((_, x) => ({ x, y, isWall: true, isFinish: false }))
    );

    const stack: { x: number; y: number }[] = [];
    const start = { x: 1, y: 1 };
    stack.push(start);
    newGrid[start.y][start.x].isWall = false;

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = [];

      for (const dir of Object.values(directionVectors)) {
        const nx = current.x + dir.x * 2;
        const ny = current.y + dir.y * 2;
        if (nx > 0 && nx < GRID_SIZE - 1 && ny > 0 && ny < GRID_SIZE - 1 && newGrid[ny][nx].isWall) {
          neighbors.push({ nx, ny, dir });
        }
      }

      if (neighbors.length > 0) {
        const { nx, ny, dir } = neighbors[Math.floor(Math.random() * neighbors.length)];
        newGrid[ny][nx].isWall = false;
        newGrid[current.y + dir.y][current.x + dir.x].isWall = false;
        stack.push({ x: nx, y: ny });
      } else {
        stack.pop();
      }
    }

    newGrid[GRID_SIZE - 2][GRID_SIZE - 2].isFinish = true;
    setGrid(newGrid);
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    generateNewMaze();
  }, [generateNewMaze]);

  const addCommand = (command: Command) => {
    if (gameState === 'idle') {
      setCommands([...commands, command]);
    }
  };

  const runCommands = () => {
    setGameState('running');
    let tempPos = { ...playerPos };
    let tempDir = playerDir;
    let failed = false;

    commands.forEach((command, index) => {
      setTimeout(() => {
        if (failed || gameState === 'success') return;

        if (command === 'TURN_LEFT') {
          const newDir: Direction = tempDir === 'UP' ? 'LEFT' : tempDir === 'LEFT' ? 'DOWN' : tempDir === 'DOWN' ? 'RIGHT' : 'UP';
          tempDir = newDir;
          setPlayerDir(newDir);
        } else if (command === 'TURN_RIGHT') {
          const newDir: Direction = tempDir === 'UP' ? 'RIGHT' : tempDir === 'RIGHT' ? 'DOWN' : tempDir === 'DOWN' ? 'LEFT' : 'UP';
          tempDir = newDir;
          setPlayerDir(newDir);
        } else if (command === 'FORWARD') {
          const vec = directionVectors[tempDir];
          const nextPos = { x: tempPos.x + vec.x, y: tempPos.y + vec.y };

          if (nextPos.x < 0 || nextPos.x >= GRID_SIZE || nextPos.y < 0 || nextPos.y >= GRID_SIZE || grid[nextPos.y][nextPos.x].isWall) {
            failed = true;
            setGameState('fail');
            toast.error("Olamaz! Robot duvara çarptı.", {
              duration: 3000,
              icon: '💥'
            });
          } else {
            tempPos = nextPos;
            setPlayerPos(nextPos);
          }
        }

        if (index === commands.length - 1 && !failed) {
          if (grid[tempPos.y][tempPos.x].isFinish) {
            setGameState('success');
            toast.success("Tebrikler! Görev tamamlandı.", {
              duration: 4000,
              icon: '🏆',
              position: 'top-center'
            });
          } else {
            setGameState('fail');
            toast.warning("Kupaya ulaşılamadı. Tekrar dene!", {
              duration: 3000,
              icon: '🤔',
              position: 'top-center'
            });
          }
        }
      }, (index + 1) * 500);
    });
  };

  const getRotationClass = (dir: Direction) => {
    if (dir === 'UP') return '-rotate-90';
    if (dir === 'DOWN') return 'rotate-90';
    if (dir === 'LEFT') return 'rotate-180';
    return 'rotate-0';
  };

  

  // Oyun durumu bildirimi
  const renderGameStateNotification = () => {
    if (gameState === 'success') {
      return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce">
          <div className="flex items-center">
            <Trophy className="mr-2" size={20} />
            <span className="font-bold">Tebrikler! Görev tamamlandı.</span>
          </div>
        </div>
      );
    }
    if (gameState === 'fail') {
      return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg z-50">
          <div className="flex items-center">
            <Square className="mr-2" size={20} />
            <span className="font-bold">Olamaz! Tekrar dene.</span>
          </div>
        </div>
      );
    }
    return null;
  };
  
  const commandIcons = {
    'FORWARD': <ArrowUp size={16} />,
    'TURN_LEFT': <RotateCcw size={16} />,
    'TURN_RIGHT': <RotateCw size={16} />,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto font-sans">
      {renderGameStateNotification()}
      <div className="w-full lg:w-[320px] flex-shrink-0 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-blue-100 dark:border-gray-700">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4 shadow-lg">
            <Bot className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Labirent Algoritması
          </h1>
          <p className="text-muted-foreground">Komutları sırala, robotu hedefe ulaştır.</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Button 
            aria-label="İlerle" 
            className="flex flex-col h-20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-b-4 border-blue-700 hover:border-blue-800" 
            onClick={() => addCommand('FORWARD')} 
            disabled={gameState !== 'idle'}
          >
            <ArrowUp className="mb-1" size={20} /> 
            <span className="text-sm font-bold">İlerle</span>
          </Button>
          <Button 
            aria-label="Sola Dön" 
            className="flex flex-col h-20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-b-4 border-purple-700 hover:border-purple-800" 
            onClick={() => addCommand('TURN_LEFT')} 
            disabled={gameState !== 'idle'}
          >
            <RotateCcw className="mb-1" size={20} /> 
            <span className="text-sm font-bold">Sola Dön</span>
          </Button>
          <Button 
            aria-label="Sağa Dön" 
            className="flex flex-col h-20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white border-b-4 border-pink-700 hover:border-pink-800" 
            onClick={() => addCommand('TURN_RIGHT')} 
            disabled={gameState !== 'idle'}
          >
            <RotateCw className="mb-1" size={20} /> 
            <span className="text-sm font-bold">Sağa Dön</span>
          </Button>
        </div>

        <div className="flex gap-3 mb-6">
          <Button 
            onClick={runCommands} 
            disabled={commands.length === 0 || gameState !== 'idle'} 
            className="w-full py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 border-b-4 border-teal-700 hover:border-teal-800"
          >
            <Play className="mr-2" size={24} /> Çalıştır
          </Button>
          <Button 
            onClick={resetGame} 
            variant="outline" 
            className="w-full py-6 text-lg font-bold rounded-xl border-2 hover:bg-muted transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg border-blue-300 hover:border-blue-400"
          >
            <Square className="mr-2" size={20} /> Sıfırla
          </Button>
        </div>
        <Button 
          onClick={generateNewMaze} 
          variant="secondary" 
          className="w-full py-5 text-lg font-bold rounded-xl mb-6 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-b-4 border-orange-600 hover:border-orange-700"
        >
          Yeni Labirent
        </Button>

        <div className="p-4 border-2 border-dashed border-blue-300 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 min-h-[180px] shadow-inner">
            <h3 className="font-bold text-lg mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Komut Sırası
            </h3>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
                {commands.map((cmd, i) => (
                    <span 
                      key={i} 
                      className="flex items-center gap-1 bg-white dark:bg-gray-700 border-2 border-blue-300 dark:border-purple-500 p-2 rounded-lg text-sm font-bold shadow-md transition-all duration-200 hover:scale-105 transform"
                    >
                        <span className="bg-blue-100 dark:bg-blue-900/50 p-1 rounded">
                          {commandIcons[cmd]}
                        </span>
                        {cmd === 'FORWARD' ? 'İlerle' : (cmd === 'TURN_LEFT' ? 'Sola Dön' : 'Sağa Dön')}
                    </span>
                ))}
                {gameState === 'idle' && commands.length > 0 && (
                  <div className="w-3 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm animate-pulse self-center shadow-md" />
                )}
            </div>
            {commands.length === 0 && (
              <div className="text-center mt-4">
                <div className="inline-block p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-2">
                  <Bot className="text-blue-500 dark:text-blue-400" size={24} />
                </div>
                <p className="text-muted-foreground">Henüz komut eklenmedi</p>
              </div>
            )}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-2xl border">
          <div 
            className="grid gap-1.5 mx-auto border-4 border-blue-200 rounded-2xl p-2 bg-blue-50/50 dark:bg-gray-900/50" 
            style={{gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`}}
          >
            {grid.map((row, y) =>
              row.map((cell, x) => (
                <div 
                  key={`${x}-${y}`} 
                  className={`aspect-square flex items-center justify-center relative rounded shadow-sm transition-all duration-300 transform hover:scale-105 ${
                    cell.isWall 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 shadow-inner ring-1 ring-gray-700' 
                      : 'bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-800 ring-1 ring-gray-200 dark:ring-gray-600'
                  } ${
                    playerPos.x === x && playerPos.y === y 
                      ? 'ring-4 ring-blue-500 ring-opacity-90 scale-110 z-10' 
                      : ''
                  } ${
                    cell.isFinish 
                      ? 'ring-2 ring-yellow-400 ring-opacity-70' 
                      : ''
                  }`}
                >
                  {cell.isFinish && (
                    <div className={`transition-all duration-1000 ${gameState === 'success' ? 'animate-bounce' : ''}`}>
                      <Trophy className="text-yellow-400 drop-shadow-lg" size={24} />
                    </div>
                  )}
                  {playerPos.x === x && playerPos.y === y && (
                    <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out ${getRotationClass(playerDir)} ${
                      gameState === 'idle' ? 'animate-pulse' : ''
                    }`}>
                      <Bot 
                        className={`h-3/4 w-3/4 drop-shadow-lg ${
                          gameState === 'success' 
                            ? 'text-green-500 animate-pulse' 
                            : gameState === 'fail' 
                              ? 'text-red-500 animate-pulse' 
                              : 'text-blue-600'
                        }`} 
                        size={28}
                      />
                    </div>
                  )}
                  {x === 1 && y === 1 && !(playerPos.x === 1 && playerPos.y === 1) && (
                    <ChevronsRight className="text-muted-foreground/50" size={20} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YazilimOyunu;
