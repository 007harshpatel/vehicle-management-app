import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    visible: boolean;
    message: string;
    type?: ToastType;
    onHide?: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    visible,
    message,
    type = 'info',
    onHide,
    duration = 3000
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-100)).current;

    const show = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 50, // Top position
                friction: 5,
                useNativeDriver: true,
            })
        ]).start();

        if (duration > 0) {
            setTimeout(hide, duration);
        }
    };

    const hide = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            if (onHide) onHide();
        });
    };

    useEffect(() => {
        if (visible) {
            show();
        } else {
            hide();
        }
    }, [visible]);

    if (!visible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return <Text style={{ color: 'white', fontSize: 20 }}>✅</Text>;
            case 'error': return <Text style={{ color: 'white', fontSize: 20 }}>✕</Text>;
            case 'warning': return <Text style={{ color: 'white', fontSize: 20 }}>⚠️</Text>;
            case 'info': return <Text style={{ color: 'white', fontSize: 20 }}>ℹ️</Text>;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success': return '#4CAF50';
            case 'error': return '#FF5252';
            case 'warning': return '#FF9800';
            case 'info': return '#2196F3';
        }
    };

    const color = getColors();

    return (
        <Animated.View style={[
            styles.container,
            {
                opacity: fadeAnim,
                transform: [{ translateY }]
            }
        ]}>
            <View style={styles.card}>
                <View style={[styles.iconContainer, { backgroundColor: color }]}>
                    {getIcon()}
                </View>
                <Text style={styles.message}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0, // Will be driven by translateY
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
        paddingHorizontal: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 30, // Pill shape
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    message: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
    },
});
