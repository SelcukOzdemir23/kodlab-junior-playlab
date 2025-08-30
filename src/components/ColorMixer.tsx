import React, { useState, useEffect } from 'react';
import { rgbToHex, generateRandomColor, calculateColorDistance } from '../utils/colorUtils';

const ColorMixer: React.FC = () => {
  const [red, setRed] = useState<number>(128);
  const [green, setGreen] = useState<number>(128);
  const [blue, setBlue] = useState<number>(128);
  const [targetColor, setTargetColor] = useState<{ r: number; g: number; b: number }>({ r: 0, g: 0, b: 0 });
  const [distance, setDistance] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  // Başlangıçta rastgele bir hedef renk oluştur
  useEffect(() => {
    generateNewTargetColor();
  }, []);

  const handleRedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRed(parseInt(e.target.value));
  };

  const handleGreenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGreen(parseInt(e.target.value));
  };

  const handleBlueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlue(parseInt(e.target.value));
  };

  const generateNewTargetColor = () => {
    const newColor = generateRandomColor();
    setTargetColor(newColor);
    // Kaydırıcıları sıfırla
    setRed(128);
    setGreen(128);
    setBlue(128);
    // Sonuçları gizle
    setDistance(null);
    setMessage('');
    setShowResult(false);
  };

  const handleGuess = () => {
    const dist = calculateColorDistance(
      { r: red, g: green, b: blue },
      targetColor
    );
    setDistance(dist);
    
    // Mesajı güncelle
    if (dist < 10) {
      setMessage('Harika! Neredeyse aynı!');
    } else if (dist < 30) {
      setMessage('Çok yakın!');
    } else if (dist < 60) {
      setMessage('Yaklaşıyorsun!');
    } else if (dist < 100) {
      setMessage('Biraz daha çalış!');
    } else {
      setMessage('Hedef renge daha çok yaklaşmalısın!');
    }
    
    setShowResult(true);
  };

  const handleNewGuess = () => {
    // Kaydırıcıları sıfırla
    setRed(128);
    setGreen(128);
    setBlue(128);
    // Sonuçları gizle
    setDistance(null);
    setMessage('');
    setShowResult(false);
  };

  const mixedColor = `rgb(${red}, ${green}, ${blue})`;
  const hexColor = rgbToHex(red, green, blue);
  const targetColorString = `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`;
  const targetHexColor = rgbToHex(targetColor.r, targetColor.g, targetColor.b);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Renk Karıştırma Stüdyosu</h1>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hedef Renk */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Hedef Renk</h2>
          <div 
            className="w-64 h-64 mb-4 border-4 border-gray-800 rounded-lg shadow-lg"
            style={{ backgroundColor: targetColorString }}
          ></div>
          <p className="text-lg font-semibold text-gray-800">HEX: {targetHexColor}</p>
        </div>
        
        {/* Oluşturulan Renk */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Oluşturduğun Renk</h2>
          <div 
            className="w-64 h-64 mb-4 border-4 border-gray-800 rounded-lg shadow-lg"
            style={{ backgroundColor: mixedColor }}
          ></div>
          <p className="text-lg font-semibold text-gray-800">HEX: {hexColor}</p>
        </div>
      </div>
      
      {/* Skor ve Mesaj */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mt-8">
        {/* Sonuçlar */}
        {showResult && distance !== null && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xl font-semibold text-gray-800 text-center">
              Renk Uzaklığı: <span className="text-2xl font-bold">{Math.round(distance)}</span>
            </p>
            <p className={`text-lg mt-2 text-center ${distance < 30 ? 'text-green-600' : distance < 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {message}
            </p>
          </div>
        )}
        
        {/* Kaydırıcılar */}
        <div className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Kırmızı: {red}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={red}
              onChange={handleRedChange}
              className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Yeşil: {green}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={green}
              onChange={handleGreenChange}
              className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Mavi: {blue}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={blue}
              onChange={handleBlueChange}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        {/* Butonlar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {!showResult ? (
            <button
              onClick={handleGuess}
              className="py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-all duration-200"
            >
              Tahmin Et
            </button>
          ) : (
            <button
              onClick={handleNewGuess}
              className="py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-200"
            >
              Yeni Tahmin
            </button>
          )}
          
          <button
            onClick={generateNewTargetColor}
            className="py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition-all duration-200 md:col-span-2"
          >
            Yeni Hedef Renk
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorMixer;