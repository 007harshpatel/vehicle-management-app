import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { DatePickerInput } from '../../components/DatePickerInput';
import { Button } from '../../components/Button';
import { createDriver, updateDriver, Driver } from '../../api/drivers';
import { Colors, Spacing } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';

export const CreateDriverScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const { showToast } = useToast();
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
            showToast('Name, Mobile and License Number are required', 'warning');
            return;
        }

        setLoading(true);
        const data = {
            name,
            mobile,
            licenseNumber,
            licenseExpiry: licenseExpiry || undefined,
            aadhaar: aadhaar || undefined,
            salaryType: salaryType || undefined,
            salaryAmount: salaryAmount ? Number(salaryAmount) : undefined,
            joiningDate: joiningDate || undefined,
        };

        try {
            if (editingDriver) {
                await updateDriver(editingDriver.id, data);
                showToast('Driver updated successfully', 'success');
            } else {
                await createDriver(data);
                showToast('Driver created successfully', 'success');
            }
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message;
            const toastMessage = Array.isArray(errorMessage)
                ? errorMessage[0]
                : (errorMessage || 'Failed to create driver');
            showToast(toastMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer title={editingDriver ? "Edit Driver" : "Add Driver"}>
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
