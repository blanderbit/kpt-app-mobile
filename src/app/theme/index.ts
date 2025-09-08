import { ViewStyle, TextStyle, FlexAlignType, ImageSourcePropType } from 'react-native';

export const COLORS = {
    white: '#FFFFFF',
    black: '#000000',
    warning: '#F5A73B',
    error: '#F53B3B',
    gray_light: '#F5F5F5',
    gray_dark:' #BBBBBB',
    primary: '#115541',
    border_1: '#E3E3E3',
};


interface ButtonStyle extends ViewStyle {
    textColor?: string;
}

interface FontStyle extends TextStyle {
}

export interface Theme {
    backgroundImage?: ImageSourcePropType,
    background: string,
    buttons: {
        primary: ButtonStyle;
        appleSignBtn: ButtonStyle;
        smallBtn: ButtonStyle;
    };
    fonts: {
        regular: FontStyle;
        title: FontStyle;
        titleSecond: FontStyle;
        subtitle: FontStyle;
        subtitleSecond: FontStyle;
        subheader: FontStyle;
        label: FontStyle;
        labelSecond: FontStyle;
        articleText: FontStyle;
    };
    flexBlocks: {
        justifyCenter: ViewStyle,
        justifySpaceBetween: ViewStyle,
        alignCenter: ViewStyle,
        horizontal4: ViewStyle,
        horizontal8: ViewStyle,
        vertical4: ViewStyle,
        vertical8: ViewStyle,
        vertical16: ViewStyle,
    },
    containers: {
        card: ViewStyle,
        cardRound: ViewStyle,
    }
}

export const pinkTheme: Theme = {
    backgroundImage: require('@assets/images/2x@Background Rose.png'),
    background: '#F3D2D5',
    buttons: {
        primary: {
            backgroundColor: COLORS.black,
            textColor: COLORS.white
        },
        appleSignBtn: {
            backgroundColor: COLORS.white,
            textColor: COLORS.black,
            borderColor: COLORS.border_1,
            borderWidth: 2
        },
        smallBtn: {
            backgroundColor: COLORS.white,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center' as FlexAlignType,
            width: 32,
            height: 32,
        }
    },
    fonts: {
        regular: {
            fontFamily: 'SF Pro Display',
            fontSize: 14,
            lineHeight: 20
        },
        title: {
            fontFamily: 'PP Editorial New',
            fontSize: 40,
            lineHeight: 44
        },
        titleSecond: {
            fontFamily: 'PP Editorial New',
            fontSize: 24,
            lineHeight: 28
        },
        subtitle: {
            fontFamily: 'Inter',
            fontWeight: '600',
            fontSize: 14,
            lineHeight: 20,
            opacity: 0.4,
            textAlign: 'center',
        },
        subtitleSecond: {
            fontFamily: 'SF Pro Display',
            fontWeight: 700,
            fontSize: 16,
            lineHeight: 22,
            opacity: .4
        },
        subheader: {
            fontFamily: 'Inter',
            fontWeight: '500',
            fontSize: 20,
            lineHeight: 28,
            letterSpacing: -0.5
        },
        label: {
            fontFamily: 'Inter',
            fontWeight: '600',
            fontSize: 12,
            lineHeight: 16,
        },
        labelSecond: {
            fontFamily: 'Inter',
            fontWeight: '600',
            fontSize: 16,
            lineHeight: 24,
            letterSpacing: -0.3
        },
        articleText: {
            fontFamily: 'SF Pro Display',
            fontSize: 16,
            lineHeight: 22,
            opacity: 0.6,
            fontWeight: 400
        }
    },
    flexBlocks: {
        justifyCenter: {
            flexDirection: 'row',
            justifyContent: 'center'
        },
        justifySpaceBetween: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        alignCenter: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        horizontal4: {
            flexDirection: 'row',
            gap: 4,
            alignItems: 'center',
        },
        horizontal8: {
            flexDirection: 'row',
            gap: 8
        },
        vertical4: {
            flexDirection: 'column',
            gap: 4
        },
        vertical8: {
            flexDirection: 'column',
            gap: 8
        },
        vertical16: {
            flexDirection: 'column',
            gap: 16
        }
    },
    containers: {
        card: {
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            width: '100%',
            flexDirection: 'column',
            gap: 8
        },
        cardRound: {
            backgroundColor: COLORS.white,
            width: '100%',
            flexDirection: 'column',
            gap: 8,
            borderRadius: 24,
            paddingVertical: 16,
            paddingHorizontal: 8
        }
    }
};

export const greenTheme: Theme = {
    backgroundImage: require('@assets/images/2x@Background Green.png'),
    background: '#EFFAE1',
    buttons: {
        primary: {
            backgroundColor: COLORS.primary,
            textColor: COLORS.white
        },
        appleSignBtn: {
            backgroundColor: COLORS.black,
            textColor: COLORS.white
        },
        smallBtn: {
            backgroundColor: COLORS.white,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center' as FlexAlignType,
            width: 32,
            height: 32
        }
    },
    fonts: {
        regular: {
            fontFamily: 'SF Pro Display',
            fontSize: 14,
            lineHeight: 20
        },
        title: {
            fontFamily: 'Tilt Wrap',
            fontWeight: '700',
            fontSize: 40,
            lineHeight: 44,
            letterSpacing: -0.4
        },
        titleSecond: {
            fontFamily: 'PP Editorial New',
            fontSize: 24,
            lineHeight: 28
        },
        subtitle: {
            fontFamily: 'Inter',
            fontWeight: '600',
            fontSize: 14,
            lineHeight: 20,
            opacity: 0.4,
            textAlign: 'center',
        },
        subtitleSecond: {
            fontFamily: 'SF Pro Display',
            fontWeight: 700,
            fontSize: 16,
            lineHeight: 22,
            opacity: .4
        },
        subheader: {
            fontFamily: 'Inter',
            fontWeight: '500',
            fontSize: 20,
            lineHeight: 28,
            letterSpacing: -0.5
        },
        label: {
            fontFamily: 'Inter',
            fontWeight: '600',
            fontSize: 12,
            lineHeight: 16,
        },
        labelSecond: {
            fontFamily: 'Inter',
            fontWeight: '600',
            fontSize: 16,
            lineHeight: 24,
            letterSpacing: -0.3
        },
        articleText: {
            fontFamily: 'SF Pro Display',
            fontSize: 16,
            lineHeight: 22,
            opacity: 0.6,
            fontWeight: 400
        }
    },
    flexBlocks: {
        justifyCenter: {
            flexDirection: 'row',
            justifyContent: 'center'
        },
        justifySpaceBetween: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        alignCenter: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        horizontal4: {
            flexDirection: 'row',
            gap: 4
        },
        horizontal8: {
            flexDirection: 'row',
            gap: 8
        },
        vertical4: {
            flexDirection: 'column',
            gap: 4
        },
        vertical8: {
            flexDirection: 'column',
            gap: 8
        },
        vertical16: {
            flexDirection: 'column',
            gap: 16
        }
    },
    containers: {
        card: {
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            width: '100%',
            flexDirection: 'column',
            gap: 8
        },
        cardRound: {
            backgroundColor: COLORS.white,
            width: '100%',
            flexDirection: 'column',
            gap: 8,
            borderRadius: 24,
            paddingVertical: 16,
            paddingHorizontal: 8
        }
    }
};


export const FONT_SIZE = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const BORDER_RADIUS = {
    sm: 4,
    md: 8,
    lg: 12,
};
