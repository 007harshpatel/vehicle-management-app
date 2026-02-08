import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Dimensions, Platform, TextInput, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Spacing, BorderRadius } from '../../constants/theme';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 250; // Increased to prevent cutoff
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 60 : 50; // Reduced min height
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const AVATAR_SIZE = 100;

export const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');

    // Standard RN Animated
    const scrollY = useRef(new Animated.Value(0)).current;

    const headerHeight = scrollY.interpolate({
        inputRange: [0, SCROLL_RANGE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp',
    });

    const avatarOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const avatarScale = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.5],
        extrapolate: 'clamp',
    });

    const avatarTranslateY = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -50],
        extrapolate: 'clamp',
    });

    const titleOpacity = scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const handleUpdate = () => {
        alert('Profile Updated Successfully!');
    };

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
                        <View style={styles.headerContent}>
                            <Animated.View
                                style={[
                                    styles.avatarContainer,
                                    {
                                        opacity: avatarOpacity,
                                        transform: [{ scale: avatarScale }, { translateY: avatarTranslateY }]
                                    }
                                ]}
                            >
                                <Text style={{ fontSize: AVATAR_SIZE / 2 }}>👤</Text>
                                {/* <TouchableOpacity style={styles.cameraButton}>
                                    <Camera size={16} color="white" />
                                </TouchableOpacity> */}
                            </Animated.View>

                            <Animated.Text style={[styles.userName, { opacity: titleOpacity }]}>{user?.name || 'John Doe'}</Animated.Text>
                            <Animated.Text style={[styles.userRole, { opacity: titleOpacity }]}>{user?.role || 'OWNER'}</Animated.Text>
                        </View>
                    </SafeAreaView>
                </LinearGradient>
            </Animated.View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false } // Height/Layout anim needs false
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                {/* Spacer for parallax header */}
                <View style={{ marginTop: HEADER_MAX_HEIGHT - 30 }} />

                <View style={styles.bodyContainer}>
                    <View>
                        <Text style={styles.sectionTitle}>Personal Details</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.inputIcon, { fontSize: 20 }]}>👤</Text>
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter full name"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.inputIcon, { fontSize: 20 }]}>📧</Text>
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Enter email"
                                    keyboardType="email-address"
                                    editable={false}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.inputIcon, { fontSize: 20 }]}>📞</Text>
                                <TextInput
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="Enter phone number"
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>User Role</Text>
                            <View style={[styles.inputContainer, { backgroundColor: '#f0f0f0' }]}>
                                <Text style={[styles.inputIcon, { fontSize: 20 }]}>🛡️</Text>
                                <TextInput
                                    style={[styles.input, { color: '#666' }]}
                                    value={user?.role?.toUpperCase() || 'OWNER'}
                                    editable={false}
                                />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                            <LinearGradient
                                colors={['#4c669f', '#3b5998']}
                                style={styles.gradientButton}
                            >
                                <Text style={{ fontSize: 20, marginRight: 10, color: 'white' }}>💾</Text>
                                <Text style={styles.buttonText}>Update Profile</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                            <Text style={{ fontSize: 20, marginRight: 10 }}>🚪</Text>
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 100 }} />
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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: 'hidden',
    },
    headerGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeArea: {
        width: '100%',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingBottom: 30,
    },
    avatarContainer: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 1,
        elevation: 10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4c669f',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    userRole: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    bodyContainer: {
        backgroundColor: '#F5F7FA',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        paddingHorizontal: 20,
        paddingTop: 30,
        minHeight: 600,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    inputGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 10,
        height: 50,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    inputIcon: {
        marginRight: 4,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    updateButton: {
        marginTop: 10,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#4c669f',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    gradientButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 18,
        backgroundColor: '#FFEBEE',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFCDD2',
    },
    logoutText: {
        color: '#D32F2F',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
