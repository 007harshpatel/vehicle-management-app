import React from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '../constants/theme';

interface ScreenContainerProps {
    children: React.ReactNode;
    title?: string;
    showBack?: boolean;
    style?: any;
    rightAction?: React.ReactNode;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
    children,
    title,
    showBack = true,
    style,
    rightAction
}) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <LinearGradient
                colors={['#141e30', '#243b55']}
                style={styles.headerBackground}
            >
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.headerContent}>
                        {showBack && navigation.canGoBack() ? (
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>{'<'}</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={{ width: 40 }} /> // Spacer
                        )}

                        <Text style={styles.headerTitle}>{title || ''}</Text>

                        <View style={styles.rightAction}>
                            {rightAction || <View style={{ width: 40 }} />}
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <View style={[styles.bodyContainer, style]}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    {children}
                </KeyboardAvoidingView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    headerBackground: {
        paddingBottom: 20, // Reverted to 20
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    safeArea: {
        // Safe area handled by padding top
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 5,
        paddingTop: 5,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        flex: 1,
    },
    rightAction: {
        width: 40,
        alignItems: 'flex-end',
    },
    bodyContainer: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        marginTop: -25, // Reverted to -25
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 15,
        paddingHorizontal: 20,
        overflow: 'hidden',
    },
});
