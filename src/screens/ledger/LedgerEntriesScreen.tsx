import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { getLedgerEntries, LedgerEntry } from '../../api/ledger';
import { Colors, Spacing } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';


export const LedgerEntriesScreen = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const [entries, setEntries] = useState<LedgerEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEntries = async () => {
        setLoading(true);
        try {
            const data = await getLedgerEntries();
            setEntries(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch entries', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
        const unsubscribe = navigation.addListener('focus', fetchEntries);
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }: { item: LedgerEntry }) => {
        const isCredit = item.entryType === 'credit';
        // Icon logic was: isCredit ? ArrowDownLeft : ArrowUpRight
        // Emoji logic: Credit (Get money) = ↙️ or 🟢. Debit (Give money/expense) = ↗️ or 🔴.
        const iconEmoji = isCredit ? '↙️' : '↗️';
        const color = isCredit ? Colors.success : Colors.error;

        return (
            <Card style={[styles.card, { padding: 0 }]}>
                <TouchableOpacity
                    style={styles.cardHeader}
                    onPress={() => navigation.navigate('CreateLedgerEntry', { entry: item })}
                >
                    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                        <Text style={{ fontSize: 24, color: color }}>{iconEmoji}</Text>
                    </View>
                    <View style={styles.headerText}>
                        <Text style={[styles.amount, { color: color }]}>
                            {isCredit ? '+' : '-'} ₹{item.amount}
                        </Text>
                        <Text style={styles.subtitle}>
                            Party: {item.party?.partyName || item.partyId}
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                <View style={styles.details}>
                    <View style={styles.row}>
                        <Text style={{ fontSize: 14, marginRight: 8 }}>📅</Text>
                        <Text style={styles.detail}>{item.date}</Text>
                    </View>
                    {item.notes && <Text style={styles.detail}>Note: {item.notes}</Text>}
                </View>
            </Card>
        );
    };

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text style={styles.title}>Ledger Entries</Text>
                <Button
                    title="Add Entry ➕"
                    onPress={() => navigation.navigate('CreateLedgerEntry')}
                    style={styles.addButton}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
                <FlatList
                    data={entries}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>No entries found</Text>}
                />
            )}
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    addButton: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    list: {
        paddingBottom: Spacing.xl,
    },
    card: {
        padding: Spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
    },
    headerText: {
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.sm,
    },
    amount: {
        fontSize: 18,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 12,
        color: Colors.textLight,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: Spacing.xs,
        opacity: 0.5,
    },
    details: {
        padding: Spacing.md,
        gap: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detail: {
        fontSize: 14,
        color: Colors.textLight,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.gray,
        marginTop: Spacing.xl,
    },
});
