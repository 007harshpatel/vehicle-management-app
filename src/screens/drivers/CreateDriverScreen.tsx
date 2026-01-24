import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { DatePickerInput } from '../../components/DatePickerInput';
import { Button } from '../../components/Button';
import { createDriver, updateDriver, Driver } from '../../api/drivers';
import { Spacing } from '../../constants/theme';

export const CreateDriverScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const editingDriver = route.params?.driver as Driver | undefined;
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [licenseExpiry, setLicenseExpiry] = useState('');
    const [aadhaar, setAadhaar] = useState('');
    const [salaryType, setSalaryType] = useState('');
    const [salaryAmount, setSalaryAmount] = useState('');
    const [joiningDate, setJoiningDate] = useState('');

    React.useEffect(() => {
        if (editingDriver) {
            setName(editingDriver.name);
            setMobile(editingDriver.mobile);
            setLicenseNumber(editingDriver.licenseNumber);
            setLicenseExpiry(editingDriver.licenseExpiry || '');
            setAadhaar(editingDriver.aadhaar || '');
            setSalaryType(editingDriver.salaryType || '');
            setSalaryAmount(editingDriver.salaryAmount ? editingDriver.salaryAmount.toString() : '');
            setJoiningDate(editingDriver.joiningDate || '');
        }
    }, [editingDriver]);

    const handleSubmit = async () => {
        if (!name || !mobile || !licenseNumber) {
            Alert.alert('Error', 'Name, Mobile and License Number are required');
            return;
        }

        setLoading(true);
        try {
            if (editingDriver) {
                await updateDriver(editingDriver.id, {
                    name,
                    mobile,
                    licenseNumber,
                    licenseExpiry: licenseExpiry || undefined,
                    aadhaar: aadhaar || undefined,
                    salaryType: salaryType || undefined,
                    salaryAmount: salaryAmount ? Number(salaryAmount) : undefined,
                    joiningDate: joiningDate || undefined,
                });
                Alert.alert('Success', 'Driver updated successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                await createDriver({
                    name,
                    mobile,
                    licenseNumber,
                    licenseExpiry: licenseExpiry || undefined,
                    aadhaar: aadhaar || undefined,
                    salaryType: salaryType || undefined,
                    salaryAmount: salaryAmount ? Number(salaryAmount) : undefined,
                    joiningDate: joiningDate || undefined,
                });
                Alert.alert('Success', 'Driver created successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to create driver');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.content}>
                <Input label="Name *" value={name} onChangeText={setName} />
                <Input label="Mobile *" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
                <Input label="License Number *" value={licenseNumber} onChangeText={setLicenseNumber} />
                <DatePickerInput
                    label="License Expiry (YYYY-MM-DD)"
                    value={licenseExpiry}
                    onChange={(selectedDate) => setLicenseExpiry(selectedDate.toISOString().split('T')[0])}
                />
                <Input label="Aadhaar" value={aadhaar} onChangeText={setAadhaar} keyboardType="numeric" />
                <Input label="Salary Type (e.g. Monthly)" value={salaryType} onChangeText={setSalaryType} />
                <Input label="Salary Amount" value={salaryAmount} onChangeText={setSalaryAmount} keyboardType="numeric" />
                <DatePickerInput
                    label="Joining Date (YYYY-MM-DD)"
                    value={joiningDate}
                    onChange={(selectedDate) => setJoiningDate(selectedDate.toISOString().split('T')[0])}
                />

                <Button
                    title={editingDriver ? "Update Driver" : "Create Driver"}
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
