import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

type Props = SvgProps & {
    size?: number;
    color?: string;
};

const CheckMarkIcon: React.FC<Props> = ({ size = 24, color = "black", ...rest }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
            <Path
                d="M9.96875 20.6602C9.48047 20.6602 9.11914 20.4551 8.77734 20.0352L3.71875 13.707C3.47461 13.4043 3.36719 13.1211 3.36719 12.8281C3.36719 12.1543 3.86523 11.666 4.54883 11.666C4.97852 11.666 5.27148 11.8223 5.55469 12.2031L9.92969 17.8184L18.416 4.3418C18.709 3.88281 18.9922 3.7168 19.4707 3.7168C20.1543 3.7168 20.623 4.18555 20.623 4.85938C20.623 5.12305 20.5449 5.39648 20.3398 5.70898L11.1602 20.0254C10.877 20.4453 10.4863 20.6602 9.96875 20.6602Z"
                fill={color}
            />
        </Svg>
    );
};

export default React.memo(CheckMarkIcon);
