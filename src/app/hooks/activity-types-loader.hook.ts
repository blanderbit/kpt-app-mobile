import { useEffect } from 'react';
import { useActivityTypes } from '@shared/services/api';
import { updateActivityTypes, ACTIVITY_TYPES } from '@shared/components/ActivityLabel';

export const useActivityTypesLoader = (options?: { enabled?: boolean }) => {
  const { data: activityTypes, isLoading, error, refetch, isSuccess } = useActivityTypes(options);

  useEffect(() => {
    if (isSuccess && activityTypes && activityTypes.length > 0) {
      updateActivityTypes(activityTypes);
    }
  }, [activityTypes, isSuccess]);

  const refreshActivityTypes = async () => {
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
