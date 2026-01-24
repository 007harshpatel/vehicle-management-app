import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ScrollView, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { DatePickerInput } from '../../components/DatePickerInput';
import { Button } from '../../components/Button';
import { createLedgerEntry, updateLedgerEntry, getParties, Party, LedgerEntry } from '../../api/ledger';
import { Spacing, Colors, BorderRadius } from '../../constants/theme';

export const CreateLedgerEntryScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const editingEntry = route.params?.entry as LedgerEntry | undefined;
    const [loading, setLoading] = useState(false);

    const [parties, setParties] = useState<Party[]>([]);
    const [partyId, setPartyId] = useState('');
    const [entryType, setEntryType] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (editingEntry) {
            setPartyId(editingEntry.partyId.toString());
            setEntryType(editingEntry.entryType);
            setAmount(editingEntry.amount.toString());
            setDate(editingEntry.date);
            setNotes(editingEntry.notes || '');
        }
    }, [editingEntry]);

    useEffect(() => {
        loadParties();
    }, []);

    const loadParties = async () => {
        try {
            const data = await getParties();
            setParties(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load parties');
        }
    };

    const handleSubmit = async () => {
        if (!partyId || !entryType || !amount || !date) {
            Alert.alert('Error', 'Party, Type, Amount and Date are required');
            return;
        }

        setLoading(true);
        try {
            if (editingEntry) {
                await updateLedgerEntry(editingEntry.id, {
                    partyId: Number(partyId),
                    entryType,
                    amount: Number(amount),
                    date,
                    notes,
                });
                Alert.alert('Success', 'Entry updated successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                await createLedgerEntry({
                    partyId: Number(partyId),
                    entryType,
                    amount: Number(amount),
                    date,
                    notes,
                });
                Alert.alert('Success', 'Entry recorded successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to create entry');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Party *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={partyId}
                            onValueChange={(itemValue) => setPartyId(itemValue)}
                        >
                            <Picker.Item label="Select Party" value="" />
                            {parties.map((party) => (
                                <Picker.Item key={party.id} label={party.partyName} value={party.id.toString()} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Entry Type (credit/debit) *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={entryType}
                            onValueChange={(itemValue) => setEntryType(itemValue)}
                        >
                            <Picker.Item label="Select Type" value="" />
                            <Picker.Item label="Credit" value="credit" />
                            <Picker.Item label="Debit" value="debit" />
                        </Picker>
                    </View>
                </View>
                <Input label="Amount *" value={amount} onChangeText={setAmount} keyboardType="numeric" />
                <DatePickerInput
                    label="Date (YYYY-MM-DD) *"
                    value={date}
                    onChange={(selectedDate) => setDate(selectedDate.toISOString().split('T')[0])}
                />
                <Input label="Notes" value={notes} onChangeText={setNotes} />

                <Button
                    title={editingEntry ? "Update Entry" : "Create Entry"}
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
