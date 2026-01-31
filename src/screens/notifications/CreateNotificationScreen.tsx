import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { DatePickerInput } from '../../components/DatePickerInput';
import { Button } from '../../components/Button';
import { createNotification } from '../../api/notifications';
import { Spacing } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';

export const CreateNotificationScreen = () => {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [targetRole, setTargetRole] = useState('');

    const handleSubmit = async () => {
        if (!title || !message || !targetRole) {
            showToast('Title, Message, and Target Role are required', 'warning');
            return;
        }

        setLoading(true);
        try {
            await createNotification({ title, message });
            showToast('Notification created', 'success');
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message;
            const toastMessage = Array.isArray(errorMessage)
                ? errorMessage[0]
                : (errorMessage || 'Failed to create notification');
            showToast(toastMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer title="Create Notification">
            <ScrollView contentContainerStyle={styles.content}>
                <Input label="Title *" value={title} onChangeText={setTitle} />
                <Input label="Message *" value={message} onChangeText={setMessage} multiline numberOfLines={3} style={{ height: 100, textAlignVertical: 'top' }} />
                <DatePickerInput
                    label="Due Date (YYYY-MM-DD)"
                    value={dueDate}
                    onChange={(selectedDate) => setDueDate(selectedDate.toISOString().split('T')[0])}
                />

                <Button
                    title="Send Notification"
                    onPress={handleSubmit}
                    loading={loading}
                    style={styles.button}
                />
            </ScrollView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingBottom: Spacing.xl,
    },
    button: {
        marginTop: Spacing.md,
    },
});
