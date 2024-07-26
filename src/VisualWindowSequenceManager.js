import React, { useState, useEffect } from 'react';
import { useWindows } from './WindowContext';
import { IconButton, Menu, MenuItem, TextField, Select, FormControl, InputLabel, Chip, Tooltip } from '@mui/material';
import { ArrowUpward, ArrowDownward, MoreVert, Search } from '@mui/icons-material';

export const WindowTypes = {
  REWARD: 'reward',
  OFFER: 'offer',
  TUTORIAL: 'tutorial',
  EVENT: 'event',
  SYSTEM: 'system',
  PROGRESS: 'progress'
};

export const PriorityLevels = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export const initialWindows = [
  { id: '1', content: 'Обновление', type: WindowTypes.SYSTEM, priority: PriorityLevels.HIGH, line: 1, description: 'Блокирующий попап необходимости обновить приложение' },
  { id: '2', content: 'Покупки', type: WindowTypes.SYSTEM, priority: PriorityLevels.HIGH, line: 1, description: 'Обработка и начисление отложенных покупок' },
  { id: '3', content: 'Win Streak Loose', type: WindowTypes.EVENT, priority: PriorityLevels.MEDIUM, line: 2, description: 'Отображение потери стрика' },
  { id: '4', content: 'Island Fail', type: WindowTypes.EVENT, priority: PriorityLevels.MEDIUM, line: 2, description: 'При проигрыше в ивенте' },
  { id: '5', content: 'Анлок фичи', type: WindowTypes.SYSTEM, priority: PriorityLevels.MEDIUM, line: 2, description: 'Отображение анлока фичи (улетание шариков с иконки)' },
  { id: '6', content: 'New Booster', type: WindowTypes.TUTORIAL, priority: PriorityLevels.MEDIUM, line: 2, description: 'New Booster Open - перед уровнем с туториалом бустеров' },
  { id: '7', content: 'Нотификации', type: WindowTypes.SYSTEM, priority: PriorityLevels.LOW, line: 3, description: 'Попап запроса разрешения на показ нотификаций (iOS only)' },
  { id: '8', content: 'Челлендж', type: WindowTypes.PROGRESS, priority: PriorityLevels.MEDIUM, line: 2, description: 'Отображение изменения прогресса по челленджу' },
  { id: '9', content: 'Прогресс', type: WindowTypes.PROGRESS, priority: PriorityLevels.MEDIUM, line: 2, description: 'Отображение других изменений прогресса после завершения уровня' },
  { id: '10', content: 'Сундук уровней', type: WindowTypes.REWARD, priority: PriorityLevels.HIGH, line: 1, description: 'Открытие сундука уровней если он заполнился' },
  { id: '11', content: 'Сундук звёзд', type: WindowTypes.REWARD, priority: PriorityLevels.HIGH, line: 1, description: 'Открытие сундука звёзд если он заполнился' },
  { id: '12', content: 'Промокоды', type: WindowTypes.REWARD, priority: PriorityLevels.HIGH, line: 1, description: 'Начисление награды за промокоды' },
  { id: '13', content: 'New Pack', type: WindowTypes.EVENT, priority: PriorityLevels.MEDIUM, line: 2, description: 'New Pack Open - каждый холидей, 1 раз, при старте холидея' },
  { id: '14', content: 'Win Streak', type: WindowTypes.REWARD, priority: PriorityLevels.HIGH, line: 1, description: 'Win Streak Reward - получение награды' },
  { id: '15', content: 'Island Progress', type: WindowTypes.PROGRESS, priority: PriorityLevels.MEDIUM, line: 2, description: 'Island Progress - при каждом успешном выходе из уровня' },
  { id: '16', content: 'Collect Items', type: WindowTypes.REWARD, priority: PriorityLevels.HIGH, line: 1, description: 'Collect Items Event Reward - при доступности получения награды' },
  { id: '17', content: 'Star Tournament', type: WindowTypes.REWARD, priority: PriorityLevels.HIGH, line: 1, description: 'Star Tournament Reward - при доступности получения награды' },
  { id: '18', content: 'Boss Challenge', type: WindowTypes.REWARD, priority: PriorityLevels.HIGH, line: 1, description: 'Boss Challenge Reward - при доступности получения награды' },
  { id: '19', content: 'Гонка', type: WindowTypes.PROGRESS, priority: PriorityLevels.MEDIUM, line: 2, description: 'Прогресс гонки - если завершён этап, в котором пользователь принимал участие' },
  { id: '20', content: 'Харвест', type: WindowTypes.PROGRESS, priority: PriorityLevels.MEDIUM, line: 2, description: 'Окно прогресса харвест ивента - если ивент завершён и пользователь принимал в нём участие' },
  { id: '21', content: 'Piggy Bank', type: WindowTypes.OFFER, priority: PriorityLevels.MEDIUM, line: 2, description: 'Piggy Bank - при первом анлоке' },
  { id: '22', content: 'Collect Start', type: WindowTypes.EVENT, priority: PriorityLevels.MEDIUM, line: 2, description: 'Collect Items Event Start - однократно при старте нового ивента сбора предметов' },
  { id: '23', content: 'Star Tournament', type: WindowTypes.EVENT, priority: PriorityLevels.MEDIUM, line: 2, description: 'Star Tournament - однократно когда новый эвент доступен для старта' },
  { id: '24', content: 'Island Start', type: WindowTypes.EVENT, priority: PriorityLevels.MEDIUM, line: 2, description: 'Island Start - при старте ивента' },
  { id: '25', content: 'Honey Factory', type: WindowTypes.EVENT, priority: PriorityLevels.LOW, line: 3, description: 'Honey Factory - Annonce - В состоянии анонса, один раз в день' },
  { id: '26', content: 'Honey Factory', type: WindowTypes.EVENT, priority: PriorityLevels.MEDIUM, line: 2, description: 'Honey Factory - Start - В состоянии возможности старта, один раз за эвент' },
  { id: '27', content: 'Win Streak', type: WindowTypes.EVENT, priority: PriorityLevels.MEDIUM, line: 2, description: 'Win Streak Start - однократно в случае если запустился новый ивент вин стрик' },
  { id: '28', content: 'Челлендж оффер', type: WindowTypes.OFFER, priority: PriorityLevels.LOW, line: 3, description: 'Челлендж оффер - периодически, период конфигурируется' },
  { id: '29', content: 'Бест-старт', type: WindowTypes.OFFER, priority: PriorityLevels.MEDIUM, line: 2, description: 'Бест-старт оффер - один раз после каждого холодного старта' },
  { id: '30', content: 'Но-адс', type: WindowTypes.OFFER, priority: PriorityLevels.LOW, line: 3, description: 'Но-адс оффер - при активации оффера и после просмотра каждых N реклам' },
  { id: '31', content: 'Чейн оффер', type: WindowTypes.OFFER, priority: PriorityLevels.LOW, line: 3, description: 'Чейн оффер - один раз после каждого холодного старта' },
  { id: '32', content: 'Чуз ван', type: WindowTypes.OFFER, priority: PriorityLevels.LOW, line: 3, description: 'Чуз ван оффер - один раз после каждого холодного старта' },
  { id: '33', content: 'Дейли бонус', type: WindowTypes.REWARD, priority: PriorityLevels.HIGH, line: 1, description: 'Дейли бонус - если зарядился' },
  { id: '34', content: 'Челлендж', type: WindowTypes.EVENT, priority: PriorityLevels.MEDIUM, line: 2, description: 'Челлендж - если стартовал новый челендж' },
  { id: '35', content: 'Команда', type: WindowTypes.TUTORIAL, priority: PriorityLevels.MEDIUM, line: 2, description: 'Туториал о присоединении к команде - по достижении уровня когда открываются команды' },
  { id: '36', content: 'Гонка', type: WindowTypes.EVENT, priority: PriorityLevels.LOW, line: 3, description: 'Попап анонса/возможности старта гонки - один раз в календарный день' },
  { id: '37', content: 'Харвест', type: WindowTypes.EVENT, priority: PriorityLevels.LOW, line: 3, description: 'Окно возможности старта харвест ивента - один раз в календарный день' },
  { id: '38', content: 'Boss Challenge', type: WindowTypes.EVENT, priority: PriorityLevels.MEDIUM, line: 2, description: 'Boss Challenge - один раз в календарный день когда новый эвент доступен для старта' },
  { id: '39', content: 'Дейли челлендж', type: WindowTypes.TUTORIAL, priority: PriorityLevels.MEDIUM, line: 2, description: 'Туториал дейли челленджа - один раз при активации дейли челленджа' }
];


const VisualWindowSequenceManager = () => {
  const { windows, updateWindows } = useWindows();
  const [filteredWindows, setFilteredWindows] = useState(windows);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedWindow, setSelectedWindow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    let result = windows;
    if (searchTerm) {
      result = result.filter(w => 
        w.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (typeFilter !== 'all') {
      result = result.filter(w => w.type === typeFilter);
    }
    if (priorityFilter !== 'all') {
      result = result.filter(w => w.priority === priorityFilter);
    }
    setFilteredWindows(result);
  }, [windows, searchTerm, typeFilter, priorityFilter]);

  const moveWindow = (id, direction) => {
    const index = windows.findIndex(w => w.id === id);
    if (index !== -1) {
      const targetIndex = index + direction;
      if (targetIndex >= 0 && targetIndex < windows.length) {
        const newWindows = [...windows];
        [newWindows[index], newWindows[targetIndex]] = [newWindows[targetIndex], newWindows[index]];
        updateWindows(newWindows);
      }
    }
  };

  const moveToLine = (id, targetLine) => {
    const newWindows = windows.map(window => {
      if (window.id === id) {
        return { ...window, line: targetLine };
      }
      return window;
    });
    updateWindows(newWindows);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, window) => {
    setAnchorEl(event.currentTarget);
    setSelectedWindow(window);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWindow(null);
  };

  const getTypeColor = (type) => {
    switch(type) {
      case WindowTypes.REWARD: return '#4caf50';
      case WindowTypes.OFFER: return '#2196f3';
      case WindowTypes.TUTORIAL: return '#ff9800';
      case WindowTypes.EVENT: return '#9c27b0';
      case WindowTypes.SYSTEM: return '#f44336';
      case WindowTypes.PROGRESS: return '#00bcd4';
      default: return '#757575';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case PriorityLevels.HIGH: return '#f44336';
      case PriorityLevels.MEDIUM: return '#ff9800';
      case PriorityLevels.LOW: return '#4caf50';
      default: return '#757575';
    }
  };

  const renderWindow = (window, index) => (
    <div
      key={window.id}
      style={{
        width: '220px',
        padding: '15px',
        margin: '10px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        backgroundColor: '#ffffff',
        border: `2px solid ${getTypeColor(window.type)}`,
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>{window.content}</div>
      <Tooltip title={window.description} arrow>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px', height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {window.description}
        </div>
      </Tooltip>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <Chip label={window.type} size="small" style={{ backgroundColor: getTypeColor(window.type), color: 'white' }} />
        <Chip label={window.priority} size="small" style={{ backgroundColor: getPriorityColor(window.priority), color: 'white' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <IconButton onClick={() => moveWindow(window.id, -1)} size="small">
          <ArrowUpward />
        </IconButton>
        <IconButton onClick={() => moveWindow(window.id, 1)} size="small">
          <ArrowDownward />
        </IconButton>
        <IconButton onClick={(e) => handleMenuOpen(e, window)} size="small">
          <MoreVert />
        </IconButton>
      </div>
    </div>
  );

  const renderLine = (lineNumber) => {
    const lineWindows = filteredWindows.filter(w => w.line === lineNumber);
    return (
      <div 
        key={lineNumber}
        style={{ 
          marginBottom: '20px', 
          padding: '20px', 
          backgroundColor: '#f0f4f8', 
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Вход в лобби #{lineNumber}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {lineWindows.map((window, index) => renderWindow(window, index))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <TextField
          label="Поиск"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search />,
          }}
        />
        <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
          <InputLabel>Тип</InputLabel>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            label="Тип"
          >
            <MenuItem value="all">Все типы</MenuItem>
            {Object.entries(WindowTypes).map(([key, value]) => (
              <MenuItem key={key} value={value}>{value}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
          <InputLabel>Приоритет</InputLabel>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            label="Приоритет"
          >
            <MenuItem value="all">Все приоритеты</MenuItem>
            {Object.entries(PriorityLevels).map(([key, value]) => (
              <MenuItem key={key} value={value}>{value}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {Array.from({ length: 5 }).map((_, i) => renderLine(i + 1))}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <MenuItem key={i} onClick={() => moveToLine(selectedWindow.id, i + 1)}>
            Переместить в лобби {i + 1}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default VisualWindowSequenceManager;