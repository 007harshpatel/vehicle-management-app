import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { getSalaries, Salary } from '../../api/salary';
import { Colors, Spacing } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';


export const SalaryListScreen = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const [salaries, setSalaries] = useState<Salary[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSalaries = async () => {
        setLoading(true);
        try {
            const data = await getSalaries();
            setSalaries(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch salaries', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalaries();
        const unsubscribe = navigation.addListener('focus', fetchSalaries);
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }: { item: Salary }) => (
        <Card style={[styles.card, { padding: 0 }]}>
            <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => navigation.navigate('CreateSalary', { salary: item })}
            >
                <View style={[styles.iconContainer, { backgroundColor: '#009688' + '20' }]}>
                    <Text style={{ fontSize: 24 }}>💵</Text>
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.amount}>₹{item.amount}</Text>
                    <Text style={styles.subtitle}>{item.salaryType}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.details}>
                <View style={styles.row}>
                    <Text style={{ fontSize: 14, marginRight: 8 }}>📅</Text>
                    <Text style={styles.detail}>{item.salaryDate}</Text>
                </View>
                {item.driver && (
                    <>
                        <View style={styles.row}>
                            <Text style={{ fontSize: 14, marginRight: 8 }}>👤</Text>
                            <Text style={styles.detail}>{item.driver.name}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={{ fontSize: 14, marginRight: 8 }}>📞</Text>
                            <Text style={styles.detail}>{item.driver.mobile}</Text>
                        </View>
                    </>
                )}
                {!item.driver && (
                    <View style={styles.row}>
                        <Text style={{ fontSize: 14, marginRight: 8 }}>👤</Text>
                        <Text style={styles.detail}>Driver ID: {item.driverId}</Text>
                    </View>
                )}
            </View>
        </Card>
    );

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text style={styles.title}>Salary Records</Text>
                <Button
                    title="Add Payment ➕"
                    onPress={() => navigation.navigate('CreateSalary')}
                    style={styles.addButton}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
                <FlatList
                    data={salaries}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>No salary records found</Text>}
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
