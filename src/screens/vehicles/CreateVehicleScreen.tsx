import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { DatePickerInput } from '../../components/DatePickerInput';
import { Button } from '../../components/Button';
import { createVehicle, updateVehicle, Vehicle } from '../../api/vehicles';
import { Spacing, Colors, BorderRadius } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';

export const CreateVehicleScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const editingVehicle = route.params?.vehicle as Vehicle | undefined;
    const [loading, setLoading] = useState(false);

    const [vehicleNumber, setVehicleNumber] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [insuranceExpiry, setInsuranceExpiry] = useState('');
    const [pucExpiry, setPucExpiry] = useState('');
    const [fitnessExpiry, setFitnessExpiry] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [status, setStatus] = useState('');

    React.useEffect(() => {
        if (editingVehicle) {
            setVehicleNumber(editingVehicle.vehicleNumber);
            setVehicleType(editingVehicle.vehicleType);
            setCapacity(editingVehicle.capacity.toString());
            setInsuranceExpiry(editingVehicle.insuranceExpiry || '');
            setPucExpiry(editingVehicle.pucExpiry || '');
            setFitnessExpiry(editingVehicle.fitnessExpiry || '');
            setPurchaseDate(editingVehicle.purchaseDate || '');
            setPurchasePrice(editingVehicle.purchasePrice ? editingVehicle.purchasePrice.toString() : '');
            setStatus(editingVehicle.status || '');
        }
    }, [editingVehicle]);

    const handleSubmit = async () => {
        if (!vehicleNumber || !vehicleType || !capacity) {
            showToast('Vehicle Number, Type and Capacity are required', 'warning');
            return;
        }

        setLoading(true);
        try {
            const data = {
                vehicleNumber,
                vehicleType,
                capacity: Number(capacity),
                insuranceExpiry: insuranceExpiry || undefined,
                pucExpiry: pucExpiry || undefined,
                fitnessExpiry: fitnessExpiry || undefined,
                purchaseDate: purchaseDate || undefined,
                purchasePrice: purchasePrice ? Number(purchasePrice) : undefined,
                status: status || undefined,
            };

            if (editingVehicle) {
                await updateVehicle(editingVehicle.id, data);
                showToast('Vehicle updated successfully', 'success');
            } else {
                await createVehicle(data);
                showToast('Vehicle created successfully', 'success');
            }
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message;
            const toastMessage = Array.isArray(errorMessage)
                ? errorMessage[0]
                : (errorMessage || 'Failed to create vehicle');
            showToast(toastMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer title={editingVehicle ? "Edit Vehicle" : "Add Vehicle"}>
            <ScrollView contentContainerStyle={styles.content}>
                <Input label="Vehicle Number *" value={vehicleNumber} onChangeText={setVehicleNumber} />
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Vehicle Type *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={vehicleType}
                            onValueChange={(itemValue) => setVehicleType(itemValue)}
                        >
                            <Picker.Item label="Select Type" value="" />
                            <Picker.Item label="Truck" value="Truck" />
                            <Picker.Item label="Tempo" value="Tempo" />
                            <Picker.Item label="Car" value="Car" />
                            <Picker.Item label="Tractor" value="Tractor" />
                        </Picker>
                    </View>
                </View>
                <Input label="Capacity (kg/ton) *" value={capacity} onChangeText={setCapacity} keyboardType="numeric" />
                <DatePickerInput
                    label="Insurance Expiry (YYYY-MM-DD)"
                    value={insuranceExpiry}
                    onChange={(selectedDate) => setInsuranceExpiry(selectedDate.toISOString().split('T')[0])}
                />
                <DatePickerInput
                    label="PUC Expiry (YYYY-MM-DD)"
                    value={pucExpiry}
                    onChange={(selectedDate) => setPucExpiry(selectedDate.toISOString().split('T')[0])}
                />
                <DatePickerInput
                    label="Fitness Expiry (YYYY-MM-DD)"
                    value={fitnessExpiry}
                    onChange={(selectedDate) => setFitnessExpiry(selectedDate.toISOString().split('T')[0])}
                />
                <DatePickerInput
                    label="Purchase Date (YYYY-MM-DD)"
                    value={purchaseDate}
                    onChange={(selectedDate) => setPurchaseDate(selectedDate.toISOString().split('T')[0])}
                />
                <Input label="Purchase Price" value={purchasePrice} onChangeText={setPurchasePrice} keyboardType="numeric" />
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Status</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={status}
                            onValueChange={(itemValue) => setStatus(itemValue)}
                        >
                            <Picker.Item label="Select Status" value="" />
                            <Picker.Item label="Active" value="Active" />
                            <Picker.Item label="Sold" value="Sold" />
                            <Picker.Item label="Under maintenance" value="Under maintenance" />
                        </Picker>
                    </View>
                </View>

                <Button
                    title={editingVehicle ? "Update Vehicle" : "Create Vehicle"}
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
    inputContainer: {
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: Spacing.xs,
        fontWeight: '500',
    },
    pickerContainer: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        overflow: 'hidden',
    },
});
