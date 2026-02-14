import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView, View, Text, TouchableOpacity, Modal, Image, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { BASE_URL } from '../../api/client';
import { Colors, Spacing, BorderRadius } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { DatePickerInput } from '../../components/DatePickerInput';
import { Button } from '../../components/Button';
import { createDriver, updateDriver, Driver } from '../../api/drivers';
import { useToast } from '../../context/ToastContext';

export const CreateDriverScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const editingDriver = route.params?.driver as Driver | undefined;
    const viewOnly = route.params?.viewOnly as boolean | undefined;
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [licenseExpiry, setLicenseExpiry] = useState('');
    const [aadhaar, setAadhaar] = useState('');
    const [joiningDate, setJoiningDate] = useState('');

    // Files
    const [aadhaarFile, setAadhaarFile] = useState<any>(null);
    const [licenseFile, setLicenseFile] = useState<any>(null);
    const [photoFile, setPhotoFile] = useState<any>(null);

    // Upload Modal State
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [currentUploadField, setCurrentUploadField] = useState<string | null>(null);

    React.useEffect(() => {
        if (editingDriver) {
            setName(editingDriver.name);
            setMobile(editingDriver.mobile);
            setLicenseNumber(editingDriver.licenseNumber);
            setLicenseExpiry(editingDriver.licenseExpiry || '');
            setAadhaar(editingDriver.aadhaar || '');
            setJoiningDate(editingDriver.joiningDate || '');
        }
    }, [editingDriver]);

    const handleUploadPress = (field: string) => {
        setCurrentUploadField(field);
        setUploadModalVisible(true);
    };

    const handleFileSelect = (file: any) => {
        if (!currentUploadField) return;

        if (currentUploadField === 'aadhaar') setAadhaarFile(file);
        else if (currentUploadField === 'license') setLicenseFile(file);
        else if (currentUploadField === 'photo') setPhotoFile(file);

        setUploadModalVisible(false);
        setCurrentUploadField(null);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], allowsEditing: false, aspect: [4, 3], quality: 0.8,
        });
        if (!result.canceled) {
            const asset = result.assets[0];
            handleFileSelect({ uri: asset.uri, type: asset.mimeType || 'image/jpeg', name: asset.fileName || 'upload.jpg' });
        }
    };

    const pickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', copyToCacheDirectory: true });
        if (!result.canceled) {
            const asset = result.assets[0];
            handleFileSelect({ uri: asset.uri, type: asset.mimeType || 'application/pdf', name: asset.name || 'document.pdf' });
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) return showToast("Permission to access camera is required!", 'error');
        const result = await ImagePicker.launchCameraAsync({ allowsEditing: false, aspect: [4, 3], quality: 0.8 });
        if (!result.canceled) {
            const asset = result.assets[0];
            handleFileSelect({ uri: asset.uri, type: asset.mimeType || 'image/jpeg', name: asset.fileName || 'camera.jpg' });
        }
    };

    const renderUploadSection = (label: string, field: string, file: any, existingUrl?: string) => (
        <View style={styles.uploadSection}>
            <Text style={styles.label}>{label}</Text>
            {!viewOnly && (
                <TouchableOpacity onPress={() => handleUploadPress(field)} style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>{file ? "Change File" : "Upload File"}</Text>
                </TouchableOpacity>
            )}

            {existingUrl && !file && (
                <TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/${existingUrl}`)} style={styles.existingFileContainer}>
                    <Text style={{ fontSize: 20 }}>📄</Text>
                    <Text style={styles.existingFileLabel}>View Existing</Text>
                </TouchableOpacity>
            )}

            {file && (
                <View style={styles.filePreview}>
                    <Text style={styles.fileName}>{file.name}</Text>
                    {file.type?.includes('image') && <Image source={{ uri: file.uri }} style={styles.previewImage} />}
                </View>
            )}
        </View>
    );

    const handleSubmit = async () => {
        if (!name || !mobile || !licenseNumber) {
            showToast('Name, Mobile and License Number are required', 'warning');
            return;
        }

        if (aadhaar.length > 0 && aadhaar.length !== 12) {
            showToast('Aadhaar must be 12 digits', 'warning');
            return;
        }
        if (mobile.length !== 10) {
            showToast('Mobile number must be 10 digits', 'warning');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('mobile', mobile);
        formData.append('licenseNumber', licenseNumber);
        if (licenseExpiry) formData.append('licenseExpiry', licenseExpiry);
        if (aadhaar) formData.append('aadhaar', aadhaar);
        if (joiningDate) formData.append('joiningDate', joiningDate);

        if (aadhaarFile) {
            formData.append('aadhaarFile', {
                uri: aadhaarFile.uri,
                name: aadhaarFile.name,
                type: aadhaarFile.type,
            } as any);
        }
        if (licenseFile) {
            formData.append('licenseFile', {
                uri: licenseFile.uri,
                name: licenseFile.name,
                type: licenseFile.type,
            } as any);
        }
        if (photoFile) {
            formData.append('photo', {
                uri: photoFile.uri,
                name: photoFile.name,
                type: photoFile.type,
            } as any);
        }

        // Debug Logs
        console.log('Submitting Driver Form:', formData);

        try {
            if (editingDriver) {
                console.log('Updating Driver ID:', editingDriver.id);
                await updateDriver(editingDriver.id, formData);
                showToast('Driver updated successfully', 'success');
            } else {
                console.log('Creating New Driver');
                await createDriver(formData);
                showToast('Driver created successfully', 'success');
            }
            navigation.goBack();
        } catch (error: any) {
            console.error('Driver Submit Error:', error);
            if (error.response) {
                console.error('Error Response Data:', error.response.data);
                console.error('Error Response Status:', error.response.status);
                console.error('Error Response Headers:', error.response.headers);
            } else if (error.request) {
                console.error('Error Request:', error.request);
            } else {
                console.error('Error Message:', error.message);
            }
            const errorMessage = error.response?.data?.message;
            const toastMessage = Array.isArray(errorMessage)
                ? errorMessage[0]
                : (errorMessage || 'Failed to create/update driver');
            showToast(toastMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer title={viewOnly ? "Driver Details" : (editingDriver ? "Edit Driver" : "Add Driver")}>
            <ScrollView contentContainerStyle={styles.content}>
                <Input
                    label="Name *"
                    value={name}
                    onChangeText={(text) => {
                        const sanitized = text.replace(/[^a-zA-Z\s]/g, '');
                        if (sanitized.length <= 50) setName(sanitized);
                    }}
                    maxLength={50}
                    editable={!viewOnly}
                />
                <Input
                    label="Mobile *"
                    value={mobile}
                    onChangeText={(text) => {
                        const sanitized = text.replace(/[^0-9]/g, '');
                        if (sanitized.length <= 10) setMobile(sanitized);
                    }}
                    keyboardType="phone-pad"
                    maxLength={10}
                    editable={!viewOnly}
                />
                <Input
                    label="License Number *"
                    value={licenseNumber}
                    onChangeText={(text) => {
                        const sanitized = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        if (sanitized.length <= 20) setLicenseNumber(sanitized);
                    }}
                    maxLength={20}
                    autoCapitalize="characters"
                    editable={!viewOnly}
                />
                <DatePickerInput
                    label="License Expiry (YYYY-MM-DD)"
                    value={licenseExpiry}
                    onChange={(selectedDate) => setLicenseExpiry(selectedDate.toISOString().split('T')[0])}
                    editable={!viewOnly}
                />
                <Input
                    label="Aadhaar"
                    value={aadhaar}
                    onChangeText={(text) => {
                        const sanitized = text.replace(/[^0-9]/g, '');
                        if (sanitized.length <= 12) setAadhaar(sanitized);
                    }}
                    keyboardType="numeric"
                    maxLength={12}
                    editable={!viewOnly}
                />
                <DatePickerInput
                    label="Joining Date (YYYY-MM-DD)"
                    value={joiningDate}
                    onChange={(selectedDate) => setJoiningDate(selectedDate.toISOString().split('T')[0])}
                    editable={!viewOnly}
                />

                <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginTop: Spacing.md, marginBottom: Spacing.sm }}>Documents</Text>
                {renderUploadSection("Driver Photo", "photo", photoFile, (editingDriver as any)?.photo)}
                {renderUploadSection("Aadhaar Card", "aadhaar", aadhaarFile, (editingDriver as any)?.aadhaarFile)}
                {renderUploadSection("Driving License", "license", licenseFile, (editingDriver as any)?.licenseFile)}

                {!viewOnly && (
                    <Button
                        title={editingDriver ? "Update Driver" : "Create Driver"}
                        onPress={handleSubmit}
                        loading={loading}
                        style={styles.button}
                    />
                )}

                {/* Upload Modal */}
                <Modal visible={uploadModalVisible} transparent={true} animationType="slide" onRequestClose={() => setUploadModalVisible(false)}>
                    <View style={styles.uploadModalOverlay}>
                        <View style={styles.uploadModalContainer}>
                            <View style={styles.uploadModalHeader}>
                                <Text style={styles.uploadModalTitle}>Upload Document</Text>
                                <TouchableOpacity onPress={() => setUploadModalVisible(false)}><Text style={{ fontSize: 24, color: Colors.text }}>✕</Text></TouchableOpacity>
                            </View>
                            <View style={styles.uploadOptions}>
                                <TouchableOpacity style={styles.uploadOption} onPress={takePhoto}>
                                    <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}><Text style={{ fontSize: 28 }}>📷</Text></View>
                                    <Text style={styles.uploadOptionText}>Camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.uploadOption} onPress={pickImage}>
                                    <View style={[styles.iconContainer, { backgroundColor: '#e8f5e9' }]}><Text style={{ fontSize: 28 }}>🖼️</Text></View>
                                    <Text style={styles.uploadOptionText}>Gallery</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.uploadOption} onPress={pickDocument}>
                                    <View style={[styles.iconContainer, { backgroundColor: '#fff3e0' }]}><Text style={{ fontSize: 28 }}>📄</Text></View>
                                    <Text style={styles.uploadOptionText}>Document</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingBottom: Spacing.xl,
    },
    button: {
        marginTop: Spacing.md,
    },
    label: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: Spacing.xs,
        fontWeight: '500',
    },
    uploadSection: { marginBottom: Spacing.md },
    uploadButton: { padding: 10, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.primary, borderRadius: BorderRadius.sm, alignItems: 'center' },
    uploadButtonText: { color: Colors.primary, fontWeight: '600', fontSize: 14 },
    filePreview: { marginTop: 8, alignItems: 'center' },
    previewImage: { width: 80, height: 80, borderRadius: BorderRadius.sm, marginTop: 5 },
    fileName: { fontSize: 12, color: Colors.textLight },
    existingFileContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e3f2fd', padding: 8, borderRadius: BorderRadius.sm, marginTop: 8, borderWidth: 1, borderColor: '#bbdefb' },
    existingFileLabel: { fontSize: 12, fontWeight: '600', color: Colors.text, marginLeft: 8 },

    // Upload Modal
    uploadModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    uploadModalContainer: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, minHeight: 250 },
    uploadModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    uploadModalTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
    uploadOptions: { flexDirection: 'row', justifyContent: 'space-around' },
    uploadOption: { alignItems: 'center' },
    iconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    uploadOptionText: { fontSize: 14, color: Colors.text, fontWeight: '500' },
});
