import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { getExpenses, Expense } from '../../api/expenses';
import { Colors, Spacing } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { Plus, Tag, Calendar, Wallet, CreditCard, Truck, User } from 'lucide-react-native';

export const ExpensesListScreen = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const data = await getExpenses();
            setExpenses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch expenses', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
        const unsubscribe = navigation.addListener('focus', fetchExpenses);
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }: { item: Expense }) => (
        <Card style={[styles.card, { padding: 0 }]}>
            <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => navigation.navigate('CreateExpense', { expense: item })}
            >
                <View style={[styles.iconContainer, { backgroundColor: '#F44336' + '20' }]}>
                    <Wallet size={24} color="#F44336" />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.amount}>₹{item.amount}</Text>
                    <View style={styles.row}>
                        <Tag size={12} color={Colors.textLight} style={{ marginRight: 4 }} />
                        <Text style={styles.subtitle}>{item.category}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.details}>
                <View style={styles.row}>
                    <Calendar size={14} color={Colors.textLight} style={{ marginRight: 8 }} />
                    <Text style={styles.detail}>{item.date}</Text>
                </View>
                <View style={styles.row}>
                    <CreditCard size={14} color={Colors.textLight} style={{ marginRight: 8 }} />
                    <Text style={styles.detail}>{item.paymentMode}</Text>
                </View>
                {item.vehicle && (
                    <View style={styles.row}>
                        <Truck size={14} color={Colors.textLight} style={{ marginRight: 8 }} />
                        <Text style={styles.detail}>{item.vehicle.vehicleNumber}</Text>
                    </View>
                )}
                {!item.vehicle && item.vehicleId && (
                    <View style={styles.row}>
                        <Truck size={14} color={Colors.textLight} style={{ marginRight: 8 }} />
                        <Text style={styles.detail}>Vehicle ID: {item.vehicleId}</Text>
                    </View>
                )}
                {item.driver && (
                    <View style={styles.row}>
                        <User size={14} color={Colors.textLight} style={{ marginRight: 8 }} />
                        <Text style={styles.detail}>{item.driver.name}</Text>
                    </View>
                )}
                {!item.driver && item.driverId && (
                    <View style={styles.row}>
                        <User size={14} color={Colors.textLight} style={{ marginRight: 8 }} />
                        <Text style={styles.detail}>Driver ID: {item.driverId}</Text>
                    </View>
                )}
            </View>
        </Card>
    );

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text style={styles.title}>Expenses</Text>
                <Button
                    title="Add Expense"
                    onPress={() => navigation.navigate('CreateExpense')}
                    icon={Plus}
                    style={styles.addButton}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>No expenses found</Text>}
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
        color: Colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textLight,
        marginTop: 2,
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
