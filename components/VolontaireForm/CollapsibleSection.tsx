// CollapsibleSection.tsx
import React, { useState, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';

export interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  isOpen?: boolean;
  icon?: ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  isOpen = false,
  icon = null,
}) => {
  const [open, setOpen] = useState(isOpen);

  return (
    <View style={styles.collapsibleSection}>
      <TouchableOpacity style={styles.sectionHeader} onPress={() => setOpen(!open)}>
        <View style={styles.sectionTitleContainer}>
          {icon}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Icon
          name={open ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#1F2937"
        />
      </TouchableOpacity>

      {open && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

export default CollapsibleSection;