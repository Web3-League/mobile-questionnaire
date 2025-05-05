import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { styles } from './stylesHc';

type CheckboxFieldProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, checked, onChange }) => {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => onChange(!checked)}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked ? styles.checkboxChecked : null]}>
        {checked && <Icon name="check" size={16} color="#FFFFFF" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CheckboxField;