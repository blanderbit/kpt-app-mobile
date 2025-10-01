import React, {useState} from "react";
import {StyleSheet, Text, View, ScrollView, ActivityIndicator} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {SectionItem} from "@shared/components/SectionItem/SectionItem";
import {BlackCheckmarkIcon} from "@assets/icons/BlackCheckmarkIcon";
import {GrayCircleIcon} from "@assets/icons/GrayCircleIcon";
import {RemoteSvg} from "@shared/components/RemoteSvgIcon/RemoteSvgIcon";
import {useSocialNetworks} from "@shared/services/api/hooks";

export default function FifthStep({onNext}: { onNext: () => void }) {

    const {theme} = useCustomTheme();
    const {data: socialNetworks, isLoading} = useSocialNetworks();

    const [ selectedNetworks, setSelectedNetworks ] = useState<string[]>([]);

    return (
        <View style={styles.container}>
            <View style={styles.formTop}>
                <View style={styles.head}>
                    <Text style={[styles.title, {...theme.fonts.title}]}>
                        How did you hear about us?
                    </Text>
                </View>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.buttons.primary.backgroundColor} />
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={theme.flexBlocks.vertical8}>
                        {socialNetworks?.map((network) => (
                            <SectionItem
                                key={network.id}
                                label={network.name}
                                icon={<RemoteSvg xml={network.svg}/>}
                                rightElement={
                                    selectedNetworks.includes(network.id)
                                        ? <BlackCheckmarkIcon color={theme.buttons.primary.backgroundColor}/>
                                        : <GrayCircleIcon/>
                                }
                                extraStyles={[styles.variantItem]}
                                onPress={() => setSelectedNetworks(prev => {
                                    if (prev.includes(network.id)) {
                                        return prev.filter(id => id !== network.id);
                                    } else {
                                        return [...prev, network.id];
                                    }
                                })}
                            />
                        ))}
                    </View>
                </ScrollView>
            )}

            {!!selectedNetworks.length && (
                <View style={styles.formBottom}>
                    <CustomButton
                        title={'Continue'}
                        onPress={onNext}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    formTop: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        paddingTop: 10,
        marginBottom: 8,
    },
    scrollView: {
        flex: 1,
        marginBottom: 50,
    },
    scrollContent: {
        paddingVertical: 8,
    },
    formBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        flexDirection: 'column',
        gap: 10,
        paddingTop: 10,
    },
    head: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        marginBottom: 10,
    },
    title: {
        textAlign: 'center',
    },
    variantItem: {
        borderRadius: 16
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
