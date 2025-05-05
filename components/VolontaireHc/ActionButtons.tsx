import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from './stylesHc';

type ActionButtonsProps = {
  onCancel: () => void;
  onSubmit: () => void;
  loading?: boolean;
};

const ActionButtons: React.FC<ActionButtonsProps> = ({ onCancel, onSubmit, loading = false }) => {
  return (
    <View style={styles.buttonsContainer}>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.cancelButtonText}>Annuler</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.submitButton}
        onPress={onSubmit}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Enregistrer</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ActionButtons;