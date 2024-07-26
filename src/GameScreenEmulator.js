import React, { useState, useEffect } from 'react';
import { useWindows } from './WindowContext';

const GameScreenEmulator = () => {
  const { windows } = useWindows();
  const [currentEntry, setCurrentEntry] = useState(1);
  const [currentWindows, setCurrentWindows] = useState([]);
  const [currentWindowIndex, setCurrentWindowIndex] = useState(0);

  useEffect(() => {
    // Фильтруем и сортируем окна для текущего входа
    const filteredWindows = windows
      .filter(window => window.line === currentEntry)
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    setCurrentWindows(filteredWindows);
    setCurrentWindowIndex(0);
  }, [windows, currentEntry]);

  const handleNextWindow = () => {
    if (currentWindowIndex < currentWindows.length - 1) {
      setCurrentWindowIndex(currentWindowIndex + 1);
    }
  };

  const handleEntryChange = (e) => {
    setCurrentEntry(Number(e.target.value));
  };

  const currentWindow = currentWindows[currentWindowIndex];

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Game Screen Emulator</h2>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="entrySelect">Выберите вход в игру: </label>
        <select id="entrySelect" value={currentEntry} onChange={handleEntryChange}>
          {[1, 2, 3, 4, 5].map(entry => (
            <option key={entry} value={entry}>Вход {entry}</option>
          ))}
        </select>
      </div>
      {currentWindow && (
        <div style={{ 
          border: '1px solid #ccc', 
          borderRadius: '8px', 
          padding: '20px', 
          backgroundColor: '#f9f9f9',
          position: 'relative'
        }}>
          <button 
            onClick={handleNextWindow} 
            style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ✖
          </button>
          <h3 style={{ marginTop: '0' }}>{currentWindow.content}</h3>
          <p>Тип: {currentWindow.type}</p>
          <p>Приоритет: {currentWindow.priority}</p>
          <p>{currentWindow.description}</p>
          <button 
            onClick={handleNextWindow}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            OK
          </button>
        </div>
      )}
      {!currentWindow && (
        <p style={{ textAlign: 'center' }}>Все окна для этого входа показаны.</p>
      )}
    </div>
  );
};

export default GameScreenEmulator;