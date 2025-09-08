import React from 'react';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';

export const BlackCheckmarkIcon = (props: { width?: number; height?: number; color?: string }) => {
    const { width = 24, height = 24, color = 'black' } = props;

    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <G clipPath="url(#clip0)">
                <Path
                    d="M11.8359 22.0371C6.31836 22.0371 1.74805 17.4766 1.74805 11.9492C1.74805 6.43164 6.30859 1.86133 11.8262 1.86133C17.3535 1.86133 21.9238 6.43164 21.9238 11.9492C21.9238 17.4766 17.3535 22.0371 11.8359 22.0371ZM10.752 16.7734C11.1133 16.7734 11.4258 16.5879 11.6504 16.2559L16.2207 9.12695C16.3574 8.91211 16.4746 8.66797 16.4746 8.44336C16.4746 7.93555 16.0352 7.59375 15.5469 7.59375C15.2344 7.59375 14.9609 7.75977 14.7559 8.10156L10.7129 14.5664L8.82812 12.1738C8.58398 11.8613 8.34961 11.7441 8.04688 11.7441C7.53906 11.7441 7.14844 12.1543 7.14844 12.6523C7.14844 12.8965 7.23633 13.1309 7.41211 13.3457L9.80469 16.2559C10.0781 16.6074 10.3809 16.7734 10.752 16.7734Z"
                    fill={color}
                />
            </G>
            <Defs>
                <ClipPath id="clip0">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
};
