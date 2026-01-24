import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { getDrivers, Driver } from '../../api/drivers';
import { Colors, Spacing } from '../../constants/theme';
import { Plus, UserCog, Phone, FileText, CheckCircle, AlertCircle, Pencil } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export const DriversListScreen = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<any>();

    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const data = await getDrivers();
            setDrivers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch drivers');
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
            <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => navigation.navigate('CreateDriver', { driver: item })}
            >
                <View style={[styles.iconContainer, { backgroundColor: '#2196F3' + '20' }]}>
                    <UserCog size={24} color="#2196F3" />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={styles.row}>
                        {item.status ? (
                            <>
                                <CheckCircle size={12} color={Colors.success} style={{ marginRight: 4 }} />
                                <Text style={[styles.subtitle, { color: Colors.success }]}>{item.status}</Text>
                            </>
                        ) : (
                            <Text style={styles.subtitle}>Active</Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.details}>
                <View style={styles.row}>
                    <Phone size={14} color={Colors.textLight} style={{ marginRight: 8 }} />
                    <Text style={styles.detail}>{item.mobile}</Text>
                </View>
                <View style={styles.row}>
                    <FileText size={14} color={Colors.textLight} style={{ marginRight: 8 }} />
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
                    title="Add Driver"
                    onPress={() => navigation.navigate('CreateDriver')}
                    icon={Plus}
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
