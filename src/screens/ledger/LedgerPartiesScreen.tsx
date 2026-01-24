import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { getParties, Party } from '../../api/ledger';
import { Colors, Spacing } from '../../constants/theme';
import { Plus, BookOpen, Phone, Briefcase, List } from 'lucide-react-native';

export const LedgerPartiesScreen = () => {
    const [parties, setParties] = useState<Party[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<any>();

    const fetchParties = async () => {
        setLoading(true);
        try {
            const data = await getParties();
            setParties(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch parties');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParties();
        const unsubscribe = navigation.addListener('focus', fetchParties);
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }: { item: Party }) => (
        <Card style={[styles.card, { padding: 0 }]}>
            <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => navigation.navigate('CreateParty', { party: item })}
            >
                <View style={[styles.iconContainer, { backgroundColor: '#607D8B' + '20' }]}>
                    <BookOpen size={24} color="#607D8B" />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.name}>{item.partyName}</Text>
                    <Text style={styles.subtitle}>{item.partyType}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.details}>
                {item.contact && (
                    <View style={styles.row}>
                        <Phone size={14} color={Colors.textLight} style={{ marginRight: 8 }} />
                        <Text style={styles.detail}>{item.contact}</Text>
                    </View>
                )}
            </View>
        </Card>
    );

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text style={styles.title}>Ledger Parties</Text>
                <View style={styles.buttons}>
                    <Button
                        title="Entries"
                        onPress={() => navigation.navigate('LedgerEntries')}
                        variant="outline"
                        icon={List}
                        style={[styles.button, { marginRight: Spacing.sm }]}
                    />
                    <Button
                        title="Add Party"
                        onPress={() => navigation.navigate('CreateParty')}
                        icon={Plus}
                        style={styles.button}
                    />
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
                <FlatList
                    data={parties}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>No parties found</Text>}
                />
            )}
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    buttons: {
        flexDirection: 'row',
    },
    button: {
        marginRight: Spacing.sm,
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
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
