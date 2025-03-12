import React, { useState } from 'react';
import { useWindows } from '../context/WindowContext';
import { PriorityLevels } from '../constants/windowTypes';
import { getTypeColor } from '../utils/colorUtils';

const GameScreenEmulator = () => {
  const { windows } = useWindows();
  const [activeWindows, setActiveWindows] = useState([]);

  const addWindow = (window) => {
    if (!activeWindows.find(w => w.id === window.id)) {
      setActiveWindows(prev => [...prev, window]);
    }
  };

  const removeWindow = (windowId) => {
    setActiveWindows(prev => prev.filter(w => w.id !== windowId));
  };

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
                  <span>{window.content}</span>
                  <button style={modalCloseStyle} onClick={() => removeWindow(window.id)}>×</button>
                </div>
                <div style={modalBodyStyle}>
                  <p>{window.description}</p>
                  <button style={modalButtonStyle}>OK</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={emptyBoardStyle}>Game Board</div>
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
      <h3>Available Windows</h3>
      <div style={windowsGridStyle}>
        {windows.map(window => (
          <div key={window.id} style={windowItemStyle(window.type)}>
            <div style={windowItemHeaderStyle}>
              <span>{window.content}</span>
              <button style={addButtonStyle} onClick={() => addWindow(window)}>+</button>
            </div>
            <div style={windowItemBodyStyle}>
              <small>{window.type}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
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
  gap: '15px'
};

const windowItemStyle = (type) => ({
  border: `1px solid ${getTypeColor(type)}`,
  borderRadius: '4px',
  overflow: 'hidden'
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