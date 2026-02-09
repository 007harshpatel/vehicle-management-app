import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { getTrips, Trip } from '../../api/trips';
import { Colors, Spacing } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';


export const TripsListScreen = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<any>();
    const { showToast } = useToast();

    const fetchTrips = async () => {
        setLoading(true);
        try {
            const data = await getTrips();
            setTrips(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch trips', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
        const unsubscribe = navigation.addListener('focus', fetchTrips);
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }: { item: Trip }) => (
        <Card style={[styles.card, { padding: 0 }]}>
            <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => navigation.navigate('CreateTrip', { trip: item })}
            >
                <View style={[styles.iconContainer, { backgroundColor: '#9C27B0' + '20' }]}>
                    <Text style={{ fontSize: 24 }}>🧾</Text>
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.route}>{item.billNo || 'No Bill No'}</Text>
                    <Text style={styles.subtitle}>{item.vehicleNumber || 'No Vehicle'} | {(item as any).driver?.name || item.driverName || 'Unknown Driver'}</Text>
                    <Text style={styles.subtitle}>{item.supplyTo || 'Unknown Party'}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.details}>
                <View style={styles.row}>
                    <Text style={{ fontSize: 14, marginRight: 8 }}>📅</Text>
                    <Text style={styles.detail}>{item.startDatetime ? item.startDatetime.split('T')[0] : ''}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={{ fontSize: 14, marginRight: 8 }}>📍</Text>
                    <Text style={styles.detail}>{item.fromLocation} → {item.toLocation}</Text>
                </View>

                <View style={[styles.divider, { marginVertical: 8 }]} />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ fontSize: 12, color: Colors.textLight }}>Deal Amount</Text>
                        <Text style={{ fontWeight: 'bold', color: Colors.primary }}>₹{item.dealAmount || 0}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 12, color: Colors.textLight }}>Pending</Text>
                        <Text style={{ fontWeight: 'bold', color: Colors.error }}>₹{item.pendingAmount || 0}</Text>
                    </View>
                </View>
            </View>
        </Card>
    );

    const [activeTab, setActiveTab] = useState('In Progress');

    const filteredTrips = trips.filter(trip => {
        // Handle potential mismatch in casing or undefined
        const status = trip.tripStatus || 'In Progress';
        return status === activeTab;
    });

    const renderTab = (tabName: string) => (
        <TouchableOpacity
            style={[styles.tab, activeTab === tabName && styles.activeTab]}
            onPress={() => setActiveTab(tabName)}
        >
            <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>{tabName}</Text>
        </TouchableOpacity>
    );

    return (
        <ScreenContainer
            title="Trips"
            rightAction={
                <TouchableOpacity onPress={() => navigation.navigate('CreateTrip')} style={{ padding: 4 }}>
                    <Text style={{ fontSize: 24, color: 'white' }}>➕</Text>
                </TouchableOpacity>
            }
        >
            {/* Tabs */}
            <View style={styles.tabContainer}>
                {renderTab('In Progress')}
                {renderTab('Complete')}
                {renderTab('Finished')}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
                <FlatList
                    data={filteredTrips}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>No {activeTab.toLowerCase()} trips found</Text>}
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
        paddingBottom: 100,
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
    routeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    route: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    arrow: {
        marginHorizontal: 8,
        color: Colors.textLight,
        fontWeight: 'bold',
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
    tabContainer: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: Colors.primary,
    },
    tabText: {
        color: Colors.text,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
