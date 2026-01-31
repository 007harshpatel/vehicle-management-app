import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { createUser, updateUser, User } from '../../api/users';
import { Colors, Spacing } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';

export const CreateUserScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const editingUser = route.params?.user as User | undefined;
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [gstNumber, setGstNumber] = useState('');

    React.useEffect(() => {
        if (editingUser) {
            setName(editingUser.name);
            setMobile(editingUser.mobile);
            setEmail(editingUser.email || '');
            setBusinessName(editingUser.businessName || '');
            setGstNumber(editingUser.gstNumber || '');
            // Password logic: Leave empty to keep unchanged, or allow setting new one. 
            // We won't pre-fill password for security/logic reasons usually.
        }
    }, [editingUser]);

    const handleSubmit = async () => {
        if (!name || !mobile) {
            showToast('Name and Mobile are required', 'warning');
            return;
        }

        setLoading(true);
        try {
            const data = {
                name,
                mobile,
                email: email || undefined,
                password: password || undefined,
                businessName: businessName || undefined,
                gstNumber: gstNumber || undefined,
            };

            if (editingUser) {
                await updateUser(editingUser.id, data);
                showToast('User updated successfully', 'success');
            } else {
                // For creation, if password is not provided, default to 'password'
                await createUser({ ...data, password: data.password || 'password' });
                showToast('User created successfully', 'success');
            }
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message;
            const toastMessage = Array.isArray(errorMessage)
                ? errorMessage[0]
                : (errorMessage || 'Failed to create user');
            showToast(toastMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer title={editingUser ? "Edit User" : "Add User"}>
            <ScrollView contentContainerStyle={styles.content}>
                <Input label="Name *" value={name} onChangeText={setName} />
                <Input label="Mobile *" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
                <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Defaults to mobile if empty" />
                <Input label="Business Name" value={businessName} onChangeText={setBusinessName} />
                <Input label="GST Number" value={gstNumber} onChangeText={setGstNumber} />

                <Button
                    title={editingUser ? "Update User" : "Create User"}
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
