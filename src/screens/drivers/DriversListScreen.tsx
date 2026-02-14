import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { Eye, Pencil, History } from 'lucide-react-native';
import { BASE_URL } from '../../api/client';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { getDrivers, Driver } from '../../api/drivers';
import { Colors, Spacing } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';



export const DriversListScreen = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const data = await getDrivers();
            setDrivers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch drivers', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
        const unsubscribe = navigation.addListener('focus', fetchDrivers);
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }: { item: Driver }) => (
        <Card style={[styles.card, { padding: 0 }]}>
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: item.photo ? 'transparent' : '#2196F3' + '20' }]}>
                        {item.photo ? (
                            <Image source={{ uri: `${BASE_URL}/uploads/${item.photo}` }} style={styles.driverImage} />
                        ) : (
                            <Text style={{ fontSize: 24 }}>👨‍🔧</Text>
                        )}
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.name}>{item.name}</Text>
                        <View style={styles.row}>
                            {item.status ? (
                                <>
                                    <Text style={{ fontSize: 12, marginRight: 4, color: Colors.success }}>✅</Text>
                                    <Text style={[styles.subtitle, { color: Colors.success }]}>{item.status}</Text>
                                </>
                            ) : (
                                <Text style={styles.subtitle}>Active</Text>
                            )}
                        </View>
                    </View>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={[styles.iconButton, { backgroundColor: '#E3F2FD' }]}
                        onPress={() => navigation.navigate('CreateDriver', { driver: item, viewOnly: true })}
                    >
                        <Eye size={20} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.iconButton, { backgroundColor: '#FFF3E0' }]}
                        onPress={() => navigation.navigate('CreateDriver', { driver: item })}
                    >
                        <Pencil size={20} color={Colors.warning} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.iconButton, { backgroundColor: '#E8F5E9' }]}
                        onPress={() => navigation.navigate('DriverHistory', { driverId: item.id, driverName: item.name })}
                    >
                        <History size={20} color={Colors.success} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.details}>
                <View style={styles.row}>
                    <Text style={{ fontSize: 14, marginRight: 8 }}>📞</Text>
                    <Text style={styles.detail}>{item.mobile}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={{ fontSize: 14, marginRight: 8 }}>📄</Text>
                    <Text style={styles.detail}>{item.licenseNumber}</Text>
                </View>
            </View>
        </Card>
    );

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text style={styles.title}>Drivers</Text>
                <Button
                    title="Add Driver ➕"
                    onPress={() => navigation.navigate('CreateDriver')}
                    style={styles.addButton}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
                <FlatList
                    data={drivers}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>No drivers found</Text>}
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
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
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
        overflow: 'hidden',
    },
    driverImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    name: {
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
    editButton: {
        padding: Spacing.xs,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
});
