import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import api from '../app/services/apiService';
import { styles } from './stylesHc';

// Components
import FormHeader from './FormHeader';
import SwitchNavigation from './SwitchNavigation';
import CollapsibleSection from './CollapsibleSection';
import CheckboxGroup from './CheckboxGroup';
import ActionButtons from './ActionButtons';

// Configurations
import { FORM_SECTIONS } from './formConfig';
import { FormData, FormSection, RootStackParamList } from '../types';
import { initializeAllFieldsBoolean } from './initializeAllFieldsBoolean';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Define proper types for navigation and route
type VolontaireHcFormNavigationProp = StackNavigationProp<RootStackParamList, 'VolontaireHcForm'>;
type VolontaireHcFormRouteProp = RouteProp<RootStackParamList, 'VolontaireHcForm'>;

const VolontaireHcForm: React.FC = () => {
  const route = useRoute<VolontaireHcFormRouteProp>();
  const navigation = useNavigation<VolontaireHcFormNavigationProp>();
  const { idVol } = route.params || {};

  const [formData, setFormData] = useState<FormData>({ idVol: undefined });
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Chargement initial des données
  useEffect(() => {
    if (idVol) {
      // Initialiser tous les champs avec false par défaut
      const initialFormData = initializeAllFieldsBoolean(idVol);
      setFormData(initialFormData);
    }
  }, [idVol]);

  const handleCheckboxChange = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.idVol) {
      setSubmitError('Veuillez sélectionner un volontaire');
      return;
    }

    setLoading(true);
    try {
      // Envoyer les données du formulaire au serveur
      await api.habituesCosmetiques.create(formData);
      
      Alert.alert('Succès', 'Données enregistrées !', [
        { text: 'OK', onPress: () => navigation.navigate('Accueil') }
      ]);
    } catch (error) {
      setSubmitError('Erreur lors de l\'enregistrement');
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <FormHeader 
            title="Habitudes Cosmétiques"
            onBack={() => navigation.goBack()}
          />
          
          <SwitchNavigation
            routes={[
              { name: 'Volontaires', target: 'VolontairesList' },
              { name: 'Habitudes Cosmétiques', target: 'VolontaireHcForm' }
            ]}
            currentRoute={route.name}
          />

          {submitError && (
            <View style={styles.errorBanner}>
              <Icon name="alert-circle" size={20} color="#B91C1C" />
              <Text style={styles.errorText}>{submitError}</Text>
            </View>
          )}

          <View style={styles.formContainer}>
            {FORM_SECTIONS.map((section: FormSection) => (
              <CollapsibleSection
                key={section.title}
                title={section.title}
                icon={section.icon}
              >
                <View style={styles.sectionContent}>
                  {section.groups.map((group, index) => (
                    <CheckboxGroup
                      key={index}
                      title={group.title}
                      items={group.items.map(item => ({
                        ...item,
                        checked: Boolean(formData[item.id]),
                        onChange: handleCheckboxChange(item.id)
                      }))}
                    />
                  ))}
                </View>
              </CollapsibleSection>
            ))}

            <ActionButtons
              onCancel={() => navigation.goBack()}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VolontaireHcForm;