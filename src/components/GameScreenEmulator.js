import React, { useState, useEffect, useCallback } from 'react';
import { useWindows } from '../context/WindowContext';
import { PriorityLevels } from '../constants/windowTypes';
import { getTypeColor } from '../utils/colorUtils';

const GameScreenEmulator = () => {
  const { windows } = useWindows();
  const [activeWindows, setActiveWindows] = useState([]);
  const [gameStage, setGameStage] = useState('gameStart'); // gameStart, levelExit1, levelExit2, levelExit3

  // Фильтры для разных этапов игры - обернул в useCallback для решения проблемы ESLint
  const getWindowsForStage = useCallback((stage) => {
    const mainScreenWindows = windows.filter(w => parseInt(w.id) <= 50);
    const levelExitWindows = windows.filter(w => parseInt(w.id) > 50);

    switch(stage) {
      case 'gameStart':
        // Окна при входе в игру (обычно высокоприоритетные системные и наградные)
        return mainScreenWindows.filter(w => 
          w.priority === PriorityLevels.HIGH && 
          parseInt(w.id) <= 10 // Демонстрационное ограничение: только первые 10 окон для примера
        ).slice(0, 3); // Показываем только 3 первых окна
        
      case 'levelExit1':
        // Первый выход из уровня: показываем окна завершения уровня и некоторые события
        return [
          // Основные окна выхода из уровня
          ...levelExitWindows.filter(w => w.priority === PriorityLevels.HIGH).slice(0, 2),
          // Некоторые обучающие окна
          ...mainScreenWindows.filter(w => w.priority === PriorityLevels.MEDIUM && w.id === '6')
        ];
        
      case 'levelExit2':
        // Второй выход из уровня: показываем прогресс и события
        return [
          // Прогресс-окна
          ...mainScreenWindows.filter(w => w.id === '15' || w.id === '19'), 
          // Окна предложений
          ...mainScreenWindows.filter(w => w.id === '21' || w.id === '31').slice(0, 1)
        ];
        
      case 'levelExit3':
        // Третий выход из уровня: показываем награды и события
        return [
          // Наградные окна
          ...mainScreenWindows.filter(w => w.id === '14' || w.id === '16' || w.id === '17'),
          // Событийные окна
          ...mainScreenWindows.filter(w => w.id === '22' || w.id === '27').slice(0, 1)
        ];
        
      default:
        return [];
    }
  }, [windows]); // добавляем windows как зависимость

  // Обновляем активные окна при смене этапа игры
  useEffect(() => {
    const stageWindows = getWindowsForStage(gameStage);
    setActiveWindows(stageWindows);
  }, [gameStage, getWindowsForStage]); // Добавляем getWindowsForStage в зависимости

  const addWindow = (window) => {
    if (!activeWindows.find(w => w.id === window.id)) {
      setActiveWindows(prev => [...prev, window]);
    }
  };

  const removeWindow = (windowId) => {
    setActiveWindows(prev => prev.filter(w => w.id !== windowId));
  };

  const renderGameStageButtons = () => (
    <div style={stageButtonsContainerStyle}>
      <h3>Сценарии игры</h3>
      <div style={stageButtonsGridStyle}>
        <button 
          style={{
            ...stageButtonStyle,
            backgroundColor: gameStage === 'gameStart' ? '#3f51b5' : '#6573c3',
          }} 
          onClick={() => setGameStage('gameStart')}
        >
          Вход в игру
        </button>
        <button 
          style={{
            ...stageButtonStyle,
            backgroundColor: gameStage === 'levelExit1' ? '#3f51b5' : '#6573c3',
          }} 
          onClick={() => setGameStage('levelExit1')}
        >
          Первый выход из уровня
        </button>
        <button 
          style={{
            ...stageButtonStyle,
            backgroundColor: gameStage === 'levelExit2' ? '#3f51b5' : '#6573c3',
          }} 
          onClick={() => setGameStage('levelExit2')}
        >
          Второй выход из уровня
        </button>
        <button 
          style={{
            ...stageButtonStyle,
            backgroundColor: gameStage === 'levelExit3' ? '#3f51b5' : '#6573c3',
          }} 
          onClick={() => setGameStage('levelExit3')}
        >
          Третий выход из уровня
        </button>
      </div>
    </div>
  );

  const renderGameScreen = () => (
    <div style={gameScreenStyle}>
      <div style={gameHeaderStyle}>
        <div style={gameScoreStyle}>Score: 10,500</div>
        <div style={gameLevelStyle}>Level 42</div>
        <div style={gameStarsStyle}>★★★</div>
      </div>

      <div style={gameBoardStyle}>
        {activeWindows.length > 0 ? (
          <div style={modalOverlayStyle}>
            {activeWindows.map(window => (
              <div key={window.id} style={modalWindowStyle(window)}>
                <div style={modalHeaderStyle(window.type)}>
                  <span>{window.content} (#{window.id})</span>
                  <button style={modalCloseStyle} onClick={() => removeWindow(window.id)}>×</button>
                </div>
                <div style={modalBodyStyle}>
                  <p>{window.description}</p>
                  <div style={modalTagsStyle}>
                    <span style={modalTagStyle(getTypeColor(window.type))}>{window.type}</span>
                    <span style={priorityTagStyle(window.priority)}>{window.priority}</span>
                  </div>
                  <button style={modalButtonStyle}>OK</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={emptyBoardStyle}>Нет активных окон</div>
        )}
      </div>

      <div style={gameControlsStyle}>
        <div style={gameButtonsStyle}>
          <button style={gameButtonStyle}>Booster 1</button>
          <button style={gameButtonStyle}>Booster 2</button>
          <button style={gameButtonStyle}>Booster 3</button>
        </div>
      </div>
    </div>
  );

  const renderWindowsList = () => (
    <div style={windowsListStyle}>
      <h3>Добавить окна вручную</h3>
      <div style={windowsGridStyle}>
        {windows.map(window => (
          <div key={window.id} style={windowItemStyle(window.type)}>
            <div style={windowItemHeaderStyle}>
              <span>{window.content} <small>#{window.id}</small></span>
              <button style={addButtonStyle} onClick={() => addWindow(window)}>+</button>
            </div>
            <div style={windowItemBodyStyle}>
              <small>{window.type} • {window.priority}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      {renderGameStageButtons()}
      {renderGameScreen()}
      {renderWindowsList()}
    </div>
  );
};

// Styles
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '20px'
};

const stageButtonsContainerStyle = {
  marginBottom: '20px'
};

const stageButtonsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '10px'
};

const stageButtonStyle = {
  color: 'white',
  border: 'none',
  padding: '12px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background-color 0.2s ease'
};

const gameScreenStyle = {
  border: '2px solid #333',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: '#fff',
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  marginBottom: '30px'
};

const gameHeaderStyle = {
  backgroundColor: '#333',
  color: 'white',
  padding: '10px 15px',
  display: 'flex',
  justifyContent: 'space-between'
};

const gameScoreStyle = {
  fontWeight: 'bold'
};

const gameLevelStyle = {
  fontWeight: 'bold'
};

const gameStarsStyle = {
  color: '#FFD700'
};

const gameBoardStyle = {
  position: 'relative',
  height: '400px',
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const emptyBoardStyle = {
  color: '#aaa',
  fontSize: '24px',
  fontWeight: 'bold'
};

const modalOverlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const modalWindowStyle = (window) => ({
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  overflow: 'hidden',
  width: '300px',
  maxWidth: '90%',
  zIndex: window.priority === PriorityLevels.HIGH ? 3 : 
          window.priority === PriorityLevels.MEDIUM ? 2 : 1
});

const modalHeaderStyle = (type) => ({
  backgroundColor: getTypeColor(type),
  color: 'white',
  padding: '10px 15px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 'bold'
});

const modalCloseStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  color: 'white',
  fontSize: '20px',
  cursor: 'pointer'
};

const modalBodyStyle = {
  padding: '15px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const modalTagsStyle = {
  display: 'flex',
  gap: '8px',
  marginBottom: '12px'
};

const modalTagStyle = (color) => ({
  display: 'inline-block',
  backgroundColor: `${color}20`,
  color: color,
  padding: '3px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold'
});

const priorityTagStyle = (priority) => {
  let color;
  switch(priority) {
    case PriorityLevels.HIGH: color = '#f44336'; break;
    case PriorityLevels.MEDIUM: color = '#ff9800'; break;
    case PriorityLevels.LOW: color = '#4caf50'; break;
    default: color = '#777';
  }
  return {
    display: 'inline-block',
    backgroundColor: `${color}20`,
    color: color,
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  };
};

const modalButtonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  padding: '8px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '10px'
};

const gameControlsStyle = {
  backgroundColor: '#eee',
  padding: '15px',
  borderTop: '1px solid #ddd'
};

const gameButtonsStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'center'
};

const gameButtonStyle = {
  backgroundColor: '#777',
  color: 'white',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '5px',
  cursor: 'pointer'
};

const windowsListStyle = {
  marginTop: '20px'
};

const windowsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '15px',
  maxHeight: '400px',
  overflowY: 'auto',
  padding: '10px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px'
};

const windowItemStyle = (type) => ({
  border: `1px solid ${getTypeColor(type)}`,
  borderRadius: '4px',
  overflow: 'hidden',
  backgroundColor: 'white'
});

const windowItemHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 12px',
  backgroundColor: '#f5f5f5',
  borderBottom: '1px solid #eee'
};

const addButtonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  cursor: 'pointer',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const windowItemBodyStyle = {
  padding: '8px 12px'
};

export default GameScreenEmulator; 