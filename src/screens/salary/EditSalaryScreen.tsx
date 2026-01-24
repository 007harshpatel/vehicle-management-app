import React, { useEffect, useState } from 'react';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getSalaryById, updateSalary } from '../../api/salary';

const EditSalaryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { salaryId } = route.params;
  const [form, setForm] = useState({ amount: '', month: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSalaryById(salaryId).then(data => {
      setForm({ amount: data.amount, month: data.month });
      setLoading(false);
    });
  }, [salaryId]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await updateSalary(salaryId, form);
    navigation.goBack();
  };

  if (loading) return <ScreenContainer><p>Loading...</p></ScreenContainer>;

  return (
    <ScreenContainer>
      <Input label="Amount" value={form.amount} onChangeText={v => handleChange('amount', v)} />
      <Input label="Month" value={form.month} onChangeText={v => handleChange('month', v)} />
      <Button title="Save Changes" onPress={handleSubmit} />
    </ScreenContainer>
  );
};

export default EditSalaryScreen;
