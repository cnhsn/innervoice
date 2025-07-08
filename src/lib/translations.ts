export type Language = 'en' | 'tr';

export interface Translations {
  // App Title and Description
  appTitle: string;
  appDescription: string;
  
  // Form Labels
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  mood: string;
  customMoodLabel: string;
  customMoodPlaceholder: string;
  
  // Mood Options
  moods: {
    happy: string;
    sad: string;
    anxious: string;
    stressed: string;
    excited: string;
    confused: string;
    lonely: string;
    grateful: string;
    angry: string;
    hopeful: string;
    other: string;
  };
  
  // Buttons
  generateInnerVoice: string;
  chatWithInnerVoice: string;
  createAnother: string;
  
  // Placeholders
  enterFirstName: string;
  enterLastName: string;
  selectMood: string;
  
  // Results Page
  yourInnerVoice: string;
  resultsDescription: string;
  inspirationalQuote: string;
  letterForYou: string;
  
  // Chat
  chatTitle: string;
  chatPlaceholder: string;
  thinking: string;
  
  // Theme
  lightMode: string;
  darkMode: string;
  
  // Loading and Error Messages
  generatingInnerVoice: string;
  errorOccurred: string;
  chatErrorMessage: string;
  
  // Specific API Error Messages
  rateLimitError: string;
  quotaExceededError: string;
  authenticationError: string;
  serviceUnavailableError: string;
  retryInSeconds: string;
  
  // Validation Messages
  nameRequired: string;
  surnameRequired: string;
  dateRequired: string;
  moodRequired: string;
  customMoodRequired: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // App Title and Description
    appTitle: 'InnerVoice',
    appDescription: 'Share a bit about yourself and receive personalized wisdom and comfort',
    
    // Form Labels
    firstName: 'First Name',
    lastName: 'Last Name',
    dateOfBirth: 'Date of Birth',
    mood: 'How are you feeling today?',
    customMoodLabel: 'Please describe how you\'re feeling',
    customMoodPlaceholder: 'Describe your current mood',
    
    // Mood Options
    moods: {
      happy: 'Happy',
      sad: 'Sad',
      anxious: 'Anxious',
      stressed: 'Stressed',
      excited: 'Excited',
      confused: 'Confused',
      lonely: 'Lonely',
      grateful: 'Grateful',
      angry: 'Angry',
      hopeful: 'Hopeful',
      other: 'Other',
    },
    
    // Buttons
    generateInnerVoice: 'Generate My InnerVoice',
    chatWithInnerVoice: 'Chat with Your Inner Voice',
    createAnother: 'Create Another',
    
    // Placeholders
    enterFirstName: 'Enter your first name',
    enterLastName: 'Enter your last name',
    selectMood: 'Select your mood',
    
    // Results Page
    yourInnerVoice: 'Your InnerVoice',
    resultsDescription: 'Here\'s what we have for you today',
    inspirationalQuote: 'Inspirational Quote',
    letterForYou: 'A Letter for You',
    
    // Chat
    chatTitle: 'Chat with Your Inner Voice',
    chatPlaceholder: 'Share what\'s on your mind...',
    thinking: 'Thinking...',
    
    // Theme
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    
    // Loading and Error Messages
    generatingInnerVoice: 'Generating your InnerVoice...',
    errorOccurred: 'An unexpected error occurred',
    chatErrorMessage: 'I\'m sorry, I\'m having trouble responding right now. Please try again.',
    
    // Specific API Error Messages
    rateLimitError: 'Rate limit exceeded. Please wait a moment before trying again.',
    quotaExceededError: 'API quota exceeded. Please check your account or try again later.',
    authenticationError: 'Authentication failed. Please check the configuration.',
    serviceUnavailableError: 'Service is temporarily unavailable. Please try again later.',
    retryInSeconds: 'Please try again in {seconds} seconds.',
    
    // Validation Messages
    nameRequired: 'First name is required',
    surnameRequired: 'Last name is required',
    dateRequired: 'Date of birth is required',
    moodRequired: 'Please select your mood',
    customMoodRequired: 'Please describe your mood',
  },
  
  tr: {
    // App Title and Description
    appTitle: 'İç Ses',
    appDescription: 'Kendiniz hakkında biraz bilgi paylaşın ve kişiselleştirilmiş bilgelik ve rahatlık alın',
    
    // Form Labels
    firstName: 'Ad',
    lastName: 'Soyad',
    dateOfBirth: 'Doğum Tarihi',
    mood: 'Bugün kendinizi nasıl hissediyorsunuz?',
    customMoodLabel: 'Lütfen nasıl hissettiğinizi açıklayın',
    customMoodPlaceholder: 'Şu anki ruh halinizi açıklayın',
    
    // Mood Options
    moods: {
      happy: 'Mutlu',
      sad: 'Üzgün',
      anxious: 'Endişeli',
      stressed: 'Stresli',
      excited: 'Heyecanlı',
      confused: 'Kafası Karışık',
      lonely: 'Yalnız',
      grateful: 'Minnettar',
      angry: 'Kızgın',
      hopeful: 'Umutlu',
      other: 'Diğer',
    },
    
    // Buttons
    generateInnerVoice: 'İç Sesimi Oluştur',
    chatWithInnerVoice: 'İç Sesinle Sohbet Et',
    createAnother: 'Yeni Bir Tane Oluştur',
    
    // Placeholders
    enterFirstName: 'Adınızı girin',
    enterLastName: 'Soyadınızı girin',
    selectMood: 'Ruh halinizi seçin',
    
    // Results Page
    yourInnerVoice: 'İç Sesiniz',
    resultsDescription: 'Bugün sizin için hazırladıklarımız',
    inspirationalQuote: 'İlham Verici Söz',
    letterForYou: 'Size Özel Mektup',
    
    // Chat
    chatTitle: 'İç Sesinizle Sohbet Edin',
    chatPlaceholder: 'Aklınızdan geçenleri paylaşın...',
    thinking: 'Düşünüyor...',
    
    // Theme
    lightMode: 'Açık Mod',
    darkMode: 'Koyu Mod',
    
    // Loading and Error Messages
    generatingInnerVoice: 'İç Sesiniz oluşturuluyor...',
    errorOccurred: 'Beklenmeyen bir hata oluştu',
    chatErrorMessage: 'Üzgünüm, şu anda yanıt vermekte zorlanıyorum. Lütfen tekrar deneyin.',
    
    // Specific API Error Messages
    rateLimitError: 'İstek sınırı aşıldı. Lütfen bir süre bekledikten sonra tekrar deneyin.',
    quotaExceededError: 'API kotası aşıldı. Lütfen hesabınızı kontrol edin veya daha sonra tekrar deneyin.',
    authenticationError: 'Kimlik doğrulama başarısız. Lütfen yapılandırmayı kontrol edin.',
    serviceUnavailableError: 'Hizmet geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
    retryInSeconds: 'Lütfen {seconds} saniye sonra tekrar deneyin.',
    
    // Validation Messages
    nameRequired: 'Ad gereklidir',
    surnameRequired: 'Soyad gereklidir',
    dateRequired: 'Doğum tarihi gereklidir',
    moodRequired: 'Lütfen ruh halinizi seçin',
    customMoodRequired: 'Lütfen ruh halinizi açıklayın',
  },
};
