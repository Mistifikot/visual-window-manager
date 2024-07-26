import React, { useState } from 'react';
import VisualWindowSequenceManager from './VisualWindowSequenceManager';
import GameScreenEmulator from './GameScreenEmulator';
import PriorityVisualization from './PriorityVisualization';
import WindowEditor from './WindowEditor';
import { WindowProvider } from './WindowContext';

function App() {
  const [activeComponent, setActiveComponent] = useState('manager');

  const buttonStyle = (component) => ({
    padding: '10px 20px',
    marginRight: '10px',
    backgroundColor: activeComponent === component ? '#4CAF50' : '#ddd',
    color: activeComponent === component ? 'white' : 'black',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  });

  return (
    <WindowProvider>
      <div className="App">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', padding: '20px', backgroundColor: '#f0f4f8' }}>
          <button 
            onClick={() => setActiveComponent('manager')}
            style={buttonStyle('manager')}
          >
            Window Manager
          </button>
          <button 
            onClick={() => setActiveComponent('emulator')}
            style={buttonStyle('emulator')}
          >
            Game Screen Emulator
          </button>
          <button 
            onClick={() => setActiveComponent('visualization')}
            style={buttonStyle('visualization')}
          >
            Priority Visualization
          </button>
          <button 
            onClick={() => setActiveComponent('editor')}
            style={buttonStyle('editor')}
          >
            Window Editor
          </button>
        </div>
        {activeComponent === 'manager' && <VisualWindowSequenceManager />}
        {activeComponent === 'emulator' && <GameScreenEmulator />}
        {activeComponent === 'visualization' && <PriorityVisualization />}
        {activeComponent === 'editor' && <WindowEditor />}
      </div>
    </WindowProvider>
  );
}

export default App;