import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StarIcon } from '@assets/icons/StarIcon';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: number;
}

export default function StarRating({ rating, maxRating = 5, size = 20 }: StarRatingProps) {
    return (
        <View style={styles.container}>
            {Array.from({ length: maxRating }, (_, index) => (
                <View key={index}>
                    <StarIcon 
                        size={size}
                        color={index < rating ? '#F5A73B' : '#D1D5DB'}
                    />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
});
