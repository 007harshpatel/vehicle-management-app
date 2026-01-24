import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import {
    Users,
    UserCog,
    Truck,
    MapPin,
    Wallet,
    Banknote,
    BookOpen,
    Wrench,
    Bell,
    LogOut
} from 'lucide-react-native';

export const DashboardScreen = () => {
    const { logout } = useAuth();
    const navigation = useNavigation<any>();

    const menuItems = [
        { title: 'Users', icon: Users, route: 'UsersList', color: '#4CAF50' },
        { title: 'Drivers', icon: UserCog, route: 'DriversList', color: '#2196F3' },
        { title: 'Vehicles', icon: Truck, route: 'VehiclesList', color: '#FF9800' },
        { title: 'Trips', icon: MapPin, route: 'TripsList', color: '#9C27B0' },
        { title: 'Expenses', icon: Wallet, route: 'ExpensesList', color: '#F44336' },
        { title: 'Salary', icon: Banknote, route: 'SalaryList', color: '#009688' },
        { title: 'Ledger', icon: BookOpen, route: 'LedgerParties', color: '#607D8B' },
        { title: 'Maintenance', icon: Wrench, route: 'MaintenanceList', color: '#795548' },
        { title: 'Notifications', icon: Bell, route: 'CreateNotification', color: '#E91E63' },
    ];

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text style={styles.title}>Dashboard</Text>
                <Text style={styles.subtitle}>Welcome back</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.card}
                            onPress={() => navigation.navigate(item.route)}
                            activeOpacity={0.9}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                                <item.icon size={32} color={item.color} />
                            </View>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <LogOut size={20} color={Colors.error} style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: Spacing.xl,
        paddingTop: Spacing.sm,
    },
    header: {
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.text,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.gray,
        marginTop: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: Spacing.md,
    },
    card: {
        width: '47%', // slightly less than 48 to fit gap
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4, // Android shadow
        borderWidth: 1,
        borderColor: Colors.border + '40', // transparent border
    },
    iconContainer: {
        padding: Spacing.md,
        borderRadius: BorderRadius.xl, // circle-ish
        marginBottom: Spacing.md,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        textAlign: 'center',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.xl * 2,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.error,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.error,
    },
});
