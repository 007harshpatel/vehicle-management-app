import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ScrollView, View, Text, TouchableOpacity, Modal, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Camera, Image as ImageIcon, FileText, X, Download } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { DatePickerInput } from '../../components/DatePickerInput';
import { Button } from '../../components/Button';
import { createExpense, updateExpense, Expense } from '../../api/expenses';
import { getVehicles, Vehicle } from '../../api/vehicles';
import { getDrivers, Driver } from '../../api/drivers';
import { BASE_URL } from '../../api/client';
import { Spacing, Colors, BorderRadius } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';

export const CreateExpenseScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const editingExpense = route.params?.expense as Expense | undefined;
    const [loading, setLoading] = useState(false);

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('Fuel');
    const [amount, setAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [vehicleId, setVehicleId] = useState('');
    const [driverId, setDriverId] = useState('');
    const [notes, setNotes] = useState('');

    // File Upload State
    // File Upload State
    const [billFile, setBillFile] = useState<any>(null);
    const [existingFile, setExistingFile] = useState<string | null>(null);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);

    useEffect(() => {
        if (editingExpense) {
            setDate(editingExpense.date);
            setCategory(editingExpense.category);
            setAmount(editingExpense.amount.toString());
            setPaymentMode(editingExpense.paymentMode);
            setVehicleId(editingExpense.vehicleId ? editingExpense.vehicleId.toString() : '');
            setDriverId(editingExpense.driverId ? editingExpense.driverId.toString() : '');
            setNotes(editingExpense.notes || '');
            if (editingExpense.bill_file) {
                setExistingFile(editingExpense.bill_file);
            }
        }
    }, [editingExpense]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [vehiclesData, driversData] = await Promise.all([
                getVehicles(),
                getDrivers()
            ]);

            const vList = Array.isArray(vehiclesData) ? vehiclesData : [];
            const dList = Array.isArray(driversData) ? driversData : [];

            setVehicles(vList);
            setDrivers(dList);

        } catch (error) {
            console.error(error);
            showToast('Failed to fetch required data', 'error');
        }
    };

    const handleUploadPress = () => {
        setUploadModalVisible(true);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setBillFile({
                uri: asset.uri,
                type: asset.mimeType || 'image/jpeg',
                name: asset.fileName || 'bill.jpg',
            });
            setUploadModalVisible(false);
        }
    };

    const pickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
            copyToCacheDirectory: true,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setBillFile({
                uri: asset.uri,
                type: asset.mimeType || 'application/pdf',
                name: asset.name || 'bill.pdf',
            });
            setUploadModalVisible(false);
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            showToast("Permission to access camera is required!", 'error');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setBillFile({
                uri: asset.uri,
                type: asset.mimeType || 'image/jpeg',
                name: asset.fileName || 'camera_capture.jpg',
            });
            setUploadModalVisible(false);
        }
    }

    const handleSubmit = async () => {
        if (!date || !category || !amount || !paymentMode) {
            showToast('Date, Category, Amount and Payment Mode are required', 'warning');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('date', date);
        formData.append('category', category);
        formData.append('amount', amount);
        formData.append('paymentMode', paymentMode);
        if (vehicleId) formData.append('vehicleId', vehicleId);
        if (driverId) formData.append('driverId', driverId);
        formData.append('notes', notes);

        if (billFile) {
            formData.append('billFile', {
                uri: billFile.uri,
                name: billFile.name,
                type: billFile.type,
            } as any);
        }

        try {
            if (editingExpense) {
                await updateExpense(editingExpense.id, formData);
                showToast('Expense updated successfully', 'success');
            } else {
                await createExpense(formData);
                showToast('Expense created successfully', 'success');
            }
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message;
            const toastMessage = Array.isArray(errorMessage)
                ? errorMessage[0]
                : (errorMessage || 'Failed to create expense');
            showToast(toastMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer title={editingExpense ? "Edit Expense" : "Add Expense"}>
            <ScrollView contentContainerStyle={styles.content}>
                <DatePickerInput
                    label="Date (YYYY-MM-DD) *"
                    value={date}
                    onChange={(selectedDate) => setDate(selectedDate.toISOString().split('T')[0])}
                />

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={category}
                            onValueChange={(itemValue: string) => setCategory(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Fuel" value="Fuel" />
                            <Picker.Item label="Maintenance" value="Maintenance" />
                            <Picker.Item label="Driver salary" value="Driver salary" />
                            <Picker.Item label="Toll" value="Toll" />
                            <Picker.Item label="Insurance" value="Insurance" />
                            <Picker.Item label="EMI" value="EMI" />
                            <Picker.Item label="Office expenses" value="Office expenses" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
                    </View>
                </View>

                <Input label="Amount *" value={amount} onChangeText={setAmount} keyboardType="numeric" />

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Payment Mode *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={paymentMode}
                            onValueChange={(itemValue: string) => setPaymentMode(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Cash" value="Cash" />
                            <Picker.Item label="Bank" value="Bank" />
                            <Picker.Item label="UPI" value="UPI" />
                            <Picker.Item label="Cheque" value="Cheque" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Select Vehicle (Optional)</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={vehicleId}
                            onValueChange={(itemValue: string) => setVehicleId(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="None" value="" />
                            {vehicles.map((v) => (
                                <Picker.Item key={v.id} label={v.vehicleNumber} value={v.id.toString()} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Select Driver (Optional)</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={driverId}
                            onValueChange={(itemValue: string) => setDriverId(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="None" value="" />
                            {drivers.map((d) => (
                                <Picker.Item key={d.id} label={d.name} value={d.id.toString()} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <Text style={styles.label}>Bill File</Text>
                <TouchableOpacity onPress={handleUploadPress} style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>{billFile ? "Change Bill File" : "Upload Bill"}</Text>
                </TouchableOpacity>

                {/* Show Existing File if no new file selected */}
                {existingFile && !billFile && (
                    <View style={styles.existingFileContainer}>
                        <View style={styles.existingFileIcon}>
                            <FileText size={24} color={Colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.existingFileLabel}>Uploaded File Available</Text>
                            <TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/${existingFile}`)}>
                                <Text style={styles.downloadLink}>Tap to Download/View</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/${existingFile}`)} style={styles.downloadButton}>
                            <Download size={20} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                )}


                {billFile && (
                    <View style={styles.filePreview}>
                        <Text style={styles.fileName}>Selected: {billFile.name}</Text>
                        {billFile.type.includes('image') && (
                            <Image source={{ uri: billFile.uri }} style={styles.previewImage} />
                        )}
                    </View>
                )}

                <Input label="Notes" value={notes} onChangeText={setNotes} />

                <Button
                    title={editingExpense ? "Update Expense" : "Create Expense"}
                    onPress={handleSubmit}
                    loading={loading}
                    style={styles.button}
                />

                {/* Upload Modal - Custom Bottom Sheet Style */}
                <Modal
                    visible={uploadModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setUploadModalVisible(false)}
                >
                    <View style={styles.uploadModalOverlay}>
                        <View style={styles.uploadModalContainer}>
                            <View style={styles.uploadModalHeader}>
                                <Text style={styles.uploadModalTitle}>Upload Bill</Text>
                                <TouchableOpacity onPress={() => setUploadModalVisible(false)}>
                                    <X color={Colors.text} size={24} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.uploadOptions}>
                                <TouchableOpacity style={styles.uploadOption} onPress={takePhoto}>
                                    <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
                                        <Camera color="#2196F3" size={28} />
                                    </View>
                                    <Text style={styles.uploadOptionText}>Camera</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.uploadOption} onPress={pickImage}>
                                    <View style={[styles.iconContainer, { backgroundColor: '#e8f5e9' }]}>
                                        <ImageIcon color="#4caf50" size={28} />
                                    </View>
                                    <Text style={styles.uploadOptionText}>Gallery</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.uploadOption} onPress={pickDocument}>
                                    <View style={[styles.iconContainer, { backgroundColor: '#fff3e0' }]}>
                                        <FileText color="#ff9800" size={28} />
                                    </View>
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
    inputGroup: {
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: 8,
        fontWeight: '500',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.white,
        overflow: 'hidden',
        height: 50,
        justifyContent: 'center',
    },
    picker: {
        width: '100%',
        color: Colors.text,
    },
    uploadButton: {
        padding: 12,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: BorderRadius.sm,
        alignItems: 'center',
        marginBottom: Spacing.md
    },
    uploadButtonText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 16
    },
    filePreview: {
        marginBottom: Spacing.md,
        alignItems: 'center'
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: BorderRadius.sm,
        marginTop: 5
    },
    fileName: {
        fontSize: 12,
        color: Colors.textLight
    },
    // Upload Modal Styles
    uploadModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    uploadModalContainer: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, minHeight: 250 },
    uploadModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    uploadModalTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
    uploadOptions: { flexDirection: 'row', justifyContent: 'space-around' },
    uploadOption: { alignItems: 'center' },
    iconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    uploadOptionText: { fontSize: 14, color: Colors.text, fontWeight: '500' },

    // Existing File Styles
    existingFileContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e3f2fd', padding: 12, borderRadius: BorderRadius.sm, marginBottom: Spacing.md, borderWidth: 1, borderColor: '#bbdefb' },
    existingFileIcon: { marginRight: 12 },
    existingFileLabel: { fontSize: 14, fontWeight: '600', color: Colors.text },
    downloadLink: { fontSize: 12, color: Colors.primary, textDecorationLine: 'underline', marginTop: 2 },
    downloadButton: { padding: 8, backgroundColor: Colors.primary, borderRadius: 20, marginLeft: 10 },
});
