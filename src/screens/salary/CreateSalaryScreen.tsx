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
    const [salaryType, setSalaryType] = useState('Monthly');
    const [amount, setAmount] = useState('');
    const [salaryDate, setSalaryDate] = useState(new Date().toISOString().split('T')[0]);
    const [advance, setAdvance] = useState('');
    const [deduction, setDeduction] = useState('');

    useEffect(() => {
        if (editingSalary) {
            setDriverId(editingSalary.driverId.toString());
            setSalaryType(editingSalary.salaryType);
            setAmount(editingSalary.amount.toString());
            setSalaryDate(editingSalary.salaryDate);
            setAdvance(editingSalary.advance ? editingSalary.advance.toString() : '');
            setDeduction(editingSalary.deduction ? editingSalary.deduction.toString() : '');
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
        if (!driverId || !amount || !salaryType || !salaryDate) {
            showToast('Driver, Amount, Type and Date are required', 'warning');
            return;
        }

        setLoading(true);
        try {
            const data = {
                driverId: Number(driverId),
                salaryType,
                amount: Number(amount),
                salaryDate,
                advance: advance ? Number(advance) : undefined,
                deduction: deduction ? Number(deduction) : undefined,
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

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Salary Type *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={salaryType}
                            onValueChange={(itemValue: string) => setSalaryType(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Monthly" value="Monthly" />
                            <Picker.Item label="Trip-wise" value="Trip-wise" />
                        </Picker>
                    </View>
                </View>

                <Input label="Amount *" value={amount} onChangeText={setAmount} keyboardType="numeric" />
                <DatePickerInput
                    label="Date (YYYY-MM-DD) *"
                    value={salaryDate}
                    onChange={(selectedDate) => setSalaryDate(selectedDate.toISOString().split('T')[0])}
                />
                <Input label="Advance" value={advance} onChangeText={setAdvance} keyboardType="numeric" />
                <Input label="Deduction" value={deduction} onChangeText={setDeduction} keyboardType="numeric" />

                <Button
                    title={editingSalary ? "Update Payment" : "Record Payment"}
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
