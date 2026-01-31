import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ScrollView, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { DatePickerInput } from '../../components/DatePickerInput';
import { Button } from '../../components/Button';
import { createMaintenance, updateMaintenance, Maintenance } from '../../api/maintenance';
import { getVehicles, Vehicle } from '../../api/vehicles';
import { Spacing, Colors, BorderRadius } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';

export const CreateMaintenanceScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const editingRecord = route.params?.maintenance as Maintenance | undefined;
    const [loading, setLoading] = useState(false);

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vehicleId, setVehicleId] = useState('');
    const [maintenanceType, setMaintenanceType] = useState('');
    const [date, setDate] = useState('');
    const [odometer, setOdometer] = useState('');
    const [vendor, setVendor] = useState('');
    const [description, setDescription] = useState('');
    const [totalCost, setTotalCost] = useState('');
    const [nextServiceDue, setNextServiceDue] = useState('');
    const [nextServiceDate, setNextServiceDate] = useState('');

    useEffect(() => {
        if (editingRecord) {
            setVehicleId(editingRecord.vehicleId.toString());
            setMaintenanceType(editingRecord.maintenanceType);
            setDate(editingRecord.date);
            setOdometer(editingRecord.odometer.toString());
            setVendor(editingRecord.vendor);
            setDescription(editingRecord.description);
            setTotalCost(editingRecord.totalCost.toString());
            setNextServiceDue(editingRecord.nextServiceDue ? editingRecord.nextServiceDue.toString() : '');
            setNextServiceDate(editingRecord.nextServiceDate || '');
        }
    }, [editingRecord]);

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const data = await getVehicles();
            setVehicles(data);
        } catch (error) {
            console.error(error);
            showToast('Failed to load vehicles', 'error');
        }
    };

    const handleSubmit = async () => {
        if (!vehicleId || !maintenanceType || !date || !totalCost) {
            showToast('Vehicle, Type, Date and Cost are required', 'warning');
            return;
        }

        setLoading(true);
        try {
            const formData = {
                vehicleId: Number(vehicleId),
                maintenanceType,
                date,
                odometer: Number(odometer),
                vendor,
                description,
                totalCost: Number(totalCost),
                nextServiceDue: nextServiceDue ? Number(nextServiceDue) : undefined,
                nextServiceDate: nextServiceDate || undefined,
            };

            if (editingRecord) {
                await updateMaintenance(editingRecord.id, formData);
                showToast('Maintenance record updated', 'success');
            } else {
                await createMaintenance(formData);
                showToast('Maintenance record created', 'success');
            }
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message;
            const toastMessage = Array.isArray(errorMessage)
                ? errorMessage[0]
                : (errorMessage || 'Failed to create record');
            showToast(toastMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer title={editingRecord ? "Edit Maintenance" : "Add Maintenance"}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Vehicle *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={vehicleId}
                            onValueChange={(itemValue) => setVehicleId(itemValue)}
                        >
                            <Picker.Item label="Select Vehicle" value="" />
                            {vehicles.map((vehicle) => (
                                <Picker.Item key={vehicle.id} label={vehicle.vehicleNumber} value={vehicle.id.toString()} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Type *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={maintenanceType}
                            onValueChange={(itemValue) => setMaintenanceType(itemValue)}
                        >
                            <Picker.Item label="Select Type" value="" />
                            <Picker.Item label="Service" value="Service" />
                            <Picker.Item label="Repair" value="Repair" />
                            <Picker.Item label="Tyre change" value="Tyre change" />
                            <Picker.Item label="Battery" value="Battery" />
                        </Picker>
                    </View>
                </View>

                <DatePickerInput
                    label="Date (YYYY-MM-DD) *"
                    value={date}
                    onChange={(selectedDate) => setDate(selectedDate.toISOString().split('T')[0])}
                />
                <Input label="Odometer *" value={odometer} onChangeText={setOdometer} keyboardType="numeric" />
                <Input label="Vendor *" value={vendor} onChangeText={setVendor} />
                <Input label="Description *" value={description} onChangeText={setDescription} />
                <Input label="Total Cost *" value={totalCost} onChangeText={setTotalCost} keyboardType="numeric" />
                <Input label="Next Service Due (km)" value={nextServiceDue} onChangeText={setNextServiceDue} keyboardType="numeric" />
                <DatePickerInput
                    label="Next Service Date"
                    value={nextServiceDate}
                    onChange={(selectedDate) => setNextServiceDate(selectedDate.toISOString().split('T')[0])}
                />

                <Button
                    title={editingRecord ? "Update Record" : "Create Record"}
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
