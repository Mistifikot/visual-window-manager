import { WindowTypes, PriorityLevels } from '../constants/windowTypes';

/**
 * Возвращает цвет в зависимости от типа окна
 * @param {string} type - Тип окна из WindowTypes
 * @returns {string} - Цвет в HEX формате
 */
export const getTypeColor = (type) => {
  switch (type) {
    case WindowTypes.REWARD: return '#00c853';
    case WindowTypes.OFFER: return '#ff9100';
    case WindowTypes.TUTORIAL: return '#2979ff';
    case WindowTypes.EVENT: return '#aa00ff';
    case WindowTypes.SYSTEM: return '#f50057';
    case WindowTypes.PROGRESS: return '#00b0ff';
    default: return '#616161';
  }
};

/**
 * Возвращает цвет в зависимости от приоритета
 * @param {string} priority - Приоритет из PriorityLevels
 * @returns {string} - Цвет в HEX формате
 */
export const getPriorityColor = (priority) => {
  switch (priority) {
    case PriorityLevels.HIGH: return '#f44336';
    case PriorityLevels.MEDIUM: return '#ff9800';
    case PriorityLevels.LOW: return '#4caf50';
    default: return '#757575';
  }
}; 