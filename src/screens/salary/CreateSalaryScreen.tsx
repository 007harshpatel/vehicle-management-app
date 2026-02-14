import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ScrollView, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'; // Ensure this is installed
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { DatePickerInput } from '../../components/DatePickerInput';
import { Button } from '../../components/Button';
import { createSalary, updateSalary, Salary } from '../../api/salary';
import { getDrivers, Driver } from '../../api/drivers';
import { Spacing, Colors, BorderRadius } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';

export const CreateSalaryScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const editingSalary = route.params?.salary as Salary | undefined;
    const [loading, setLoading] = useState(false);
    const [drivers, setDrivers] = useState<Driver[]>([]);

    const [driverId, setDriverId] = useState('');
    const [amount, setAmount] = useState('');
    const [salaryDate, setSalaryDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');

    useEffect(() => {
        if (editingSalary) {
            setDriverId(editingSalary.driverId.toString());
            setAmount(editingSalary.amount.toString());
            setSalaryDate(editingSalary.salaryDate);
            setNote(editingSalary.note || '');
        }
    }, [editingSalary]);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const data = await getDrivers();
            const list = Array.isArray(data) ? data : [];
            setDrivers(list);
            if (list.length > 0) {
                setDriverId(list[0].id.toString());
            }
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch drivers', 'error');
        }
    };

    const handleSubmit = async () => {
        if (!driverId || !amount || !salaryDate) {
            showToast('Driver, Amount and Date are required', 'warning');
            return;
        }

        if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            showToast('Amount must be a valid positive number', 'warning');
            return;
        }

        if (note.length > 200) {
            showToast('Note cannot exceed 200 characters', 'warning');
            return;
        }

        setLoading(true);
        try {
            const data = {
                driverId: Number(driverId),
                amount: Number(amount),
                salaryDate,
                note: note.trim(),
            };

            if (editingSalary) {
                await updateSalary(editingSalary.id, data);
                showToast('Salary record updated', 'success');
            } else {
                await createSalary(data);
                showToast('Salary payment recorded', 'success');
            }
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message;
            const toastMessage = Array.isArray(errorMessage)
                ? errorMessage[0]
                : (errorMessage || 'Failed to create salary record');
            showToast(toastMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer title={editingSalary ? "Edit Salary" : "Record Salary"}>
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Select Driver *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={driverId}
                            onValueChange={(itemValue: string) => setDriverId(itemValue)}
                            style={styles.picker}
                        >
                            {drivers.map((driver) => (
                                <Picker.Item key={driver.id} label={driver.name} value={driver.id.toString()} />
                            ))}
                        </Picker>
                    </View>
                </View>



                <Input
                    label="Amount *"
                    value={amount}
                    onChangeText={(text) => {
                        const sanitized = text.replace(/[^0-9.]/g, '');
                        if ((sanitized.match(/\./g) || []).length <= 1 && sanitized.length <= 10) {
                            setAmount(sanitized);
                        }
                    }}
                    keyboardType="numeric"
                    maxLength={10}
                />
                <DatePickerInput
                    label="Date (YYYY-MM-DD) *"
                    value={salaryDate}
                    onChange={(selectedDate) => setSalaryDate(selectedDate.toISOString().split('T')[0])}
                />
                <Input
                    label="Note"
                    value={note}
                    onChangeText={setNote}
                    maxLength={200}
                    multiline
                    numberOfLines={3}
                />

                <Button
                    title={editingSalary ? "Update Payment" : "Record Payment"}
                    onPress={handleSubmit}
                    loading={loading}
                    style={styles.button}
                />
            </ScrollView>
        </ScreenContainer >
    );
};

const styles = StyleSheet.create({
    content: {
        paddingBottom: Spacing.xl,
    },
    button: {
        marginTop: Spacing.md,
    },
    inputGroup: {
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: 8,
        fontWeight: '500',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.white,
        overflow: 'hidden', // Required for borderRadius on Android
        height: 50,
        justifyContent: 'center',
    },
    picker: {
        // height: 50, // Often problematic on Android if set explicitly too small, defaults are usually fine
        width: '100%',
        color: Colors.text,
    },
});
