import React, { useEffect, useState } from 'react';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getTripById, updateTrip } from '../../api/trips';

const EditTripScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tripId } = route.params;
  const [form, setForm] = useState({ destination: '', date: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTripById(tripId).then(data => {
      setForm({ destination: data.destination, date: data.date });
      setLoading(false);
    });
  }, [tripId]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await updateTrip(tripId, form);
    navigation.goBack();
  };

  if (loading) return <ScreenContainer><p>Loading...</p></ScreenContainer>;

  return (
    <ScreenContainer>
      <Input label="Destination" value={form.destination} onChangeText={v => handleChange('destination', v)} />
      <Input label="Date" value={form.date} onChangeText={v => handleChange('date', v)} />
      <Button title="Save Changes" onPress={handleSubmit} />
    </ScreenContainer>
  );
};

export default EditTripScreen;
