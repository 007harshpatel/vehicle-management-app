import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { getVehicles, Vehicle } from '../../api/vehicles';
import { Colors, Spacing } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { Plus, Truck, Hash, Box, Info } from 'lucide-react-native';

export const VehiclesListScreen = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const data = await getVehicles();
            setVehicles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch vehicles', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
        const unsubscribe = navigation.addListener('focus', fetchVehicles);
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }: { item: Vehicle }) => (
        <Card style={[styles.card, { padding: 0 }]}>
            <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => navigation.navigate('CreateVehicle', { vehicle: item })}
            >
                <View style={[styles.iconContainer, { backgroundColor: '#FF9800' + '20' }]}>
                    <Truck size={24} color="#FF9800" />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.number}>{item.vehicleNumber}</Text>
                    <Text style={styles.subtitle}>{item.vehicleType}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.details}>
                <View style={styles.row}>
                    <Box size={14} color={Colors.textLight} style={{ marginRight: 8 }} />
                    <Text style={styles.detail}>Capacity: {item.capacity} tons</Text>
                </View>
                {item.status && (
                    <View style={styles.row}>
                        <Info size={14} color={Colors.textLight} style={{ marginRight: 8 }} />
                        <Text style={styles.detail}>{item.status}</Text>
                    </View>
                )}
            </View>
        </Card>
    );

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text style={styles.title}>Vehicles</Text>
                <Button
                    title="Add Vehicle"
                    onPress={() => navigation.navigate('CreateVehicle')}
                    icon={Plus}
                    style={styles.addButton}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
                <FlatList
                    data={vehicles}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>No vehicles found</Text>}
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
    number: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
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
