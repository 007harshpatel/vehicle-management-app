import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({ label, error, containerStyle, style, ...props }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, error ? styles.inputError : null, style]}
                placeholderTextColor={Colors.textLight}
                {...props}
            />
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
    input: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: 16,
        color: Colors.text,
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
