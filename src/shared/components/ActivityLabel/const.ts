import { ActivityType } from '@shared/services/api/types';

// Константа с типами активностей, которая обновляется при старте приложения
export let ACTIVITY_TYPES: Record<string, ActivityType> = {
  // Базовые типы по умолчанию (fallback)
  'sport': {
    id: 'sport',
    name: 'Спорт',
    description: 'Физическая активность',
    icon: '🏃‍♂️',
    color: '#245DF5',
    category: 'physical'
  },
  'work': {
    id: 'work',
    name: 'Работа',
    description: 'Рабочие задачи',
    icon: '💼',
    color: '#246B56',
    category: 'professional'
  },
  'study': {
    id: 'study',
    name: 'Учеба',
    description: 'Образовательная деятельность',
    icon: '📚',
    color: '#BE7715',
    category: 'educational'
  },
  'health': {
    id: 'health',
    name: 'Здоровье',
    description: 'Забота о здоровье',
    icon: '🏥',
    color: '#DD583D',
    category: 'health'
  },
  'hobby': {
    id: 'hobby',
    name: 'Хобби',
    description: 'Досуг и развлечения',
    icon: '🎨',
    color: '#CA21D0',
    category: 'leisure'
  },
  'social': {
    id: 'social',
    name: 'Социальное',
    description: 'Общение с людьми',
    icon: '👥',
    color: '#810085',
    category: 'social'
  }
};

export const updateActivityTypes = (newActivityTypes: ActivityType[]) => {
  const updatedTypes: Record<string, ActivityType> = {};
  
  newActivityTypes.forEach(activityType => {
    updatedTypes[activityType.id] = activityType;
  });
  
  ACTIVITY_TYPES = updatedTypes;
  console.log('Activity types updated from backend:', ACTIVITY_TYPES);
  console.log('Total types loaded:', Object.keys(ACTIVITY_TYPES).length);
};

export const getActivityTypeById = (id: string): ActivityType | undefined => {
  return ACTIVITY_TYPES[id];
};

export const getAllActivityTypes = (): ActivityType[] => {
  return Object.values(ACTIVITY_TYPES);
};

export const getAllActivityTypeIds = (): string[] => {
  return Object.keys(ACTIVITY_TYPES);
};
