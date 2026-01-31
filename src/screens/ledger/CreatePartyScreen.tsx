import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { createParty, updateParty, Party } from '../../api/ledger';
import { Spacing, Colors, BorderRadius } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';

export const CreatePartyScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const editingParty = route.params?.party as Party | undefined;
    const [loading, setLoading] = useState(false);

    const [partyName, setPartyName] = useState('');
    const [partyType, setPartyType] = useState('');
    const [contact, setContact] = useState('');
    const [creditLimit, setCreditLimit] = useState('');

    React.useEffect(() => {
        if (editingParty) {
            setPartyName(editingParty.partyName);
            setPartyType(editingParty.partyType);
            setContact(editingParty.contact || '');
            setCreditLimit(editingParty.creditLimit ? editingParty.creditLimit.toString() : '');
        }
    }, [editingParty]);

    const handleSubmit = async () => {
        if (!partyName || !partyType) {
            showToast('Name and Type are required', 'warning');
            return;
        }

        setLoading(true);
        try {
            const data = {
                partyName,
                partyType,
                contact: contact || undefined,
                creditLimit: creditLimit ? Number(creditLimit) : undefined,
            };

            if (editingParty) {
                await updateParty(editingParty.id, data);
                showToast('Party updated successfully', 'success');
            } else {
                await createParty(data);
                showToast('Party created successfully', 'success');
            }
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message;
            const toastMessage = Array.isArray(errorMessage)
                ? errorMessage[0]
                : (errorMessage || 'Failed to create party');
            showToast(toastMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer title={editingParty ? "Edit Party" : "Add Party"}>
            <ScrollView contentContainerStyle={styles.content}>
                <Input label="Party Name *" value={partyName} onChangeText={setPartyName} />
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Party Type (Customer/Broker) *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={partyType}
                            onValueChange={(itemValue) => setPartyType(itemValue)}
                        >
                            <Picker.Item label="Select Type" value="" />
                            <Picker.Item label="Customer" value="Customer" />
                            <Picker.Item label="Broker" value="Broker" />
                        </Picker>
                    </View>
                </View>
                <Input label="Contact" value={contact} onChangeText={setContact} keyboardType="phone-pad" />
                <Input label="Credit Limit" value={creditLimit} onChangeText={setCreditLimit} keyboardType="numeric" />

                <Button
                    title={editingParty ? "Update Party" : "Create Party"}
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
