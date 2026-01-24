import React, { useEffect, useState } from 'react';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getVehicleById, updateVehicle } from '../../api/vehicles';

const EditVehicleScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { vehicleId } = route.params;
  const [form, setForm] = useState({ number: '', model: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVehicleById(vehicleId).then(data => {
      setForm({ number: data.number, model: data.model });
      setLoading(false);
    });
  }, [vehicleId]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await updateVehicle(vehicleId, form);
    navigation.goBack();
  };

  if (loading) return <ScreenContainer><p>Loading...</p></ScreenContainer>;

  return (
    <ScreenContainer>
      <Input label="Number" value={form.number} onChangeText={v => handleChange('number', v)} />
      <Input label="Model" value={form.model} onChangeText={v => handleChange('model', v)} />
      <Button title="Save Changes" onPress={handleSubmit} />
    </ScreenContainer>
  );
};

export default EditVehicleScreen;
