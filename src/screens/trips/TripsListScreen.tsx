import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { getTrips, Trip } from '../../api/trips';
import { Colors, Spacing } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { Plus, MapPin, Calendar, Receipt, Navigation } from 'lucide-react-native';

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
                    <Receipt size={24} color="#9C27B0" />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.route}>{item.billNo || 'No Bill No'}</Text>
                    <Text style={styles.subtitle}>{item.driverName || 'Unknown Driver'} | {item.supplyTo || 'Unknown Party'}</Text>
                </View>
                <View>
                    <Text style={[styles.subtitle, { color: item.tripStatus === 'Completed' ? Colors.success : Colors.textLight }]}>
                        {item.tripStatus || 'In Progress'}
                    </Text>
                </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.details}>
                <View style={styles.row}>
                    <Calendar size={14} color={Colors.textLight} style={{ marginRight: 8 }} />
                    <Text style={styles.detail}>{item.startDatetime ? item.startDatetime.split('T')[0] : ''}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={[styles.detail, { fontWeight: 'bold' }]}>Total: ₹{item.totalAmount}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.detail}>{item.details ? `${item.details.length} Details` : '0 Details'}</Text>
                </View>
            </View>
        </Card>
    );

    return (
        <ScreenContainer
            title="Trips"
            rightAction={
                <TouchableOpacity onPress={() => navigation.navigate('CreateTrip')} style={{ padding: 4 }}>
                    <Plus color="white" size={24} />
                </TouchableOpacity>
            }
        >

            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
                <FlatList
                    data={trips}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>No trips found</Text>}
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
});
