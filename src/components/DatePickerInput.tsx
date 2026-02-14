import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Spacing, Colors, BorderRadius } from '../constants/theme';

interface DatePickerInputProps {
    label?: string;
    value?: Date | string;
    onChange: (date: Date) => void;
    error?: string;
    dateFormat?: string; // Optional format like YYYY-MM-DD
    editable?: boolean;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({ label, value, onChange, error, editable = true }) => {
    const [show, setShow] = useState(false);

    // Convert value to Date object for the picker
    const getSafeDate = (val: any) => {
        if (!val) return new Date();
        const d = val instanceof Date ? val : new Date(val);
        return isNaN(d.getTime()) ? new Date() : d;
    };

    const dateValue = getSafeDate(value);

    // Display value as YYYY-MM-DD
    const displayValue = value instanceof Date
        ? value.toISOString().split('T')[0]
        : (value ? value.toString().split('T')[0] : '');

    const handleChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShow(false);
        }

        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TouchableOpacity
                style={[styles.input, error ? styles.inputError : null, !editable && styles.disabledInput]}
                onPress={() => editable && setShow(true)}
                activeOpacity={editable ? 0.7 : 1}
            >
                <Text style={[styles.inputText, !displayValue && styles.placeholder]}>
                    {displayValue || 'Select Date'}
                </Text>
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {show && (
                Platform.OS === 'ios' ? (
                    // iOS often needs a Modal or a specific view wrapper depending on design, 
                    // but for simplicity we can render it inline or use a modal.
                    // Standard iOS behavior is often inline or bottom sheet.
                    // For this simple implementation we'll try inline if possible, or just wrap in a simple view.
                    // But typically default is spinner or inline. Let's wrap in a Modal for a cleaner "popup" feel on iOS if desired,
                    // or just render it below if inline. 
                    // Let's go with a Modal approach for iOS to mimic the "popup" behavior of Android 
                    <Modal transparent={true} animationType="slide">
                        <View style={styles.modalBackground}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalHeader}>
                                    <TouchableOpacity onPress={() => setShow(false)}>
                                        <Text style={styles.doneButton}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    value={dateValue}
                                    mode="date"
                                    display="spinner"
                                    onChange={handleChange}
                                    textColor={Colors.text}
                                />
                            </View>
                        </View>
                    </Modal>
                ) : (
                    <DateTimePicker
                        value={dateValue}
                        mode="date"
                        display="default"
                        onChange={handleChange}
                    />
                )
            )}
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
        justifyContent: 'center',
    },
    inputText: {
        fontSize: 16,
        color: Colors.text,
    },
    placeholder: {
        color: Colors.gray, // Assuming you have a gray or textLight color
    },
    inputError: {
        borderColor: Colors.error,
    },
    errorText: {
        color: Colors.error,
        fontSize: 12,
        marginTop: Spacing.xs,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: Colors.white,
        paddingBottom: Spacing.xl,
    },
    modalHeader: {
        padding: Spacing.md,
        alignItems: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    doneButton: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    disabledInput: {
        backgroundColor: Colors.background, // or a lighter gray
        opacity: 0.6,
    },
});
