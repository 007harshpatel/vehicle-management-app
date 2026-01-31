import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Dimensions, Platform, Animated, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { getDashboardStats, DashboardStats } from '../api/dashboard';
import {
    Bus, Truck, Wallet, Banknote, BookOpen, Wrench,
    Plus, TrendingUp, TrendingDown, DollarSign, LogOut, Bell, ChevronRight
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 190; // Reverted to user preference
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 60 : 50; // Reduced min height
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const SectionHeader = ({ title, onSeeAll }: { title: string, onSeeAll?: () => void }) => (
    <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onSeeAll && (
            <TouchableOpacity onPress={onSeeAll}>
                <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
        )}
    </View>
);

const ServiceCard = ({ title, icon: Icon, color, priceTag, onPress }: any) => (
    <TouchableOpacity style={styles.serviceCard} onPress={onPress} activeOpacity={0.8}>
        {priceTag && (
            <View style={styles.priceTag}>
                <Text style={styles.priceTagText}>{priceTag}</Text>
            </View>
        )}
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
            <Icon size={28} color={color} />
        </View>
        <Text style={styles.serviceTitle}>{title}</Text>
        <View style={styles.arrowContainer}>
            <ChevronRight size={16} color="#8E8E93" />
        </View>
    </TouchableOpacity>
);

const ActiveOrderCard = ({ trip }: { trip: any }) => (
    <View style={styles.activeOrderCard}>
        <View style={styles.orderHeader}>
            <Text style={styles.orderTitle}>Trip #{trip.billNo}</Text>
            <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{trip.tripStatus || 'On-Process'}</Text>
            </View>
        </View>

        <View style={styles.orderRow}>
            <Truck size={14} color="#666" />
            <Text style={styles.orderDetailText}>
                {trip.details?.map((d: any) => d.vehicleNumber).join(', ') || 'Vehicle Unassigned'}
            </Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.orderDetailText}>₹{trip.totalAmount}</Text>
        </View>

        <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%' }]} />
            </View>
            <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Picked</Text>
                <Text style={styles.progressLabel}>Transit</Text>
                <Text style={styles.progressLabel}>Delivered</Text>
            </View>
        </View>
    </View>
);

const SummaryChip = ({ label, value, icon: Icon, color }: any) => (
    <View style={styles.summaryChip}>
        <View style={[styles.chipIcon, { backgroundColor: color + '20' }]}>
            <Icon size={16} color={color} />
        </View>
        <View>
            <Text style={styles.chipLabel}>{label}</Text>
            <Text style={[styles.chipValue, { color: color }]}>{value}</Text>
        </View>
    </View>
);

export const DashboardScreen = () => {
    const { user, logout } = useAuth();
    const navigation = useNavigation<any>();
    const [stats, setStats] = useState<DashboardStats>({ income: 0, expense: 0, profit: 0, recentTrips: [] });

    const scrollY = useRef(new Animated.Value(0)).current;

    const headerHeight = scrollY.interpolate({
        inputRange: [0, SCROLL_RANGE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp',
    });

    const greetingOpacity = scrollY.interpolate({
        inputRange: [0, SCROLL_RANGE],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const greetingTranslateY = scrollY.interpolate({
        inputRange: [0, SCROLL_RANGE],
        outputRange: [0, -50],
        extrapolate: 'clamp',
    });

    const fetchStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchStats();
        }, [])
    );

    const formatShortCurrency = (amount: number) => {
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
        return `₹${amount}`;
    };

    const DriverIcon = ({ size, color }: any) => (
        <Image
            source={require('../../assets/driver_icon.png')}
            style={{ width: size, height: size, tintColor: color }}
            resizeMode="contain"
        />
    );

    const services = [
        { title: 'Create Trip', icon: Plus, route: 'CreateTrip', color: '#4c669f', priceTag: 'New' },
        { title: 'Vehicles', icon: Truck, route: 'VehiclesList', color: '#00C853' },
        { title: 'Drivers', icon: DriverIcon, route: 'DriversList', color: '#FF6D00' },
        { title: 'Expenses', icon: Wallet, route: 'ExpensesList', color: '#D50000' },
        { title: 'Maintenance', icon: Wrench, route: 'MaintenanceList', color: '#37474F' },
        { title: 'Ledger', icon: BookOpen, route: 'LedgerParties', color: '#6200EA' },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Parallax Header */}
            <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
                <LinearGradient
                    colors={['#141e30', '#243b55']}
                    style={styles.headerGradient}
                >
                    <SafeAreaView style={styles.safeArea}>
                        <View style={styles.headerTop}>
                            {/* Empty View just for layout spacing */}
                            <View />
                        </View>

                        <Animated.View style={[styles.greetingContainer, { opacity: greetingOpacity, transform: [{ translateY: greetingTranslateY }] }]}>
                            <Text style={styles.greetingTitle}>Hi {user?.name?.split(' ')[0] || 'User'}, Here's</Text>
                            <Text style={styles.greetingSubtitle}>Your Business Overview</Text>

                            <View style={styles.summaryRow}>
                                <SummaryChip label="Income" value={formatShortCurrency(stats.income)} icon={TrendingUp} color="#448AFF" />
                                <SummaryChip label="Expense" value={formatShortCurrency(stats.expense)} icon={TrendingDown} color="#FF5252" />
                                <SummaryChip label="Profit" value={formatShortCurrency(stats.profit)} icon={DollarSign} color="#4CAF50" />
                            </View>
                        </Animated.View>
                    </SafeAreaView>
                </LinearGradient>
            </Animated.View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={10}
                showsVerticalScrollIndicator={false}
            >
                {/* Spacer to push content down below the max header height */}
                <View style={{ marginTop: HEADER_MAX_HEIGHT - 20 }} />

                <View style={styles.bodyContainer}>

                    {/* Active Orders */}
                    <View style={styles.section}>
                        <SectionHeader title="Recent Trips" onSeeAll={() => navigation.navigate('Trips')} />
                        {stats.recentTrips && stats.recentTrips.length > 0 ? (
                            stats.recentTrips.map((trip: any, index: number) => (
                                <ActiveOrderCard key={index} trip={trip} />
                            ))
                        ) : (
                            <Text style={styles.emptyText}>No Recent Trips.</Text>
                        )}
                    </View>

                    {/* Services Grid */}
                    <View style={styles.section}>
                        <SectionHeader title="Our Services" />
                        <View style={styles.grid}>
                            {services.map((service, index) => (
                                <ServiceCard
                                    key={index}
                                    {...service}
                                    onPress={() => service.route === 'CreateTrip' ? navigation.navigate('CreateTrip') : navigation.navigate(service.route)}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Promo Section */}
                    <View style={styles.promoCard}>
                        <View>
                            <Text style={styles.promoTitle}>Driver Salary</Text>
                            <Text style={styles.promoSubtitle}>Manage payouts easily</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SalaryList')}>
                                <Text style={styles.promoLink}>Manage Now</Text>
                            </TouchableOpacity>
                        </View>
                        <Banknote size={48} color="#FF6D00" style={{ opacity: 0.8 }} />
                    </View>

                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    headerContainer: {
        position: 'absolute', // Sticky!
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
    },
    headerGradient: {
        flex: 1,
    },
    safeArea: {
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    greetingContainer: {
        marginTop: 5,
    },
    greetingTitle: {
        fontSize: 22,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    greetingSubtitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
    },
    summaryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 14,
        gap: 8,
        flex: 1,
        minWidth: 100,
        justifyContent: 'center',
    },
    chipIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipLabel: {
        fontSize: 10,
        color: '#666',
        fontWeight: '600',
    },
    chipValue: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    bodyContainer: {
        backgroundColor: '#F5F7FA',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        // Overlap logic provided by spacer margin + standard scroll behavior
        // But to make sure it looks 'beside' or properly layered:
        paddingHorizontal: 20,
        paddingTop: 30,
        minHeight: 800,
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    seeAllText: {
        fontSize: 14,
        color: '#4c669f',
        fontWeight: '600',
    },
    activeOrderCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#2E7D32',
        fontSize: 12,
        fontWeight: '600',
    },
    orderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    orderDetailText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 6,
    },
    dot: {
        marginHorizontal: 8,
        color: '#ccc',
    },
    progressContainer: {
        marginTop: 5,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#F0F0F0',
        borderRadius: 3,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4c669f',
        borderRadius: 3,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressLabel: {
        fontSize: 10,
        color: '#999',
        fontWeight: '500',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 15,
    },
    serviceCard: {
        backgroundColor: 'white',
        width: (width - 40 - 15) / 2,
        borderRadius: 20,
        padding: 16,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    serviceTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginTop: 12,
        marginBottom: 4,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    arrowContainer: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
    priceTag: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    priceTagText: {
        fontSize: 10,
        color: '#FF6D00',
        fontWeight: '700',
    },
    emptyText: {
        color: '#999',
        fontStyle: 'italic',
    },
    promoCard: {
        backgroundColor: '#FFF3E0',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    promoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E65100',
        marginBottom: 4,
    },
    promoSubtitle: {
        fontSize: 14,
        color: '#EF6C00',
        marginBottom: 10,
    },
    promoLink: {
        fontSize: 14,
        fontWeight: '700',
        color: '#E65100',
        textDecorationLine: 'underline',
    }
});
