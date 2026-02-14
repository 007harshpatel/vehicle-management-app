import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ScrollView, View, Text, TouchableOpacity, Modal, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { DatePickerInput } from '../../components/DatePickerInput';
import { Button } from '../../components/Button';
import { createTrip, updateTrip, Trip } from '../../api/trips';
import { getVehicles, Vehicle } from '../../api/vehicles';
import { getDrivers, Driver } from '../../api/drivers';
import { getParties, Party } from '../../api/ledger';
import { BASE_URL } from '../../api/client';
import { Spacing, Colors, BorderRadius } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';

export const CreateTripScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const editingTrip = route.params?.trip as Trip | undefined;
    const [loading, setLoading] = useState(false);

    // Data Sources
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [parties, setParties] = useState<Party[]>([]);

    // --- Form Fields ---

    // 1. Trip Basic Info
    const [driverId, setDriverId] = useState('');
    const [driverName, setDriverName] = useState('');
    const [partyId, setPartyId] = useState('');
    const [supplyTo, setSupplyTo] = useState('');
    const [billNo, setBillNo] = useState('');
    const [startDatetime, setStartDatetime] = useState(new Date().toISOString().split('T')[0]);
    const [refNo, setRefNo] = useState('');
    const [panNo, setPanNo] = useState('');
    const [docNo, setDocNo] = useState('');
    const [notes, setNotes] = useState(''); // General Notes
    const [tripStatus, setTripStatus] = useState('In Progress');
    const [dealAmount, setDealAmount] = useState('');

    // 2. Logistics Details
    const [momentDate, setMomentDate] = useState(new Date().toISOString().split('T')[0]);
    const [vehicleId, setVehicleId] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [containerNo, setContainerNo] = useState('');
    const [fromLocation, setFromLocation] = useState('');
    const [viaLocation, setViaLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [weight, setWeight] = useState('');

    // 3. Our Cost (Aapne Kharcho)
    const [diesel, setDiesel] = useState('');
    const [toll, setToll] = useState('');
    const [driverExpense, setDriverExpense] = useState('');
    const [biltyCharge, setBiltyCharge] = useState('');
    const [extraMoney, setExtraMoney] = useState(''); // Label: Extra Charge
    const [ourCostNote, setOurCostNote] = useState('');

    // 4. Party Bill (Party pase thi levana)
    const [rate, setRate] = useState('');

    const [loLo, setLoLo] = useState('');
    const [extraCharge, setExtraCharge] = useState(''); // Label: Extra Money
    const [weighBridge, setWeighBridge] = useState('');
    const [detention, setDetention] = useState('');
    const [partyBillNote, setPartyBillNote] = useState('');
    const [transporter, setTransporter] = useState('');
    const [billDueDate, setBillDueDate] = useState<string | undefined>(undefined);

    // 5. Financial Totals
    const [totalOurCost, setTotalOurCost] = useState(0);
    const [totalPartyBill, setTotalPartyBill] = useState(0);

    // Legacy/Standard Financials
    const [lessAdvance, setLessAdvance] = useState('');
    // totalAmount is essentially Party Bill Total
    const [receivedDate, setReceivedDate] = useState<string | undefined>(undefined);
    const [receivedAmount, setReceivedAmount] = useState('');
    const [pendingAmount, setPendingAmount] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);

    // File
    const [billFile, setBillFile] = useState<any>(null);
    const [existingFile, setExistingFile] = useState<string | null>(null);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);

    useEffect(() => {
        if (editingTrip) {
            setDriverId(editingTrip.driverId ? editingTrip.driverId.toString() : '');
            setDriverName(editingTrip.driverName);
            setPartyId(editingTrip.partyId ? editingTrip.partyId.toString() : '');
            setSupplyTo(editingTrip.supplyTo);
            setBillNo(editingTrip.billNo);
            setStartDatetime(editingTrip.startDatetime ? editingTrip.startDatetime.split('T')[0] : new Date().toISOString().split('T')[0]);
            setRefNo(editingTrip.refNo || '');
            setPanNo(editingTrip.panNo || '');
            setDocNo(editingTrip.docNo || '');
            setNotes(editingTrip.notes || '');
            setTripStatus(editingTrip.tripStatus || 'In Progress');
            setDealAmount(editingTrip.dealAmount ? editingTrip.dealAmount.toString() : '');

            // Logistics
            setMomentDate(editingTrip.momentDate ? editingTrip.momentDate.split('T')[0] : new Date().toISOString().split('T')[0]);
            setVehicleId(editingTrip.vehicleId ? editingTrip.vehicleId.toString() : '');
            setVehicleNumber(editingTrip.vehicleNumber || '');
            setContainerNo(editingTrip.containerNo || '');
            setFromLocation(editingTrip.fromLocation || '');
            setViaLocation(editingTrip.viaLocation || '');
            setToLocation(editingTrip.toLocation || '');
            setWeight(editingTrip.weight ? editingTrip.weight.toString() : '');

            // Our Cost
            setDiesel(editingTrip.diesel ? editingTrip.diesel.toString() : '');
            setToll(editingTrip.toll ? editingTrip.toll.toString() : '');
            setDriverExpense(editingTrip.driverExpense ? editingTrip.driverExpense.toString() : '');
            setBiltyCharge(editingTrip.biltyCharge ? editingTrip.biltyCharge.toString() : '');
            setExtraMoney(editingTrip.extraMoney ? editingTrip.extraMoney.toString() : ''); // Mapped to Cost Extra
            setOurCostNote(editingTrip.ourCostNote || '');

            // Party Bill
            setRate(editingTrip.rate ? editingTrip.rate.toString() : '');

            setLoLo(editingTrip.loLo ? editingTrip.loLo.toString() : '');
            setExtraCharge(editingTrip.extraCharge ? editingTrip.extraCharge.toString() : ''); // Mapped to Bill Extra
            setWeighBridge(editingTrip.weighBridge ? editingTrip.weighBridge.toString() : '');
            setDetention(editingTrip.detention ? editingTrip.detention.toString() : '');
            setPartyBillNote(editingTrip.partyBillNote || '');
            setTransporter(editingTrip.transporter || '');
            setBillDueDate(editingTrip.billDueDate ? editingTrip.billDueDate.split('T')[0] : undefined);

            // Financials
            setLessAdvance(editingTrip.lessAdvance ? editingTrip.lessAdvance.toString() : '');
            setReceivedDate(editingTrip.receivedDate ? editingTrip.receivedDate.split('T')[0] : undefined);
            setReceivedAmount(editingTrip.receivedAmount ? editingTrip.receivedAmount.toString() : '');

            if (editingTrip.bill_file) {
                setExistingFile(editingTrip.bill_file);
            }
        }
    }, [editingTrip]);

    useEffect(() => {
        fetchData();
    }, []);

    // Auto-calculate Financials
    useEffect(() => {
        // 1. Calculate Our Cost (Aapne Kharcho)
        // Diesel + Toll + Driver Exp + Bilty + Extra Cost (DB extraMoney)
        const cost = (Number(diesel) || 0) +
            (Number(toll) || 0) +
            (Number(driverExpense) || 0) +
            (Number(biltyCharge) || 0) +
            (Number(extraMoney) || 0);
        setTotalOurCost(cost);

        // 2. Calculate Party Bill (Party pase thi levana)
        // Rate + FRS + LoLo + Extra Bill (DB extraCharge) + Waybridge + Detention
        const bill = (Number(rate) || 0) +

            (Number(loLo) || 0) +
            (Number(extraCharge) || 0) +
            (Number(weighBridge) || 0) +
            (Number(detention) || 0);
        setTotalPartyBill(bill);

        // 3. Profit = Deal Amount + Bill - Cost
        const deal = Number(dealAmount) || 0;
        setTotalProfit(deal + bill - cost);

        // 4. Pending = (Deal Amount + Bill) - Received
        const received = Number(receivedAmount) || 0;
        setPendingAmount((deal + bill) - received);

    }, [diesel, toll, driverExpense, biltyCharge, extraMoney, rate, loLo, extraCharge, weighBridge, detention, receivedAmount, dealAmount]);

    const fetchData = async () => {
        try {
            const [vehiclesData, driversData, partiesData] = await Promise.all([
                getVehicles(),
                getDrivers(),
                getParties()
            ]);
            setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
            setDrivers(Array.isArray(driversData) ? driversData : []);
            setParties(Array.isArray(partiesData) ? partiesData : []);
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch required data', 'error');
        }
    };

    const handleDriverChange = (id: string) => {
        setDriverId(id);
        const driver = drivers.find(d => d.id.toString() === id);
        if (driver) {
            setDriverName(driver.name);
        }
    };

    const handleVehicleChange = (itemValue: string) => {
        setVehicleId(itemValue);
        const selectedVehicle = vehicles.find(v => v.id.toString() === itemValue);
        if (selectedVehicle) {
            setVehicleNumber(selectedVehicle.vehicleNumber);
            // Auto-select driver if assigned to vehicle
            if (selectedVehicle.driverId) {
                setDriverId(selectedVehicle.driverId.toString());
            }
        }
    };

    const handleUploadPress = () => setUploadModalVisible(true);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], allowsEditing: false, aspect: [4, 3], quality: 0.8,
        });
        if (!result.canceled) {
            const asset = result.assets[0];
            setBillFile({ uri: asset.uri, type: asset.mimeType || 'image/jpeg', name: asset.fileName || 'bill.jpg' });
            setUploadModalVisible(false);
        }
    };

    const pickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', copyToCacheDirectory: true });
        if (!result.canceled) {
            const asset = result.assets[0];
            setBillFile({ uri: asset.uri, type: asset.mimeType || 'application/pdf', name: asset.name || 'bill.pdf' });
            setUploadModalVisible(false);
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) return showToast("Permission to access camera is required!", 'error');
        const result = await ImagePicker.launchCameraAsync({ allowsEditing: false, aspect: [4, 3], quality: 0.8 });
        if (!result.canceled) {
            const asset = result.assets[0];
            setBillFile({ uri: asset.uri, type: asset.mimeType || 'image/jpeg', name: asset.fileName || 'camera_capture.jpg' });
            setUploadModalVisible(false);
        }
    }

    const handleSubmit = async () => {
        if (!driverId || !billNo || !startDatetime || !vehicleId || !fromLocation || !toLocation) {
            showToast('Please fill all required fields (*)', 'warning');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        // Basic
        formData.append('driverId', driverId);
        formData.append('driverName', driverName);
        if (partyId) formData.append('partyId', partyId);
        formData.append('supplyTo', supplyTo);
        formData.append('billNo', billNo);
        formData.append('startDatetime', startDatetime);
        formData.append('refNo', refNo);
        formData.append('panNo', panNo);
        formData.append('docNo', docNo);
        formData.append('notes', notes);
        formData.append('tripStatus', tripStatus);
        formData.append('dealAmount', dealAmount || '0');

        // Logistics
        formData.append('momentDate', momentDate);
        formData.append('vehicleId', vehicleId);
        formData.append('vehicleNumber', vehicleNumber);
        formData.append('containerNo', containerNo);
        formData.append('fromLocation', fromLocation);
        formData.append('viaLocation', viaLocation);
        formData.append('toLocation', toLocation);
        formData.append('weight', weight || '0');

        // Our Cost (Mapped Fields)
        formData.append('diesel', diesel || '0');
        formData.append('toll', toll || '0');
        formData.append('driverExpense', driverExpense || '0');
        formData.append('biltyCharge', biltyCharge || '0');
        formData.append('extraMoney', extraMoney || '0'); // UI: Extra Charge (Cost) -> DB: extraMoney
        formData.append('ourCostNote', ourCostNote);

        // Party Bill (Mapped Fields)
        formData.append('rate', rate || '0');

        formData.append('loLo', loLo || '0');
        formData.append('extraCharge', extraCharge || '0'); // UI: Extra Money (Bill) -> DB: extraCharge
        formData.append('weighBridge', weighBridge || '0');
        formData.append('detention', detention || '0');
        formData.append('partyBillNote', partyBillNote);
        formData.append('transporter', transporter);
        if (billDueDate) formData.append('billDueDate', billDueDate);

        // Financials
        // Inherited fields logic
        formData.append('subTotal', totalPartyBill.toString()); // Assuming SubTotal = Total Bill
        formData.append('totalAmount', totalPartyBill.toString()); // Total Bill
        formData.append('lessAdvance', (Number(lessAdvance) || 0).toString());

        if (receivedDate) formData.append('receivedDate', receivedDate);
        formData.append('receivedAmount', (Number(receivedAmount) || 0).toString());
        formData.append('pendingAmount', pendingAmount.toString());
        formData.append('totalProfit', totalProfit.toString());

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
                showToast('Trip updated successfully', 'success');
            } else {
                await createTrip(formData);
                showToast('Trip created successfully', 'success');
            }
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'Failed to save trip';
            showToast(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const SectionHeader = ({ title, total }: { title: string, total?: number }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {total !== undefined && (
                <View style={styles.totalBadge}>
                    <Text style={styles.totalBadgeText}>₹{total}</Text>
                </View>
            )}
        </View>
    );

    return (
        <ScreenContainer title={editingTrip ? "Edit Trip" : "Create Trip"}>
            <ScrollView contentContainerStyle={styles.content}>

                {/* --- Basic Info --- */}
                <SectionHeader title="Basic Info" />
                <View style={styles.card}>
                    {/* 1. Ledger Party */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Ledger Party</Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={partyId} onValueChange={setPartyId} style={styles.picker}>
                                <Picker.Item label="Select Party" value="" />
                                {parties.map((p) => <Picker.Item key={p.id} label={p.partyName} value={p.id.toString()} />)}
                            </Picker>
                        </View>
                    </View>

                    {/* 2. Vehicle */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Vehicle *</Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={vehicleId} onValueChange={handleVehicleChange} style={styles.picker}>
                                <Picker.Item label="Select Vehicle" value="" />
                                {vehicles.map((v) => <Picker.Item key={v.id} label={v.vehicleNumber} value={v.id.toString()} />)}
                            </Picker>
                        </View>
                    </View>

                    {/* 3. Driver */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Driver *</Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={driverId} onValueChange={handleDriverChange} style={styles.picker}>
                                <Picker.Item label="Select Driver" value="" />
                                {drivers.map((d) => <Picker.Item key={d.id} label={d.name} value={d.id.toString()} />)}
                            </Picker>
                        </View>
                    </View>

                    {/* 4. Date */}
                    <DatePickerInput label="Date *" value={startDatetime} onChange={(d) => setStartDatetime(d.toISOString().split('T')[0])} />

                    <Input label="Bill No *" value={billNo} onChangeText={setBillNo} />
                    <DatePickerInput label="Bill Due Date" value={billDueDate} onChange={(d) => setBillDueDate(d.toISOString().split('T')[0])} />
                    <Input label="Supply To" value={supplyTo} onChangeText={setSupplyTo} />
                    <Input label="Deal Amount" value={dealAmount} onChangeText={setDealAmount} keyboardType="numeric" />

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Trip Status</Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={tripStatus} onValueChange={setTripStatus} style={styles.picker}>
                                <Picker.Item label="In Progress" value="In Progress" />
                                <Picker.Item label="Complete" value="Complete" />
                                <Picker.Item label="Finished" value="Finished" />
                            </Picker>
                        </View>
                    </View>
                </View>

                {/* --- Route Info --- */}
                <SectionHeader title="Route Details" />
                <View style={styles.card}>
                    {/* Route Timeline UI */}
                    <View style={styles.routeContainer}>
                        <View style={styles.routeRow}>
                            <View style={styles.timelineContainer}>
                                <View style={[styles.dot, { backgroundColor: Colors.success }]} />
                                <View style={styles.line} />
                            </View>
                            <View style={styles.routeInput}>
                                <Input label="From Location" value={fromLocation} onChangeText={setFromLocation} placeholder="Start Point" />
                            </View>
                        </View>

                        <View style={styles.routeRow}>
                            <View style={styles.timelineContainer}>
                                <View style={[styles.dot, { backgroundColor: Colors.warning }]} />
                                <View style={styles.line} />
                            </View>
                            <View style={styles.routeInput}>
                                <Input label="Via (Optional)" value={viaLocation} onChangeText={setViaLocation} placeholder="Stopover" />
                            </View>
                        </View>

                        <View style={styles.routeRow}>
                            <View style={styles.timelineContainer}>
                                <View style={[styles.dot, { backgroundColor: Colors.error }]} />
                            </View>
                            <View style={styles.routeInput}>
                                <Input label="To Location" value={toLocation} onChangeText={setToLocation} placeholder="Destination" />
                            </View>
                        </View>
                    </View>
                    <Input label="Weight (Ton)" value={weight} onChangeText={setWeight} keyboardType="numeric" />
                </View>

                {/* --- Our Cost (Aapne Kharcho) --- */}
                <SectionHeader title="Our Cost (Expenses)" total={totalOurCost} />
                <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: Colors.error }]}>
                    <View style={styles.row}>
                        <View style={styles.col}><Input label="Diesel" value={diesel} onChangeText={setDiesel} keyboardType="numeric" /></View>
                        <View style={styles.col}><Input label="Toll" value={toll} onChangeText={setToll} keyboardType="numeric" /></View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}><Input label="Driver Exp" value={driverExpense} onChangeText={setDriverExpense} keyboardType="numeric" /></View>
                        <View style={styles.col}><Input label="Bilty" value={biltyCharge} onChangeText={setBiltyCharge} keyboardType="numeric" /></View>
                    </View>
                    <Input label="Extra Charge" value={extraMoney} onChangeText={setExtraMoney} keyboardType="numeric" placeholder="(e.g. Penalty)" />
                    <Input label="Note" value={ourCostNote} onChangeText={setOurCostNote} multiline numberOfLines={2} />
                </View>


                {/* --- Party Bill (Receivables) --- */}
                <SectionHeader title="Party Bill (Receivables)" total={totalPartyBill} />
                <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: Colors.success }]}>
                    <Input label="Freight Rate" value={rate} onChangeText={setRate} keyboardType="numeric" style={{ fontWeight: 'bold' }} />

                    <View style={styles.row}>

                        <View style={styles.col}><Input label="LoLo" value={loLo} onChangeText={setLoLo} keyboardType="numeric" /></View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.col}><Input label="Extra Money" value={extraCharge} onChangeText={setExtraCharge} keyboardType="numeric" /></View>
                        <View style={styles.col}><Input label="Weigh Bridge" value={weighBridge} onChangeText={setWeighBridge} keyboardType="numeric" /></View>
                    </View>

                    <Input label="Detention" value={detention} onChangeText={setDetention} keyboardType="numeric" />
                    <Input label="Note" value={partyBillNote} onChangeText={setPartyBillNote} multiline numberOfLines={2} />
                </View>

                {/* --- Financial Summary --- */}
                <SectionHeader title="Profit & Status" />
                <View style={styles.card}>
                    {/* Summary Row */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, backgroundColor: '#F8F9FA', padding: 10, borderRadius: 8 }}>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={{ fontSize: 12, color: Colors.textLight, marginBottom: 4 }}>Total Trip Value</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.primary }}>
                                ₹{(Number(dealAmount) || 0) + totalPartyBill}
                            </Text>
                        </View>
                        <View style={{ width: 1, backgroundColor: Colors.border, marginHorizontal: 10 }} />
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={{ fontSize: 12, color: Colors.textLight, marginBottom: 4 }}>Total Profit</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.success }}>
                                ₹{totalProfit}
                            </Text>
                        </View>
                    </View>

                    <Text style={{ marginTop: 5, marginBottom: 10, fontWeight: '600', color: Colors.text }}>Payment Status</Text>
                    <View style={styles.row}>
                        <View style={styles.col}><Input label="Received Amount" value={receivedAmount} onChangeText={setReceivedAmount} keyboardType="numeric" /></View>
                        <View style={styles.col}>
                            {/* Read-only Text for Pending */}
                            <Text style={{ fontSize: 14, color: Colors.text, marginBottom: 10, fontWeight: '500' }}>Pending Amount</Text>
                            <View style={{ borderWidth: 1, borderColor: '#FFECB3', borderRadius: BorderRadius.md, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF8E1' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.error }}>₹{pendingAmount}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* --- File Upload --- */}
                <Text style={styles.sectionTitle}>Documents</Text>
                <TouchableOpacity onPress={handleUploadPress} style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>{billFile ? "Change Bill File" : "Upload Bill / Document"}</Text>
                </TouchableOpacity>

                {existingFile && !billFile && (
                    <TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/${existingFile}`)} style={styles.existingFileContainer}>
                        <Text style={{ fontSize: 24 }}>📄</Text>
                        <Text style={styles.existingFileLabel}>View Uploaded File</Text>
                    </TouchableOpacity>
                )}

                {billFile && (
                    <View style={styles.filePreview}>
                        <Text style={styles.fileName}>{billFile.name}</Text>
                        {billFile.type.includes('image') && <Image source={{ uri: billFile.uri }} style={styles.previewImage} />}
                    </View>
                )}

                <Button title={editingTrip ? "Update Trip" : "Create Trip"} onPress={handleSubmit} loading={loading} style={styles.submitButton} />

                {/* Upload Modal */}
                <Modal visible={uploadModalVisible} transparent={true} animationType="slide" onRequestClose={() => setUploadModalVisible(false)}>
                    <View style={styles.uploadModalOverlay}>
                        <View style={styles.uploadModalContainer}>
                            <View style={styles.uploadModalHeader}>
                                <Text style={styles.uploadModalTitle}>Upload</Text>
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
    content: { paddingBottom: Spacing.xl },

    // Header
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
    totalBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    totalBadgeText: { color: 'white', fontWeight: 'bold', fontSize: 14 },

    // Card
    card: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        borderWidth: 1,
        borderColor: Colors.border,
    },

    inputGroup: { marginBottom: Spacing.md },
    label: { fontSize: 14, color: Colors.text, marginBottom: 8, fontWeight: '500' },
    pickerContainer: { borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, backgroundColor: Colors.white, overflow: 'hidden', height: 50, justifyContent: 'center' },
    picker: { width: '100%', color: Colors.text },
    submitButton: { marginTop: Spacing.xl },
    uploadButton: { padding: 12, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.primary, borderRadius: BorderRadius.sm, alignItems: 'center', marginBottom: Spacing.md },
    uploadButtonText: { color: Colors.primary, fontWeight: '600', fontSize: 16 },
    filePreview: { marginBottom: Spacing.md, alignItems: 'center' },
    previewImage: { width: 100, height: 100, borderRadius: BorderRadius.sm, marginTop: 5 },
    fileName: { fontSize: 12, color: Colors.textLight },
    existingFileContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e3f2fd', padding: 12, borderRadius: BorderRadius.sm, marginBottom: Spacing.md, borderWidth: 1, borderColor: '#bbdefb' },
    existingFileLabel: { fontSize: 14, fontWeight: '600', color: Colors.text, marginLeft: 10 },

    // Grid System
    row: { flexDirection: 'row', gap: 10, marginBottom: Spacing.sm },
    col: { flex: 1 },

    // Route Timeline
    routeContainer: { marginBottom: Spacing.md },
    routeRow: { flexDirection: 'row', alignItems: 'flex-start' },
    timelineContainer: { alignItems: 'center', marginRight: 10, marginTop: 35, width: 20 },
    dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
    line: { width: 2, height: 45, backgroundColor: '#E0E0E0', marginVertical: 4 },
    routeInput: { flex: 1 },

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
