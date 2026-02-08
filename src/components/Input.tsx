import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    rightIcon?: React.ReactNode;
    onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({ label, error, containerStyle, style, rightIcon, onRightIconPress, ...props }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error ? styles.inputError : null, style]}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={Colors.textLight}
                    {...props}
                />
                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: Spacing.xs,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
    },
    input: {
        flex: 1,
        paddingVertical: Spacing.md,
        fontSize: 16,
        color: Colors.text,
    },
    rightIcon: {
        padding: Spacing.xs,
    },
    inputError: {
        borderColor: Colors.error,
    },
    errorText: {
        color: Colors.error,
        fontSize: 12,
        marginTop: Spacing.xs,
    },
});
