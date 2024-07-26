import React, { useState } from 'react';
import { WindowTypes, PriorityLevels } from './VisualWindowSequenceManager';
import { useWindows } from './WindowContext';

const WindowEditor = () => {
  const { windows, updateWindow, updateWindows } = useWindows();
  const [editingWindow, setEditingWindow] = useState(null);

  const handleEdit = (window) => {
    setEditingWindow(window.id === editingWindow?.id ? null : { ...window });
  };

  const handleSave = () => {
    if (editingWindow) {
      updateWindow(editingWindow);
      setEditingWindow(null);
    }
  };

  const handleChange = (e) => {
    setEditingWindow({
      ...editingWindow,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateNew = () => {
    const newWindow = {
      id: (Math.max(...windows.map(w => parseInt(w.id))) + 1).toString(),
      content: 'Новое окно',
      type: WindowTypes.SYSTEM,
      priority: PriorityLevels.MEDIUM,
      line: 1,
      description: 'Описание нового окна'
    };
    updateWindows([...windows, newWindow]);
    setEditingWindow(newWindow);
  };

  const renderEditForm = (window) => (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginTop: '10px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
        {window.id ? 'Редактировать окно' : 'Создать новое окно'}
      </h3>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Content:</label>
        <input 
          type="text" 
          name="content" 
          value={window.content} 
          onChange={handleChange}
          style={{ width: '100%', padding: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Type:</label>
        <select 
          name="type" 
          value={window.type} 
          onChange={handleChange}
          style={{ width: '100%', padding: '5px' }}
        >
          {Object.values(WindowTypes).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Priority:</label>
        <select 
          name="priority" 
          value={window.priority} 
          onChange={handleChange}
          style={{ width: '100%', padding: '5px' }}
        >
          {Object.values(PriorityLevels).map(priority => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Entry:</label>
        <input 
          type="number" 
          name="line" 
          value={window.line} 
          onChange={handleChange}
          min="1" 
          max="5"
          style={{ width: '100%', padding: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
        <textarea 
          name="description" 
          value={window.description} 
          onChange={handleChange}
          style={{ width: '100%', padding: '5px', height: '100px' }}
        />
      </div>
      <button 
        onClick={handleSave}
        style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Save Changes
      </button>
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Window Editor</h2>
      
      <button 
        onClick={handleCreateNew}
        style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}
      >
        Create New Window
      </button>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Window List</h3>
        {windows.map(window => (
          <div key={window.id}>
            <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f0f4f8', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>{window.content}</span>
              <button 
                onClick={() => handleEdit(window)}
                style={{ padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
              >
                {editingWindow?.id === window.id ? 'Close' : 'Edit'}
              </button>
            </div>
            {editingWindow?.id === window.id && renderEditForm(editingWindow)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WindowEditor;