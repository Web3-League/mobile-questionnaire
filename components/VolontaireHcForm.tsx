/* eslint-disable no-trailing-spaces */
import React, { useState, useEffect, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import api from '../app/services/apiService';
import styles from './stylesHc';

// Types
type FormFieldType = 'text' | 'select' | 'textarea';
type FormFieldOption = string | { label: string; value: string };

interface FormFieldProps {
  label: string;
  id: string;
  type?: FormFieldType;
  value?: string | null;
  onChange: (name: string, value: string | null) => void;
  required?: boolean;
  error?: string | null;
  options?: FormFieldOption[] | null;
  placeholder?: string;
  infoTooltip?: string | null;
}

interface CheckboxFieldProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (id: string, value: 'Oui' | 'Non') => void;
}

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  isOpen?: boolean;
  icon?: ReactNode;
}

interface FormData {
  [key: string]: string | number | null;
  idVol: string | number | null;
  achatPharmacieParapharmacie: string | null;
  achatGrandesSurfaces: string | null;
  // ... (ajouter toutes les autres propriétés du formulaire)
}

interface VolontaireHcRouteParams {
  idVol?: string;
}

const produitsBioOptions = ['Oui', 'Non', 'Parfois'];

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  required = false,
  error = null,
  options = null,
  placeholder = '',
  infoTooltip = null
}) => (
  <View style={styles.formField}>
    <View style={styles.labelContainer}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      {infoTooltip && (
        <TouchableOpacity onPress={() => Alert.alert('Info', infoTooltip)}>
          <Icon name="info" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>

    {type === 'select' ? (
      <View style={[styles.selectContainer, error ? styles.inputError : null]}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onChange(id, itemValue)}
          style={styles.picker}>
          <Picker.Item label="Sélectionner..." value="" />
          {options?.map((option) =>
            typeof option === 'string' ? (
              <Picker.Item key={option} label={option} value={option} />
            ) : (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            )
          )}
        </Picker>
      </View>
    ) : type === 'textarea' ? (
      <TextInput
        value={value || ''}
        onChangeText={(text) => onChange(id, text)}
        style={[styles.textarea, error ? styles.inputError : null]}
        placeholder={placeholder}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
    ) : (
      <TextInput
        value={value || ''}
        onChangeText={(text) => onChange(id, text)}
        style={[styles.input, error ? styles.inputError : null]}
        placeholder={placeholder}
      />
    )}
  </View>
);

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  isOpen = false,
  icon = null,
}) => {
  const [open, setOpen] = useState(isOpen);

  return (
    <View style={styles.collapsibleSection}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}>
        <View style={styles.sectionTitleContainer}>
          {icon}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Icon
          name={open ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#1F2937"
        />
      </TouchableOpacity>

      {open && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

// Utilisez cette version unique de CheckboxField qui résout le problème d'encodage
const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, id, checked, onChange }) => {
  // Fonction pour créer des chaînes propres sans caractères spéciaux
  const cleanString = (value: string): string => {
    // Créer manuellement une nouvelle chaîne avec des lettres ASCII standard
    if (value === 'Oui') {
      // Construire "Oui" proprement lettre par lettre
      return String.fromCharCode(79, 117, 105); // O-u-i en ASCII
    } else if (value === 'Non') {
      // Construire "Non" proprement lettre par lettre
      return String.fromCharCode(78, 111, 110); // N-o-n en ASCII
    }
    return value;
  };

  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => onChange(id, checked ? (cleanString('Non') as 'Non') : (cleanString('Oui') as 'Oui'))}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Icon name="check" size={14} color="#FFFFFF" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

// Define your navigation param list for this stack
type RootStackParamList = {
  VolontairesList: undefined;
  VolontaireHcList: undefined;
  VolontaireHcDetails: { idVol: string };
  VolontaireHcForm: { idVol?: string };
  // add other screens if needed
};

const VolontaireHcForm: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'VolontaireHcForm'>>();
  const navigation = useNavigation<any>();
  const { idVol } = route.params || {};
  const isEditMode = Boolean(idVol);

  const [formData, setFormData] = useState<FormData>({
    idVol: null,
    // Lieux d'achat
    achatPharmacieParapharmacie: null,
    achatGrandesSurfaces: null,
    achatInstitutParfumerie: null,
    achatInternet: null,
    produitsBio: null,

    // Épilation
    rasoir: null,
    epilateurElectrique: null,
    cire: null,
    cremeDepilatoire: null,
    institut: null,
    epilationDefinitive: null,

    // Soins du visage
    soinHydratantVisage: null,
    soinAntiAgeVisage: null,
    soinAntiRidesVisage: null,
    soinAntiTachesVisage: null,
    soinMatifiantVisage: null,
    soinNourissantVisage: null,
    soinRaffermissantVisage: null,
    soinAntiRougeursVisage: null,
    soinEclatDuTeint: null,
    soinContourDesYeux: null,
    soinContourDesLevres: null,

    // Démaquillage et nettoyage
    demaquillantVisage: null,
    demaquillantYeux: null,
    demaquillantWaterproof: null,
    gelNettoyant: null,
    lotionMicellaire: null,
    tonique: null,

    // Soins du corps
    soinHydratantCorps: null,
    soinNourrissantCorps: null,
    soinRaffermissantCorps: null,
    soinAmincissant: null,
    soinAntiCellulite: null,
    soinAntiVergetures: null,
    soinAntiAgeCorps: null,
    gommageCorps: null,
    masqueCorps: null,

    // Soins spécifiques
    soinHydratantMains: null,
    soinNourrissantMains: null,
    soinAntiAgeMains: null,
    soinAntiTachesMains: null,
    soinPieds: null,
    soinOngles: null,

    // Produits d'hygiène
    gelDouche: null,
    laitDouche: null,
    savon: null,
    produitsBain: null,
    nettoyantIntime: null,
    deodorant: null,
    antiTranspirant: null,

    // Soins capillaires
    shampoing: null,
    apresShampoing: null,
    masqueCapillaire: null,
    produitCoiffantFixant: null,
    colorationMeches: null,
    permanente: null,
    lissageDefrisage: null,
    extensionsCapillaires: null,

    // Maquillage visage
    fondDeTeint: null,
    poudreLibre: null,
    blushFardAJoues: null,
    correcteurTeint: null,
    anticerne: null,
    baseMaquillage: null,
    cremeTeintee: null,

    // Maquillage yeux
    mascara: null,
    mascaraWaterproof: null,
    crayonsYeux: null,
    eyeliner: null,
    fardAPaupieres: null,
    maquillageDesSourcils: null,
    fauxCils: null,

    // Maquillage lèvres et ongles
    rougeALevres: null,
    gloss: null,
    crayonLevres: null,
    vernisAOngles: null,
    dissolvantOngles: null,
    fauxOngles: null,
    manucures: null,

    // Maquillage permanent
    maquillagePermanentYeux: null,
    maquillagePermanentLevres: null,
    maquillagePermanentSourcils: null,

    // Solaire
    protecteurSolaireVisage: null,
    protecteurSolaireCorps: null,
    protecteurSolaireLevres: null,
    soinApresSoleil: null,
    autobronzant: null,

    // Parfums
    parfum: null,
    eauDeToilette: null,

    // Commentaires
    commentaires: null,

    // RASAGE HOMME
    apresRasage: null,
    gelARaser: null,
    mousseARaser: null,
    tondeuseBarbe: null,
    ombreBarbe: null,
    rasoirElectrique: null,
    rasoirMecanique: null,
  });

  const [volontaireInfo, setVolontaireInfo] = useState<any>(null);
  const [availableVolontaires, setAvailableVolontaires] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(isEditMode);

  const scrollViewRef = React.useRef<ScrollView>(null);

  useEffect(() => {
    const fetchVolontaires = async () => {
      try {
        const response = await api.volontaires.getAll();
        setAvailableVolontaires(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des volontaires:', error);
        setSubmitError('Impossible de charger la liste des volontaires.');
      }
    };
    fetchVolontaires();
  }, []);

  useEffect(() => {
    if (isEditMode && idVol) {
      // Commencer par définir l'ID du volontaire dans le formulaire
      setFormData(prev => ({
        ...prev,
        idVol: idVol // L'ID est déjà disponible via les paramètres de route
      }));

      const fetchVolontaireHcData = async () => {
        try {
          setIsLoading(true);
          const response = await api.habituesCosmetiques.getByVolontaireId(idVol);

          if (response.data) {
            // Fusionner les données récupérées avec l'ID du volontaire déjà défini
            setFormData(prevData => ({
              ...prevData,
              ...response.data,
              idVol: idVol // S'assurer que l'ID reste défini même si les données API ne le contiennent pas
            }));

            try {
              const volResponse = await api.volontaires.getById(idVol);
              setVolontaireInfo(volResponse.data);
            } catch (volError) {
              console.error('Erreur lors de la récupération des informations du volontaire:', volError);
            }
          }
        } catch (error) {
          console.error('Erreur lors du chargement des données HC:', error);
          setSubmitError('Impossible de charger les données d\'habitudes cosmétiques.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchVolontaireHcData();
    }
  }, [idVol, isEditMode]);

  const handleChange = (name: keyof FormData, value: string | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!isEditMode && !formData.idVol) {
      newErrors.idVol = 'Le volontaire est obligatoire';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      // Convertir l'ID en nombre avant d'envoyer les données
      const idVolAsNumber = typeof formData.idVol === 'string' 
        ? parseInt(formData.idVol, 10) 
        : formData.idVol;

      if (idVolAsNumber === null || Number.isNaN(idVolAsNumber) || idVolAsNumber <= 0) {
        setSubmitError("L'ID du volontaire doit être un nombre positif");
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        setLoading(false);
        return;
      }

      // Préparer les données pour la soumission
      const formDataToSubmit: Record<string, string | number> = {
        idVol: idVolAsNumber
      };

      // Pour les champs qui acceptent "Oui"/"Non", les envoyer tels quels
      // Pour tous les autres champs, y compris ceux non remplis, ne pas les inclure
      Object.keys(formData).forEach(key => {
        // Gérer produitsBio séparément car il a des valeurs spéciales
        if (key === 'produitsBio' && formData[key]) {
          formDataToSubmit[key] = formData[key] as string;
        }
        // Gérer commentaires séparément
        else if (key === 'commentaires' && formData[key]) {
          formDataToSubmit[key] = formData[key];
        }
        // Ne pas inclure idVol car déjà ajouté
        else if (key !== 'idVol') {
          // N'inclure QUE les champs qui ont une valeur "Oui"
          if (formData[key] === 'Oui') {
            formDataToSubmit[key] = 'Oui';
          }
          // Ne PAS inclure les autres champs du tout
        }
      });

      console.log("Données soumises:", JSON.stringify(formDataToSubmit, null, 2));

      // Créer les habitudes cosmétiques
      const response = await api.habituesCosmetiques.create(formDataToSubmit);

      Alert.alert(
        "Succès",
        "Les habitudes cosmétiques ont été enregistrées avec succès",
        [{
          text: "OK",
          onPress: () => {
            navigation.navigate('index');
          }
        }]
      );
    } catch (error: any) {
      console.error('Erreur lors de la soumission:', error);

      // Afficher plus de détails sur l'erreur
      let errorMessage = 'Erreur lors de la soumission';
      if (error.response) {
        errorMessage += ': ' + (error.response.data?.message || error.response.statusText);
      }

      setSubmitError(errorMessage);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}
        >
          {/* En-tête */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // Zone tactile plus grande
              >
                <Icon name="arrow-left" size={18} color="#2563EB" />
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                {isEditMode ? (
                  <View style={styles.titleWithIcon}>
                    <Icon name="edit" size={22} color="#2563EB" />
                    <Text style={styles.title}>Modifier les habitudes cosmétiques</Text>
                  </View>
                ) : (
                  <View style={styles.titleWithIcon}>
                    <Icon name="user-plus" size={22} color="#2563EB" />
                    <Text style={styles.title}>Ajouter des habitudes cosmétiques</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Switch Navigation */}
          <View style={styles.switchNavContainer}>
            <View style={styles.switchNav}>
              <TouchableOpacity
                style={[
                  styles.switchNavButton,
                  !route.name.includes('VolontaireHc') && styles.activeNavButton,
                ]}
                onPress={() => navigation.navigate('VolontairesList')}
              >
                <Text
                  style={[
                    styles.switchNavButtonText,
                    !route.name.includes('VolontaireHc') && styles.activeNavButtonText,
                  ]}
                >
                  Volontaires
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.switchNavButton,
                  route.name.includes('VolontaireHc') && styles.activeNavButton,
                ]}
                onPress={() => navigation.navigate('VolontaireHcList')}
              >
                <Text
                  style={[
                    styles.switchNavButtonText,
                    route.name.includes('VolontaireHc') && styles.activeNavButtonText,
                  ]}
                >
                  Habitudes Cosmétiques
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Message d'erreur */}
          {submitError ? (
            <View style={styles.errorBanner}>
              <Icon name="alert-circle" size={20} color="#B91C1C" />
              <Text style={styles.errorBannerText}>{submitError}</Text>
            </View>
          ) : null}

          <View style={styles.formContainer}>
            {/* Section sélection du volontaire */}
            <CollapsibleSection
              title="Sélection du volontaire"
              isOpen={true}
              icon={<Icon name="user" size={22} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.sectionContent}>
                {isEditMode ? (
                  // En mode édition, afficher juste les infos du volontaire
                  volontaireInfo && (
                    <View style={styles.volontaireInfoCard}>
                      <View style={styles.volontaireAvatarContainer}>
                        <Icon name="user" size={24} color="#2563EB" />
                      </View>
                      <View style={styles.volontaireInfo}>
                        <Text style={styles.volontaireName}>{volontaireInfo.nom} {volontaireInfo.prenom}</Text>
                        <Text style={styles.volontaireDetails}>
                          ID: {idVol} • {volontaireInfo.sexe}, {volontaireInfo.age} ans
                          {volontaireInfo.phototype && ` - Phototype ${volontaireInfo.phototype}`}
                        </Text>
                      </View>
                    </View>
                  )
                ) : (
                  // En mode création, permettre de sélectionner un volontaire
                  <FormField
                    label="Volontaire associé"
                    id="idVol"
                    type="select"
                    value={formData.idVol !== null ? String(formData.idVol) : null}
                    onChange={handleChange}
                    options={availableVolontaires.map(vol => ({
                      value: vol.id,
                      label: `${vol.nom} ${vol.prenom} (ID: ${vol.id})`,
                    }))}
                    required
                    error={errors.idVol}
                  />
                )}
              </View>
            </CollapsibleSection>

            {/* Section habitudes d'achat */}
            <CollapsibleSection
              title="Habitudes d'achat"
              isOpen={true}
              icon={<Icon name="shopping-bag" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <View style={styles.column}>
                  <Text style={styles.subSectionTitle}>Lieux d'achat préférés</Text>
                  <CheckboxField
                    label="Pharmacie/Parapharmacie"
                    id="achatPharmacieParapharmacie"
                    checked={formData.achatPharmacieParapharmacie === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Grandes surfaces"
                    id="achatGrandesSurfaces"
                    checked={formData.achatGrandesSurfaces === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Institut/Parfumerie"
                    id="achatInstitutParfumerie"
                    checked={formData.achatInstitutParfumerie === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Internet"
                    id="achatInternet"
                    checked={formData.achatInternet === 'Oui'}
                    onChange={handleChange}
                  />
                </View>

                <View style={styles.column}>
                  <FormField
                    label="Utilisation de produits bio"
                    id="produitsBio"
                    type="select"
                    value={typeof formData.produitsBio === 'string' ? formData.produitsBio : null}
                    onChange={handleChange}
                    options={produitsBioOptions}
                  />
                </View>
              </View>
            </CollapsibleSection>

            {/* Section épilation */}
            <CollapsibleSection
              title="Méthodes d'épilation"
              icon={<Icon name="scissors" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <View style={styles.column}>
                  <Text style={styles.subSectionTitle}>Méthodes utilisées</Text>
                  <CheckboxField
                    label="Rasoir"
                    id="rasoir"
                    checked={formData.rasoir === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Épilateur électrique"
                    id="epilateurElectrique"
                    checked={formData.epilateurElectrique === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Cire"
                    id="cire"
                    checked={formData.cire === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Crème dépilatoire"
                    id="cremeDepilatoire"
                    checked={formData.cremeDepilatoire === 'Oui'}
                    onChange={handleChange}
                  />
                </View>
                <View style={styles.column}>
                  <Text style={styles.subSectionTitle}>Méthodes professionnelles</Text>
                  <CheckboxField
                    label="Institut"
                    id="institut"
                    checked={formData.institut === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Épilation définitive (laser, lumière pulsée...)"
                    id="epilationDefinitive"
                    checked={formData.epilationDefinitive === 'Oui'}
                    onChange={handleChange}
                  />
                </View>
              </View>
            </CollapsibleSection>

            {/* Section soins du visage */}
            <CollapsibleSection
              title="Soins du visage"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <View style={styles.column}>
                  <Text style={styles.subSectionTitle}>Soins de base</Text>
                  <CheckboxField
                    label="Soin hydratant"
                    id="soinHydratantVisage"
                    checked={formData.soinHydratantVisage === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Soin nourrissant"
                    id="soinNourissantVisage"
                    checked={formData.soinNourissantVisage === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Soin matifiant"
                    id="soinMatifiantVisage"
                    checked={formData.soinMatifiantVisage === 'Oui'}
                    onChange={handleChange}
                  />
                </View>

                <View style={styles.column}>
                  <Text style={styles.subSectionTitle}>Soins spécifiques</Text>
                  <CheckboxField
                    label="Soin anti-âge"
                    id="soinAntiAgeVisage"
                    checked={formData.soinAntiAgeVisage === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Soin anti-rides"
                    id="soinAntiRidesVisage"
                    checked={formData.soinAntiRidesVisage === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Soin anti-taches"
                    id="soinAntiTachesVisage"
                    checked={formData.soinAntiTachesVisage === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Soin anti-rougeurs"
                    id="soinAntiRougeursVisage"
                    checked={formData.soinAntiRougeursVisage === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Soin éclat du teint"
                    id="soinEclatDuTeint"
                    checked={formData.soinEclatDuTeint === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Soin raffermissant"
                    id="soinRaffermissantVisage"
                    checked={formData.soinRaffermissantVisage === 'Oui'}
                    onChange={handleChange}
                  />
                </View>

                <View style={styles.column}>
                  <Text style={styles.subSectionTitle}>Zones spécifiques</Text>
                  <CheckboxField
                    label="Contour des yeux"
                    id="soinContourDesYeux"
                    checked={formData.soinContourDesYeux === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Contour des lèvres"
                    id="soinContourDesLevres"
                    checked={formData.soinContourDesLevres === 'Oui'}
                    onChange={handleChange}
                  />
                </View>
              </View>
            </CollapsibleSection>

            {/* Section démaquillage et nettoyage */}
            <CollapsibleSection
              title="Démaquillage et nettoyage"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <View style={styles.column}>
                  <CheckboxField
                    label="Démaquillant visage"
                    id="demaquillantVisage"
                    checked={formData.demaquillantVisage === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Démaquillant yeux"
                    id="demaquillantYeux"
                    checked={formData.demaquillantYeux === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Démaquillant waterproof"
                    id="demaquillantWaterproof"
                    checked={formData.demaquillantWaterproof === 'Oui'}
                    onChange={handleChange}
                  />
                </View>

                <View style={styles.column}>
                  <CheckboxField
                    label="Gel nettoyant"
                    id="gelNettoyant"
                    checked={formData.gelNettoyant === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Lotion micellaire"
                    id="lotionMicellaire"
                    checked={formData.lotionMicellaire === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Tonique"
                    id="tonique"
                    checked={formData.tonique === 'Oui'}
                    onChange={handleChange}
                  />
                </View>
              </View>
            </CollapsibleSection>

            {/* Soins du corps */}

            <CollapsibleSection
              title="Soins du corps"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <View style={styles.column}>
                  <CheckboxField
                    label="Soins hydratant corps"
                    id="soinsHydratantCorps"
                    checked={formData.soinsHydratantCorps === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Soins Nourrissant Mains"
                    id="soinsNourrissantMains"
                    checked={formData.soinsNourrissantMains === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Soins Anti-âge Mains"
                    id="soinsAntiAgeMains"
                    checked={formData.soinsAntiAgeMains === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Soins Anti-taches Mains"
                    id="soinsAntiTachesMains"
                    checked={formData.soinsAntiTachesMains === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Soin pieds"
                    id="soinPieds"
                    checked={formData.soinPieds === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Soin ongles"
                    id="soinOngles"
                    checked={formData.soinOngles === 'Oui'}
                    onChange={handleChange}
                  />
                </View>
              </View>
            </CollapsibleSection>

            {/* Section produits d'hygiène */}
            <CollapsibleSection
              title="Produits d'hygiène"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <View style={styles.column}>
                  <CheckboxField
                    label="Shampooing"
                    id="shampooing"
                    checked={formData.shampooing === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Après-shampooing"
                    id="apresShampooing"
                    checked={formData.apresShampooing === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Masque capillaires"
                    id="masqueCapillaires"
                    checked={formData.masqueCapillaires === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Produit coiffant/fixant"
                    id="produitCoiffantFixant"
                    checked={formData.produitCoiffantFixant === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Coloration/mèches"
                    id="colorationMeches"
                    checked={formData.colorationMeches === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Permanente"
                    id="permanente"
                    checked={formData.permanente === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Lissage de frisage"
                    id="lissageDefrisage"
                    checked={formData.lissageDefrisage === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Extensions capillaires"
                    id="extensionsCapillaires"
                    checked={formData.extensionsCapillaires === 'Oui'}
                    onChange={handleChange}
                  />
                </View>
              </View>
            </CollapsibleSection>

            {/* Section maquillage visage */}
            <CollapsibleSection
              title="Maquillage visage"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <View style={styles.column}>
                  <CheckboxField
                    label="Fond de teint"
                    id="fondDeTeint"
                    checked={formData.fondDeTeint === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Poudre libre"
                    id="poudreLibre"
                    checked={formData.poudreLibre === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Blush/fard à joues"
                    id="blushFardAJoues"
                    checked={formData.blushFardAJoues === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Correcteur teint"
                    id="correcteurTeint"
                    checked={formData.correcteurTeint === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Anticerne"
                    id="anticerne"
                    checked={formData.anticerne === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Base maquillage"
                    id="baseMaquillage"
                    checked={formData.baseMaquillage === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Creme teintée"
                    id="cremeTeintee"
                    checked={formData.cremeTeintee === 'Oui'}
                    onChange={handleChange}
                  />
                </View>
              </View>
            </CollapsibleSection>

            {/* Section maquillage yeux */}
            <CollapsibleSection
              title="Maquillage yeux"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <View style={styles.column}>
                  <CheckboxField
                    label="Mascara"
                    id="mascara"
                    checked={formData.mascara === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Mascara waterproof"
                    id="mascaraWaterproof"
                    checked={formData.mascaraWaterproof === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Crayons yeux"
                    id="crayonsYeux"
                    checked={formData.crayonsYeux === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Eyeliner"
                    id="eyeliner"
                    checked={formData.eyeliner === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Fard a paupières"
                    id="fardAPaupieres"
                    checked={formData.fardAPaupieres === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Maquillage des sourcils"
                    id="maquillageDesSourcils"
                    checked={formData.maquillageDesSourcils === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Faux cils"
                    id="fauxCils"
                    checked={formData.fauxCils === 'Oui'}
                    onChange={handleChange}
                  />
                </View>
              </View>
            </CollapsibleSection>

            {/* Section maquillage lèvres et ongles */}
            <CollapsibleSection
              title="Maquillage lèvres et ongles"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <View style={styles.column}>
                  <CheckboxField
                    label="Rouge à lèvres"
                    id="rougeALevres"
                    checked={formData.rougeALevres === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Gloss"
                    id="gloss"
                    checked={formData.gloss === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Crayon lèvres"
                    id="crayonALevres"
                    checked={formData.crayonALevres === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Vernis à ongles"
                    id="vernisAOngles"
                    checked={formData.vernisAOngles === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Dissolvant ongles"
                    id="dissolvantOngles"
                    checked={formData.dissolvantOngles === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Faux ongles"
                    id="fauxOngles"
                    checked={formData.fauxOngles === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Manucures"
                    id="manucures"
                    checked={formData.manucures === 'Oui'}
                    onChange={handleChange}
                  />
                </View>
              </View>
            </CollapsibleSection>

            {/* Section maquillage permanent */}
            <CollapsibleSection
              title="Maquillage permanent"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <View style={styles.column}>
                  <CheckboxField
                    label="Maquillage permanent yeux"
                    id="maquillagePermanentYeux"
                    checked={formData.maquillagePermanentYeux === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Maquillage permanent lèvres"
                    id="maquillagePermanentALevres"
                    checked={formData.maquillagePermanentALevres === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Maquillage permanent sourcils"
                    id="maquillagePermanentSourcils"
                    checked={formData.maquillagePermanentSourcils === 'Oui'}
                    onChange={handleChange}
                  />
                </View>
              </View>
            </CollapsibleSection>

            {/* Solaire */}
            <CollapsibleSection
              title="Solaire"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <View style={styles.column}>
                  <CheckboxField
                    label="Protecteur solaire visage"
                    id="protecteurSolaireVisage"
                    checked={formData.protecteurSolaireVisage === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Protecteur solaire corps"
                    id="protecteurSolaireCorps"
                    checked={formData.protecteurSolaireCorps === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Protecteur solaire lèvres"
                    id="protecteurSolaireLevres"
                    checked={formData.protecteurSolaireLevres === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Soin après-soleil"
                    id="soinApresSoleil"
                    checked={formData.soinApresSoleil === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Autobronzant"
                    id="autobronzant"
                    checked={formData.autobronzant === 'Oui'}
                    onChange={handleChange}
                  />
                </View>
              </View>
            </CollapsibleSection>

            {/* Parfums */}
            <CollapsibleSection
              title="Parfums"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <View style={styles.column}>
                  <CheckboxField
                    label="Parfums"
                    id="parfums"
                    checked={formData.parfums === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Eau de toilette"
                    id="eauDeToilette"
                    checked={formData.eauDeToilette === 'Oui'}
                    onChange={handleChange}
                  />
                </View>
              </View>
            </CollapsibleSection>

            {/* Section produits pour hommes */}
            <CollapsibleSection
              title="Produits pour hommes"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <View style={styles.column}>
                  <CheckboxField
                    label="Après-rasage"
                    id="apresRasage"
                    checked={formData.apresRasage === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Gel à raser"
                    id="gelARaser"
                    checked={formData.gelARaser === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Mousse à raser"
                    id="mousseARaser"
                    checked={formData.mousseARaser === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Tondeuse barbe"
                    id="tondeuseBarbe"
                    checked={formData.tondeuseBarbe === 'Oui'}
                    onChange={handleChange}
                  />
                </View>
                <View style={styles.column}>
                  <CheckboxField
                    label="Ombre barbe"
                    id="ombreBarbe"
                    checked={formData.ombreBarbe === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Rasoir électrique"
                    id="rasoirElectrique"
                    checked={formData.rasoirElectrique === 'Oui'}
                    onChange={handleChange}
                  />
                  <CheckboxField
                    label="Rasoir mécanique"
                    id="rasoirMecanique"
                    checked={formData.rasoirMecanique === 'Oui'}
                    onChange={handleChange}
                  />
                </View>
              </View>
            </CollapsibleSection>

            {/* Section commentaires */}
            <View style={styles.commentSection}>
              <FormField
                label="Commentaires supplémentaires"
                id="commentaires"
                type="textarea"
                value={formData.commentaires !== null ? String(formData.commentaires) : null}
                onChange={handleChange}
                placeholder="Ajoutez des commentaires ou des notes spécifiques..."
              />
            </View>

            {/* Boutons d'action */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => isEditMode
                  ? navigation.navigate('VolontaireHcDetails', { idVol })
                  : navigation.navigate('VolontaireHcList')
                }
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                <View style={styles.submitButtonContent}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" style={styles.buttonIcon} />
                  ) : (
                    <Icon name="save" size={16} color="#FFFFFF" style={styles.buttonIcon} />
                  )}
                  <Text style={styles.submitButtonText}>
                    {loading ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour' : 'Enregistrer')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VolontaireHcForm;