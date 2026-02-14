import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Colors, Spacing } from '../../constants/theme';
import { getDriverTransactions } from '../../api/drivers';
import { ArrowLeft } from 'lucide-react-native';

interface Transaction {
    id: string;
    type: 'Expense' | 'Salary' | 'Trip Expense';
    date: string;
    amount: number;
    note: string;
    category?: string;
    paymentMode?: string;
    tripId?: number;
}

export const DriverHistoryScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { driverId, driverName } = route.params;
    const [transactions, setTransactions] = useState<Transaction[]>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, [driverId]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const data = await getDriverTransactions(driverId);
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Salary': return '#4CAF50'; // Green
            case 'Expense': return '#F44336'; // Red
            case 'Trip Expense': return '#FF9800'; // Orange
            default: return Colors.text;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Salary': return '💰';
            case 'Expense': return '💸';
            case 'Trip Expense': return '🚚';
            default: return '📄';
        }
    };

    const renderItem = ({ item }: { item: Transaction }) => (
        <Card style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: getTypeColor(item.type) + '20' }]}>
                    <Text style={{ fontSize: 20 }}>{getTypeIcon(item.type)}</Text>
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.type}>{item.type}</Text>
                    <Text style={styles.date}>{item.date}</Text>
                </View>
                <Text style={[styles.amount, { color: getTypeColor(item.type) }]}>
                    ₹{item.amount}
                </Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.note}>{item.note}</Text>
            {item.tripId && (
                <Text style={styles.subtext}>Trip ID: {item.tripId}</Text>
            )}
            {item.paymentMode && (
                <Text style={styles.subtext}>Payment: {item.paymentMode}</Text>
            )}
        </Card>
    );

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={Colors.text} size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>{driverName}'s History</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>No transactions found</Text>}
                />
            )}
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    backButton: {
        marginRight: Spacing.sm,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    list: {
        paddingBottom: Spacing.xl,
    },
    loader: {
        marginTop: Spacing.xl,
    },
    card: {
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.sm,
    },
    headerText: {
        flex: 1,
    },
    type: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    date: {
        fontSize: 12,
        color: Colors.textLight,
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: Spacing.sm,
        opacity: 0.5,
    },
    note: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: 4,
    },
    subtext: {
        fontSize: 12,
        color: Colors.textLight,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.gray,
        marginTop: Spacing.xl,
    },
});
