import React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

type ArchiveIconProps = {
    size?: number;
};

export const ArchiveIcon = ({ size = 24 }: ArchiveIconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
            <LinearGradient
                id="archiveGradient"
                x1="12"
                y1="0"
                x2="12"
                y2="24"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#CA21D0" />
                <Stop offset="1" stopColor="#810085" />
            </LinearGradient>
        </Defs>
        <Path
            d="M5.53125 8.83594C4.55469 8.83594 4.04688 8.27344 4.04688 7.29688V6.53906C4.04688 5.5625 4.58594 5 5.53125 5H18.4688C19.4531 5 19.9531 5.5625 19.9531 6.53906V7.29688C19.9531 8.27344 19.4531 8.83594 18.4688 8.83594H5.53125ZM7.71875 19.7344C6.05469 19.7344 5.14062 18.8359 5.14062 17.1797V10.0312H18.8672V17.1797C18.8672 18.8359 17.9453 19.7344 16.2812 19.7344H7.71875ZM9.52344 13.1172H14.4844C14.8828 13.1172 15.1719 12.8281 15.1719 12.4141V12.1641C15.1719 11.75 14.8828 11.4688 14.4844 11.4688H9.52344C9.125 11.4688 8.83594 11.75 8.83594 12.1641V12.4141C8.83594 12.8281 9.125 13.1172 9.52344 13.1172Z"
            fill="url(#archiveGradient)"
        />
    </Svg>
);
