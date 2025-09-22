import { ActivityType } from '@shared/services/api/types';

// Константа с типами активностей, которая обновляется при старте приложения
export let ACTIVITY_TYPES: Record<string, ActivityType> = {};

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
