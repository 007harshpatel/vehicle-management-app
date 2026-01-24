import React, { useEffect, useState } from 'react';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getMaintenanceById, updateMaintenance } from '../../api/maintenance';

const EditMaintenanceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { maintenanceId } = route.params;
  const [form, setForm] = useState({ type: '', cost: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMaintenanceById(maintenanceId).then(data => {
      setForm({ type: data.type, cost: data.cost });
      setLoading(false);
    });
  }, [maintenanceId]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await updateMaintenance(maintenanceId, form);
    navigation.goBack();
  };

  if (loading) return <ScreenContainer><p>Loading...</p></ScreenContainer>;

  return (
    <ScreenContainer>
      <Input label="Type" value={form.type} onChangeText={v => handleChange('type', v)} />
      <Input label="Cost" value={form.cost} onChangeText={v => handleChange('cost', v)} />
      <Button title="Save Changes" onPress={handleSubmit} />
    </ScreenContainer>
  );
};

export default EditMaintenanceScreen;
