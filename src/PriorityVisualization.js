import React, { useState, useEffect } from 'react';
import { useWindows } from './WindowContext';
import { PriorityLevels, WindowTypes } from './VisualWindowSequenceManager';

const PriorityVisualization = () => {
  const { windows } = useWindows();
  const [filteredWindows, setFilteredWindows] = useState(windows);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [entryFilter, setEntryFilter] = useState('all');

  useEffect(() => {
    let result = windows;
    if (priorityFilter !== 'all') {
      result = result.filter(window => window.priority === priorityFilter);
    }
    if (entryFilter !== 'all') {
      result = result.filter(window => window.line === parseInt(entryFilter));
    }
    setFilteredWindows(result);
  }, [windows, priorityFilter, entryFilter]);

  const getColor = (type) => {
    switch(type) {
      case WindowTypes.REWARD: return '#c6f6d5';
      case WindowTypes.OFFER: return '#bee3f8';
      case WindowTypes.TUTORIAL: return '#fefcbf';
      case WindowTypes.EVENT: return '#e9d8fd';
      case WindowTypes.SYSTEM: return '#fed7d7';
      case WindowTypes.PROGRESS: return '#feebc8';
      default: return '#e2e8f0';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case PriorityLevels.HIGH: return '#f56565';
      case PriorityLevels.MEDIUM: return '#ed8936';
      case PriorityLevels.LOW: return '#48bb78';
      default: return '#a0aec0';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>Priority and Entry Visualization</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
        <select 
          value={priorityFilter} 
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{ padding: '5px', borderRadius: '5px' }}
        >
          <option value="all">All Priorities</option>
          {Object.values(PriorityLevels).map(priority => (
            <option key={priority} value={priority}>{priority.toUpperCase()}</option>
          ))}
        </select>
        <select 
          value={entryFilter} 
          onChange={(e) => setEntryFilter(e.target.value)}
          style={{ padding: '5px', borderRadius: '5px' }}
        >
          <option value="all">All Entries</option>
          {[1, 2, 3, 4, 5].map(entry => (
            <option key={entry} value={entry}>Entry {entry}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredWindows.map((window, index) => (
          <div 
            key={window.id} 
            style={{
              padding: '10px',
              backgroundColor: getColor(window.type),
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ width: '30px', fontWeight: 'bold', marginRight: '10px' }}>{index + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold' }}>{window.content}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>{window.type}</div>
            </div>
            <div style={{ 
              padding: '5px 10px', 
              backgroundColor: getPriorityColor(window.priority),
              color: 'white',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: 'bold',
              marginRight: '10px'
            }}>
              {window.priority.toUpperCase()}
            </div>
            <div style={{ 
              padding: '5px 10px', 
              backgroundColor: '#4a5568',
              color: 'white',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              Entry {window.line}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityVisualization;