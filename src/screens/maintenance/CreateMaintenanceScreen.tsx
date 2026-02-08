import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../api/client';
import { StyleSheet, Alert, ScrollView, View, Text, TouchableOpacity, Modal, Image, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { DatePickerInput } from '../../components/DatePickerInput';
import { Button } from '../../components/Button';
import { createMaintenance, updateMaintenance, Maintenance } from '../../api/maintenance';
import { getVehicles, Vehicle } from '../../api/vehicles';
import { Spacing, Colors, BorderRadius } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';

export const CreateMaintenanceScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const editingRecord = route.params?.maintenance as Maintenance | undefined;
    const [loading, setLoading] = useState(false);

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vehicleId, setVehicleId] = useState('');
    const [maintenanceType, setMaintenanceType] = useState('');
    const [date, setDate] = useState('');
    const [odometer, setOdometer] = useState('');
    const [vendor, setVendor] = useState('');
    const [description, setDescription] = useState('');
    const [totalCost, setTotalCost] = useState('');
    const [nextServiceDue, setNextServiceDue] = useState('');
    const [nextServiceDate, setNextServiceDate] = useState('');
    const [billFile, setBillFile] = useState<any>(null);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);

    const handleUploadPress = () => {
        setUploadModalVisible(true);
    };

    const handleFileSelect = (asset: any) => {
        setBillFile(asset);
        setUploadModalVisible(false);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            handleFileSelect({
                uri: asset.uri,
                name: asset.fileName || 'image.jpg',
                type: asset.mimeType || 'image/jpeg'
            });
        }
    };

    const pickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['image/*', 'application/pdf'],
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            handleFileSelect({
                uri: asset.uri,
                name: asset.name,
                type: asset.mimeType
            });
        }
    };

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.granted) {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                handleFileSelect({
                    uri: asset.uri,
                    name: asset.fileName || 'camera_capture.jpg',
                    type: asset.mimeType || 'image/jpeg'
                });
            }
        }
    };

    const renderUploadSection = (label: string, fileState: any, existingFile: string | undefined) => (
        <View style={styles.uploadSection}>
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity onPress={handleUploadPress} style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Upload Bill</Text>
            </TouchableOpacity>

            {(fileState || existingFile) && (
                <View style={styles.filePreviewContainer}>
                    <View style={styles.fileIconContainer}>
                        <Text style={{ fontSize: 24 }}>📄</Text>
                    </View>
                    <View style={styles.fileInfo}>
                        <Text style={styles.fileName}>
                            {fileState ? fileState.name : 'Uploaded File Available'}
                        </Text>
                        <TouchableOpacity onPress={() => {
                            if (existingFile && !fileState) {
                                Linking.openURL(`${BASE_URL}/uploads/${existingFile}`);
                            }
                        }}>
                            <Text style={styles.downloadLink}>Tap to Download/View</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.checkIcon}>
                        <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>↓</Text>
                    </View>
                </View>
            )}
        </View>
    );

    useEffect(() => {
        if (editingRecord) {
            setVehicleId(editingRecord.vehicleId.toString());
            setMaintenanceType(editingRecord.maintenanceType);
            setDate(editingRecord.date);
            setOdometer(editingRecord.odometer.toString());
            setVendor(editingRecord.vendor);
            setDescription(editingRecord.description);
            setTotalCost(editingRecord.totalCost.toString());
            setNextServiceDue(editingRecord.nextServiceDue ? editingRecord.nextServiceDue.toString() : '');
            setNextServiceDate(editingRecord.nextServiceDate || '');
        }
    }, [editingRecord]);

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const data = await getVehicles();
            setVehicles(data);
        } catch (error) {
            console.error(error);
            showToast('Failed to load vehicles', 'error');
        }
    };

    const handleSubmit = async () => {
        if (!vehicleId || !maintenanceType || !date || !totalCost) {
            showToast('Vehicle, Type, Date and Cost are required', 'warning');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('vehicleId', vehicleId);
            formData.append('maintenanceType', maintenanceType);
            formData.append('date', date);
            formData.append('odometer', odometer);
            formData.append('vendor', vendor);
            formData.append('description', description);
            formData.append('totalCost', totalCost);
            if (nextServiceDue) formData.append('nextServiceDue', nextServiceDue);
            if (nextServiceDate) formData.append('nextServiceDate', nextServiceDate);

            if (billFile) {
                formData.append('billFile', {
                    uri: billFile.uri,
                    name: billFile.name,
                    type: billFile.type,
                } as any);
            }

            if (editingRecord) {
                console.log('Updating Maintenance:', editingRecord.id);
                console.log('Sending FormData:', JSON.stringify(formData));
                await updateMaintenance(editingRecord.id, formData);
                showToast('Maintenance record updated', 'success');
            } else {
                await createMaintenance(formData);
                showToast('Maintenance record created', 'success');
            }
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message;
            const toastMessage = Array.isArray(errorMessage)
                ? errorMessage[0]
                : (errorMessage || 'Failed to save record');
            showToast(toastMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer title={editingRecord ? "Edit Maintenance" : "Add Maintenance"}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Vehicle *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={vehicleId}
                            onValueChange={(itemValue) => setVehicleId(itemValue)}
                        >
                            <Picker.Item label="Select Vehicle" value="" />
                            {vehicles.map((vehicle) => (
                                <Picker.Item key={vehicle.id} label={vehicle.vehicleNumber} value={vehicle.id.toString()} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Type *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={maintenanceType}
                            onValueChange={(itemValue) => setMaintenanceType(itemValue)}
                        >
                            <Picker.Item label="Select Type" value="" />
                            <Picker.Item label="Service" value="Service" />
                            <Picker.Item label="Repair" value="Repair" />
                            <Picker.Item label="Tyre change" value="Tyre change" />
                            <Picker.Item label="Battery" value="Battery" />
                        </Picker>
                    </View>
                </View>

                <DatePickerInput
                    label="Date (YYYY-MM-DD) *"
                    value={date}
                    onChange={(selectedDate) => setDate(selectedDate.toISOString().split('T')[0])}
                />
                <Input label="Odometer *" value={odometer} onChangeText={setOdometer} keyboardType="numeric" />
                <Input label="Vendor *" value={vendor} onChangeText={setVendor} />
                <Input label="Description *" value={description} onChangeText={setDescription} />
                <Input label="Total Cost *" value={totalCost} onChangeText={setTotalCost} keyboardType="numeric" />
                <Input label="Next Service Due (km)" value={nextServiceDue} onChangeText={setNextServiceDue} keyboardType="numeric" />
                <DatePickerInput
                    label="Next Service Date"
                    value={nextServiceDate}
                    onChange={(selectedDate) => setNextServiceDate(selectedDate.toISOString().split('T')[0])}
                />

                <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginTop: Spacing.md, marginBottom: Spacing.sm }}>Documents</Text>
                {renderUploadSection("Bill / Invoice", billFile, editingRecord?.billFile)}

                <Button
                    title={editingRecord ? "Update Record" : "Create Record"}
                    onPress={handleSubmit}
                    loading={loading}
                    style={styles.button}
                />

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
    uploadSection: {
        marginBottom: Spacing.md,
    },
    uploadButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    uploadButtonText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    filePreviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e3f2fd',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: '#bbdefb',
    },
    fileIconContainer: {
        marginRight: Spacing.md,
        width: 40,
        alignItems: 'center'
    },
    fileInfo: {
        flex: 1,
    },
    fileName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.text,
    },
    downloadLink: {
        fontSize: 12,
        color: Colors.primary,
        textDecorationLine: 'underline',
        marginTop: 4,
    },
    checkIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8
    },
    pickerContainer: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        overflow: 'hidden',
    },
    uploadModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    uploadModalContainer: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: Spacing.lg,
    },
    uploadModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    uploadModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    uploadOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: Spacing.md,
    },
    uploadOption: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    uploadOptionText: {
        fontSize: 14,
        color: Colors.text,
    },
});
