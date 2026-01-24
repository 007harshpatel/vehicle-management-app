import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { createUser, updateUser, User } from '../../api/users';
import { Spacing } from '../../constants/theme';

export const CreateUserScreen = ({ route }: any) => {
    const navigation = useNavigation();
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
            Alert.alert('Error', 'Name and Mobile are required');
            return;
        }

        setLoading(true);
        try {
            if (editingUser) {
                await updateUser(editingUser.id, {
                    name,
                    mobile,
                    email: email || undefined,
                    password: password || undefined, // Only update if provided
                    businessName: businessName || undefined,
                    gstNumber: gstNumber || undefined,
                });
                Alert.alert('Success', 'User updated successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                await createUser({
                    name,
                    mobile,
                    email: email || undefined,
                    password: password || undefined,
                    businessName: businessName || undefined,
                    gstNumber: gstNumber || undefined,
                });
                Alert.alert('Success', 'User created successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer>
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
