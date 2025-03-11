import React, { useState } from 'react';
import { useWindows } from '../context/WindowContext';
import { WindowTypes, PriorityLevels } from '../constants/windowTypes';
import { getTypeColor, getPriorityColor } from '../utils/colorUtils';

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
      line: 2,
      description: 'Описание нового окна'
    };
    updateWindows([...windows, newWindow]);
    setEditingWindow({ ...newWindow });
  };

  const renderEditForm = (window) => (
    <div style={formStyle}>
      <div style={formFieldStyle}>
        <label style={labelStyle}>Название</label>
        <input
          style={inputStyle}
          type="text"
          name="content"
          value={window.content}
          onChange={handleChange}
        />
      </div>
      <div style={formFieldStyle}>
        <label style={labelStyle}>Описание</label>
        <textarea
          style={{ ...inputStyle, height: '80px' }}
          name="description"
          value={window.description}
          onChange={handleChange}
        />
      </div>
      <div style={formFieldStyle}>
        <label style={labelStyle}>Тип</label>
        <select
          style={inputStyle}
          name="type"
          value={window.type}
          onChange={handleChange}
        >
          {Object.values(WindowTypes).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div style={formFieldStyle}>
        <label style={labelStyle}>Приоритет</label>
        <select
          style={inputStyle}
          name="priority"
          value={window.priority}
          onChange={handleChange}
        >
          {Object.values(PriorityLevels).map(priority => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>
      </div>
      <div style={formFieldStyle}>
        <label style={labelStyle}>Линия</label>
        <select
          style={inputStyle}
          name="line"
          value={window.line}
          onChange={handleChange}
        >
          <option value={1}>1 (Высокий приоритет)</option>
          <option value={2}>2 (Средний приоритет)</option>
          <option value={3}>3 (Низкий приоритет)</option>
        </select>
      </div>
      <div style={actionButtonsStyle}>
        <button style={saveButtonStyle} onClick={handleSave}>Сохранить</button>
        <button style={cancelButtonStyle} onClick={() => setEditingWindow(null)}>Отмена</button>
      </div>
    </div>
  );

  const renderWindowCard = (window) => {
    const isEditing = editingWindow?.id === window.id;
    const typeColor = getTypeColor(window.type);
    const priorityColor = getPriorityColor(window.priority);

    return (
      <div key={window.id} style={cardStyle}>
        <div style={{ 
          ...cardHeaderStyle, 
          borderLeft: `4px solid ${typeColor}`,
          borderBottom: `1px solid ${typeColor}25`
        }}>
          <span style={cardTitleStyle}>{window.content}</span>
          <div style={tagStyle} title={`Priority: ${window.priority}`}>
            <span style={{ ...badgeStyle, backgroundColor: priorityColor }}></span>
          </div>
        </div>
        <div style={cardBodyStyle}>
          <p style={descriptionStyle}>{window.description}</p>
          <div style={cardFooterStyle}>
            <span style={typeTagStyle(typeColor)}>{window.type}</span>
            <button style={editButtonStyle} onClick={() => handleEdit(window)}>
              {isEditing ? 'Отмена' : 'Редактировать'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0 }}>Window Editor</h2>
        <button style={newButtonStyle} onClick={handleCreateNew}>Создать новое окно</button>
      </div>
      
      {editingWindow && renderEditForm(editingWindow)}

      <div style={windowsGridStyle}>
        {windows.map(window => renderWindowCard(window))}
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
};

const newButtonStyle = {
  backgroundColor: '#4caf50',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const windowsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '20px'
};

const cardStyle = {
  border: '1px solid #eee',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  backgroundColor: 'white'
};

const cardHeaderStyle = {
  padding: '12px 15px',
  backgroundColor: '#f8f8f8',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const cardTitleStyle = {
  fontWeight: 'bold',
  fontSize: '16px'
};

const tagStyle = {
  display: 'flex',
  alignItems: 'center'
};

const badgeStyle = {
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  display: 'inline-block'
};

const cardBodyStyle = {
  padding: '15px'
};

const descriptionStyle = {
  margin: '0 0 15px 0',
  fontSize: '14px',
  color: '#555'
};

const cardFooterStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const typeTagStyle = (color) => ({
  backgroundColor: `${color}20`,
  color: color,
  padding: '3px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold'
});

const editButtonStyle = {
  backgroundColor: 'transparent',
  border: '1px solid #ddd',
  borderRadius: '4px',
  padding: '4px 10px',
  cursor: 'pointer',
  fontSize: '12px'
};

const formStyle = {
  backgroundColor: '#f9f9f9',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px',
  border: '1px solid #eee'
};

const formFieldStyle = {
  marginBottom: '15px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold'
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '14px'
};

const actionButtonsStyle = {
  display: 'flex',
  gap: '10px'
};

const saveButtonStyle = {
  backgroundColor: '#4caf50',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer'
};

const cancelButtonStyle = {
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default WindowEditor; 