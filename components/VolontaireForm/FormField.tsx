// FormField.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Keyboard
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';
import WebDatePicker from './WebDatePicker';
import { Modal } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import FieldAlert from './FieldAlert';


export type FormFieldType = 'text' | 'select' | 'date' | 'textarea' | 'number';
export type FormFieldOption = string | { label: string; value: string };

export interface FormFieldProps {
  label: string;
  id: string;
  type?: FormFieldType;
  value?: string;
  onChange: (name: string, value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  error?: string | null;
  options?: FormFieldOption[];
  placeholder?: string;
  infoTooltip?: string | null;
  numberOfLines?: number;
}

// Utility function to convert a date to ISO format
export const toISODateString = (dateString?: string | Date): string => {
  try {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Date conversion error:', error);
    return '';
  }
};

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  onBlur,
  required = false,
  error = null,
  options = [],
  placeholder = '',
  infoTooltip = null,
  numberOfLines = 3,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);

  // Handle date selection
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateStr = toISODateString(selectedDate);
      onChange(id, dateStr);
    }
  };

  return (
    <View style={styles.formField}>
      <View style={styles.labelContainer}>
        <Text style={required ? styles.labelRequired : styles.label}>
          {label}
          {required && <Text style={styles.labelRequiredAsterisk}> *</Text>}
        </Text>
        {infoTooltip && (
          <TouchableOpacity onPress={() => Alert.alert('Info', infoTooltip)}>
            <Icon name="info" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
        {error && <FieldAlert message={error} />}
      </View>

      {type === 'select' ? (
        <View style={[styles.selectContainer, error ? styles.inputError : null]}>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => {
              Keyboard.dismiss();
              setShowPickerModal(true);
            }}>
            <Text style={value ? styles.inputText : styles.placeholderText}>
              {value
                ? (() => {
                  const foundOption = options?.find(
                    (opt) =>
                      (typeof opt === 'string' && opt === value) ||
                      (typeof opt === 'object' && opt.value === value)
                  );

                  if (foundOption) {
                    if (typeof foundOption === 'string') {
                      return foundOption;
                    } else if (typeof foundOption === 'object' && 'label' in foundOption) {
                      return foundOption.label;
                    }
                  }
                  return value;
                })()
                : 'Sélectionner...'}
            </Text>
            <Icon name="chevron-down" size={16} color="#6B7280" />
          </TouchableOpacity>

          <Modal
            transparent={true}
            visible={showPickerModal}
            onRequestClose={() => setShowPickerModal(false)}
            animationType="slide">
            <TouchableWithoutFeedback onPress={() => setShowPickerModal(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.pickerModalContainer}>
                    <View style={styles.pickerModalHeader}>
                      <TouchableOpacity onPress={() => setShowPickerModal(false)}>
                        <Text style={styles.pickerModalCancel}>Annuler</Text>
                      </TouchableOpacity>
                      <Text style={styles.pickerModalTitle}>{label}</Text>
                      <TouchableOpacity onPress={() => setShowPickerModal(false)}>
                        <Text style={styles.pickerModalDone}>OK</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ height: 200 }}>
                      <Picker
                        selectedValue={value || ''}
                        onValueChange={(itemValue) => {
                          onChange(id, itemValue);
                        }}
                        style={{ flex: 1 }}>
                        <Picker.Item label="Sélectionner..." value="" />
                        {options?.map((option, index) =>
                          typeof option === 'string' ? (
                            <Picker.Item key={`${option}-${index}`} label={option} value={option} />
                          ) : (
                            option && typeof option === 'object' && 'label' in option && 'value' in option ? (
                              <Picker.Item key={`${option.value}-${index}`} label={option.label} value={option.value} />
                            ) : null
                          )
                        )}
                      </Picker>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      ) : type === 'date' ? (
        Platform.OS === 'web' ? (
          <WebDatePicker
            label={label}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            error={error}
            required={required}
          />
        ) : (
          <>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                setShowDatePicker(true);
              }}
              style={[styles.input, error ? styles.inputError : null]}>
              <Text style={value ? styles.inputText : styles.placeholderText}>
                {value ? new Date(value).toLocaleDateString('fr-FR') : (placeholder || 'Sélectionner une date')}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </>
        )
      ) : type === 'textarea' ? (
        <TextInput
          value={value || ''}
          onChangeText={(text) => onChange(id, text)}
          style={[styles.textarea, error ? styles.inputError : null]}
          placeholder={placeholder}
          multiline
          numberOfLines={numberOfLines}
          textAlignVertical="top"
        />
      ) : (
        <TextInput
          value={value || ''}
          onChangeText={(text) => onChange(id, text)}
          onBlur={onBlur} 
          style={[styles.input, error ? styles.inputError : null]}
          placeholder={placeholder}
          keyboardType={type === 'number' ? 'numeric' : 'default'}
        />
      )}
    </View>
  );
};

export default FormField;
