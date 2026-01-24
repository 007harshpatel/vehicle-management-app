import React, { useEffect, useState } from 'react';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getNotificationById, updateNotification } from '../../api/notifications';

const EditNotificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { notificationId } = route.params;
  const [form, setForm] = useState({ title: '', message: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotificationById(notificationId).then(data => {
      setForm({ title: data.title, message: data.message });
      setLoading(false);
    });
  }, [notificationId]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await updateNotification(notificationId, form);
    navigation.goBack();
  };

  if (loading) return <ScreenContainer><p>Loading...</p></ScreenContainer>;

  return (
    <ScreenContainer>
      <Input label="Title" value={form.title} onChangeText={v => handleChange('title', v)} />
      <Input label="Message" value={form.message} onChangeText={v => handleChange('message', v)} />
      <Button title="Save Changes" onPress={handleSubmit} />
    </ScreenContainer>
  );
};

export default EditNotificationScreen;
