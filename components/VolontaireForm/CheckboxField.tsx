// CheckboxField.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';

export interface CheckboxFieldProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (id: string, value: 'Oui' | 'Non') => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, id, checked, onChange }) => (
  <TouchableOpacity
    style={styles.checkboxContainer}
    onPress={() => onChange(id, checked ? 'Non' : 'Oui')}>
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Icon name="check" size={14} color="#FFFFFF" />}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

export default CheckboxField;