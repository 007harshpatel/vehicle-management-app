import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ScrollView, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { DatePickerInput } from '../../components/DatePickerInput';
import { Button } from '../../components/Button';
import { createExpense, updateExpense, Expense } from '../../api/expenses';
import { getVehicles, Vehicle } from '../../api/vehicles';
import { getDrivers, Driver } from '../../api/drivers';
import { Spacing, Colors, BorderRadius } from '../../constants/theme';

export const CreateExpenseScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const editingExpense = route.params?.expense as Expense | undefined;
    const [loading, setLoading] = useState(false);

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('Fuel');
    const [amount, setAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [vehicleId, setVehicleId] = useState('');
    const [driverId, setDriverId] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (editingExpense) {
            setDate(editingExpense.date);
            setCategory(editingExpense.category);
            setAmount(editingExpense.amount.toString());
            setPaymentMode(editingExpense.paymentMode);
            setVehicleId(editingExpense.vehicleId ? editingExpense.vehicleId.toString() : '');
            setDriverId(editingExpense.driverId ? editingExpense.driverId.toString() : '');
            setNotes(editingExpense.notes || '');
        }
    }, [editingExpense]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [vehiclesData, driversData] = await Promise.all([
                getVehicles(),
                getDrivers()
            ]);

            const vList = Array.isArray(vehiclesData) ? vehiclesData : [];
            const dList = Array.isArray(driversData) ? driversData : [];

            setVehicles(vList);
            setDrivers(dList);

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch required data');
        }
    };

    const handleSubmit = async () => {
        if (!date || !category || !amount || !paymentMode) {
            Alert.alert('Error', 'Date, Category, Amount and Payment Mode are required');
            return;
        }

        setLoading(true);
        try {
            if (editingExpense) {
                await updateExpense(editingExpense.id, {
                    date,
                    category,
                    amount: Number(amount),
                    paymentMode,
                    vehicleId: vehicleId ? Number(vehicleId) : undefined,
                    driverId: driverId ? Number(driverId) : undefined,
                    notes,
                });
                Alert.alert('Success', 'Expense updated successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                await createExpense({
                    date,
                    category,
                    amount: Number(amount),
                    paymentMode,
                    vehicleId: vehicleId ? Number(vehicleId) : undefined,
                    driverId: driverId ? Number(driverId) : undefined,
                    notes,
                });
                Alert.alert('Success', 'Expense created successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to create expense');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.content}>
                <DatePickerInput
                    label="Date (YYYY-MM-DD) *"
                    value={date}
                    onChange={(selectedDate) => setDate(selectedDate.toISOString().split('T')[0])}
                />

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={category}
                            onValueChange={(itemValue: string) => setCategory(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Fuel" value="Fuel" />
                            <Picker.Item label="Maintenance" value="Maintenance" />
                            <Picker.Item label="Driver salary" value="Driver salary" />
                            <Picker.Item label="Toll" value="Toll" />
                            <Picker.Item label="Insurance" value="Insurance" />
                            <Picker.Item label="EMI" value="EMI" />
                            <Picker.Item label="Office expenses" value="Office expenses" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
                    </View>
                </View>

                <Input label="Amount *" value={amount} onChangeText={setAmount} keyboardType="numeric" />

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Payment Mode *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={paymentMode}
                            onValueChange={(itemValue: string) => setPaymentMode(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Cash" value="Cash" />
                            <Picker.Item label="Bank" value="Bank" />
                            <Picker.Item label="UPI" value="UPI" />
                            <Picker.Item label="Cheque" value="Cheque" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Select Vehicle (Optional)</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={vehicleId}
                            onValueChange={(itemValue: string) => setVehicleId(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="None" value="" />
                            {vehicles.map((v) => (
                                <Picker.Item key={v.id} label={v.vehicleNumber} value={v.id.toString()} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Select Driver (Optional)</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={driverId}
                            onValueChange={(itemValue: string) => setDriverId(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="None" value="" />
                            {drivers.map((d) => (
                                <Picker.Item key={d.id} label={d.name} value={d.id.toString()} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <Input label="Notes" value={notes} onChangeText={setNotes} />

                <Button
                    title={editingExpense ? "Update Expense" : "Create Expense"}
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
        overflow: 'hidden',
        height: 50,
        justifyContent: 'center',
    },
    picker: {
        width: '100%',
        color: Colors.text,
    },
});
