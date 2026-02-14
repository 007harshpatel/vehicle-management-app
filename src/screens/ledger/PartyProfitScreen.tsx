import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { getTrips, Trip } from '../../api/trips';
import { Colors, Spacing } from '../../constants/theme';
import { Party } from '../../api/ledger';

export const PartyProfitScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const party = route.params?.party as Party;
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (party?.id) {
            fetchTrips();
        }
    }, [party]);

    const fetchTrips = async () => {
        setLoading(true);
        try {
            const data = await getTrips({ partyId: party.id });
            setTrips(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateProfit = () => {
        return trips.reduce((acc, trip) => {
            // Profit is (Total Amount - Expenses). 
            // Assuming 'totalProfit' from backend handles this logic correctly.
            // If backend logic is 'totalProfit', we use that.
            return acc + (Number(trip.totalProfit) || 0);
        }, 0);
    };

    const calculatePending = () => {
        return trips.reduce((acc, trip) => {
            return acc + (Number(trip.pendingAmount) || 0);
        }, 0);
    };

    const totalProfit = calculateProfit();
    const totalPending = calculatePending();
    const totalTrips = trips.length;

    const renderItem = ({ item }: { item: Trip }) => (
        <Card style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.tripDate}>{item.startDatetime?.split('T')[0]}</Text>
                <Text style={styles.tripAmount}>Bill No: {item.billNo}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.tripRoute}>{item.fromLocation} ➔ {item.toLocation}</Text>
                <Text style={styles.tripAmount}>Amt: ₹{item.totalAmount}</Text>
            </View>
            <View style={styles.row}>
                <Text style={[styles.profit, { color: Number(item.totalProfit) >= 0 ? Colors.success : Colors.error }]}>
                    Profit: ₹{item.totalProfit}
                </Text>
                {Number(item.pendingAmount) > 0 && (
                    <Text style={[styles.tripAmount, { color: Colors.warning }]}>
                        Pending: ₹{item.pendingAmount}
                    </Text>
                )}
            </View>
            <Text style={styles.tripDetails}>Vehicle: {item.vehicleNumber} {item.billDueDate ? `| Due: ${item.billDueDate.split('T')[0]}` : ''}</Text>
        </Card>
    );

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text style={styles.title}>{party?.partyName} - Profit Status</Text>
            </View>

            <Card style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Trips:</Text>
                    <Text style={styles.summaryValue}>{totalTrips}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Profit:</Text>
                    <Text style={[styles.summaryValue, { color: totalProfit >= 0 ? Colors.success : Colors.error }]}>
                        ₹{totalProfit.toFixed(2)}
                    </Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Pending:</Text>
                    <Text style={[styles.summaryValue, { color: Colors.error }]}>
                        ₹{totalPending.toFixed(2)}
                    </Text>
                </View>
            </Card>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={trips}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>No trips found for this party.</Text>}
                />
            )}
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    summaryCard: {
        marginBottom: Spacing.md,
        backgroundColor: Colors.background, // Or a slightly different shade
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.xs,
    },
    summaryLabel: {
        fontSize: 16,
        color: Colors.textLight,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    list: {
        paddingBottom: Spacing.xl,
    },
    card: {
        marginBottom: Spacing.sm,
        padding: Spacing.md,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.xs,
    },
    tripDate: {
        fontSize: 14,
        color: Colors.textLight,
    },
    tripAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    tripRoute: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.text,
        flex: 1,
    },
    profit: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    tripDetails: {
        fontSize: 12,
        color: Colors.textLight,
        marginTop: 4,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: Spacing.xl,
        color: Colors.gray,
    }
});
