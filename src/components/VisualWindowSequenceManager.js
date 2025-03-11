import React, { useState, useEffect } from 'react';
import { useWindows } from '../context/WindowContext';
import { 
  IconButton, Menu, MenuItem, TextField, Select, FormControl, InputLabel, 
  Chip, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Paper, Typography, Box, Badge, Divider, Fade, Tab, Tabs, InputAdornment
} from '@mui/material';
import { 
  ArrowUpward, ArrowDownward, MoreVert, Search, FilterList,
  Edit, Delete, Category, PriorityHigh, SwapVert, Clear, Apps, ClearAll
} from '@mui/icons-material';
import { WindowTypes, PriorityLevels } from '../constants/windowTypes';
import { getTypeColor, getPriorityColor } from '../utils/colorUtils';

const VisualWindowSequenceManager = () => {
  const { windows, updateWindows, updateWindow } = useWindows();
  const [filteredWindows, setFilteredWindows] = useState(windows);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedWindow, setSelectedWindow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'type', 'priority', 'edit', 'delete'
  const [dialogValue, setDialogValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [draggedWindow, setDraggedWindow] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [currentTab, setCurrentTab] = useState(0); // 0 - MainScreen, 1 - LevelExit
  const [groupByLine, setGroupByLine] = useState(true);

  useEffect(() => {
    let result = windows;
    
    // Фильтрация по плейсменту (на основе ID)
    if (currentTab === 0) {
      result = result.filter(w => parseInt(w.id) <= 50); // MainScreen плейсмент
    } else {
      result = result.filter(w => parseInt(w.id) > 50); // LevelExit плейсмент
    }
    
    // Остальные фильтры
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
  }, [windows, searchTerm, typeFilter, priorityFilter, currentTab]);

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

  const handleMenuClick = (event, window) => {
    setAnchorEl(event.currentTarget);
    setSelectedWindow(window);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = (type) => {
    if (selectedWindow) {
      setDialogType(type);
      if (type === 'type') {
        setDialogValue(selectedWindow.type);
      } else if (type === 'priority') {
        setDialogValue(selectedWindow.priority);
      } else if (type === 'edit') {
        // Для редактирования нам не нужен dialogValue, 
        // так как мы будем использовать отдельные состояния в диалоге
      }
      setDialogOpen(true);
      setAnchorEl(null);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedWindow(null);
  };

  const handleDialogSave = () => {
    if (selectedWindow) {
      const updatedWindow = { ...selectedWindow };
      
      if (dialogType === 'type') {
        updatedWindow.type = dialogValue;
      } else if (dialogType === 'priority') {
        updatedWindow.priority = dialogValue;
        
        // Обновляем line в соответствии с приоритетом
        if (dialogValue === PriorityLevels.HIGH) {
          updatedWindow.line = 1;
        } else if (dialogValue === PriorityLevels.MEDIUM) {
          updatedWindow.line = 2;
        } else if (dialogValue === PriorityLevels.LOW) {
          updatedWindow.line = 3;
        }
      } else if (dialogType === 'delete') {
        const newWindows = windows.filter(w => w.id !== selectedWindow.id);
        updateWindows(newWindows);
        setDialogOpen(false);
        setSelectedWindow(null);
        return;
      }
      
      updateWindow(updatedWindow);
      setDialogOpen(false);
      setSelectedWindow(null);
    }
  };

  const handleDeleteWindow = () => {
    setDialogType('delete');
    setDialogOpen(true);
    setAnchorEl(null);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setPriorityFilter('all');
  };

  // Drag and drop functionality
  const handleDragStart = (window) => {
    setDraggedWindow(window);
  };

  const handleDragOver = (e, window) => {
    e.preventDefault();
    setDragOver(window.id);
  };

  const handleDragEnd = () => {
    setDraggedWindow(null);
    setDragOver(null);
  };

  const handleDrop = (e, targetWindow) => {
    e.preventDefault();
    if (!draggedWindow || draggedWindow.id === targetWindow.id) return;

    // Find indices
    const draggedIndex = windows.findIndex(w => w.id === draggedWindow.id);
    const targetIndex = windows.findIndex(w => w.id === targetWindow.id);

    // Create a new array and swap items
    const newWindows = [...windows];
    [newWindows[draggedIndex], newWindows[targetIndex]] = [newWindows[targetIndex], newWindows[draggedIndex]];
    
    updateWindows(newWindows);
    setDraggedWindow(null);
    setDragOver(null);
  };

  const renderContent = () => {
    if (groupByLine) {
      return renderLines();
    } else {
      return renderWindows();
    }
  };

  const renderLines = () => {
    const lineGroups = {};
    
    filteredWindows.forEach(window => {
      if (!lineGroups[window.line]) {
        lineGroups[window.line] = [];
      }
      lineGroups[window.line].push(window);
    });

    return Object.entries(lineGroups)
      .sort(([lineA], [lineB]) => parseInt(lineA) - parseInt(lineB))
      .map(([line, windowsInLine]) => (
        <Box key={line} sx={lineStyle}>
          <Paper 
            elevation={0} 
            sx={lineHeaderStyle(getPriorityColorForLine(line))}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Line {line} - {getPriorityLabelByLine(line)}
            </Typography>
            <Badge 
              badgeContent={windowsInLine.length} 
              color={getPriorityColorName(line)} 
              sx={{ ml: 2 }}
            />
          </Paper>
          <Box sx={windowsContainerStyle}>
            {windowsInLine.map(window => renderWindow(window))}
          </Box>
        </Box>
      ));
  };

  const renderWindows = () => {
    return (
      <Box sx={windowsContainerStyle}>
        {filteredWindows.map(window => renderWindow(window))}
      </Box>
    );
  };

  const getPriorityLabelByLine = (line) => {
    switch (parseInt(line)) {
      case 1: return 'HIGH Priority';
      case 2: return 'MEDIUM Priority';
      case 3: return 'LOW Priority';
      default: return 'Priority';
    }
  };

  const getPriorityColorForLine = (line) => {
    switch (parseInt(line)) {
      case 1: return '#ff5252';
      case 2: return '#fb8c00';
      case 3: return '#4caf50';
      default: return '#777';
    }
  };

  const getPriorityColorName = (line) => {
    switch (parseInt(line)) {
      case 1: return 'error';
      case 2: return 'warning';
      case 3: return 'success';
      default: return 'default';
    }
  };

  const renderWindow = (window) => (
    <Fade in={true} timeout={300}>
      <Paper 
        key={window.id} 
        sx={{
          ...windowStyle,
          boxShadow: dragOver === window.id ? '0 0 0 2px #2196f3' : windowStyle.boxShadow,
          transform: draggedWindow?.id === window.id ? 'scale(1.03)' : 'scale(1)',
          borderLeft: `4px solid ${getTypeColor(window.type)}`
        }}
        draggable
        onDragStart={() => handleDragStart(window)}
        onDragOver={(e) => handleDragOver(e, window)}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDrop(e, window)}
      >
        <Box sx={windowHeaderStyle}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              flex: 1, 
              fontWeight: 'bold',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {window.content}
            <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>#{window.id}</Typography>
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => moveWindow(window.id, -1)}
            sx={iconButtonStyle}
          >
            <ArrowUpward fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => moveWindow(window.id, 1)}
            sx={iconButtonStyle}
          >
            <ArrowDownward fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={(e) => handleMenuClick(e, window)}
            sx={iconButtonStyle}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={windowContentStyle}>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2,
              color: 'text.secondary',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              height: '40px'
            }}
          >
            {window.description}
          </Typography>
          <Box sx={tagContainerStyle}>
            <Tooltip title={`Type: ${window.type}`}>
              <Chip 
                label={window.type} 
                size="small" 
                icon={<Category fontSize="small" />}
                sx={{ 
                  backgroundColor: `${getTypeColor(window.type)}20`,
                  color: getTypeColor(window.type),
                  fontWeight: 'bold',
                  mr: 1,
                  '&:hover': {
                    backgroundColor: `${getTypeColor(window.type)}30`,
                  }
                }} 
              />
            </Tooltip>
            <Tooltip title={`Priority: ${window.priority}`}>
              <Chip 
                label={window.priority} 
                size="small"
                icon={<PriorityHigh fontSize="small" />}
                sx={{ 
                  backgroundColor: `${getPriorityColor(window.priority)}20`,
                  color: getPriorityColor(window.priority),
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: `${getPriorityColor(window.priority)}30`,
                  }
                }} 
              />
            </Tooltip>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );

  const renderDialog = () => {
    if (dialogType === 'type') {
      return (
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Change Window Type</DialogTitle>
          <DialogContent>
            <FormControl fullWidth style={{ marginTop: '10px' }}>
              <Select
                value={dialogValue}
                onChange={(e) => setDialogValue(e.target.value)}
              >
                {Object.values(WindowTypes).map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleDialogSave} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      );
    } else if (dialogType === 'priority') {
      return (
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Change Priority</DialogTitle>
          <DialogContent>
            <FormControl fullWidth style={{ marginTop: '10px' }}>
              <Select
                value={dialogValue}
                onChange={(e) => setDialogValue(e.target.value)}
              >
                {Object.values(PriorityLevels).map(priority => (
                  <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleDialogSave} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      );
    } else if (dialogType === 'delete') {
      return (
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Delete Window</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this window?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleDialogSave} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      );
    } else if (dialogType === 'edit') {
      return (
        <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Window</DialogTitle>
          <DialogContent>
            {selectedWindow && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <TextField
                  label="Title"
                  fullWidth
                  value={selectedWindow.content}
                  onChange={(e) => setSelectedWindow({...selectedWindow, content: e.target.value})}
                />
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={selectedWindow.description}
                  onChange={(e) => setSelectedWindow({...selectedWindow, description: e.target.value})}
                />
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={selectedWindow.type}
                    label="Type"
                    onChange={(e) => {
                      setSelectedWindow({...selectedWindow, type: e.target.value});
                    }}
                  >
                    {Object.values(WindowTypes).map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={selectedWindow.priority}
                    label="Priority"
                    onChange={(e) => {
                      const priority = e.target.value;
                      let line = selectedWindow.line;
                      
                      if (priority === PriorityLevels.HIGH) {
                        line = 1;
                      } else if (priority === PriorityLevels.MEDIUM) {
                        line = 2;
                      } else if (priority === PriorityLevels.LOW) {
                        line = 3;
                      }
                      
                      setSelectedWindow({...selectedWindow, priority, line});
                    }}
                  >
                    {Object.values(PriorityLevels).map(priority => (
                      <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={() => {
              updateWindow(selectedWindow);
              handleDialogClose();
            }} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={3}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          mb: 3
        }}
      >
        <Tabs 
          value={currentTab} 
          onChange={(e, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
          textColor="primary"
          sx={{ 
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f5f5f7'
          }}
        >
          <Tab label="MainScreen (Лобби)" />
          <Tab label="LevelExit (Выход с уровня)" />
        </Tabs>

        <Paper 
          elevation={0} 
          sx={{
            p: 2,
            borderRadius: 0,
            background: 'linear-gradient(145deg, #f0f4f9, #ffffff)'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 2
          }}>
            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                p: 1,
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                minWidth: '280px',
                maxWidth: '400px',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  borderColor: '#bdbdbd'
                }
              }}
            >
              <Search sx={{ color: '#9e9e9e', mr: 1 }} />
              <TextField 
                placeholder="Search windows..." 
                variant="standard"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  endAdornment: searchTerm ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchTerm('')}
                        edge="end"
                      >
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
              />
            </Paper>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Apps />}
                onClick={() => setGroupByLine(!groupByLine)}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none'
                }}
              >
                {groupByLine ? 'Show All' : 'Group By Priority'}
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{ 
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  textTransform: 'none'
                }}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </Box>
          </Box>

          {showFilters && (
            <Fade in={showFilters}>
              <Box sx={{ 
                display: 'flex', 
                mt: 2, 
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    label="Type"
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    {Object.values(WindowTypes).map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    label="Priority"
                  >
                    <MenuItem value="all">All Priorities</MenuItem>
                    {Object.values(PriorityLevels).map(priority => (
                      <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {(searchTerm || typeFilter !== 'all' || priorityFilter !== 'all') && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<ClearAll />}
                    onClick={clearAllFilters}
                  >
                    Clear Filters
                  </Button>
                )}
                <Typography variant="body2" color="textSecondary">
                  Showing {filteredWindows.length} of {windows.length} windows
                </Typography>
              </Box>
            </Fade>
          )}
        </Paper>
      </Paper>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <SwapVert fontSize="small" sx={{ mr: 0.5 }} />
        Tip: You can drag and drop windows to reorder them
      </Typography>

      <Box>
        {renderContent()}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        elevation={3}
        sx={{ 
          '& .MuiPaper-root': {
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <MenuItem onClick={() => handleDialogOpen('edit')} sx={menuItemStyle}>
          <Edit fontSize="small" sx={{ mr: 1, color: '#2196f3' }} />
          Edit Window
        </MenuItem>
        <MenuItem onClick={() => handleDialogOpen('type')} sx={menuItemStyle}>
          <Category fontSize="small" sx={{ mr: 1, color: '#9c27b0' }} />
          Change Type
        </MenuItem>
        <MenuItem onClick={() => handleDialogOpen('priority')} sx={menuItemStyle}>
          <PriorityHigh fontSize="small" sx={{ mr: 1, color: '#ff9800' }} />
          Change Priority
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteWindow} sx={{ ...menuItemStyle, color: '#f44336' }}>
          <Delete fontSize="small" sx={{ mr: 1, color: '#f44336' }} />
          Delete Window
        </MenuItem>
      </Menu>

      {renderDialog()}
    </Box>
  );
};

// Styles with Material UI SX Prop
const lineStyle = {
  mb: 4
};

const lineHeaderStyle = (color) => ({
  p: 1.5,
  borderRadius: '10px',
  mb: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#f5f5f5',
  borderLeft: `4px solid ${color}`,
  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
});

const windowsContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 2
};

const windowStyle = {
  width: 280,
  borderRadius: '10px',
  overflow: 'hidden',
  backgroundColor: 'white',
  boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)'
  }
};

const windowHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  p: 1.5,
  backgroundColor: '#fafafa'
};

const windowContentStyle = {
  p: 2
};

const tagContainerStyle = {
  display: 'flex',
  mt: 1
};

const iconButtonStyle = {
  ml: 0.5,
  color: '#757575',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.05)',
    color: '#2196f3'
  }
};

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  py: 1,
  px: 2
};

export default VisualWindowSequenceManager; 