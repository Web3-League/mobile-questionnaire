// styles.ts
import { StyleSheet, Dimensions } from 'react-native';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Check if device is a tablet
const isTablet = width >= 768;

// Define constants for sizes and margins based on device type
const SPACING = isTablet ? 16 : 12;
const FONT_SIZE_SMALL = isTablet ? 14 : 12;
const FONT_SIZE_NORMAL = isTablet ? 16 : 14;
const FONT_SIZE_LARGE = isTablet ? 18 : 16;
const FONT_SIZE_TITLE = isTablet ? 24 : 20;
const BORDER_RADIUS = 8;
const INPUT_HEIGHT = 50;
const BUTTON_HEIGHT = 52;
const TAB_HEIGHT = 56;

// Color palette
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

  // Header
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
    zIndex: 10,
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

  // Notification messages
  errorBanner: {
    backgroundColor: '#FEE2E2',
    padding: SPACING,
    borderRadius: BORDER_RADIUS,
    marginHorizontal: SPACING * 2,
    marginTop: SPACING,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorBannerText: {
    color: COLORS.error,
    fontSize: FONT_SIZE_NORMAL,
    marginLeft: SPACING,
    flex: 1,
  },
  successBanner: {
    backgroundColor: '#ECFDF5',
    padding: SPACING,
    borderRadius: BORDER_RADIUS,
    marginHorizontal: SPACING * 2,
    marginTop: SPACING,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successBannerText: {
    color: COLORS.success,
    fontSize: FONT_SIZE_NORMAL,
    marginLeft: SPACING,
    flex: 1,
  },

  // Main form container
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  formScrollContent: {
    padding: SPACING * 2,
  },

  // Tabs
  tabsWrapper: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 5,
  },
  tabsContainer: {
    height: TAB_HEIGHT,
  },
  tabsContentContainer: {
    paddingHorizontal: SPACING * 2,
  },
  tabButton: {
    paddingHorizontal: SPACING,
    paddingVertical: SPACING,
    marginRight: SPACING,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    height: TAB_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    borderBottomColor: COLORS.primary,
  },
  tabButtonText: {
    fontSize: FONT_SIZE_NORMAL,
    fontWeight: '500',
    color: COLORS.text.secondary,
    marginLeft: SPACING / 2,
  },
  activeTabButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  tabIcon: {
    marginRight: 4,
  },

  // Form section
  sectionTitle: {
    fontSize: FONT_SIZE_LARGE,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING,
    marginTop: SPACING,
  },
  subSectionTitle: {
    fontSize: FONT_SIZE_NORMAL,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginTop: SPACING * 1.5,
    marginBottom: SPACING / 2,
  },

  // Grid layout
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING / 2,
  },
  column: {
    width: isTablet ? '33.33%' : '50%',
    paddingHorizontal: SPACING / 2,
    marginBottom: SPACING,
  },
  fullWidth: {
    width: '100%',
  },

  // Form fields
  formField: {
    marginBottom: SPACING,
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
  inputText: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE_NORMAL,
    paddingVertical: (INPUT_HEIGHT - FONT_SIZE_NORMAL) / 2, // Center vertically
  },
  placeholderText: {
    color: COLORS.text.placeholder,
    fontSize: FONT_SIZE_NORMAL,
    paddingVertical: (INPUT_HEIGHT - FONT_SIZE_NORMAL) / 2, // Center vertically
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
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 12,
  },
  picker: {
    height: '100%',
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

  // Checkbox
  checkboxGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: SPACING,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING * 2,
    marginBottom: SPACING,
    minWidth: isTablet ? '30%' : '45%',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderRadius: 4,
    marginRight: SPACING / 2,
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
  },

  // Collapsible section
  collapsibleSection: {
    marginBottom: SPACING * 2,
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
  sectionContent: {
    padding: SPACING,
  },

  // Action buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: SPACING * 2,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
    paddingHorizontal: SPACING * 2,
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

  // Miscellaneous
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  bottomSpacer: {
    height: 40,
  },

  //erreur message
  labelRequired: {
    color: '#000',
    fontWeight: '600',
    marginBottom: 8,
  },
  labelRequiredAsterisk: {
    color: '#DC2626',
    fontWeight: '600',
  },
  formErrorBanner: {
    backgroundColor: '#FEE2E2',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  formErrorText: {
    color: '#B91C1C',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  formErrorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  formErrorTitle: {
    color: '#B91C1C',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  formErrorList: {
    marginLeft: 28,
  },
  formErrorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  formErrorItemText: {
    color: '#B91C1C',
    marginLeft: 4,
    fontSize: 13,
  },
});