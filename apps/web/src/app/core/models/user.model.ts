export type OnboardingStep = 'TOUR_PENDING' | 'PROFILE_PENDING' | 'COMPLETED';

export interface UserProfileData {
  taxId?: string; // CPF ou CNPJ
  phone?: string; // WhatsApp
  profession?: string; // Área de Atuação
  pixKey?: string; // Chave PIX Padrão
  companyName?: string; // Razão Social / Nome Fantasia
}

export interface UserSession extends UserProfileData {
  userId: string;
  name: string;
  email: string;
  role: string;
  onboardingStatus: OnboardingStep;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
    onboardingStatus?: OnboardingStep;
  };
}

