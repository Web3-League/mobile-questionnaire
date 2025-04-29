import React, { useState, useEffect, useRef, useMemo, ReactNode } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Alert,
    Platform,
    KeyboardAvoidingView,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import WebDatePicker from './WebDatePicker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import api from '../app/services/apiService';
import styles from './styles';

// Détection de tablette plus précise
const { width } = Dimensions.get('window');
const isTablet = width >= 768;

// Types généraux
type FormFieldType = 'text' | 'select' | 'date' | 'textarea' | 'number';
type FormTab = {
    id: string;
    label: string;
    icon: string;
};

type FormFieldOption = string | { label: string; value: string };

// Props des composants
interface FormFieldProps {
    label: string;
    id: string;
    type?: FormFieldType;
    value?: string;
    onChange: (name: string, value: string) => void;
    required?: boolean;
    error?: string | null;
    options?: FormFieldOption[]; // Remove | null for better type safety
    placeholder?: string;
    infoTooltip?: string | null;
    numberOfLines?: number;
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

interface FormTabsProps {
    tabs: FormTab[];
    activeTab: string;
    setActiveTab: (tabId: string) => void;
}

// Types pour la navigation
type VolontaireFormRouteParams = {
    id?: string;
};

type NavProps = {
    VolontaireDetails: { id: string };
};

// Interface pour les données du formulaire
interface FormData {
    [key: string]: string;

}

// Fonction utilitaire pour convertir une date au format ISO
const toISODateString = (dateString?: string | Date): string => {
    try {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch (error) {
        console.error('Erreur de conversion de date:', error);
        return '';
    }
};

// Composants
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

const FormField = ({
    label,
    id,
    type = 'text',
    value,
    onChange,
    required = false,
    error = null,
    options = [],
    placeholder = '',
    infoTooltip = null,
    numberOfLines = 3,
}: FormFieldProps) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showPickerModal, setShowPickerModal] = useState(false);

    // Amélioration pour les dates
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
                    {/* Utiliser un TouchableOpacity au lieu du Picker direct pour les tablettes */}
                    <TouchableOpacity
                        style={tabletStyles.selectButton}
                        onPress={() => {
                            Keyboard.dismiss();
                            setShowPickerModal(true);
                        }}>
                        <Text style={value ? styles.inputText : styles.placeholderText}>
                            {value ?
                                (() => {
                                    const foundOption = options?.find(opt =>
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
                                })() :
                                'Sélectionner...'
                            }
                        </Text>
                        <Icon name="chevron-down" size={16} color="#6B7280" />
                    </TouchableOpacity>

                    {/* Modal de sélection pour éviter les problèmes de Picker sur tablette */}
                    <Modal
                        transparent={true}
                        visible={showPickerModal}
                        onRequestClose={() => setShowPickerModal(false)}
                        animationType="slide">
                        <TouchableWithoutFeedback onPress={() => setShowPickerModal(false)}>
                            <View style={tabletStyles.modalOverlay}>
                                <TouchableWithoutFeedback>
                                    <View style={tabletStyles.pickerModalContainer}>
                                        <View style={tabletStyles.pickerModalHeader}>
                                            <TouchableOpacity onPress={() => setShowPickerModal(false)}>
                                                <Text style={tabletStyles.pickerModalCancel}>Annuler</Text>
                                            </TouchableOpacity>
                                            <Text style={tabletStyles.pickerModalTitle}>{label}</Text>
                                            <TouchableOpacity onPress={() => setShowPickerModal(false)}>
                                                <Text style={tabletStyles.pickerModalDone}>OK</Text>
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
                    style={[styles.input, error ? styles.inputError : null]}
                    placeholder={placeholder}
                    keyboardType={type === 'number' ? 'numeric' : 'default'}
                />
            )}
        </View>
    );
};

const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, id, checked, onChange }) => (
    <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => onChange(id, checked ? 'Non' : 'Oui')}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
            {checked && <Icon name="check" size={14} color="#FFFFFF" />}
        </View>
        <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
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

// Props pour VolontaireForm
interface VolontaireFormProps {
    isEmbedded?: boolean;
    onSubmitSuccess?: (id: string) => void;
}

// Composant principal
const VolontaireForm: React.FC<VolontaireFormProps> = (props) => {
    const route = useRoute<RouteProp<Record<string, VolontaireFormRouteParams>, string>>();
    const navigation = useNavigation<any>();
    const { id } = route.params || {};
    const isEditMode = Boolean(id);




    // État initial du formulaire avec tous les champs possibles
    const initialFormState = useMemo(() => {
        return {
            // Informations personnelles
            titre: '',
            nom: '',
            prenom: '',
            email: '',
            telephone: '',
            telephoneDomicile: '',
            sexe: '',
            dateNaissance: '',

            // Adresse
            adresse: '',
            codePostal: '',
            ville: '',
            pays: 'France',

            // Caractéristiques physiques
            taille: '',
            poids: '',
            phototype: '',
            ethnie: '',
            sousEthnie: '',
            yeux: '',
            pilosite: '',
            originePere: '',
            origineMere: '',

            // Peau
            typePeau: '',
            carnation: '',
            sensibiliteCutanee: '',
            teintInhomogene: 'Non',
            teintTerne: 'Non',
            poresVisibles: 'Non',
            expositionSolaire: '',
            bronzage: '',
            coupsDeSoleil: '',
            celluliteBras: 'Non',
            celluliteFessesHanches: 'Non',
            celluliteJambes: 'Non',
            celluliteVentreTaille: 'Non',

            // Cheveux et ongles
            couleurCheveux: '',
            longueurCheveux: '',
            natureCheveux: '',
            epaisseurCheveux: '',
            natureCuirChevelu: '',
            cuirCheveluSensible: 'Non',
            chuteDeCheveux: 'Non',
            cheveuxCassants: 'Non',
            onglesCassants: 'Non',
            onglesDedoubles: 'Non',

            // Problèmes spécifiques
            acne: 'Non',
            couperoseRosacee: 'Non',
            dermiteSeborrheique: 'Non',
            eczema: 'Non',
            psoriasis: 'Non',

            // Informations médicales
            traitement: '',
            anamnese: '',
            contraception: '',
            menopause: 'Non',
            allergiesCommentaires: '',
            santeCompatible: 'Oui',

            // Notes
            notes: '',

            // Caractéristiques supplémentaires
            cicatrices: 'Non',
            tatouages: 'Non',
            piercings: 'Non',

            // Vergetures
            vergeturesJambes: 'Non',
            vergeturesFessesHanches: 'Non',
            vergeturesVentreTaille: 'Non',
            vergeturesPoitrineDecollete: 'Non',

            // Sécheresse de la peau
            secheresseLevres: 'Non',
            secheresseCou: 'Non',
            secheressePoitrineDecollete: 'Non',
            secheresseVentreTaille: 'Non',
            secheresseFessesHanches: 'Non',
            secheresseBras: 'Non',
            secheresseMains: 'Non',
            secheresseJambes: 'Non',
            secheressePieds: 'Non',

            // Taches pigmentaires
            tachesPigmentairesVisage: 'Non',
            tachesPigmentairesCou: 'Non',
            tachesPigmentairesDecollete: 'Non',
            tachesPigmentairesMains: 'Non',

            // Perte de fermeté
            perteDeFermeteVisage: 'Non',
            perteDeFermeteCou: 'Non',
            perteDeFermeteDecollete: 'Non',

            // Cils
            cils: '',
            epaisseurCils: '',
            longueurCils: '',
            courbureCils: '',
            cilsAbimes: 'Non',
            cilsBroussailleux: 'Non',
            chuteDeCils: 'Non',

            // Problèmes médicaux supplémentaires
            angiome: 'Non',
            pityriasis: 'Non',
            vitiligo: 'Non',
            melanome: 'Non',
            zona: 'Non',
            herpes: 'Non',
            pelade: 'Non',
            reactionAllergique: 'Non',
            desensibilisation: 'Non',
            terrainAtopique: 'Non',

            // Valeurs mesurées
            ihBrasDroit: '',
            ihBrasGauche: '',

            // Scores
            scorePod: '',
            scorePog: '',
            scoreFront: '',
            scoreLion: '',
            scorePpd: '',
            scorePpg: '',
            scoreDod: '',
            scoreDog: '',
            scoreSngd: '',
            scoreSngg: '',
            scoreLevsup: '',
            scoreComlevd: '',
            scoreComlevg: '',
            scorePtose: '',
            ita: '',

            // Autres attributs
            levres: '',
            bouffeeChaleurMenaupose: 'Non',
            cernesVasculaires: 'Non',
            cernesPigmentaires: 'Non',
            poches: 'Non',
            nbCigarettesJour: '',
            caracteristiqueSourcils: 'Non spécifié',
            mapyeux: '',
            maplevres: '',
            mapsourcils: '',
            ths: 'Non',

        };
    }, []);

    const [activeTab, setActiveTab] = useState('infos-personnelles');
    const [formData, setFormData] = useState<FormData>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Définition des onglets
    const tabs = [
        { id: 'infos-personnelles', label: 'Informations personnelles', icon: 'user' },
        { id: 'caracteristiques', label: 'Caractéristiques physiques', icon: 'activity' },
        { id: 'peau', label: 'Peau', icon: 'droplet' },
        { id: 'marques-cutanees', label: 'Marques cutanées', icon: 'target' },
        { id: 'cheveux', label: 'Cheveux & ongles', icon: 'feather' },
        { id: 'cils', label: 'Cils & sourcils', icon: 'eye' },
        { id: 'problemes', label: 'Problèmes spécifiques', icon: 'alert-circle' },
        { id: 'medical', label: 'Informations médicales', icon: 'heart' },
        { id: 'mesures', label: 'Mesures', icon: 'sliders' },
        { id: 'notes', label: 'Notes', icon: 'file-text' },
    ];

    // Référence au ScrollView
    const scrollViewRef = useRef<ScrollView>(null);

    // Chargement des données du volontaire en mode édition
    useEffect(() => {
        if (!isEditMode) { return; }

        const fetchVolontaire = async () => {
            try {
                setIsLoading(true);

                // Récupérer les données du volontaire
                const response = await api.volontaires.getById(id);
                const volontaireData = response.data || {};

                // Récupérer les détails du volontaire
                interface DetailsData {
                    cpVol?: string;
                    adresseVol?: string;
                    villeVol?: string;
                    pays?: string;
                    taille?: number;
                    poids?: number;
                    ethnie?: string;
                    sousEthnie?: string;
                    yeux?: string;
                    pilosite?: string;
                    originePere?: string;
                    origineMere?: string;
                    [key: string]: any;
                }

                let detailsData: DetailsData = {};
                try {
                    const detailsResponse = await api.volontaires.getDetailsById(id);
                    detailsData = detailsResponse.data || {};
                } catch (detailsError) {
                    console.error('Erreur lors du chargement des détails du volontaire:', detailsError);
                }

                // Formater les données pour le formulaire
                const formattedData = {
                    ...initialFormState,
                    titre: volontaireData.titreVol || '',
                    nom: volontaireData.nomVol || '',
                    prenom: volontaireData.prenomVol || '',
                    email: volontaireData.emailVol || '',
                    telephone: volontaireData.telPortableVol || '',
                    telephoneDomicile: volontaireData.telDomicileVol || '',
                    sexe: volontaireData.sexe || '',
                    dateNaissance: volontaireData.dateNaissance
                        ? toISODateString(volontaireData.dateNaissance)
                        : '',

                    // Adresse
                    adresse: detailsData.adresseVol || '',
                    codePostal: detailsData.cpVol || '',
                    ville: detailsData.villeVol || '',
                    pays: detailsData.pays || 'France',

                    // Caractéristiques physiques
                    taille: detailsData.taille ? detailsData.taille.toString() : '',
                    poids: detailsData.poids ? detailsData.poids.toString() : '',
                    phototype: volontaireData.phototype || '',
                    ethnie: detailsData.ethnie || '',
                    sousEthnie: detailsData.sousEthnie || '',
                    yeux: detailsData.yeux || '',
                    pilosite: detailsData.pilosite || '',
                    originePere: detailsData.originePere || '',
                    origineMere: detailsData.origineMere || '',

                    // Peau
                    typePeau: volontaireData.typePeauVisage || detailsData.typePeauVisage || '',
                    carnation: detailsData.carnation || '',
                    sensibiliteCutanee: detailsData.sensibiliteCutanee || '',
                    teintInhomogene: detailsData.teintInhomogene || 'Non',
                    teintTerne: detailsData.teintTerne || 'Non',
                    poresVisibles: detailsData.poresVisibles || 'Non',
                    expositionSolaire: detailsData.expositionSolaire || '',
                    bronzage: detailsData.bronzage || '',
                    coupsDeSoleil: detailsData.coupsDeSoleil || '',
                    celluliteBras: detailsData.celluliteBras || 'Non',
                    celluliteFessesHanches: detailsData.celluliteFessesHanches || 'Non',
                    celluliteJambes: detailsData.celluliteJambes || 'Non',
                    celluliteVentreTaille: detailsData.celluliteVentreTaille || 'Non',

                    // Cheveux et ongles
                    couleurCheveux: detailsData.couleurCheveux || '',
                    longueurCheveux: detailsData.longueurCheveux || '',
                    natureCheveux: detailsData.natureCheveux || '',
                    epaisseurCheveux: detailsData.epaisseurCheveux || '',
                    natureCuirChevelu: detailsData.natureCuirChevelu || '',
                    cuirCheveluSensible: detailsData.cuirCheveluSensible || 'Non',
                    chuteDeCheveux: detailsData.chuteDeCheveux || 'Non',
                    cheveuxCassants: detailsData.cheveuxCassants || 'Non',
                    onglesCassants: detailsData.onglesCassants || 'Non',
                    onglesDedoubles: detailsData.onglesDedoubles || 'Non',

                    // Marques cutanées
                    cicatrices: detailsData.cicatrices || 'Non',
                    tatouages: detailsData.tatouages || 'Non',
                    piercings: detailsData.piercings || 'Non',
                    tachesPigmentairesVisage: detailsData.tachesPigmentairesVisage || 'Non',
                    tachesPigmentairesCou: detailsData.tachesPigmentairesCou || 'Non',
                    tachesPigmentairesDecollete: detailsData.tachesPigmentairesDecollete || 'Non',
                    tachesPigmentairesMains: detailsData.tachesPigmentairesMains || 'Non',

                    // Vergetures
                    vergeturesJambes: detailsData.vergeturesJambes || 'Non',
                    vergeturesFessesHanches: detailsData.vergeturesFessesHanches || 'Non',
                    vergeturesVentreTaille: detailsData.vergeturesVentreTaille || 'Non',
                    vergeturesPoitrineDecollete: detailsData.vergeturesPoitrineDecollete || 'Non',

                    // Sécheresse de la peau
                    secheresseLevres: detailsData.secheresseLevres || 'Non',
                    secheresseCou: detailsData.secheresseCou || 'Non',
                    secheressePoitrineDecollete: detailsData.secheressePoitrineDecollete || 'Non',
                    secheresseVentreTaille: detailsData.secheresseVentreTaille || 'Non',
                    secheresseFessesHanches: detailsData.secheresseFessesHanches || 'Non',
                    secheresseBras: detailsData.secheresseBras || 'Non',
                    secheresseMains: detailsData.secheresseMains || 'Non',
                    secheresseJambes: detailsData.secheresseJambes || 'Non',
                    secheressePieds: detailsData.secheressePieds || 'Non',

                    // Perte de fermeté
                    perteDeFermeteVisage: detailsData.perteDeFermeteVisage || 'Non',
                    perteDeFermeteCou: detailsData.perteDeFermeteCou || 'Non',
                    perteDeFermeteDecollete: detailsData.perteDeFermeteDecollete || 'Non',

                    // Cils et sourcils
                    cils: detailsData.cils || 'Non spécifié',
                    epaisseurCils: detailsData.epaisseurCils || '',
                    longueurCils: detailsData.longueurCils || '',
                    courbureCils: detailsData.courbureCils || '',
                    cilsAbimes: detailsData.cilsAbimes || 'Non',
                    cilsBroussailleux: detailsData.cilsBroussailleux || 'Non',
                    chuteDeCils: detailsData.chuteDeCils || 'Non',
                    caracteristiqueSourcils: detailsData.caracteristiqueSourcils || 'Non spécifié',

                    // Problèmes spécifiques
                    acne: detailsData.acne || 'Non',
                    couperoseRosacee: detailsData.couperoseRosacee || 'Non',
                    dermiteSeborrheique: detailsData.dermiteSeborrheique || 'Non',
                    eczema: detailsData.eczema || 'Non',
                    psoriasis: detailsData.psoriasis || 'Non',

                    // Problèmes médicaux supplémentaires
                    angiome: detailsData.angiome || 'Non',
                    pityriasis: detailsData.pityriasis || 'Non',
                    vitiligo: detailsData.vitiligo || 'Non',
                    melanome: detailsData.melanome || 'Non',
                    zona: detailsData.zona || 'Non',
                    herpes: detailsData.herpes || 'Non',
                    pelade: detailsData.pelade || 'Non',
                    reactionAllergique: detailsData.reactionAllergique || 'Non',
                    desensibilisation: detailsData.desensibilisation || 'Non',
                    terrainAtopique: detailsData.terrainAtopique || 'Non',

                    // Informations médicales
                    traitement: detailsData.traitement || '',
                    anamnese: detailsData.anamnese || '',
                    contraception: detailsData.contraception || '',
                    menopause: detailsData.menopause || 'Non',
                    allergiesCommentaires: detailsData.allergiesCommentaires || '',
                    santeCompatible: detailsData.santeCompatible || 'Oui',

                    // Autres attributs
                    levres: detailsData.levres || '',
                    bouffeeChaleurMenaupose: detailsData.bouffeeChaleurMenaupose || 'Non',
                    cernesVasculaires: detailsData.cernesVasculaires || 'Non',
                    cernesPigmentaires: detailsData.cernesPigmentaires || 'Non',
                    poches: detailsData.poches || 'Non',
                    nbCigarettesJour: detailsData.nbCigarettesJour ? detailsData.nbCigarettesJour.toString() : '',
                    mapyeux: detailsData.mapyeux || '',
                    maplevres: detailsData.maplevres || '',
                    mapsourcils: detailsData.mapsourcils || '',
                    ths: detailsData.ths || 'Non',

                    // Valeurs mesurées
                    ihBrasDroit: detailsData.ihBrasDroit ? detailsData.ihBrasDroit.toString() : '',
                    ihBrasGauche: detailsData.ihBrasGauche ? detailsData.ihBrasGauche.toString() : '',

                    // Scores
                    scorePod: detailsData.scorePod ? detailsData.scorePod.toString() : '',
                    scorePog: detailsData.scorePog ? detailsData.scorePog.toString() : '',
                    scoreFront: detailsData.scoreFront ? detailsData.scoreFront.toString() : '',
                    scoreLion: detailsData.scoreLion ? detailsData.scoreLion.toString() : '',
                    scorePpd: detailsData.scorePpd ? detailsData.scorePpd.toString() : '',
                    scorePpg: detailsData.scorePpg ? detailsData.scorePpg.toString() : '',
                    scoreDod: detailsData.scoreDod ? detailsData.scoreDod.toString() : '',
                    scoreDog: detailsData.scoreDog ? detailsData.scoreDog.toString() : '',
                    scoreSngd: detailsData.scoreSngd ? detailsData.scoreSngd.toString() : '',
                    scoreSngg: detailsData.scoreSngg ? detailsData.scoreSngg.toString() : '',
                    scoreLevsup: detailsData.scoreLevsup ? detailsData.scoreLevsup.toString() : '',
                    scoreComlevd: detailsData.scoreComlevd ? detailsData.scoreComlevd.toString() : '',
                    scoreComlevg: detailsData.scoreComlevg ? detailsData.scoreComlevg.toString() : '',
                    scorePtose: detailsData.scorePtose ? detailsData.scorePtose.toString() : '',
                    ita: detailsData.ita ? detailsData.ita.toString() : '',

                    // Notes
                    notes: detailsData.commentairesVol || '',
                };

                setFormData(formattedData);

                setFormData(formattedData);
            } catch (error) {
                console.error('Erreur lors du chargement des données du volontaire:', error);
                setErrorMessage('Impossible de charger les données du volontaire');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVolontaire();
    }, [id, isEditMode, initialFormState]);

    // Gestion des changements dans le formulaire
    const handleChange = (name: string | number, value: any) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Effacer l'erreur pour ce champ
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Validation du formulaire
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Validation des champs obligatoires
        if (!formData.nom.trim()) {
            newErrors.nom = 'Le nom est obligatoire';
        }

        if (!formData.prenom.trim()) {
            newErrors.prenom = 'Le prénom est obligatoire';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est obligatoire';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }

        if (!formData.sexe) {
            newErrors.sexe = 'Le sexe est obligatoire';
        }

        if (!formData.typePeau) {
            newErrors.typePeau = 'Le type de peau est obligatoire';
        }

        // Code postal français (5 chiffres)
        if (formData.codePostal && !/^\d{5}$/.test(formData.codePostal)) {
            newErrors.codePostal = 'Le code postal doit contenir 5 chiffres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Soumission du formulaire
    const handleSubmit = async () => {
        // Vérification de la validité du formulaire
        if (!validateForm()) {
            // Faire défiler vers le haut en cas d'erreur
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 0, animated: true });
            }
            return;
        }

        setIsSaving(true);
        setErrorMessage('');
        setSuccessMessage('');

        const defaultIfNull = (value: any, defaultValue: any) => {
            // Si la valeur est null, undefined ou une chaîne vide, utiliser la valeur par défaut
            if (value === null || value === undefined || value === "") {
                return defaultValue;
            }
            return value;
        };

        try {
            // Préparation des données pour l'API
            const volontaireData = {
                titreVol: formData.titre,
                nomVol: formData.nom,
                prenomVol: formData.prenom,
                emailVol: formData.email,
                telPortableVol: formData.telephone,
                telDomicileVol: formData.telephoneDomicile,
                sexe: formData.sexe,
                dateNaissance: formData.dateNaissance,
                typePeauVisage: formData.typePeau,
                phototype: formData.phototype,
                ethnie: formData.ethnie,
                santeCompatible: formData.santeCompatible,
            };

            // Données détaillées
            const detailsData = {
                // Adresse
                adresseVol: formData.adresse,
                cpVol: formData.codePostal,
                villeVol: formData.ville,
                pays: formData.pays,

                // Caractéristiques physiques
                taille: formData.taille ? parseFloat(formData.taille) : 0,
                poids: formData.poids ? parseFloat(formData.poids) : 0,
                sousEthnie: formData.sousEthnie,
                yeux: formData.yeux,
                pilosite: formData.pilosite,
                originePere: formData.originePere,
                origineMere: formData.origineMere,

                // Peau
                carnation: formData.carnation,
                sensibiliteCutanee: formData.sensibiliteCutanee,
                teintInhomogene: formData.teintInhomogene,
                teintTerne: formData.teintTerne,
                poresVisibles: formData.poresVisibles,
                expositionSolaire: formData.expositionSolaire,
                bronzage: formData.bronzage,
                coupsDeSoleil: formData.coupsDeSoleil,
                celluliteBras: formData.celluliteBras,
                celluliteFessesHanches: formData.celluliteFessesHanches,
                celluliteJambes: formData.celluliteJambes,
                celluliteVentreTaille: formData.celluliteVentreTaille,

                // Cheveux et ongles
                couleurCheveux: formData.couleurCheveux,
                longueurCheveux: formData.longueurCheveux,
                natureCheveux: formData.natureCheveux,
                epaisseurCheveux: formData.epaisseurCheveux,
                natureCuirChevelu: formData.natureCuirChevelu,
                cuirCheveluSensible: formData.cuirCheveluSensible,
                chuteDeCheveux: formData.chuteDeCheveux,
                cheveuxCassants: formData.cheveuxCassants,
                onglesCassants: formData.onglesCassants,
                onglesDedoubles: formData.onglesDedoubles,

                // Marques cutanées
                cicatrices: formData.cicatrices,
                tatouages: formData.tatouages,
                piercings: formData.piercings,
                tachesPigmentairesVisage: formData.tachesPigmentairesVisage,
                tachesPigmentairesCou: formData.tachesPigmentairesCou,
                tachesPigmentairesDecollete: formData.tachesPigmentairesDecollete,
                tachesPigmentairesMains: formData.tachesPigmentairesMains,

                // Vergetures
                vergeturesJambes: formData.vergeturesJambes,
                vergeturesFessesHanches: formData.vergeturesFessesHanches,
                vergeturesVentreTaille: formData.vergeturesVentreTaille,
                vergeturesPoitrineDecollete: formData.vergeturesPoitrineDecollete,

                // Sécheresse de la peau
                secheresseLevres: formData.secheresseLevres,
                secheresseCou: formData.secheresseCou,
                secheressePoitrineDecollete: formData.secheressePoitrineDecollete,
                secheresseVentreTaille: formData.secheresseVentreTaille,
                secheresseFessesHanches: formData.secheresseFessesHanches,
                secheresseBras: formData.secheresseBras,
                secheresseMains: formData.secheresseMains,
                secheresseJambes: formData.secheresseJambes,
                secheressePieds: formData.secheressePieds,

                // Perte de fermeté
                perteDeFermeteVisage: formData.perteDeFermeteVisage,
                perteDeFermeteCou: formData.perteDeFermeteCou,
                perteDeFermeteDecollete: formData.perteDeFermeteDecollete,

                // Cils et sourcils
                cils: defaultIfNull(formData.cils, "Non spécifié"),
                epaisseurCils: formData.epaisseurCils,
                longueurCils: formData.longueurCils,
                courbureCils: formData.courbureCils,
                cilsAbimes: formData.cilsAbimes,
                cilsBroussailleux: formData.cilsBroussailleux,
                chuteDeCils: formData.chuteDeCils,
                caracteristiqueSourcils: defaultIfNull(formData.caracteristiqueSourcils, "Non spécifié"),

                // Problèmes spécifiques
                acne: formData.acne,
                couperoseRosacee: formData.couperoseRosacee,
                dermiteSeborrheique: formData.dermiteSeborrheique,
                eczema: formData.eczema,
                psoriasis: formData.psoriasis,

                // Problèmes médicaux supplémentaires
                angiome: formData.angiome,
                pityriasis: formData.pityriasis,
                vitiligo: formData.vitiligo,
                melanome: formData.melanome,
                zona: formData.zona,
                herpes: formData.herpes,
                pelade: formData.pelade,
                reactionAllergique: formData.reactionAllergique,
                desensibilisation: formData.desensibilisation,
                terrainAtopique: formData.terrainAtopique,

                // Informations médicales
                traitement: formData.traitement,
                anamnese: formData.anamnese,
                contraception: formData.contraception,
                menopause: formData.menopause,
                allergiesCommentaires: formData.allergiesCommentaires,

                // Autres attributs
                levres: formData.levres,
                bouffeeChaleurMenaupose: formData.bouffeeChaleurMenaupose,
                cernesVasculaires: formData.cernesVasculaires,
                cernesPigmentaires: formData.cernesPigmentaires,
                poches: formData.poches,
                nbCigarettesJour: formData.nbCigarettesJour ? parseInt(formData.nbCigarettesJour, 10) : 0,
                mapyeux: formData.mapyeux,
                maplevres: formData.maplevres,
                mapsourcils: formData.mapsourcils,
                ths: formData.ths,

                // Valeurs mesurées
                ihBrasDroit: formData.ihBrasDroit ? parseFloat(formData.ihBrasDroit) : 0,
                ihBrasGauche: formData.ihBrasGauche ? parseFloat(formData.ihBrasGauche) : 0,

                // Scores
                scorePod: formData.scorePod ? parseFloat(formData.scorePod) : 0,
                scorePog: formData.scorePog ? parseFloat(formData.scorePog) : 0,
                scoreFront: formData.scoreFront ? parseFloat(formData.scoreFront) : 0,
                scoreLion: formData.scoreLion ? parseFloat(formData.scoreLion) : 0,
                scorePpd: formData.scorePpd ? parseFloat(formData.scorePpd) : 0,
                scorePpg: formData.scorePpg ? parseFloat(formData.scorePpg) : 0,
                scoreDod: formData.scoreDod ? parseFloat(formData.scoreDod) : 0,
                scoreDog: formData.scoreDog ? parseFloat(formData.scoreDog) : 0,
                scoreSngd: formData.scoreSngd ? parseFloat(formData.scoreSngd) : 0,
                scoreSngg: formData.scoreSngg ? parseFloat(formData.scoreSngg) : 0,
                scoreLevsup: formData.scoreLevsup ? parseFloat(formData.scoreLevsup) : 0,
                scoreComlevd: formData.scoreComlevd ? parseFloat(formData.scoreComlevd) : 0,
                scoreComlevg: formData.scoreComlevg ? parseFloat(formData.scoreComlevg) : 0,
                scorePtose: formData.scorePtose ? parseFloat(formData.scorePtose) : 0,
                ita: formData.ita ? parseFloat(formData.ita) : 0,

                // Notes
                commentairesVol: formData.notes,
            };

            let newVolontaireId;

            if (isEditMode) {
                // Mode édition
                await api.volontaires.update(id, volontaireData);
                try {
                    await api.volontaires.updateDetails(id, detailsData);
                } catch (detailsError) {
                    console.warn('Erreur lors de la mise à jour des détails du volontaire:', detailsError);
                }

                setSuccessMessage('Volontaire mis à jour avec succès');
                newVolontaireId = id;
            } else {
                // Mode création
                try {
                    // Utiliser uniquement createDetails puisque ce DTO étend déjà le DTO de base
                    const response = await api.volontaires.createDetails({
                        ...volontaireData,
                        ...detailsData
                    });

                    newVolontaireId = response.data.id || response.data.idVol;
                    setSuccessMessage('Volontaire créé avec succès');
                } catch (error) {
                    console.error('Erreur lors de la création du volontaire:', error);
                    throw error;
                }
            }

            // Si isEmbedded est défini, utilisez la fonction de callback
            // sinon, naviguer vers la page détails
            if (props.isEmbedded && props.onSubmitSuccess && newVolontaireId) {
                setTimeout(() => {
                    if (props.onSubmitSuccess) {
                        props.onSubmitSuccess(newVolontaireId);
                    }
                }, 1000);
            } else if (newVolontaireId) {
                // Attendre un peu pour montrer le message de succès
                setTimeout(() => {
                    // Si onSubmitSuccess est fourni, l'appeler
                    if (props.onSubmitSuccess) {
                        props.onSubmitSuccess(newVolontaireId);
                    } else {
                        // Sinon, naviguer vers la page de détails
                        navigation.navigate('VolontaireDetails', { id: newVolontaireId });
                    }
                }, 1500);
            }

        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du volontaire:', error);
            setErrorMessage('Une erreur est survenue lors de l\'enregistrement du volontaire');

            // Faire défiler vers le haut pour voir l'erreur
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 0, animated: true });
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Rendu des sections de formulaire en fonction de l'onglet actif
    const renderTabContent = () => {
        switch (activeTab) {
            case 'infos-personnelles':
                return (
                    <View>
                        <Text style={styles.sectionTitle}>Informations personnelles</Text>
                        <View style={styles.gridContainer}>
                            <View style={styles.column}>
                                <FormField
                                    label="Titre"
                                    id="titre"
                                    type="select"
                                    value={formData.titre}
                                    onChange={handleChange}
                                    options={[
                                        'Madame',
                                        'Monsieur',
                                        'Autre',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Nom"
                                    id="nom"
                                    type="text"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                    error={errors.nom}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Prénom"
                                    id="prenom"
                                    type="text"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    required
                                    error={errors.prenom}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Email"
                                    id="email"
                                    type="text"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    error={errors.email}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Téléphone portable"
                                    id="telephone"
                                    type="text"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Téléphone fixe"
                                    id="telephoneDomicile"
                                    type="text"
                                    value={formData.telephoneDomicile}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Date de naissance"
                                    id="dateNaissance"
                                    type="date"
                                    value={formData.dateNaissance}
                                    onChange={handleChange}
                                    placeholder="Sélectionner une date"
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Sexe"
                                    id="sexe"
                                    type="select"
                                    value={formData.sexe}
                                    onChange={handleChange}
                                    required
                                    error={errors.sexe}
                                    options={[
                                        'Masculin',
                                        'Féminin',
                                        'O',
                                    ]}
                                />
                            </View>
                        </View>

                        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Adresse</Text>
                        <View style={styles.gridContainer}>
                            <View style={[styles.column, styles.fullWidth]}>
                                <FormField
                                    label="Adresse"
                                    id="adresse"
                                    type="text"
                                    value={formData.adresse}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Code postal"
                                    id="codePostal"
                                    type="text"
                                    value={formData.codePostal}
                                    onChange={handleChange}
                                    error={errors.codePostal}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Ville"
                                    id="ville"
                                    type="text"
                                    value={formData.ville}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Pays"
                                    id="pays"
                                    type="text"
                                    value={formData.pays}
                                    onChange={handleChange}
                                />
                            </View>
                        </View>
                    </View>
                );

            case 'caracteristiques':
                return (
                    <View>
                        <Text style={styles.sectionTitle}>Caractéristiques physiques</Text>
                        <View style={styles.gridContainer}>
                            <View style={styles.column}>
                                <FormField
                                    label="Taille (cm)"
                                    id="taille"
                                    type="number"
                                    value={formData.taille}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Poids (kg)"
                                    id="poids"
                                    type="number"
                                    value={formData.poids}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Phototype"
                                    id="phototype"
                                    type="select"
                                    value={formData.phototype}
                                    onChange={handleChange}
                                    options={[
                                        'I - Peau très claire',
                                        'II - Peau claire',
                                        'III - Peau claire à mate',
                                        'IV - Peau mate',
                                        'V - Peau foncée',
                                        'VI - Peau noire',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Ethnie"
                                    id="ethnie"
                                    type="select"
                                    value={formData.ethnie}
                                    onChange={handleChange}
                                    options={[
                                        'CAUCASIEN',
                                        'Caucasienne',
                                        'AFRICAIN',
                                        'Africaine',
                                        'ASIATIQUE',
                                        'HISPANIQUE',
                                        'MOYEN_ORIENT',
                                        'AUTRE',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Sous-ethnie"
                                    id="sousEthnie"
                                    type="text"
                                    value={formData.sousEthnie}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Couleur des yeux"
                                    id="yeux"
                                    type="select"
                                    value={formData.yeux}
                                    onChange={handleChange}
                                    options={[
                                        'Bleus',
                                        'Verts',
                                        'Marrons',
                                        'Noisette',
                                        'Gris',
                                        'Noirs',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Pilosité"
                                    id="pilosite"
                                    type="select"
                                    value={formData.pilosite}
                                    onChange={handleChange}
                                    options={[
                                        'Faible_pilosite',
                                        'Moyenne_pilosite',
                                        'Forte_pilosite',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Origine du père"
                                    id="originePere"
                                    type="text"
                                    value={formData.originePere}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Origine de la mère"
                                    id="origineMere"
                                    type="text"
                                    value={formData.origineMere}
                                    onChange={handleChange}
                                />
                            </View>
                        </View>
                    </View>
                );

            case 'peau':
                return (
                    <View>
                        <Text style={styles.sectionTitle}>Caractéristiques de la peau</Text>
                        <View style={styles.gridContainer}>
                            <View style={styles.column}>
                                <FormField
                                    label="Type de peau"
                                    id="typePeau"
                                    type="select"
                                    value={formData.typePeau}
                                    onChange={handleChange}
                                    required
                                    error={errors.typePeau}
                                    options={[
                                        'NORMALE',
                                        'SECHE',
                                        'GRASSE',
                                        'MIXTE',
                                        'SENSIBLE',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Carnation"
                                    id="carnation"
                                    type="select"
                                    value={formData.carnation}
                                    onChange={handleChange}
                                    options={[
                                        'Très claire',
                                        'Claire',
                                        'Moyenne',
                                        'Mate',
                                        'Foncée',
                                        'Très foncée',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Sensibilité cutanée"
                                    id="sensibiliteCutanee"
                                    type="select"
                                    value={formData.sensibiliteCutanee}
                                    onChange={handleChange}
                                    options={[
                                        'Peau sensible',
                                        'Peau peu sensible',
                                        'Peau non sensible',
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.checkboxGroup}>
                            <CheckboxField
                                label="Teint inhomogène"
                                id="teintInhomogene"
                                checked={formData.teintInhomogene === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Teint terne"
                                id="teintTerne"
                                checked={formData.teintTerne === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Pores visibles"
                                id="poresVisibles"
                                checked={formData.poresVisibles === 'Oui'}
                                onChange={handleChange}
                            />
                        </View>

                        <Text style={styles.subSectionTitle}>Exposition au soleil</Text>
                        <View style={styles.gridContainer}>
                            <View style={styles.column}>
                                <FormField
                                    label="Exposition solaire"
                                    id="expositionSolaire"
                                    type="select"
                                    value={formData.expositionSolaire}
                                    onChange={handleChange}
                                    options={[
                                        'Faiblement',
                                        'Moyennement',
                                        'Fortement',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Bronzage"
                                    id="bronzage"
                                    type="select"
                                    value={formData.bronzage}
                                    onChange={handleChange}
                                    options={[
                                        'Progressif',
                                        'Rapide',
                                        'Difficile',
                                        'Inexistant',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Coups de soleil"
                                    id="coupsDeSoleil"
                                    type="select"
                                    value={formData.coupsDeSoleil}
                                    onChange={handleChange}
                                    options={[
                                        'Jamais',
                                        'Rarement',
                                        'Parfois',
                                        'Souvent',
                                        'Toujours',
                                    ]}
                                />
                            </View>
                        </View>

                        <Text style={styles.subSectionTitle}>Cellulite</Text>
                        <View style={styles.checkboxGroup}>
                            <CheckboxField
                                label="Cellulite bras"
                                id="celluliteBras"
                                checked={formData.celluliteBras === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Cellulite fesses/hanches"
                                id="celluliteFessesHanches"
                                checked={formData.celluliteFessesHanches === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Cellulite jambes"
                                id="celluliteJambes"
                                checked={formData.celluliteJambes === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Cellulite ventre/taille"
                                id="celluliteVentreTaille"
                                checked={formData.celluliteVentreTaille === 'Oui'}
                                onChange={handleChange}
                            />
                        </View>

                        <Text style={styles.subSectionTitle}>Sécheresse cutanée</Text>
                        <View style={styles.checkboxGroup}>
                            <CheckboxField
                                label="Lèvres"
                                id="secheresseLevres"
                                checked={formData.secheresseLevres === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Cou"
                                id="secheresseCou"
                                checked={formData.secheresseCou === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Poitrine/Décolleté"
                                id="secheressePoitrineDecollete"
                                checked={formData.secheressePoitrineDecollete === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Ventre/Taille"
                                id="secheresseVentreTaille"
                                checked={formData.secheresseVentreTaille === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Fesses/Hanches"
                                id="secheresseFessesHanches"
                                checked={formData.secheresseFessesHanches === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Bras"
                                id="secheresseBras"
                                checked={formData.secheresseBras === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Mains"
                                id="secheresseMains"
                                checked={formData.secheresseMains === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Jambes"
                                id="secheresseJambes"
                                checked={formData.secheresseJambes === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Pieds"
                                id="secheressePieds"
                                checked={formData.secheressePieds === 'Oui'}
                                onChange={handleChange}
                            />
                        </View>

                        <Text style={styles.subSectionTitle}>Problèmes autour des yeux</Text>
                        <View style={styles.checkboxGroup}>
                            <CheckboxField
                                label="Cernes pigmentaires"
                                id="cernesPigmentaires"
                                checked={formData.cernesPigmentaires === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Cernes vasculaires"
                                id="cernesVasculaires"
                                checked={formData.cernesVasculaires === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Poches"
                                id="poches"
                                checked={formData.poches === 'Oui'}
                                onChange={handleChange}
                            />
                        </View>

                        <Text style={styles.subSectionTitle}>Perte de fermeté</Text>
                        <View style={styles.checkboxGroup}>
                            <CheckboxField
                                label="Visage"
                                id="perteDeFermeteVisage"
                                checked={formData.perteDeFermeteVisage === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Cou"
                                id="perteDeFermeteCou"
                                checked={formData.perteDeFermeteCou === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Décolleté"
                                id="perteDeFermeteDecollete"
                                checked={formData.perteDeFermeteDecollete === 'Oui'}
                                onChange={handleChange}
                            />
                        </View>
                    </View>
                );

            case 'marques-cutanees':
                return (
                    <View>
                        <Text style={styles.sectionTitle}>Marques cutanées</Text>

                        <Text style={styles.subSectionTitle}>Caractéristiques</Text>
                        <View style={styles.checkboxGroup}>
                            <CheckboxField
                                label="Cicatrices"
                                id="cicatrices"
                                checked={formData.cicatrices === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Tatouages"
                                id="tatouages"
                                checked={formData.tatouages === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Piercings"
                                id="piercings"
                                checked={formData.piercings === 'Oui'}
                                onChange={handleChange}
                            />
                        </View>

                        <Text style={styles.subSectionTitle}>Taches pigmentaires</Text>
                        <View style={styles.checkboxGroup}>
                            <CheckboxField
                                label="Visage"
                                id="tachesPigmentairesVisage"
                                checked={formData.tachesPigmentairesVisage === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Cou"
                                id="tachesPigmentairesCou"
                                checked={formData.tachesPigmentairesCou === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Décolleté"
                                id="tachesPigmentairesDecollete"
                                checked={formData.tachesPigmentairesDecollete === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Mains"
                                id="tachesPigmentairesMains"
                                checked={formData.tachesPigmentairesMains === 'Oui'}
                                onChange={handleChange}
                            />
                        </View>

                        <Text style={styles.subSectionTitle}>Vergetures</Text>
                        <View style={styles.checkboxGroup}>
                            <CheckboxField
                                label="Jambes"
                                id="vergeturesJambes"
                                checked={formData.vergeturesJambes === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Fesses/Hanches"
                                id="vergeturesFessesHanches"
                                checked={formData.vergeturesFessesHanches === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Ventre/Taille"
                                id="vergeturesVentreTaille"
                                checked={formData.vergeturesVentreTaille === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Poitrine/Décolleté"
                                id="vergeturesPoitrineDecollete"
                                checked={formData.vergeturesPoitrineDecollete === 'Oui'}
                                onChange={handleChange}
                            />
                        </View>
                    </View>
                );

            case 'cheveux':
                return (
                    <View>
                        <Text style={styles.sectionTitle}>Caractéristiques des cheveux</Text>
                        <View style={styles.gridContainer}>
                            <View style={styles.column}>
                                <FormField
                                    label="Couleur des cheveux"
                                    id="couleurCheveux"
                                    type="select"
                                    value={formData.couleurCheveux}
                                    onChange={handleChange}
                                    options={[
                                        'Blonds',
                                        'Bruns',
                                        'Chatains',
                                        'Noirs',
                                        'Roux',
                                        'Gris',
                                        'Blancs',
                                        'Colorés',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Longueur des cheveux"
                                    id="longueurCheveux"
                                    type="select"
                                    value={formData.longueurCheveux}
                                    onChange={handleChange}
                                    options={[
                                        'Courts',
                                        'Mi-longs',
                                        'Longs',
                                        'Très longs',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Nature des cheveux"
                                    id="natureCheveux"
                                    type="select"
                                    value={formData.natureCheveux}
                                    onChange={handleChange}
                                    options={[
                                        'Lisses',
                                        'Ondulés',
                                        'Bouclés',
                                        'Crépus',
                                        'Frisés',
                                        'Normaux',
                                        'Secs',
                                        'Gras',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Épaisseur des cheveux"
                                    id="epaisseurCheveux"
                                    type="select"
                                    value={formData.epaisseurCheveux}
                                    onChange={handleChange}
                                    options={[
                                        'Fins',
                                        'Moyens',
                                        'Épais',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Nature du cuir chevelu"
                                    id="natureCuirChevelu"
                                    type="select"
                                    value={formData.natureCuirChevelu}
                                    onChange={handleChange}
                                    options={[
                                        'Normal',
                                        'Sec',
                                        'Gras',
                                        'Mixte',
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.checkboxGroup}>
                            <CheckboxField
                                label="Cuir chevelu sensible"
                                id="cuirCheveluSensible"
                                checked={formData.cuirCheveluSensible === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Chute de cheveux"
                                id="chuteDeCheveux"
                                checked={formData.chuteDeCheveux === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Cheveux cassants"
                                id="cheveuxCassants"
                                checked={formData.cheveuxCassants === 'Oui'}
                                onChange={handleChange}
                            />
                        </View>

                        <Text style={styles.subSectionTitle}>Ongles</Text>
                        <View style={styles.checkboxGroup}>
                            <CheckboxField
                                label="Ongles cassants"
                                id="onglesCassants"
                                checked={formData.onglesCassants === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Ongles dédoublés"
                                id="onglesDedoubles"
                                checked={formData.onglesDedoubles === 'Oui'}
                                onChange={handleChange}
                            />
                        </View>
                    </View>
                );

            case 'cils':
                return (
                    <View>
                        <Text style={styles.sectionTitle}>Cils & sourcils</Text>

                        <Text style={styles.subSectionTitle}>Caractéristiques des cils</Text>
                        <View style={styles.gridContainer}>

                            <View style={styles.column}>
                                <FormField
                                    label="cils"
                                    id="Cils"
                                    type="select"
                                    value={formData.cils}
                                    onChange={handleChange}
                                    options={[
                                        'Noirs',
                                        'Bruns',
                                        'Châtains',
                                        'Blonds',
                                        'Rouxs',
                                        'Gris',
                                        'Colorés',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Épaisseur des cils"
                                    id="epaisseurCils"
                                    type="select"
                                    value={formData.epaisseurCils}
                                    onChange={handleChange}
                                    options={[
                                        'Fins',
                                        'Moyens',
                                        'Épais',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Longueur des cils"
                                    id="longueurCils"
                                    type="select"
                                    value={formData.longueurCils}
                                    onChange={handleChange}
                                    options={[
                                        'Courts',
                                        'Moyens',
                                        'Longs',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Courbure des cils"
                                    id="courbureCils"
                                    type="select"
                                    value={formData.courbureCils}
                                    onChange={handleChange}
                                    options={[
                                        'Droits',
                                        'Légèrement courbés',
                                        'Très courbés',
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.checkboxGroup}>
                            <CheckboxField
                                label="Cils abîmés"
                                id="cilsAbimes"
                                checked={formData.cilsAbimes === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Cils broussailleux"
                                id="cilsBroussailleux"
                                checked={formData.cilsBroussailleux === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Chute de cils"
                                id="chuteDeCils"
                                checked={formData.chuteDeCils === 'Oui'}
                                onChange={handleChange}
                            />
                        </View>

                        <Text style={styles.subSectionTitle}>Sourcils</Text>
                        <View style={styles.gridContainer}>
                            <View style={styles.column}>
                                <FormField
                                    label="Caractéristiques des sourcils"
                                    id="caracteristiqueSourcils"
                                    type="select"
                                    value={formData.caracteristiqueSourcils}
                                    onChange={handleChange}
                                    options={[
                                        'Fins',
                                        'Moyens',
                                        'Épais',
                                        'Clairsemés',
                                        'Fournis',
                                    ]}
                                />
                            </View>
                        </View>

                        <Text style={styles.subSectionTitle}>Lèvres</Text>
                        <View style={styles.gridContainer}>
                            <View style={styles.column}>
                                <FormField
                                    label="Type de lèvres"
                                    id="levres"
                                    type="select"
                                    value={formData.levres}
                                    onChange={handleChange}
                                    options={[
                                        'Fines',
                                        'Moyennes',
                                        'Pulpeuses',
                                        'Asymétriques',
                                    ]}
                                />
                            </View>
                        </View>
                    </View>
                );

            case 'problemes':
                return (
                    <View>
                        <Text style={styles.sectionTitle}>Problèmes spécifiques</Text>
                        <View style={styles.checkboxGroup}>
                            <CheckboxField
                                label="Acné"
                                id="acne"
                                checked={formData.acne === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Couperose / Rosacée"
                                id="couperoseRosacee"
                                checked={formData.couperoseRosacee === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Dermite séborrhéique"
                                id="dermiteSeborrheique"
                                checked={formData.dermiteSeborrheique === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Eczéma"
                                id="eczema"
                                checked={formData.eczema === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Psoriasis"
                                id="psoriasis"
                                checked={formData.psoriasis === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Angiome"
                                id="angiome"
                                checked={formData.angiome === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Pityriasis"
                                id="pityriasis"
                                checked={formData.pityriasis === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Vitiligo"
                                id="vitiligo"
                                checked={formData.vitiligo === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Mélanome"
                                id="melanome"
                                checked={formData.melanome === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Zona"
                                id="zona"
                                checked={formData.zona === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Herpès"
                                id="herpes"
                                checked={formData.herpes === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Pelade"
                                id="pelade"
                                checked={formData.pelade === 'Oui'}
                                onChange={handleChange}
                            />
                        </View>
                    </View>
                );

            case 'medical':
                return (
                    <View>
                        <Text style={styles.sectionTitle}>Informations médicales</Text>
                        <View style={styles.gridContainer}>
                            <View style={[styles.column, styles.fullWidth]}>
                                <FormField
                                    label="Traitement en cours"
                                    id="traitement"
                                    type="textarea"
                                    value={formData.traitement}
                                    onChange={handleChange}
                                    placeholder="Traitements médicaux en cours"
                                />
                            </View>

                            <View style={[styles.column, styles.fullWidth]}>
                                <FormField
                                    label="Anamnèse"
                                    id="anamnese"
                                    type="textarea"
                                    value={formData.anamnese}
                                    onChange={handleChange}
                                    placeholder="Antécédents médicaux"
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Contraception"
                                    id="contraception"
                                    type="select"
                                    value={formData.contraception}
                                    onChange={handleChange}
                                    options={[
                                        'Pilule',
                                        'Stérilet',
                                        'Implant',
                                        'Patch',
                                        'Autre',
                                        'Abstinence',
                                    ]}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Santé compatible"
                                    id="santeCompatible"
                                    type="select"
                                    value={formData.santeCompatible}
                                    onChange={handleChange}
                                    options={[
                                        'Oui',
                                        'Non',
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.checkboxGroup}>
                            <CheckboxField
                                label="Ménopause"
                                id="menopause"
                                checked={formData.menopause === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Bouffées de chaleur (ménopause)"
                                id="bouffeeChaleurMenaupose"
                                checked={formData.bouffeeChaleurMenaupose === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Traitement hormonal substitutif"
                                id="ths"
                                checked={formData.ths === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Réaction allergique"
                                id="reactionAllergique"
                                checked={formData.reactionAllergique === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Désensibilisation"
                                id="desensibilisation"
                                checked={formData.desensibilisation === 'Oui'}
                                onChange={handleChange}
                            />

                            <CheckboxField
                                label="Terrain atopique"
                                id="terrainAtopique"
                                checked={formData.terrainAtopique === 'Oui'}
                                onChange={handleChange}
                            />
                        </View>

                        <View style={[styles.column, styles.fullWidth]}>
                            <FormField
                                label="Allergies connues"
                                id="allergiesCommentaires"
                                type="textarea"
                                value={formData.allergiesCommentaires}
                                onChange={handleChange}
                                placeholder="Allergies connues (médicaments, aliments, autres substances)"
                            />
                        </View>
                    </View>
                );

            case 'mesures':
                return (
                    <View>
                        <Text style={styles.sectionTitle}>Mesures et valeurs</Text>

                        <Text style={styles.subSectionTitle}>Index d'hydratation</Text>
                        <View style={styles.gridContainer}>
                            <View style={styles.column}>
                                <FormField
                                    label="IH Bras droit"
                                    id="ihBrasDroit"
                                    type="number"
                                    value={formData.ihBrasDroit}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="IH Bras gauche"
                                    id="ihBrasGauche"
                                    type="number"
                                    value={formData.ihBrasGauche}
                                    onChange={handleChange}
                                />
                            </View>
                        </View>

                        <Text style={styles.subSectionTitle}>Scores d'évaluation</Text>
                        <View style={styles.gridContainer}>
                            <View style={styles.column}>
                                <FormField
                                    label="Score POD"
                                    id="scorePod"
                                    type="number"
                                    value={formData.scorePod}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Score POG"
                                    id="scorePog"
                                    type="number"
                                    value={formData.scorePog}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Score Front"
                                    id="scoreFront"
                                    type="number"
                                    value={formData.scoreFront}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Score Lion"
                                    id="scoreLion"
                                    type="number"
                                    value={formData.scoreLion}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Score PPD"
                                    id="scorePpd"
                                    type="number"
                                    value={formData.scorePpd}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Score PPG"
                                    id="scorePpg"
                                    type="number"
                                    value={formData.scorePpg}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Score DOD"
                                    id="scoreDod"
                                    type="number"
                                    value={formData.scoreDod}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Score DOG"
                                    id="scoreDog"
                                    type="number"
                                    value={formData.scoreDog}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Score SNGD"
                                    id="scoreSngd"
                                    type="number"
                                    value={formData.scoreSngd}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Score SNGG"
                                    id="scoreSngg"
                                    type="number"
                                    value={formData.scoreSngg}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Score LEVSUP"
                                    id="scoreLevsup"
                                    type="number"
                                    value={formData.scoreLevsup}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Score COMLEVD"
                                    id="scoreComlevd"
                                    type="number"
                                    value={formData.scoreComlevd}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Score COMLEVG"
                                    id="scoreComlevg"
                                    type="number"
                                    value={formData.scoreComlevg}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Score PTOSE"
                                    id="scorePtose"
                                    type="number"
                                    value={formData.scorePtose}
                                    onChange={handleChange}
                                />
                            </View>

                            <View style={styles.column}>
                                <FormField
                                    label="Score ITA"
                                    id="ita"
                                    type="number"
                                    value={formData.ita}
                                    onChange={handleChange}
                                />
                            </View>
                        </View>

                        <Text style={styles.subSectionTitle}>Autres</Text>
                        <View style={styles.gridContainer}>
                            <View style={styles.column}>
                                <FormField
                                    label="Nombre de cigarettes par jour"
                                    id="nbCigarettesJour"
                                    type="number"
                                    value={formData.nbCigarettesJour}
                                    onChange={handleChange}
                                />
                            </View>
                        </View>
                    </View>
                );

            case 'notes':
                return (
                    <View>
                        <Text style={styles.sectionTitle}>Notes et commentaires</Text>
                        <View style={styles.gridContainer}>
                            <View style={[styles.column, styles.fullWidth]}>
                                <FormField
                                    label="Notes"
                                    id="notes"
                                    type="textarea"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Commentaires, observations, études précédentes, etc."
                                    numberOfLines={6}
                                />
                            </View>
                        </View>
                    </View>
                );

            default:
                return null;
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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.select({ ios: 80, android: 80 })}
                style={{ flex: 1 }}>

                {/* En-tête */}
                <View style={styles.header}>
                    <View style={styles.headerTitleContainer}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Icon name="arrow-left" size={16} color="#2563EB" />
                            <Text style={styles.backButtonText}>Retour</Text>
                        </TouchableOpacity>
                        <View style={styles.titleContainer}>
                            {isEditMode ? (
                                <View style={styles.titleWithIcon}>
                                    <Icon name="edit" size={20} color="#2563EB" />
                                    <Text style={styles.title}>Modifier le volontaire</Text>
                                </View>
                            ) : (
                                <View style={styles.titleWithIcon}>
                                    <Icon name="user-plus" size={20} color="#2563EB" />
                                    <Text style={styles.title}>Ajouter un volontaire</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Messages d'erreur/succès */}
                {errorMessage ? (
                    <View style={styles.errorBanner}>
                        <Icon name="alert-circle" size={20} color="#B91C1C" />
                        <Text style={styles.errorBannerText}>{errorMessage}</Text>
                    </View>
                ) : null}

                {successMessage ? (
                    <View style={styles.successBanner}>
                        <Icon name="check-circle" size={20} color="#047857" />
                        <Text style={styles.successBannerText}>{successMessage}</Text>
                    </View>
                ) : null}

                <View style={{ flex: 1 }}>
                    {/* Navigation par onglets */}
                    <FormTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    {/* ScrollView modifié pour résoudre le problème de défilement */}
                    <ScrollView
                        ref={scrollViewRef}
                        style={{ flex: 1 }}
                        contentContainerStyle={{
                            ...styles.formScrollContent,
                            paddingBottom: 120 // Plus d'espace en bas
                        }}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        showsVerticalScrollIndicator={true}
                        scrollEnabled={true} // Explicitement activé
                        removeClippedSubviews={false} // Important pour les tablettes Android
                    >
                        {renderTabContent()}

                        {/* Espace supplémentaire en bas */}
                        <View style={{ height: 100 }} />
                    </ScrollView>


                    {/* Boutons d'action */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.cancelButtonText}>Annuler</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            disabled={isSaving}
                        >
                            <View style={styles.submitButtonContent}>
                                {isSaving ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" style={styles.buttonIcon} />
                                ) : (
                                    <Icon name="save" size={16} color="#FFFFFF" style={styles.buttonIcon} />
                                )}
                                <Text style={styles.submitButtonText}>
                                    {isSaving ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour' : 'Enregistrer')}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// Styles supplémentaires pour la tablette
const tabletStyles = StyleSheet.create({
    // Select amélioré
    selectButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        paddingHorizontal: 12,
    },

    // Modal picker
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    pickerModalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: 20,
    },
    pickerModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    pickerModalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    pickerModalCancel: {
        fontSize: 14,
        color: '#6B7280',
    },
    pickerModalDone: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2563EB',
    },
});

export default VolontaireForm;