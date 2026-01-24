import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';

import { UsersListScreen } from '../screens/users/UsersListScreen';
import { CreateUserScreen } from '../screens/users/CreateUserScreen';
import { DriversListScreen } from '../screens/drivers/DriversListScreen';
import { CreateDriverScreen } from '../screens/drivers/CreateDriverScreen';
import { VehiclesListScreen } from '../screens/vehicles/VehiclesListScreen';
import { CreateVehicleScreen } from '../screens/vehicles/CreateVehicleScreen';
import { TripsListScreen } from '../screens/trips/TripsListScreen';
import { CreateTripScreen } from '../screens/trips/CreateTripScreen';
import { ExpensesListScreen } from '../screens/expenses/ExpensesListScreen';
import { CreateExpenseScreen } from '../screens/expenses/CreateExpenseScreen';
import { SalaryListScreen } from '../screens/salary/SalaryListScreen';
import { CreateSalaryScreen } from '../screens/salary/CreateSalaryScreen';
import { LedgerPartiesScreen } from '../screens/ledger/LedgerPartiesScreen';
import { CreatePartyScreen } from '../screens/ledger/CreatePartyScreen';
import { LedgerEntriesScreen } from '../screens/ledger/LedgerEntriesScreen';
import { CreateLedgerEntryScreen } from '../screens/ledger/CreateLedgerEntryScreen';
import { MaintenanceListScreen } from '../screens/maintenance/MaintenanceListScreen';
import { CreateMaintenanceScreen } from '../screens/maintenance/CreateMaintenanceScreen';
import { CreateNotificationScreen } from '../screens/notifications/CreateNotificationScreen';

const Stack = createStackNavigator();

export const RootNavigator = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <>
                        <Stack.Screen name="Dashboard" component={DashboardScreen} />

                        <Stack.Screen name="UsersList" component={UsersListScreen} />
                        <Stack.Screen name="CreateUser" component={CreateUserScreen} />
                        <Stack.Screen name="EditUser" component={require('../screens/users/EditUserScreen').default} />

                        <Stack.Screen name="DriversList" component={DriversListScreen} />
                        <Stack.Screen name="CreateDriver" component={CreateDriverScreen} />
                        <Stack.Screen name="EditDriver" component={require('../screens/drivers/EditDriverScreen').default} />

                        <Stack.Screen name="VehiclesList" component={VehiclesListScreen} />
                        <Stack.Screen name="CreateVehicle" component={CreateVehicleScreen} />
                        <Stack.Screen name="EditVehicle" component={require('../screens/vehicles/EditVehicleScreen').default} />

                        <Stack.Screen name="TripsList" component={TripsListScreen} />
                        <Stack.Screen name="CreateTrip" component={CreateTripScreen} />
                        <Stack.Screen name="EditTrip" component={require('../screens/trips/EditTripScreen').default} />

                        <Stack.Screen name="ExpensesList" component={ExpensesListScreen} />
                        <Stack.Screen name="CreateExpense" component={CreateExpenseScreen} />
                        <Stack.Screen name="EditExpense" component={require('../screens/expenses/EditExpenseScreen').default} />

                        <Stack.Screen name="SalaryList" component={SalaryListScreen} />
                        <Stack.Screen name="CreateSalary" component={CreateSalaryScreen} />
                        <Stack.Screen name="EditSalary" component={require('../screens/salary/EditSalaryScreen').default} />

                        <Stack.Screen name="LedgerParties" component={LedgerPartiesScreen} />
                        <Stack.Screen name="CreateParty" component={CreatePartyScreen} />
                        <Stack.Screen name="LedgerEntries" component={LedgerEntriesScreen} />
                        <Stack.Screen name="CreateLedgerEntry" component={CreateLedgerEntryScreen} />
                        <Stack.Screen name="EditLedgerEntry" component={require('../screens/ledger/EditLedgerEntryScreen').default} />

                        <Stack.Screen name="MaintenanceList" component={MaintenanceListScreen} />
                        <Stack.Screen name="CreateMaintenance" component={CreateMaintenanceScreen} />
                        <Stack.Screen name="EditMaintenance" component={require('../screens/maintenance/EditMaintenanceScreen').default} />

                        <Stack.Screen name="CreateNotification" component={CreateNotificationScreen} />
                        <Stack.Screen name="EditNotification" component={require('../screens/notifications/EditNotificationScreen').default} />
                    </>
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
