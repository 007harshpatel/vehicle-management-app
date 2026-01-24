import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, StyleProp } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

import { LucideIcon } from 'lucide-react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    style?: StyleProp<ViewStyle>;
    textStyle?: TextStyle;
    loading?: boolean;
    disabled?: boolean;
    icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    style,
    textStyle,
    loading = false,
    disabled = false,
    icon: Icon,
}) => {
    const getBackgroundColor = () => {
        if (disabled) return Colors.gray;
        switch (variant) {
            case 'primary': return Colors.primary;
            case 'secondary': return Colors.secondary;
            case 'outline': return 'transparent';
            case 'danger': return Colors.error;
            default: return Colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return Colors.white;
        switch (variant) {
            case 'primary': return Colors.white;
            case 'secondary': return Colors.primary;
            case 'outline': return Colors.primary;
            case 'danger': return Colors.white;
            default: return Colors.white;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                variant === 'outline' && styles.outlineButton,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {Icon && <Icon size={20} color={getTextColor()} style={styles.icon} />}
                    <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    outlineButton: {
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    icon: {
        marginRight: Spacing.sm,
    },
});
