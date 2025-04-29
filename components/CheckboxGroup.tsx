import React from 'react';
import { View, Text } from 'react-native';
import CheckboxField from './CheckboxField';
import { styles } from './stylesHc';

type CheckboxItem = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

type CheckboxGroupProps = {
  title?: string;
  items: CheckboxItem[];
};

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, items }) => (
  <View style={styles.groupContainer}>
    {title && <Text style={styles.groupTitle}>{title}</Text>}
    <View style={styles.checkboxRow}>
      {items.map((item) => (
        <CheckboxField
          key={item.id}
          label={item.label}
          checked={item.checked}
          onChange={item.onChange}
        />
      ))}
    </View>
  </View>
);

export default CheckboxGroup;