// FormTabs.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';

export type FormTab = {
  id: string;
  label: string;
  icon: string;
};

export interface FormTabsProps {
  tabs: FormTab[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

const FormTabs: React.FC<FormTabsProps> = ({ tabs, activeTab, setActiveTab }) => (
  <View style={styles.tabsWrapper}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tabsContainer}
      contentContainerStyle={styles.tabsContentContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tabButton, activeTab === tab.id && styles.activeTabButton]}
          onPress={() => setActiveTab(tab.id)}>
          <Icon
            name={tab.icon}
            size={16}
            color={activeTab === tab.id ? '#2563EB' : '#6B7280'}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabButtonText, activeTab === tab.id && styles.activeTabButtonText]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

export default FormTabs;

