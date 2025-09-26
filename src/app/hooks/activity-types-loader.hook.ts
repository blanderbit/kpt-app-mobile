import { useEffect } from 'react';
import { useActivityTypes } from '@shared/services/api';
import { updateActivityTypes, ACTIVITY_TYPES } from '@shared/components/ActivityLabel';

export const useActivityTypesLoader = (options?: { enabled?: boolean }) => {
  const { data: activityTypes, isLoading, error, refetch, isSuccess } = useActivityTypes(options);

  useEffect(() => {
    if (isSuccess && activityTypes && activityTypes.length > 0) {
      console.log('Updating activity types with backend data:', activityTypes.length, 'types');
      updateActivityTypes(activityTypes);
    }
  }, [activityTypes, isSuccess]);

  const refreshActivityTypes = async () => {
    console.log('Refreshing activity types...');
    await refetch();
  };

  return {
    isLoading,
    error,
    isSuccess,
    refreshActivityTypes,
    currentTypesCount: Object.keys(ACTIVITY_TYPES).length
  };
};
