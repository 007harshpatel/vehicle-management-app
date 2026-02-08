import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { getMaintenance, Maintenance } from '../../api/maintenance';
import { Colors, Spacing } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';


export const MaintenanceListScreen = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const [records, setRecords] = useState<Maintenance[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const data = await getMaintenance();
            setRecords(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch maintenance records', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
        const unsubscribe = navigation.addListener('focus', fetchRecords);
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }: { item: Maintenance }) => (
        <Card style={[styles.card, { padding: 0 }]}>
            <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => navigation.navigate('CreateMaintenance', { maintenance: item })}
            >
                <View style={[styles.iconContainer, { backgroundColor: '#795548' + '20' }]}>
                    <Text style={{ fontSize: 24 }}>🔧</Text>
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.type}>{item.maintenanceType}</Text>
                    <Text style={[styles.amount, { color: Colors.primary }]}>₹{item.totalCost}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.details}>
                <View style={styles.row}>
                    <Text style={{ fontSize: 14, marginRight: 8 }}>📅</Text>
                    <Text style={styles.detail}>{item.date}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={{ fontSize: 14, marginRight: 8 }}>🚚</Text>
                    <Text style={styles.detail}>Vehicle No: {item.vehicle?.vehicleNumber || item.vehicleId}</Text>
                </View>
                {item.vendor && <Text style={styles.detail}>Vendor: {item.vendor}</Text>}
            </View>
        </Card>
    );

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text style={styles.title}>Maintenance</Text>
                <Button
                    title="Add Record ➕"
                    onPress={() => navigation.navigate('CreateMaintenance')}
                    style={styles.addButton}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
                <FlatList
                    data={records}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>No records found</Text>}
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
    type: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
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
