import React, { useEffect, useState } from 'react';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getLedgerEntryById, updateLedgerEntry } from '../../api/ledger';

const EditLedgerEntryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { entryId } = route.params;
  const [form, setForm] = useState({ amount: '', party: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLedgerEntryById(entryId).then(data => {
      setForm({ amount: data.amount, party: data.party });
      setLoading(false);
    });
  }, [entryId]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await updateLedgerEntry(entryId, form);
    navigation.goBack();
  };

  if (loading) return <ScreenContainer><p>Loading...</p></ScreenContainer>;

  return (
    <ScreenContainer>
      <Input label="Amount" value={form.amount} onChangeText={v => handleChange('amount', v)} />
      <Input label="Party" value={form.party} onChangeText={v => handleChange('party', v)} />
      <Button title="Save Changes" onPress={handleSubmit} />
    </ScreenContainer>
  );
};

export default EditLedgerEntryScreen;
