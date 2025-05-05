// FormHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './stylesHc';

type FormHeaderProps = {
  title: string;
  onBack: () => void;
};

export const FormHeader: React.FC<FormHeaderProps> = ({ title, onBack }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack}>
      <Icon name="arrow-left" size={24} />
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default FormHeader;