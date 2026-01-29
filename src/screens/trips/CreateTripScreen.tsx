import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ScrollView, View, Text, TouchableOpacity, Modal, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Camera, Image as ImageIcon, FileText, X } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { DatePickerInput } from '../../components/DatePickerInput';
import { Button } from '../../components/Button';
import { createTrip, updateTrip, Trip, TripDetail } from '../../api/trips';
import { getVehicles, Vehicle } from '../../api/vehicles';
import { getDrivers, Driver } from '../../api/drivers';
import { Spacing, Colors, BorderRadius } from '../../constants/theme';

export const CreateTripScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const editingTrip = route.params?.trip as Trip | undefined;
    const [loading, setLoading] = useState(false);

    // Data Sources
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);

    // Header Fields
    const [driverId, setDriverId] = useState('');
    const [driverName, setDriverName] = useState('');
    const [supplyTo, setSupplyTo] = useState('');
    const [billNo, setBillNo] = useState('');
    const [startDatetime, setStartDatetime] = useState(new Date().toISOString().split('T')[0]);
    const [refNo, setRefNo] = useState('');
    const [panNo, setPanNo] = useState('');
    const [docNo, setDocNo] = useState('');
    const [notes, setNotes] = useState('');
    const [tripStatus, setTripStatus] = useState('Planned');

    // File
    const [billFile, setBillFile] = useState<any>(null);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);

    // Financials
    const [subTotal, setSubTotal] = useState(0);
    const [lessAdvance, setLessAdvance] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);

    // Details - State
    const [details, setDetails] = useState<TripDetail[]>([]);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [editingDetailIndex, setEditingDetailIndex] = useState<number | null>(null);

    // Detail Form State
    const [dId, setDId] = useState<number | undefined>(undefined);
    const [dMomentDate, setDMomentDate] = useState(new Date().toISOString().split('T')[0]);
    const [dVehicleId, setDVehicleId] = useState('');
    const [dContainerNo, setDContainerNo] = useState('');
    const [dFromLocation, setDFromLocation] = useState('');
    const [dViaLocation, setDViaLocation] = useState('');
    const [dToLocation, setDToLocation] = useState('');
    const [dWeight, setDWeight] = useState('');
    const [dFrs, setDFrs] = useState('');
    const [dLoLo, setDLoLo] = useState('');
    const [dDetention, setDDetention] = useState('');
    const [dAmount, setDAmount] = useState('');

    useEffect(() => {
        if (editingTrip) {
            setDriverId(editingTrip.driverId.toString());
            setDriverName(editingTrip.driverName);
            setSupplyTo(editingTrip.supplyTo);
            setBillNo(editingTrip.billNo);
            setStartDatetime(editingTrip.startDatetime.split('T')[0]);
            setRefNo(editingTrip.refNo);
            setPanNo(editingTrip.panNo);
            setDocNo(editingTrip.docNo);
            setNotes(editingTrip.notes || '');
            setTripStatus(editingTrip.tripStatus || 'Planned');
            setLessAdvance(editingTrip.lessAdvance.toString());
            setDetails(editingTrip.details || []);
        }
    }, [editingTrip]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const sub = details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        setSubTotal(sub);
        const total = sub - (Number(lessAdvance) || 0);
        setTotalAmount(total);
    }, [details, lessAdvance]);

    const fetchData = async () => {
        try {
            const [vehiclesData, driversData] = await Promise.all([
                getVehicles(),
                getDrivers()
            ]);
            setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
            setDrivers(Array.isArray(driversData) ? driversData : []);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch required data');
        }
    };

    const handleDriverChange = (id: string) => {
        setDriverId(id);
        const driver = drivers.find(d => d.id.toString() === id);
        if (driver) {
            setDriverName(driver.name);
        }
    };

    const handleUploadPress = () => {
        setUploadModalVisible(true);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
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
            Alert.alert("Permission to access camera is required!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
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

    const openDetailModal = (index?: number) => {
        if (index !== undefined && index >= 0) {
            const detail = details[index];
            setEditingDetailIndex(index);
            setDId(detail.id);
            setDMomentDate(detail.momentDate.split('T')[0]);
            setDVehicleId(detail.vehicleId.toString());
            setDContainerNo(detail.containerNo);
            setDFromLocation(detail.fromLocation);
            setDViaLocation(detail.viaLocation || '');
            setDToLocation(detail.toLocation);
            setDWeight(detail.weight.toString());
            setDFrs(detail.frs.toString());
            setDLoLo(detail.loLo.toString());
            setDDetention(detail.detention.toString());
            setDAmount(detail.amount.toString());
        } else {
            setEditingDetailIndex(null);
            resetDetailForm();
        }
        setDetailModalVisible(true);
    };

    const saveDetail = () => {
        if (!dVehicleId || !dFromLocation || !dToLocation || !dAmount) {
            Alert.alert('Error', 'Vehicle, Locations, and Amount are required');
            return;
        }

        const vehicle = vehicles.find(v => v.id.toString() === dVehicleId);
        const detailData: TripDetail = {
            id: dId,
            momentDate: dMomentDate,
            vehicleId: Number(dVehicleId),
            vehicleNumber: vehicle ? vehicle.vehicleNumber : '',
            containerNo: dContainerNo,
            fromLocation: dFromLocation,
            viaLocation: dViaLocation,
            toLocation: dToLocation,
            weight: Number(dWeight) || 0,
            frs: Number(dFrs) || 0,
            loLo: Number(dLoLo) || 0,
            detention: Number(dDetention) || 0,
            amount: Number(dAmount) || 0
        };

        if (editingDetailIndex !== null) {
            const updatedDetails = [...details];
            updatedDetails[editingDetailIndex] = detailData;
            setDetails(updatedDetails);
        } else {
            setDetails([...details, detailData]);
        }

        setDetailModalVisible(false);
        resetDetailForm();
    };

    const resetDetailForm = () => {
        setDId(undefined);
        setDVehicleId('');
        setDContainerNo('');
        setDFromLocation('');
        setDViaLocation('');
        setDToLocation('');
        setDWeight('');
        setDFrs('');
        setDLoLo('');
        setDDetention('');
        setDAmount('');
        setDMomentDate(new Date().toISOString().split('T')[0]);
        setEditingDetailIndex(null);
    };

    const removeDetail = (index: number) => {
        const newDetails = [...details];
        newDetails.splice(index, 1);
        setDetails(newDetails);
    };

    const handleSubmit = async () => {
        if (!driverId || !billNo || !startDatetime || details.length === 0) {
            Alert.alert('Error', 'Driver, Bill No, Date, and at least one Trip Detail are required');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('driverId', driverId);
        formData.append('driverName', driverName);
        formData.append('supplyTo', supplyTo);
        formData.append('billNo', billNo);
        formData.append('startDatetime', startDatetime);
        formData.append('refNo', refNo);
        formData.append('panNo', panNo);
        formData.append('docNo', docNo);
        formData.append('subTotal', subTotal.toString());
        formData.append('lessAdvance', (Number(lessAdvance) || 0).toString());
        formData.append('totalAmount', totalAmount.toString());
        if (notes) formData.append('notes', notes);
        if (tripStatus) formData.append('tripStatus', tripStatus);

        formData.append('details', JSON.stringify(details));

        if (billFile) {
            formData.append('billFile', {
                uri: billFile.uri,
                name: billFile.name,
                type: billFile.type,
            } as any);
        }

        try {
            if (editingTrip) {
                await updateTrip(editingTrip.id, formData);
                Alert.alert('Success', 'Trip updated successfully');
            } else {
                await createTrip(formData);
                Alert.alert('Success', 'Trip created successfully');
            }
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save trip');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Trip Information</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Driver *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={driverId}
                            onValueChange={handleDriverChange}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select Driver" value="" />
                            {drivers.map((d) => (
                                <Picker.Item key={d.id} label={d.name} value={d.id.toString()} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <Input label="Driver Name" value={driverName} onChangeText={setDriverName} />
                <Input label="Supply To" value={supplyTo} onChangeText={setSupplyTo} />
                <Input label="Bill No *" value={billNo} onChangeText={setBillNo} />
                <DatePickerInput label="Date *" value={startDatetime} onChange={(d) => setStartDatetime(d.toISOString().split('T')[0])} />
                <Input label="Ref No" value={refNo} onChangeText={setRefNo} />
                <Input label="PAN No" value={panNo} onChangeText={setPanNo} />
                <Input label="Doc No" value={docNo} onChangeText={setDocNo} />

                <Text style={styles.label}>Bill File</Text>
                <TouchableOpacity onPress={handleUploadPress} style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>{billFile ? "Change Bill File" : "Upload Bill"}</Text>
                </TouchableOpacity>

                {billFile && (
                    <View style={styles.filePreview}>
                        <Text style={styles.fileName}>Selected: {billFile.name}</Text>
                        {billFile.type.includes('image') && (
                            <Image source={{ uri: billFile.uri }} style={styles.previewImage} />
                        )}
                    </View>
                )}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Status</Text>
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={tripStatus} onValueChange={setTripStatus} style={styles.picker}>
                            <Picker.Item label="Planned" value="Planned" />
                            <Picker.Item label="In Progress" value="In Progress" />
                            <Picker.Item label="Completed" value="Completed" />
                            <Picker.Item label="Cancelled" value="Cancelled" />
                        </Picker>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Trip Details</Text>
                {details.map((detail, index) => (
                    <TouchableOpacity key={index} onPress={() => openDetailModal(index)}>
                        <View style={styles.detailCard}>
                            <View style={styles.detailCardHeader}>
                                <Text style={styles.detailTextBold}>{detail.vehicleNumber}</Text>
                                <TouchableOpacity onPress={(e) => { e.stopPropagation(); removeDetail(index); }}>
                                    <Text style={styles.removeText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.detailText}>{detail.fromLocation} → {detail.toLocation}</Text>
                            <Text style={styles.detailText}>Amt: {detail.amount}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
                <Button title="Add Detail" onPress={() => openDetailModal()} style={styles.addButton} />

                <Text style={styles.sectionTitle}>Payment</Text>
                <Input label="Sub Total" value={subTotal.toString()} editable={false} />
                <Input label="Less Advance" value={lessAdvance} onChangeText={setLessAdvance} keyboardType="numeric" />
                <Input label="Total Amount" value={totalAmount.toString()} editable={false} />
                <Input label="Notes" value={notes} onChangeText={setNotes} multiline numberOfLines={3} />

                <Button title={editingTrip ? "Update Trip" : "Create Trip"} onPress={handleSubmit} loading={loading} style={styles.submitButton} />

                {/* Detail Modal */}
                <Modal visible={detailModalVisible} animationType="slide" onRequestClose={() => setDetailModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <ScrollView contentContainerStyle={styles.modalContent}>
                            <Text style={styles.modalTitle}>{editingDetailIndex !== null ? 'Edit Trip Detail' : 'Add Trip Detail'}</Text>
                            <DatePickerInput label="Movement Date" value={dMomentDate} onChange={(d) => setDMomentDate(d.toISOString().split('T')[0])} />

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Vehicle *</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker selectedValue={dVehicleId} onValueChange={setDVehicleId} style={styles.picker}>
                                        <Picker.Item label="Select Vehicle" value="" />
                                        {vehicles.map((v) => (
                                            <Picker.Item key={v.id} label={v.vehicleNumber} value={v.id.toString()} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <Input label="Container No" value={dContainerNo} onChangeText={setDContainerNo} />
                            <Input label="From Location *" value={dFromLocation} onChangeText={setDFromLocation} />
                            <Input label="Via Location" value={dViaLocation} onChangeText={setDViaLocation} />
                            <Input label="To Location *" value={dToLocation} onChangeText={setDToLocation} />
                            <Input label="Weight" value={dWeight} onChangeText={setDWeight} keyboardType="numeric" />
                            <Input label="FRS" value={dFrs} onChangeText={setDFrs} keyboardType="numeric" />
                            <Input label="LoLo" value={dLoLo} onChangeText={setDLoLo} keyboardType="numeric" />
                            <Input label="Detention" value={dDetention} onChangeText={setDDetention} keyboardType="numeric" />
                            <Input label="Amount *" value={dAmount} onChangeText={setDAmount} keyboardType="numeric" />

                            <Button title={editingDetailIndex !== null ? "Update" : "Add"} onPress={saveDetail} style={styles.addButton} />
                            <Button title="Cancel" onPress={() => setDetailModalVisible(false)} style={{ backgroundColor: Colors.error, marginTop: Spacing.sm }} />
                        </ScrollView>
                    </View>
                </Modal>

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
    content: { paddingBottom: Spacing.xl },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginTop: Spacing.md, marginBottom: Spacing.sm },
    inputGroup: { marginBottom: Spacing.md },
    label: { fontSize: 14, color: Colors.text, marginBottom: 8, fontWeight: '500' },
    pickerContainer: { borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, backgroundColor: Colors.white, overflow: 'hidden', height: 50, justifyContent: 'center' },
    picker: { width: '100%', color: Colors.text },
    detailCard: { padding: Spacing.md, backgroundColor: Colors.background, borderRadius: BorderRadius.sm, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
    detailCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    detailTextBold: { fontSize: 14, fontWeight: 'bold', color: Colors.text },
    detailText: { fontSize: 14, color: Colors.text },
    removeText: { color: Colors.error, fontWeight: 'bold' },
    addButton: { marginTop: Spacing.sm },
    submitButton: { marginTop: Spacing.xl },
    modalContainer: { flex: 1, backgroundColor: Colors.white },
    modalContent: { padding: Spacing.md },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: Spacing.md, textAlign: 'center' },
    uploadButton: { padding: 12, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.primary, borderRadius: BorderRadius.sm, alignItems: 'center', marginBottom: Spacing.md },
    uploadButtonText: { color: Colors.primary, fontWeight: '600', fontSize: 16 },
    filePreview: { marginBottom: Spacing.md, alignItems: 'center' },
    previewImage: { width: 100, height: 100, borderRadius: BorderRadius.sm, marginTop: 5 },
    fileName: { fontSize: 12, color: Colors.textLight },

    // Upload Modal Styles
    uploadModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    uploadModalContainer: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, minHeight: 250 },
    uploadModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    uploadModalTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
    uploadOptions: { flexDirection: 'row', justifyContent: 'space-around' },
    uploadOption: { alignItems: 'center' },
    iconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    uploadOptionText: { fontSize: 14, color: Colors.text, fontWeight: '500' }
});
