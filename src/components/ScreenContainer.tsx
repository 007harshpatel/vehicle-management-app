import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants/theme';

interface ScreenContainerProps {
    children: React.ReactNode;
    style?: any;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, style }) => {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <View style={[styles.container, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
        padding: Spacing.md,
    },
});
