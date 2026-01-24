import React, { useEffect, useState } from 'react';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getUserById, updateUser } from '../../api/users';

const EditUserScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserById(userId).then(data => {
      setForm({ name: data.name, email: data.email });
      setLoading(false);
    });
  }, [userId]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await updateUser(userId, form);
    navigation.goBack();
  };

  if (loading) return <ScreenContainer><p>Loading...</p></ScreenContainer>;

  return (
    <ScreenContainer>
      <Input label="Name" value={form.name} onChangeText={v => handleChange('name', v)} />
      <Input label="Email" value={form.email} onChangeText={v => handleChange('email', v)} />
      <Button title="Save Changes" onPress={handleSubmit} />
    </ScreenContainer>
  );
};

export default EditUserScreen;
