import React, { useEffect, useState } from 'react';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDriverById, updateDriver } from '../../api/drivers';

const EditDriverScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { driverId } = route.params;
  const [form, setForm] = useState({ name: '', license: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDriverById(driverId).then(data => {
      setForm({ name: data.name, license: data.license });
      setLoading(false);
    });
  }, [driverId]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await updateDriver(driverId, form);
    navigation.goBack();
  };

  if (loading) return <ScreenContainer><p>Loading...</p></ScreenContainer>;

  return (
    <ScreenContainer>
      <Input label="Name" value={form.name} onChangeText={v => handleChange('name', v)} />
      <Input label="License" value={form.license} onChangeText={v => handleChange('license', v)} />
      <Button title="Save Changes" onPress={handleSubmit} />
    </ScreenContainer>
  );
};

export default EditDriverScreen;
