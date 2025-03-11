/**
 * Типы окон
 */
export type WindowType = 'reward' | 'offer' | 'tutorial' | 'event' | 'system' | 'progress';

/**
 * Уровни приоритета
 */
export type PriorityLevel = 'high' | 'medium' | 'low';

/**
 * Интерфейс окна
 */
export interface Window {
  /** Уникальный идентификатор */
  id: string;
  
  /** Заголовок окна */
  content: string;
  
  /** Тип окна */
  type: WindowType;
  
  /** Приоритет */
  priority: PriorityLevel;
  
  /** Линия отображения (1 - высокий, 2 - средний, 3 - низкий) */
  line: number;
  
  /** Описание окна */
  description: string;
}

/**
 * Интерфейс контекста окон
 */
export interface WindowContextType {
  /** Список всех окон */
  windows: Window[];
  
  /** Функция для обновления списка окон */
  updateWindows: (newWindows: Window[]) => void;
  
  /** Функция для обновления одного окна */
  updateWindow: (updatedWindow: Window) => void;
} 