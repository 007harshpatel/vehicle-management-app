import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { Colors, Spacing } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';

export const SignupScreen = () => {
    const navigation = useNavigation<any>();
    const { signup, login } = useAuth();
    const { showToast } = useToast();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [gstNumber, setGstNumber] = useState('');

    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSignup = async () => {
        if (!name || !email || !password || !mobile) {
            showToast('Please fill all required fields', 'warning');
            return;
        }

        setLoading(true);
        try {
            await signup({
                name,
                email,
                mobile,
                password,
                businessName,
                gstNumber
            });

            // Auto-login after successful signup
            await login(email, password);
            showToast('Account created! Logging you in...', 'success');
            // No need to navigate, AuthContext state change will trigger RootNavigator switch
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Signup Failed';
            showToast(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>

                    <Input
                        label="Name *"
                        placeholder="Enter your full name"
                        value={name}
                        onChangeText={setName}
                    />

                    <Input
                        label="Email *"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <Input
                        label="Mobile *"
                        placeholder="Enter your mobile number"
                        value={mobile}
                        onChangeText={setMobile}
                        keyboardType="phone-pad"
                    />

                    <Input
                        label="Password *"
                        placeholder="Create a password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!isPasswordVisible}
                        rightIcon={isPasswordVisible ? <Text style={{ fontSize: 20 }}>🚫</Text> : <Text style={{ fontSize: 20 }}>👁️</Text>}
                        onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    />

                    <Input
                        label="Business Name"
                        placeholder="Enter business name (Optional)"
                        value={businessName}
                        onChangeText={setBusinessName}
                    />

                    <Input
                        label="GST Number"
                        placeholder="Enter GST number (Optional)"
                        value={gstNumber}
                        onChangeText={setGstNumber}
                        autoCapitalize="characters"
                    />

                    <Button
                        title="Sign Up"
                        onPress={handleSignup}
                        loading={loading}
                        style={styles.button}
                    />

                    <View style={styles.loginLink}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLinkText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: Spacing.xl,
    },
    content: {
        padding: Spacing.md,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: Spacing.xs,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.gray,
        marginBottom: Spacing.xl,
        textAlign: 'center',
    },
    button: {
        marginTop: Spacing.md,
    },
    loginLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.lg,
    },
    loginText: {
        color: Colors.text,
        fontSize: 14,
    },
    loginLinkText: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
