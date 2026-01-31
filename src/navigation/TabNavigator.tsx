import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/DashboardScreen';
import { TripsListScreen } from '../screens/trips/TripsListScreen';
import { ExpensesListScreen } from '../screens/expenses/ExpensesListScreen';
import { ProfileScreen } from '../screens/users/ProfileScreen';
import { Colors } from '../constants/theme';
import { Home, Map, Wallet, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');



export const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#3b5998', // Qwash Blue
                tabBarInactiveTintColor: '#9E9E9E',
                tabBarLabelStyle: { fontSize: 10, marginBottom: 5, fontWeight: '600' },
            }}
        >
            <Tab.Screen
                name="Home"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ color }) => <Home color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="Trips" // Renamed from Orders
                component={TripsListScreen}
                options={{
                    tabBarIcon: ({ color }) => <Map color={color} size={24} />,
                }}
            />



            <Tab.Screen
                name="Expenses" // Renamed from Offers
                component={ExpensesListScreen}
                options={{
                    tabBarIcon: ({ color }) => <Wallet color={color} size={24} />,
                }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => <User color={color} size={24} />,
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 10,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        borderTopWidth: 0,
        paddingBottom: 0,
    },
    customButtonContainer: {
        top: -15, // Reduced from -30 to reduce "space"
        justifyContent: 'center',
        alignItems: 'center',
    },
    customButtonWrapper: {
        width: 64, // Slightly larger wrapper
        height: 64,
        borderRadius: 32,
        backgroundColor: 'white', // White border effect
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    appIcon: {
        width: 58, // Icon fits inside
        height: 58,
        borderRadius: 29,
    }
});
