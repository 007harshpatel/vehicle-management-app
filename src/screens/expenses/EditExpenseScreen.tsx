import React, { useEffect, useState } from 'react';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getExpenseById, updateExpense } from '../../api/expenses';

const EditExpenseScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { expenseId } = route.params;
  const [form, setForm] = useState({ amount: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExpenseById(expenseId).then(data => {
      setForm({ amount: data.amount, description: data.description });
      setLoading(false);
    });
  }, [expenseId]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await updateExpense(expenseId, form);
    navigation.goBack();
  };

  if (loading) return <ScreenContainer><p>Loading...</p></ScreenContainer>;

  return (
    <ScreenContainer>
      <Input label="Amount" value={form.amount} onChangeText={v => handleChange('amount', v)} />
      <Input label="Description" value={form.description} onChangeText={v => handleChange('description', v)} />
      <Button title="Save Changes" onPress={handleSubmit} />
    </ScreenContainer>
  );
};

export default EditExpenseScreen;
