import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ScrollView, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { DatePickerInput } from '../../components/DatePickerInput';
import { Button } from '../../components/Button';
import { createTrip, updateTrip, Trip } from '../../api/trips';
import { getVehicles, Vehicle } from '../../api/vehicles';
import { getDrivers, Driver } from '../../api/drivers';
import { Spacing, Colors, BorderRadius } from '../../constants/theme';

export const CreateTripScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const editingTrip = route.params?.trip as Trip | undefined;
    const [loading, setLoading] = useState(false);

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);

    const [vehicleId, setVehicleId] = useState('');
    const [driverId, setDriverId] = useState('');
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [startDatetime, setStartDatetime] = useState(new Date().toISOString().split('T')[0]);
    const [billAmount, setBillAmount] = useState('');
    const [tripStatus, setTripStatus] = useState('Planned');

    useEffect(() => {
        if (editingTrip) {
            setVehicleId(editingTrip.vehicleId.toString());
            setDriverId(editingTrip.driverId.toString());
            setFromLocation(editingTrip.fromLocation);
            setToLocation(editingTrip.toLocation);
            setStartDatetime(editingTrip.startDatetime ? editingTrip.startDatetime.split('T')[0] : '');
            setBillAmount(editingTrip.billAmount.toString());
            setTripStatus(editingTrip.tripStatus || 'Planned');
        }
    }, [editingTrip]);

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

            if (vList.length > 0) setVehicleId(vList[0].id.toString());
            if (dList.length > 0) setDriverId(dList[0].id.toString());

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch required data');
        }
    };

    const handleSubmit = async () => {
        if (!vehicleId || !driverId || !fromLocation || !toLocation || !billAmount) {
            Alert.alert('Error', 'Vehicle, Driver, Locations, and Bill Amount are required');
            return;
        }

        setLoading(true);
        try {
            if (editingTrip) {
                await updateTrip(editingTrip.id, {
                    vehicleId: Number(vehicleId),
                    driverId: Number(driverId),
                    fromLocation,
                    toLocation,
                    startDatetime,
                    endDatetime: undefined,
                    billAmount: Number(billAmount),
                    tripStatus
                });
                Alert.alert('Success', 'Trip updated successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                await createTrip({
                    vehicleId: Number(vehicleId),
                    driverId: Number(driverId),
                    fromLocation,
                    toLocation,
                    startDatetime,
                    endDatetime: undefined,
                    billAmount: Number(billAmount),
                    tripStatus
                });
                Alert.alert('Success', 'Trip created successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to create trip');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Select Vehicle *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={vehicleId}
                            onValueChange={(itemValue: string) => setVehicleId(itemValue)}
                            style={styles.picker}
                        >
                            {vehicles.map((v) => (
                                <Picker.Item key={v.id} label={v.vehicleNumber} value={v.id.toString()} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Select Driver *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={driverId}
                            onValueChange={(itemValue: string) => setDriverId(itemValue)}
                            style={styles.picker}
                        >
                            {drivers.map((d) => (
                                <Picker.Item key={d.id} label={d.name} value={d.id.toString()} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <Input label="From Location *" value={fromLocation} onChangeText={setFromLocation} />
                <Input label="To Location *" value={toLocation} onChangeText={setToLocation} />
                <DatePickerInput
                    label="Start Date (YYYY-MM-DD) *"
                    value={startDatetime}
                    onChange={(selectedDate) => setStartDatetime(selectedDate.toISOString().split('T')[0])}
                />
                <Input label="Bill Amount *" value={billAmount} onChangeText={setBillAmount} keyboardType="numeric" />

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Status *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={tripStatus}
                            onValueChange={(itemValue: string) => setTripStatus(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Planned" value="Planned" />
                            <Picker.Item label="In Progress" value="In Progress" />
                            <Picker.Item label="Completed" value="Completed" />
                            <Picker.Item label="Cancelled" value="Cancelled" />
                        </Picker>
                    </View>
                </View>

                <Button
                    title={editingTrip ? "Update Trip" : "Create Trip"}
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
