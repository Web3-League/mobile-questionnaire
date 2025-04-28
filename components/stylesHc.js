import { StyleSheet, Dimensions } from 'react-native';

// Obtenir les dimensions de l'écran
const { width, height } = Dimensions.get('window');

// Vérifier si c'est une tablette (approche simple)
const isTablet = width >= 768;

// Définir des constantes pour les tailles et les marges adaptées aux tablettes
const SPACING = isTablet ? 16 : 12;
const FONT_SIZE_SMALL = isTablet ? 14 : 12;
const FONT_SIZE_NORMAL = isTablet ? 16 : 14;
const FONT_SIZE_LARGE = isTablet ? 18 : 16;
const FONT_SIZE_TITLE = isTablet ? 24 : 20;
const BORDER_RADIUS = 8;
const INPUT_HEIGHT = 50;
const BUTTON_HEIGHT = 52;

// Palette de couleurs
const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',
  secondary: '#64748B',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  error: '#DC2626',
  success: '#059669',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    placeholder: '#9CA3AF',
  }
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: SPACING * 4,
  },
  
  // En-tête
  header: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING,
    paddingHorizontal: SPACING * 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING * 2,
    paddingVertical: SPACING / 2,
    paddingHorizontal: SPACING,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE_NORMAL,
    fontWeight: '500',
    marginLeft: SPACING / 2,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE_TITLE,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: SPACING,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Navigation par switch
  switchNavContainer: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING * 2,
    marginBottom: SPACING,
  },
  switchNav: {
    flexDirection: 'row',
    height: 50,
  },
  switchNavButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING * 2,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeNavButton: {
    borderBottomColor: COLORS.primary,
  },
  switchNavButtonText: {
    fontSize: FONT_SIZE_NORMAL,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  activeNavButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  // Messages de notification
  errorBanner: {
    backgroundColor: '#FEE2E2',
    padding: SPACING,
    borderRadius: BORDER_RADIUS,
    marginHorizontal: SPACING * 2,
    marginTop: SPACING,
    marginBottom: SPACING,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorBannerText: {
    color: COLORS.error,
    fontSize: FONT_SIZE_NORMAL,
    marginLeft: SPACING,
    flex: 1,
  },
  
  // Container principal du formulaire
  formContainer: {
    paddingHorizontal: SPACING * 2,
  },
  
  // Carte d'info volontaire
  volontaireInfoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS,
    padding: SPACING,
    marginBottom: SPACING,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  volontaireAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING,
  },
  volontaireInfo: {
    flex: 1,
  },
  volontaireName: {
    fontSize: FONT_SIZE_LARGE,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  volontaireDetails: {
    fontSize: FONT_SIZE_SMALL,
    color: COLORS.text.secondary,
  },
  
  // Section pliable
  collapsibleSection: {
    marginBottom: SPACING * 1.5,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZE_LARGE,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: SPACING / 2,
  },
  sectionIcon: {
    marginRight: SPACING / 2,
  },
  sectionContent: {
    padding: SPACING,
  },
  
  // Disposition en grille
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING / 2,
  },
  column: {
    width: isTablet ? '33.33%' : '50%',
    paddingHorizontal: SPACING,
    marginBottom: SPACING,
  },
  
  // Titres de section
  subSectionTitle: {
    fontSize: FONT_SIZE_NORMAL,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING / 2,
    marginTop: SPACING / 2,
  },
  
  // Champs de formulaire
  formField: {
    marginBottom: SPACING * 1.5,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING / 2,
  },
  label: {
    fontSize: FONT_SIZE_NORMAL,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginRight: SPACING / 2,
  },
  required: {
    color: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE_SMALL,
    marginLeft: 'auto',
  },
  input: {
    height: INPUT_HEIGHT,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: SPACING,
    fontSize: FONT_SIZE_NORMAL,
    color: COLORS.text.primary,
    backgroundColor: COLORS.surface,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  textarea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: SPACING,
    paddingTop: SPACING,
    fontSize: FONT_SIZE_NORMAL,
    color: COLORS.text.primary,
    backgroundColor: COLORS.surface,
    textAlignVertical: 'top',
    minHeight: INPUT_HEIGHT * 3,
  },
  
  // Select/Picker
  selectContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS,
    backgroundColor: COLORS.surface,
    height: INPUT_HEIGHT,
    justifyContent: 'center',
  },
  picker: {
    height: INPUT_HEIGHT,
  },
  
  // Checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING / 2,
    paddingVertical: SPACING / 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderRadius: 4,
    marginRight: SPACING,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: FONT_SIZE_NORMAL,
    color: COLORS.text.primary,
    flex: 1,
  },
  
  // Section commentaires
  commentSection: {
    marginTop: SPACING,
    marginBottom: SPACING * 2,
    padding: SPACING,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  // Boutons d'action
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING * 2,
    marginBottom: SPACING * 4,
    padding: SPACING,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButton: {
    height: BUTTON_HEIGHT,
    paddingHorizontal: SPACING * 2,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING,
    backgroundColor: COLORS.surface,
  },
  cancelButtonText: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE_NORMAL,
    fontWeight: '500',
  },
  submitButton: {
    height: BUTTON_HEIGHT,
    paddingHorizontal: SPACING * 3,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: FONT_SIZE_NORMAL,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: SPACING / 2,
  },
  
  // Divers
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});