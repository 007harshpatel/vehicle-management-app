import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { getUsers, User } from '../../api/users';
import { Colors, Spacing } from '../../constants/theme';
import { Plus, User as UserIcon, Phone, Mail, Briefcase } from 'lucide-react-native';

export const UsersListScreen = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<any>();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            // Adjust depending on API response structure (array or wrapped in object)
            const usersList = Array.isArray(data) ? data : (data.users || []);
            setUsers(usersList);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        // Add focus listener to refresh when coming back
        const unsubscribe = navigation.addListener('focus', fetchUsers);
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }: { item: User }) => (
        <Card style={[styles.card, { padding: 0 }]}>
            <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => navigation.navigate('CreateUser', { user: item })}
            >
                <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' + '20' }]}>
                    <UserIcon size={24} color="#4CAF50" />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.name}>{item.name}</Text>
                    {item.businessName && (
                        <View style={styles.row}>
                            <Briefcase size={12} color={Colors.textLight} style={{ marginRight: 4 }} />
                            <Text style={styles.subtitle}>{item.businessName}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.details}>
                <View style={styles.row}>
                    <Phone size={14} color={Colors.textLight} style={{ marginRight: 8 }} />
                    <Text style={styles.detail}>{item.mobile}</Text>
                </View>
                {item.email && (
                    <View style={styles.row}>
                        <Mail size={14} color={Colors.textLight} style={{ marginRight: 8 }} />
                        <Text style={styles.detail}>{item.email}</Text>
                    </View>
                )}
            </View>
        </Card>
    );

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text style={styles.title}>All Users</Text>
                <Button
                    title="Add User"
                    onPress={() => navigation.navigate('CreateUser')}
                    icon={Plus}
                    style={styles.addButton}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>No users found</Text>}
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
});
