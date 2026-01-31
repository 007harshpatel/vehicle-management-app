import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { Colors, Spacing } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { showToast } = useToast();

    const handleLogin = async () => {
        if (!email || !password) {
            showToast('Please enter both email and password', 'warning');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                showToast('Invalid credentials', 'error');
            } else {
                showToast('Login Failed: Server error', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Vehicle Manager</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>

                <Input
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Input
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Button
                    title="Login"
                    onPress={handleLogin}
                    loading={loading}
                    style={styles.button}
                />
            </View>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
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
});
