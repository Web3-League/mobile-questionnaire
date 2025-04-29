import React, { useState, useEffect, ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet
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

type OuiNon = 'Oui' | 'Non' | null;

interface FormData {
  [key: string]: OuiNon | string | number | null;
  idVol: string | number | null;

  // Lieux d'achat
  achatPharmacieParapharmacie: OuiNon;
  achatGrandesSurfaces: OuiNon;
  achatInstitutParfumerie: OuiNon;
  achatInternet: OuiNon;
  produitsBio: "Oui" | "Non" | "Parfois" | null;

  // Épilation
  rasoir: OuiNon;
  epilateurElectrique: OuiNon;
  cire: OuiNon;
  cremeDepilatoire: OuiNon;
  institut: OuiNon;
  epilationDefinitive: OuiNon;

  // Soins du visage
  soinHydratantVisage: OuiNon;
  soinAntiAgeVisage: OuiNon;
  soinAntiRidesVisage: OuiNon;
  soinAntiTachesVisage: OuiNon;
  soinMatifiantVisage: OuiNon;
  soinNourissantVisage: OuiNon;
  soinRaffermissantVisage: OuiNon;
  soinAntiRougeursVisage: OuiNon;
  soinEclatDuTeint: OuiNon;
  soinContourDesYeux: OuiNon;
  soinContourDesLevres: OuiNon;

  // Démaquillage et nettoyage
  demaquillantVisage: OuiNon;
  demaquillantYeux: OuiNon;
  demaquillantWaterproof: OuiNon;
  gelNettoyant: OuiNon;
  lotionMicellaire: OuiNon;
  tonique: OuiNon;

  // Soins du corps
  soinHydratantCorps: OuiNon;
  soinNourrissantCorps: OuiNon;
  soinRaffermissantCorps: OuiNon;
  soinAmincissant: OuiNon;
  soinAntiCellulite: OuiNon;
  soinAntiTachesDecollete: OuiNon;
  soinAntiVergetures: OuiNon;
  soinAntiAgeCorps: OuiNon;
  gommageCorps: OuiNon;
  masqueCorps: OuiNon;

  // Soins spécifiques
  soinHydratantMains: OuiNon;
  soinNourrissantMains: OuiNon;
  soinAntiAgeMains: OuiNon;
  soinAntiTachesMains: OuiNon;
  soinPieds: OuiNon;
  soinOngles: OuiNon;

  // Produits d'hygiène
  gelDouche: OuiNon;
  laitDouche: OuiNon;
  savon: OuiNon;
  produitsBain: OuiNon;
  nettoyantIntime: OuiNon;
  deodorant: OuiNon;
  antiTranspirant: OuiNon;

  // Soins capillaires
  shampoing: OuiNon;
  apresShampoing: OuiNon;
  masqueCapillaire: OuiNon;
  produitCoiffantFixant: OuiNon;
  colorationMeches: OuiNon;
  permanente: OuiNon;
  lissageDefrisage: OuiNon;
  extensionsCapillaires: OuiNon;

  // Maquillage visage
  fondDeTeint: OuiNon;
  poudreLibre: OuiNon;
  blushFardAJoues: OuiNon;
  correcteurTeint: OuiNon;
  anticerne: OuiNon;
  baseMaquillage: OuiNon;
  cremeTeintee: OuiNon;

  // Maquillage yeux
  mascara: OuiNon;
  mascaraWaterproof: OuiNon;
  crayonsYeux: OuiNon;
  eyeliner: OuiNon;
  fardAPaupieres: OuiNon;
  maquillageDesSourcils: OuiNon;
  fauxCils: OuiNon;

  // Maquillage lèvres et ongles
  rougeALevres: OuiNon;
  gloss: OuiNon;
  crayonLevres: OuiNon;
  vernisAOngles: OuiNon;
  dissolvantOngles: OuiNon;
  fauxOngles: OuiNon;
  manucures: OuiNon;

  // Maquillage permanent
  maquillagePermanentYeux: OuiNon;
  maquillagePermanentLevres: OuiNon;
  maquillagePermanentSourcils: OuiNon;

  // Solaire
  protecteurSolaireVisage: OuiNon;
  protecteurSolaireCorps: OuiNon;
  protecteurSolaireLevres: OuiNon;
  soinApresSoleil: OuiNon;
  autobronzant: OuiNon;

  // Parfums
  parfum: OuiNon;
  eauDeToilette: OuiNon;

  // RASAGE HOMME
  apresRasage: OuiNon;
  gelARaser: OuiNon;
  mousseARaser: OuiNon;
  tondeuseBarbe: OuiNon;
  ombreBarbe: OuiNon;
  rasoirElectrique: OuiNon;
  rasoirMecanique: OuiNon;

  // Commentaires
  commentaires: string | null;
}

type RootStackParamList = {
  VolontairesList: undefined;
  VolontaireHcList: undefined;
  VolontaireHcDetails: { idVol: string };
  VolontaireHcForm: { idVol?: string };
  index: undefined;
};

const produitsBioOptions = ['Oui', 'Non', 'Parfois'];

/**
 * Composant de champ de formulaire
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  required = false,
  error = null,
  options = null,
  placeholder = "Sélectionner...",
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
        value={value ?? undefined}
        onChangeText={(text) => onChange(id, text)}
        style={[styles.textarea, error ? styles.inputError : null]}
        placeholder={placeholder}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
    ) : (
      <TextInput
        value={value ?? undefined}
        onChangeText={(text) => onChange(id, text)}
        style={[styles.input, error ? styles.inputError : null]}
        placeholder={placeholder}
      />
    )}
  </View>
);

/**
 * Composant section repliable
 */
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

/** 
 * Composant de sélection de volontaire séparé pour éviter les problèmes de rendu
 */
const VolontaireSelector: React.FC<{
  volontaires: any[],
  value: string | number | null,
  onChange: (name: string, value: string | null) => void,
  error?: string
}> = ({ volontaires, value, onChange, error }) => {
  // Si aucun volontaire n'est disponible, afficher un message
  if (!volontaires || volontaires.length === 0) {
    return (
      <View style={additionalStyles.noDataContainer}>
        <Icon name="alert-circle" size={24} color="#9CA3AF" />
        <Text style={additionalStyles.noDataText}>Aucun volontaire disponible. Veuillez en créer un d'abord.</Text>
      </View>
    );
  }

  // Sinon, afficher le sélecteur
  return (
    <FormField
      label="Volontaire associé"
      id="idVol"
      type="select"
      value={value !== null ? String(value) : null}
      onChange={onChange}
      options={volontaires.map(vol => ({
        value: String(vol.id || undefined),
        label: `${vol.nomVol} ${vol.prenomVol} (ID: ${vol.idVol})`,
      }))}
      required
      error={error}
    />
  );
};

/**
 * Composant CheckboxField pour une case à cocher individuelle
 */
const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, id, checked, onChange }) => (
  <TouchableOpacity
    style={styles.checkboxContainer}
    onPress={() => onChange(id, checked ? "Non" : "Oui")}
    activeOpacity={0.7}
  >
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Icon name="check" size={16} color="#fff" />}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

/**
 * Composant CheckBoxGroup qui regroupe plusieurs cases à cocher
 */
const CheckboxGroup: React.FC<{
  title?: string;
  items: { id: string; label: string }[];
  formData: FormData;
  onChange: (id: string, value: 'Oui' | 'Non') => void;
}> = ({ title, items, formData, onChange }) => (
  <View style={styles.column}>
    {title && <Text style={styles.subSectionTitle}>{title}</Text>}
    {items.map((item) => (
      <CheckboxField
        key={item.id}
        label={item.label}
        id={item.id}
        checked={formData[item.id] === "Oui"}
        onChange={onChange}
      />
    ))}
  </View>
);

// Définition des styles supplémentaires
const additionalStyles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    padding: 20
  },
  loadingText: {
    marginTop: 10,
    color: '#4B5563'
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 8
  },
  noDataText: {
    marginTop: 10,
    color: '#4B5563',
    textAlign: 'center'
  }
});




/**
 * Composant principal du formulaire d'habitudes cosmétiques
 */
const VolontaireHcForm: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'VolontaireHcForm'>>();
  const navigation = useNavigation<any>();
  const { idVol } = route.params || {}; // Récupère l'ID du volontaire s'il est passé en paramètre

  // État du formulaire - toujours vide sauf pour l'ID du volontaire
  const [formData, setFormData] = useState<FormData>({
    idVol: idVol || null, // Utilise l'ID du volontaire s'il est fourni

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
    soinAntiTachesDecollete: null,
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

    // RASAGE HOMME
    apresRasage: null,
    gelARaser: null,
    mousseARaser: null,
    tondeuseBarbe: null,
    ombreBarbe: null,
    rasoirElectrique: null,
    rasoirMecanique: null,

    // Commentaires
    commentaires: null,
  });

  // États pour gérer le chargement et les erreurs
  const [volontaireInfo, setVolontaireInfo] = useState<any>(null);
  const [availableVolontaires, setAvailableVolontaires] = useState<any[]>([]); // Initialiser comme tableau vide
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true); // Commencer avec loading=true
  const [submitError, setSubmitError] = useState<string | null>(null);

  const scrollViewRef = React.useRef<ScrollView>(null);

  // Chargement des informations du volontaire qui vient d'être créé
  useEffect(() => {
    let isMounted = true;

    // On initialise directement l'ID du volontaire dans le formulaire
    if (idVol) {
      setFormData(prev => ({
        ...prev,
        idVol: idVol
      }));

      setLoading(true);

      const fetchVolontaireInfo = async () => {
        try {
          console.log(`Chargement des informations de base du volontaire ID: ${idVol}`);
          const response = await api.volontaires.getById(idVol);

          if (!isMounted) return;

          if (response && response.data) {
            console.log("Informations du volontaire reçues");
            setVolontaireInfo(response.data);
          }
        } catch (error) {
          if (!isMounted) return;
          console.error('Erreur lors du chargement des informations du volontaire:', error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      fetchVolontaireInfo();
    }

    return () => {
      isMounted = false;
    };
  }, [idVol]);

  // Gestion des changements de champs
  const handleChange = (name: keyof FormData, value: string | null) => {

    setFormData(prev => ({
      ...prev,
      [name]: value || null,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '', // Réinitialiser l'erreur si le champ est modifié
      }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.idVol) {
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
    setSubmitError(null);

    try {
      // Parse ID to number and validate
      let idVolNumber;
      try {
        idVolNumber = parseInt(String(formData.idVol), 10);
        if (isNaN(idVolNumber) || idVolNumber <= 0) {
          throw new Error("L'ID du volontaire doit être un nombre positif");
        }
      } catch (error) {
        setSubmitError(
          typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: unknown }).message)
            : 'Une erreur est survenue'
        );
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        setLoading(false);
        return;
      }

      // Create a properly structured data object that matches backend expectations
      // Use the original string values "Oui"/"Non" directly
      const apiData = {
        // Important: use the exact field name expected by your API
        idVol: idVolNumber,

        // Pass all values as they are (already "Oui"/"Non")
        achat_grandes_surfaces: formData.achatGrandesSurfaces,
        achat_institut_parfumerie: formData.achatInstitutParfumerie,
        achat_internet: formData.achatInternet,
        achat_pharmacie_parapharmacie: formData.achatPharmacieParapharmacie,

        // Add all product fields with string "Oui"/"Non" values
        anti_transpirant: formData.antiTranspirant,
        anticerne: formData.anticerne,
        apres_rasage: formData.apresRasage,
        apres_shampoing: formData.apresShampoing,
        autobronzant: formData.autobronzant,
        base_maquillage: formData.baseMaquillage,
        blush_fard_a_joues: formData.blushFardAJoues,
        cire: formData.cire,
        coloration_meches: formData.colorationMeches,
        correcteur_teint: formData.correcteurTeint,
        crayon_levres: formData.crayonLevres,
        crayons_yeux: formData.crayonsYeux,
        creme_depilatoire: formData.cremeDepilatoire,
        creme_teintee: formData.cremeTeintee,
        demaquillant_visage: formData.demaquillantVisage,
        demaquillant_waterproof: formData.demaquillantWaterproof,
        demaquillant_yeux: formData.demaquillantYeux,
        deodorant: formData.deodorant,
        dissolvant_ongles: formData.dissolvantOngles,
        eau_de_toilette: formData.eauDeToilette,
        epilateur_electrique: formData.epilateurElectrique,
        epilation_definitive: formData.epilationDefinitive,
        extensions_capillaires: formData.extensionsCapillaires,
        eyeliner: formData.eyeliner,
        fard_a_paupieres: formData.fardAPaupieres,
        faux_cils: formData.fauxCils,
        faux_ongles: formData.fauxOngles,
        fond_de_teint: formData.fondDeTeint,
        gel_a_raser: formData.gelARaser,
        gel_douche: formData.gelDouche,
        gel_nettoyant: formData.gelNettoyant,
        gloss: formData.gloss,
        gommage_corps: formData.gommageCorps,
        gommage_visage: formData.gommageVisage,
        institut: formData.institut,
        lait_douche: formData.laitDouche,
        lissage_defrisage: formData.lissageDefrisage,
        lotion_micellaire: formData.lotionMicellaire,
        manucures: formData.manucures,
        maquillage_des_sourcils: formData.maquillageDesSourcils,
        maquillage_permanent_levres: formData.maquillagePermanentLevres,
        maquillage_permanent_sourcils: formData.maquillagePermanentSourcils,
        maquillage_permanent_yeux: formData.maquillagePermanentYeux,
        mascara: formData.mascara,
        mascara_waterproof: formData.mascaraWaterproof,
        masque_capillaire: formData.masqueCapillaire,
        masque_corps: formData.masqueCorps,
        masque_visage: formData.masqueVisage,
        mousse_a_raser: formData.mousseARaser,
        nettoyant_intime: formData.nettoyantIntime,
        ombre_barbe: formData.ombreBarbe,
        parfum: formData.parfum,
        permanente: formData.permanente,
        poudre_libre: formData.poudreLibre,
        produit_coiffant_fixant: formData.produitCoiffantFixant,
        produits_bain: formData.produitsBain,
        produits_bio: formData.produitsBio,
        protecteur_solaire_corps: formData.protecteurSolaireCorps,
        protecteur_solaire_levres: formData.protecteurSolaireLevres,
        protecteur_solaire_visage: formData.protecteurSolaireVisage,
        rasoir: formData.rasoir,
        rasoir_electrique: formData.rasoirElectrique,
        rasoir_mecanique: formData.rasoirMecanique,
        rouge_a_levres: formData.rougeALevres,
        savon: formData.savon,
        shampoing: formData.shampoing,
        soin_amincissant: formData.soinAmincissant,
        soin_anti_age_corps: formData.soinAntiAgeCorps,
        soin_anti_age_mains: formData.soinAntiAgeMains,
        soin_anti_age_visage: formData.soinAntiAgeVisage,
        soin_anti_cellulite: formData.soinAntiCellulite,
        soin_anti_rides_visage: formData.soinAntiRidesVisage,
        soin_anti_rougeurs_visage: formData.soinAntiRougeursVisage,
        soin_anti_taches_decollete: formData.soinAntiTachesDecollete,
        soin_anti_taches_mains: formData.soinAntiTachesMains,
        soin_anti_taches_visage: formData.soinAntiTachesVisage,
        soin_anti_vergetures: formData.soinAntiVergetures,
        soin_apres_soleil: formData.soinApresSoleil,
        soin_contour_des_levres: formData.soinContourDesLevres,
        soin_contour_des_yeux: formData.soinContourDesYeux,
        soin_eclat_du_teint: formData.soinEclatDuTeint,
        soin_hydratant_corps: formData.soinHydratantCorps,
        soin_hydratant_mains: formData.soinHydratantMains,
        soin_hydratant_visage: formData.soinHydratantVisage,
        soin_matifiant_visage: formData.soinMatifiantVisage,
        soin_nourissant_visage: formData.soinNourissantVisage,
        soin_nourrissant_corps: formData.soinNourrissantCorps,
        soin_nourrissant_mains: formData.soinNourrissantMains,
        soin_ongles: formData.soinOngles,
        soin_pieds: formData.soinPieds,
        soin_raffermissant_corps: formData.soinRaffermissantCorps,
        soin_raffermissant_visage: formData.soinRaffermissantVisage,
        tondeuse_barbe: formData.tondeuseBarbe,
        tonique: formData.tonique,
        vernis_a_ongles: formData.vernisAOngles
      };

      console.log("Envoi des données complètes:", JSON.stringify(apiData, null, 2));

      // Call API with complete data object
      const response = await api.habituesCosmetiques.create(apiData);

      // Handle success
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
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);

      // Display detailed error message
      let errorMessage = 'Erreur lors de la soumission';
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof error.response === 'object'
      ) {
        const errResponse = error.response;
        if (errResponse) {
          errorMessage += ': ' + ((errResponse as { data?: { message?: string }; statusText?: string }).data?.message || (errResponse as { statusText?: string }).statusText);
          console.log('Réponse d\'erreur détaillée:', JSON.stringify((errResponse as { data?: unknown }).data));
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setSubmitError(errorMessage);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } finally {
      setLoading(false);
    }
  };

  // Afficher un indicateur de chargement pendant le chargement des données
  if (loading) {
    return (
      <View style={[styles.loadingContainer, additionalStyles.loadingContainer]}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={additionalStyles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }

  // Structure des groupes de cases à cocher pour différentes sections
  const achatItems = [
    { id: 'achatPharmacieParapharmacie', label: 'Pharmacie/Parapharmacie' },
    { id: 'achatGrandesSurfaces', label: 'Grandes surfaces' },
    { id: 'achatInstitutParfumerie', label: 'Institut/Parfumerie' },
    { id: 'achatInternet', label: 'Internet' }
  ];

  const epilationItems = [
    { id: 'rasoir', label: 'Rasoir' },
    { id: 'epilateurElectrique', label: 'Épilateur électrique' },
    { id: 'cire', label: 'Cire' },
    { id: 'cremeDepilatoire', label: 'Crème dépilatoire' }
  ];

  const epilationProItems = [
    { id: 'institut', label: 'Institut' },
    { id: 'epilationDefinitive', label: 'Épilation définitive (laser, lumière pulsée...)' }
  ];

  const visageBaseItems = [
    { id: 'soinHydratantVisage', label: 'Soin hydratant' },
    { id: 'soinNourissantVisage', label: 'Soin nourrissant' },
    { id: 'soinMatifiantVisage', label: 'Soin matifiant' }
  ];

  const visageSpecItems = [
    { id: 'soinAntiAgeVisage', label: 'Soin anti-âge' },
    { id: 'soinAntiRidesVisage', label: 'Soin anti-rides' },
    { id: 'soinAntiTachesVisage', label: 'Soin anti-taches' },
    { id: 'soinAntiRougeursVisage', label: 'Soin anti-rougeurs' },
    { id: 'soinEclatDuTeint', label: 'Soin éclat du teint' },
    { id: 'soinRaffermissantVisage', label: 'Soin raffermissant' }
  ];

  const visageZoneItems = [
    { id: 'soinContourDesYeux', label: 'Contour des yeux' },
    { id: 'soinContourDesLevres', label: 'Contour des lèvres' }
  ];

  const demaquillageItems = [
    { id: 'demaquillantVisage', label: 'Démaquillant visage' },
    { id: 'demaquillantYeux', label: 'Démaquillant yeux' },
    { id: 'demaquillantWaterproof', label: 'Démaquillant waterproof' },
    { id: 'gelNettoyant', label: 'Gel nettoyant' },
    { id: 'lotionMicellaire', label: 'Lotion micellaire' },
    { id: 'tonique', label: 'Tonique' }
  ];

  const corpsItems = [
    { id: 'soinHydratantCorps', label: 'Soin hydratant corps' },
    { id: 'soinNourrissantCorps', label: 'Soin nourrissant corps' },
    { id: 'soinRaffermissantCorps', label: 'Soin raffermissant corps' },
    { id: 'soinAmincissant', label: 'Soin amincissant' },
    { id: 'soinAntiCellulite', label: 'Soin anti-cellulite' },
    { id: 'soinAntiVergetures', label: 'Soin anti-vergetures' },
    { id: 'soinAntiAgeCorps', label: 'Soin anti-âge corps' },
    { id: 'soinAntiTachesDecollete', label: 'Soin anti-taches décolleté' },
    { id: 'gommageCorps', label: 'Gommage corps' },
    { id: 'masqueCorps', label: 'Masque corps' }
  ];

  const soinsSpecifiquesItems = [
    { id: 'soinHydratantMains', label: 'Soin hydratant mains' },
    { id: 'soinNourrissantMains', label: 'Soin nourrissant mains' },
    { id: 'soinAntiAgeMains', label: 'Soin anti-âge mains' },
    { id: 'soinAntiTachesMains', label: 'Soin anti-taches mains' },
    { id: 'soinPieds', label: 'Soin pieds' },
    { id: 'soinOngles', label: 'Soin ongles' }
  ];

  const hygieneItems = [
    { id: 'gelDouche', label: 'Gel douche' },
    { id: 'laitDouche', label: 'Lait douche' },
    { id: 'savon', label: 'Savon' },
    { id: 'produitsBain', label: 'Produits bain' },
    { id: 'nettoyantIntime', label: 'Nettoyant intime' },
    { id: 'deodorant', label: 'Déodorant' },
    { id: 'antiTranspirant', label: 'Anti-transpirant' }
  ];

  const capillairesItems = [
    { id: 'shampoing', label: 'Shampooing' },
    { id: 'apresShampoing', label: 'Après-shampooing' },
    { id: 'masqueCapillaire', label: 'Masque capillaire' },
    { id: 'produitCoiffantFixant', label: 'Produit coiffant/fixant' },
    { id: 'colorationMeches', label: 'Coloration/mèches' },
    { id: 'permanente', label: 'Permanente' },
    { id: 'lissageDefrisage', label: 'Lissage/défrisage' },
    { id: 'extensionsCapillaires', label: 'Extensions capillaires' }
  ];

  const maquillageVisageItems = [
    { id: 'fondDeTeint', label: 'Fond de teint' },
    { id: 'poudreLibre', label: 'Poudre libre' },
    { id: 'blushFardAJoues', label: 'Blush/fard à joues' },
    { id: 'correcteurTeint', label: 'Correcteur teint' },
    { id: 'anticerne', label: 'Anticerne' },
    { id: 'baseMaquillage', label: 'Base maquillage' },
    { id: 'cremeTeintee', label: 'Crème teintée' }
  ];

  const maquillageYeuxItems = [
    { id: 'mascara', label: 'Mascara' },
    { id: 'mascaraWaterproof', label: 'Mascara waterproof' },
    { id: 'crayonsYeux', label: 'Crayons yeux' },
    { id: 'eyeliner', label: 'Eyeliner' },
    { id: 'fardAPaupieres', label: 'Fard à paupières' },
    { id: 'maquillageDesSourcils', label: 'Maquillage des sourcils' },
    { id: 'fauxCils', label: 'Faux cils' }
  ];

  const maquillagelevresOnglesItems = [
    { id: 'rougeALevres', label: 'Rouge à lèvres' },
    { id: 'gloss', label: 'Gloss' },
    { id: 'crayonLevres', label: 'Crayon lèvres' },
    { id: 'vernisAOngles', label: 'Vernis à ongles' },
    { id: 'dissolvantOngles', label: 'Dissolvant ongles' },
    { id: 'fauxOngles', label: 'Faux ongles' },
    { id: 'manucures', label: 'Manucures' }
  ];

  const permanentItems = [
    { id: 'maquillagePermanentYeux', label: 'Maquillage permanent yeux' },
    { id: 'maquillagePermanentLevres', label: 'Maquillage permanent lèvres' },
    { id: 'maquillagePermanentSourcils', label: 'Maquillage permanent sourcils' }
  ];

  const solaireItems = [
    { id: 'protecteurSolaireVisage', label: 'Protecteur solaire visage' },
    { id: 'protecteurSolaireCorps', label: 'Protecteur solaire corps' },
    { id: 'protecteurSolaireLevres', label: 'Protecteur solaire lèvres' },
    { id: 'soinApresSoleil', label: 'Soin après-soleil' },
    { id: 'autobronzant', label: 'Autobronzant' }
  ];

  const parfumsItems = [
    { id: 'parfum', label: 'Parfum' },
    { id: 'eauDeToilette', label: 'Eau de toilette' }
  ];

  const hommeItems1 = [
    { id: 'apresRasage', label: 'Après-rasage' },
    { id: 'gelARaser', label: 'Gel à raser' },
    { id: 'mousseARaser', label: 'Mousse à raser' },
    { id: 'tondeuseBarbe', label: 'Tondeuse barbe' }
  ];

  const hommeItems2 = [
    { id: 'ombreBarbe', label: 'Ombre barbe' },
    { id: 'rasoirElectrique', label: 'Rasoir électrique' },
    { id: 'rasoirMecanique', label: 'Rasoir mécanique' }
  ];

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
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <Icon name="arrow-left" size={18} color="#2563EB" />
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <View style={styles.titleWithIcon}>
                  <Icon name="user-plus" size={22} color="#2563EB" />
                  <Text style={styles.title}>Ajouter des habitudes cosmétiques</Text>
                </View>
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
              title='Volontaire sélectionné'
              isOpen={true}
              icon={<Icon name="user" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <Text style={styles.volontaireName}>
                  {volontaireInfo ? `${volontaireInfo.nom} ${volontaireInfo.prenom}` : 'Chargement...'}
                </Text>
              </View>
            </CollapsibleSection>

            {/* Section habitudes d'achat */}
            <CollapsibleSection
              title="Habitudes d'achat"
              isOpen={true}
              icon={<Icon name="shopping-bag" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <CheckboxGroup
                  title="Lieux d'achat préférés"
                  items={achatItems}
                  formData={formData}
                  onChange={handleChange}
                />

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
                <CheckboxGroup
                  title="Méthodes utilisées"
                  items={epilationItems}
                  formData={formData}
                  onChange={handleChange}
                />,
                <CheckboxGroup
                  title="Méthodes professionnelles"
                  items={epilationProItems}
                  formData={formData}
                  onChange={handleChange}
                />
              </View>
            </CollapsibleSection>

            {/* Section soins du visage */}
            <CollapsibleSection
              title="Soins du visage"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <CheckboxGroup
                  title="Soins de base"
                  items={visageBaseItems}
                  formData={formData}
                  onChange={handleChange}
                />
                <CheckboxGroup
                  title="Soins spécifiques"
                  items={visageSpecItems}
                  formData={formData}
                  onChange={handleChange}
                />
                <CheckboxGroup
                  title="Zones spécifiques"
                  items={visageZoneItems}
                  formData={formData}
                  onChange={handleChange}
                />
              </View>
            </CollapsibleSection>

            {/* Section démaquillage et nettoyage */}
            <CollapsibleSection
              title="Démaquillage et nettoyage"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <CheckboxGroup
                  items={demaquillageItems}
                  formData={formData}
                  onChange={handleChange}
                />
              </View>
            </CollapsibleSection>

            {/* Soins du corps */}
            <CollapsibleSection
              title="Soins du corps"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <CheckboxGroup
                  items={corpsItems}
                  formData={formData}
                  onChange={handleChange}
                />
              </View>
            </CollapsibleSection>

            {/* Soins spécifiques */}
            <CollapsibleSection
              title="Soins spécifiques (mains, pieds, ongles)"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <CheckboxGroup
                  items={soinsSpecifiquesItems}
                  formData={formData}
                  onChange={handleChange}
                />
              </View>
            </CollapsibleSection>

            {/* Section produits d'hygiène */}
            <CollapsibleSection
              title="Produits d'hygiène"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <CheckboxGroup
                  items={hygieneItems}
                  formData={formData}
                  onChange={handleChange}
                />
              </View>
            </CollapsibleSection>

            {/* Section soins capillaires */}
            <CollapsibleSection
              title="Soins capillaires"
              icon={<Icon name="scissors" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <CheckboxGroup
                  items={capillairesItems}
                  formData={formData}
                  onChange={handleChange}
                />
              </View>
            </CollapsibleSection>

            {/* Section maquillage visage */}
            <CollapsibleSection
              title="Maquillage visage"
              icon={<Icon name="droplet" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <CheckboxGroup
                  items={maquillageVisageItems}
                  formData={formData}
                  onChange={handleChange}
                />
              </View>
            </CollapsibleSection>

            {/* Section maquillage yeux */}
            <CollapsibleSection
              title="Maquillage yeux"
              icon={<Icon name="eye" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <CheckboxGroup
                  items={maquillageYeuxItems}
                  formData={formData}
                  onChange={handleChange}
                />
              </View>
            </CollapsibleSection>

            {/* Section maquillage lèvres et ongles */}
            <CollapsibleSection
              title="Maquillage lèvres et ongles"
              icon={<Icon name="smile" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <CheckboxGroup
                  items={maquillagelevresOnglesItems}
                  formData={formData}
                  onChange={handleChange}
                />
              </View>
            </CollapsibleSection>

            {/* Section maquillage permanent */}
            <CollapsibleSection
              title="Maquillage permanent"
              icon={<Icon name="pen-tool" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <CheckboxGroup
                  items={permanentItems}
                  formData={formData}
                  onChange={handleChange}
                />
              </View>
            </CollapsibleSection>

            {/* Solaire */}
            <CollapsibleSection
              title="Solaire"
              icon={<Icon name="sun" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <CheckboxGroup
                  items={solaireItems}
                  formData={formData}
                  onChange={handleChange}
                />
              </View>
            </CollapsibleSection>

            {/* Parfums */}
            <CollapsibleSection
              title="Parfums"
              icon={<Icon name="cloud" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <CheckboxGroup
                  items={parfumsItems}
                  formData={formData}
                  onChange={handleChange}
                />
              </View>
            </CollapsibleSection>

            {/* Section produits pour hommes */}
            <CollapsibleSection
              title="Produits pour hommes"
              icon={<Icon name="user" size={20} color="#2563EB" style={styles.sectionIcon} />}
            >
              <View style={styles.gridContainer}>
                <CheckboxGroup
                  items={hommeItems1}
                  formData={formData}
                  onChange={handleChange}
                />
                <CheckboxGroup
                  items={hommeItems2}
                  formData={formData}
                  onChange={handleChange}
                />
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
                onPress={() => navigation.navigate('VolontaireHcList')}
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
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
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