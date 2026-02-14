import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ScrollView, View, Text, TouchableOpacity, Modal, Image, Linking } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { DatePickerInput } from '../../components/DatePickerInput';
import { Button } from '../../components/Button';
import { createVehicle, updateVehicle, Vehicle } from '../../api/vehicles';
import { getDrivers } from '../../api/drivers';
import { Spacing, Colors, BorderRadius } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { BASE_URL } from '../../api/client';

export const CreateVehicleScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const editingVehicle = route.params?.vehicle as Vehicle | undefined;
    const viewOnly = route.params?.viewOnly as boolean | undefined;
    const [loading, setLoading] = useState(false);

    const [vehicleNumber, setVehicleNumber] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [insuranceExpiry, setInsuranceExpiry] = useState('');
    const [pucExpiry, setPucExpiry] = useState('');
    const [fitnessExpiry, setFitnessExpiry] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [status, setStatus] = useState('');

    // Files
    const [insuranceFile, setInsuranceFile] = useState<any>(null);
    const [pucFile, setPucFile] = useState<any>(null);
    const [fitnessFile, setFitnessFile] = useState<any>(null);
    const [rcBookFile, setRcBookFile] = useState<any>(null);

    // Upload Modal State
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [currentUploadField, setCurrentUploadField] = useState<string | null>(null);

    const [drivers, setDrivers] = useState<any[]>([]);
    const [driverId, setDriverId] = useState('');

    useEffect(() => {
        fetchDriversList();
    }, []);

    const fetchDriversList = async () => {
        try {
            const data = await getDrivers();
            setDrivers(data);
        } catch (error) {
            console.error("Failed to fetch drivers", error);
        }
    };


    React.useEffect(() => {
        if (editingVehicle) {
            setVehicleNumber(editingVehicle.vehicleNumber);
            setVehicleType(editingVehicle.vehicleType);
            setCapacity(editingVehicle.capacity.toString());
            setInsuranceExpiry(editingVehicle.insuranceExpiry || '');
            setPucExpiry(editingVehicle.pucExpiry || '');
            setFitnessExpiry(editingVehicle.fitnessExpiry || '');
            setPurchaseDate(editingVehicle.purchaseDate || '');
            setPurchasePrice(editingVehicle.purchasePrice ? editingVehicle.purchasePrice.toString() : '');
            setStatus(editingVehicle.status || '');
            setDriverId(editingVehicle.driverId ? editingVehicle.driverId.toString() : '');
        }
    }, [editingVehicle]);

    const handleUploadPress = (field: string) => {
        setCurrentUploadField(field);
        setUploadModalVisible(true);
    };

    const handleFileSelect = (file: any) => {
        if (!currentUploadField) return;

        if (currentUploadField === 'insurance') setInsuranceFile(file);
        else if (currentUploadField === 'puc') setPucFile(file);
        else if (currentUploadField === 'fitness') setFitnessFile(file);
        else if (currentUploadField === 'rcBook') setRcBookFile(file);

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

    const handleSubmit = async () => {
        if (!vehicleNumber || !vehicleType || !capacity) {
            showToast('Vehicle Number, Type and Capacity are required', 'warning');
            return;
        }

        // Explicit Validation
        const vehicleNumberRegex = /^[A-Z0-9]+$/;
        if (!vehicleNumberRegex.test(vehicleNumber)) {
            showToast('Vehicle Number must be alphanumeric (A-Z, 0-9)', 'warning');
            return;
        }

        if (isNaN(parseFloat(capacity)) || parseFloat(capacity) <= 0) {
            showToast('Capacity must be a valid positive number', 'warning');
            return;
        }
        if (capacity.length > 6) {
            showToast('Capacity cannot exceed 6 characters', 'warning');
            return;
        }

        if (purchasePrice) {
            const price = parseFloat(purchasePrice);
            if (isNaN(price) || price < 0) {
                showToast('Purchase Price must be a valid number', 'warning');
                return;
            }
            if (purchasePrice.length > 10) {
                showToast('Purchase Price cannot exceed 10 characters', 'warning');
                return;
            }
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('vehicleNumber', vehicleNumber);
            formData.append('vehicleType', vehicleType);
            formData.append('capacity', capacity);
            if (driverId) formData.append('driverId', driverId);
            if (insuranceExpiry) formData.append('insuranceExpiry', insuranceExpiry);
            if (pucExpiry) formData.append('pucExpiry', pucExpiry);
            if (fitnessExpiry) formData.append('fitnessExpiry', fitnessExpiry);
            if (purchaseDate) formData.append('purchaseDate', purchaseDate);
            if (purchasePrice) formData.append('purchasePrice', purchasePrice);
            if (status) formData.append('status', status);

            if (insuranceFile) {
                formData.append('insuranceFile', {
                    uri: insuranceFile.uri,
                    name: insuranceFile.name,
                    type: insuranceFile.type,
                } as any);
            }
            if (pucFile) {
                formData.append('pucFile', {
                    uri: pucFile.uri,
                    name: pucFile.name,
                    type: pucFile.type,
                } as any);
            }
            if (fitnessFile) {
                formData.append('fitnessFile', {
                    uri: fitnessFile.uri,
                    name: fitnessFile.name,
                    type: fitnessFile.type,
                } as any);
            }
            if (rcBookFile) {
                formData.append('rcBookFile', {
                    uri: rcBookFile.uri,
                    name: rcBookFile.name,
                    type: rcBookFile.type,
                } as any);
            }

            if (editingVehicle) {
                await updateVehicle(editingVehicle.id, formData);
                showToast('Vehicle updated successfully', 'success');
            } else {
                await createVehicle(formData);
                showToast('Vehicle created successfully', 'success');
            }
            navigation.goBack();
        } catch (error: any) {
            console.error('Create Vehicle Error:', error);
            if (error.response) {
                console.error('Error Response:', error.response.data);
                console.error('Error Status:', error.response.status);
                console.error('Error Headers:', error.response.headers);
            } else if (error.request) {
                console.error('Error Request:', error.request);
            } else {
                console.error('Error Message:', error.message);
            }
            const errorMessage = error.response?.data?.message;
            const toastMessage = Array.isArray(errorMessage)
                ? errorMessage[0]
                : (errorMessage || 'Failed to save vehicle');
            showToast(toastMessage, 'error');
        } finally {
            setLoading(false);
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

    return (
        <ScreenContainer title={viewOnly ? "Vehicle Details" : (editingVehicle ? "Edit Vehicle" : "Add Vehicle")}>
            <ScrollView contentContainerStyle={styles.content}>
                <Input
                    label="Vehicle Number *"
                    value={vehicleNumber}
                    onChangeText={(text) => {
                        const sanitized = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        if (sanitized.length <= 20) setVehicleNumber(sanitized);
                    }}
                    maxLength={20}
                    autoCapitalize="characters"
                    editable={!viewOnly}
                />
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Vehicle Type *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={vehicleType}
                            onValueChange={(itemValue) => setVehicleType(itemValue)}
                            enabled={!viewOnly}
                        >
                            <Picker.Item label="Select Type" value="" />
                            <Picker.Item label="Truck" value="Truck" />
                            <Picker.Item label="Tempo" value="Tempo" />
                            <Picker.Item label="Car" value="Car" />
                            <Picker.Item label="Tractor" value="Tractor" />
                        </Picker>
                    </View>
                </View>
                <Input
                    label="Capacity (kg/ton) *"
                    value={capacity}
                    onChangeText={(text) => {
                        // Allow numbers and a single decimal point
                        const sanitized = text.replace(/[^0-9.]/g, '');
                        if ((sanitized.match(/\./g) || []).length <= 1 && sanitized.length <= 6) {
                            setCapacity(sanitized);
                        }
                    }}
                    keyboardType="numeric"
                    maxLength={6}
                    editable={!viewOnly}
                />

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Default Driver</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={driverId}
                            onValueChange={(itemValue) => setDriverId(itemValue)}
                            enabled={!viewOnly}
                        >
                            <Picker.Item label="Select Driver" value="" />
                            {drivers.map((d) => (
                                <Picker.Item key={d.id} label={d.name} value={d.id.toString()} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Documents & Expiry</Text>

                <DatePickerInput
                    label="Insurance Expiry"
                    value={insuranceExpiry}
                    onChange={(selectedDate) => setInsuranceExpiry(selectedDate.toISOString().split('T')[0])}
                    editable={!viewOnly}
                />
                {renderUploadSection("Insurance Policy", "insurance", insuranceFile, (editingVehicle as any)?.insuranceFile)}

                <DatePickerInput
                    label="PUC Expiry"
                    value={pucExpiry}
                    onChange={(selectedDate) => setPucExpiry(selectedDate.toISOString().split('T')[0])}
                    editable={!viewOnly}
                />
                {renderUploadSection("PUC Document", "puc", pucFile, (editingVehicle as any)?.pucFile)}

                <DatePickerInput
                    label="Fitness Expiry"
                    value={fitnessExpiry}
                    onChange={(selectedDate) => setFitnessExpiry(selectedDate.toISOString().split('T')[0])}
                    editable={!viewOnly}
                />
                {renderUploadSection("Fitness Certificate", "fitness", fitnessFile, (editingVehicle as any)?.fitnessFile)}

                {renderUploadSection("RC Book (New)", "rcBook", rcBookFile, (editingVehicle as any)?.rcBookFile)}

                <Text style={styles.sectionTitle}>Purcahse & Status</Text>
                <DatePickerInput
                    value={purchaseDate}
                    onChange={(selectedDate) => setPurchaseDate(selectedDate.toISOString().split('T')[0])}
                    editable={!viewOnly}
                />
                <Input
                    label="Purchase Price"
                    value={purchasePrice}
                    onChangeText={(text) => {
                        const sanitized = text.replace(/[^0-9]/g, '');
                        if (sanitized.length <= 10) setPurchasePrice(sanitized);
                    }}
                    keyboardType="numeric"
                    maxLength={10}
                    editable={!viewOnly}
                />
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Status</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={status}
                            onValueChange={(itemValue) => setStatus(itemValue)}
                            enabled={!viewOnly}
                        >
                            <Picker.Item label="Select Status" value="" />
                            <Picker.Item label="Active" value="Active" />
                            <Picker.Item label="Sold" value="Sold" />
                            <Picker.Item label="Under maintenance" value="Under maintenance" />
                        </Picker>
                    </View>
                </View>

                {!viewOnly && (
                    <Button
                        title={editingVehicle ? "Update Vehicle" : "Create Vehicle"}
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
    inputContainer: {
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: Spacing.xs,
        fontWeight: '500',
    },
    pickerContainer: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        overflow: 'hidden',
    },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginTop: Spacing.md, marginBottom: Spacing.sm },
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
