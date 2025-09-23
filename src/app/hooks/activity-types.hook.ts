// import { useMemo } from 'react';
// import { useActivityTypes } from '@shared/services/api';
// import { ActivityType } from '@shared/services/api/types';

// export const useActivityTypesForLabels = () => {
//     const { data: activityTypes, isLoading, error } = useActivityTypes();

//     const activityTypesForLabels = useMemo(() => {
//         return activityTypes?.map((activityType: ActivityType) => ({
//             id: activityType.id,
//             name: activityType.name,
//             description: activityType.description,
//             iconEmoji: activityType.icon,
//             color: activityType.color,
//             backgroundColor: `${activityType.color}4D`, // 30% opacity
//             category: activityType.category
//         })) || [];
//     }, [activityTypes]);

//     return {
//         activityTypes: activityTypesForLabels,
//         isLoading,
//         error
//     };
// };
