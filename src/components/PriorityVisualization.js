import React, { useState } from 'react';
import { useWindows } from '../context/WindowContext';
import { WindowTypes, PriorityLevels } from '../constants/windowTypes';
import { getTypeColor, getPriorityColor } from '../utils/colorUtils';

const PriorityVisualization = () => {
  const { windows } = useWindows();
  const [selectedType, setSelectedType] = useState('all');

  const filteredWindows = selectedType === 'all' 
    ? windows 
    : windows.filter(window => window.type === selectedType);

  const getTypeColor = (type) => {
    switch (type) {
      case WindowTypes.REWARD: return '#4caf50';
      case WindowTypes.OFFER: return '#ff9800';
      case WindowTypes.TUTORIAL: return '#2196f3';
      case WindowTypes.EVENT: return '#9c27b0';
      case WindowTypes.SYSTEM: return '#f44336';
      case WindowTypes.PROGRESS: return '#00bcd4';
      default: return '#777';
    }
  };

  const renderTypeTabs = () => {
    const types = ['all', ...Object.values(WindowTypes)];
    
    return (
      <div style={tabsContainerStyle}>
        {types.map(type => (
          <button
            key={type}
            style={{
              ...tabStyle,
              backgroundColor: type === selectedType ? (type === 'all' ? '#333' : getTypeColor(type)) : '#eee',
              color: type === selectedType ? 'white' : '#333'
            }}
            onClick={() => setSelectedType(type)}
          >
            {type === 'all' ? 'All Types' : type}
          </button>
        ))}
      </div>
    );
  };

  const renderPriorityGroups = () => {
    const highPriority = filteredWindows.filter(w => w.priority === PriorityLevels.HIGH);
    const mediumPriority = filteredWindows.filter(w => w.priority === PriorityLevels.MEDIUM);
    const lowPriority = filteredWindows.filter(w => w.priority === PriorityLevels.LOW);

    return (
      <div style={priorityGridStyle}>
        <div style={priorityColumnStyle}>
          <div style={{ ...priorityHeaderStyle, backgroundColor: '#f44336' }}>
            High Priority
          </div>
          <div style={windowListStyle}>
            {highPriority.map(window => renderWindowItem(window))}
            {highPriority.length === 0 && <div style={emptyMessageStyle}>No windows</div>}
          </div>
        </div>
        
        <div style={priorityColumnStyle}>
          <div style={{ ...priorityHeaderStyle, backgroundColor: '#ff9800' }}>
            Medium Priority
          </div>
          <div style={windowListStyle}>
            {mediumPriority.map(window => renderWindowItem(window))}
            {mediumPriority.length === 0 && <div style={emptyMessageStyle}>No windows</div>}
          </div>
        </div>
        
        <div style={priorityColumnStyle}>
          <div style={{ ...priorityHeaderStyle, backgroundColor: '#4caf50' }}>
            Low Priority
          </div>
          <div style={windowListStyle}>
            {lowPriority.map(window => renderWindowItem(window))}
            {lowPriority.length === 0 && <div style={emptyMessageStyle}>No windows</div>}
          </div>
        </div>
      </div>
    );
  };

  const renderWindowItem = (window) => {
    const typeColor = getTypeColor(window.type);
    
    return (
      <div key={window.id} style={{ ...windowItemStyle, borderLeft: `4px solid ${typeColor}` }}>
        <div style={windowTitleStyle}>{window.content}</div>
        <div style={windowTypeStyle(typeColor)}>{window.type}</div>
        <div style={windowDescriptionStyle}>{window.description}</div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Windows by Priority</h2>
      {renderTypeTabs()}
      {renderPriorityGroups()}
    </div>
  );
};

// Styles
const containerStyle = {
  padding: '20px'
};

const headingStyle = {
  marginBottom: '20px',
  textAlign: 'center',
  color: '#333'
};

const tabsContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '30px',
  flexWrap: 'wrap',
  gap: '5px'
};

const tabStyle = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'all 0.3s ease'
};

const priorityGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px'
};

const priorityColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #eee',
  borderRadius: '8px',
  overflow: 'hidden'
};

const priorityHeaderStyle = {
  padding: '12px 15px',
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'center'
};

const windowListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '15px',
  backgroundColor: '#f9f9f9',
  flexGrow: 1
};

const windowItemStyle = {
  backgroundColor: 'white',
  borderRadius: '4px',
  padding: '12px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const windowTitleStyle = {
  fontWeight: 'bold',
  marginBottom: '5px'
};

const windowTypeStyle = (color) => ({
  display: 'inline-block',
  backgroundColor: `${color}20`,
  color: color,
  padding: '3px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold',
  marginBottom: '8px'
});

const windowDescriptionStyle = {
  fontSize: '13px',
  color: '#555'
};

const emptyMessageStyle = {
  padding: '15px',
  textAlign: 'center',
  color: '#999',
  fontStyle: 'italic'
};

export default PriorityVisualization; 