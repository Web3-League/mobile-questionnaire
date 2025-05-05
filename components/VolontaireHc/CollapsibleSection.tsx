import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './stylesHc';

type CollapsibleSectionProps = {
  title: string;
  icon: string;
  children: React.ReactNode;
};

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, icon, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={toggleCollapse}
        activeOpacity={0.7}
      >
        <View style={styles.sectionTitleContainer}>
          <Icon name={icon} size={20} color="#2563EB" style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Icon 
          name={isCollapsed ? 'chevron-down' : 'chevron-up'} 
          size={20} 
          color="#64748B" 
        />
      </TouchableOpacity>

      {!isCollapsed && (
        <View style={styles.sectionContent}>
          {children}
        </View>
      )}
    </View>
  );
};

export default CollapsibleSection;