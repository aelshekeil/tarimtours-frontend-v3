import { createClient } from '@supabase/supabase-js';

import { API_URL } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

import {
  AuthResponse,
  TravelPackage,
  ESIMProduct,
  TravelAccessory,
  ApplicationSubmission,
  StrapiResponse,
} from './types';

class StrapiAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  setToken(token: string) {
    localStorage.setItem('supabase.auth.token', token);
  }

  removeToken() {
    localStorage.removeItem('supabase.auth.token');
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('supabase.auth.token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = new URL(endpoint, `${this.baseURL}/api/`).href;
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      let message = 'Something went wrong';
      if (typeof errorData === 'object' && errorData !== null) {
        message = errorData.message || errorData.error?.message || JSON.stringify(errorData);
      }
      throw new Error(message);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const { error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: 'http://localhost:5000/',
        data: {
          first_name: username,
          last_name: username,
          phone: '1234567890',
        },
      },
    });

    if (signUpError) {
      throw new Error(signUpError.message);
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (signInError) {
      throw new Error(signInError.message);
    }

    return {
      access_token: signInData.session?.access_token || '',
      refresh_token: signInData.session?.refresh_token || '',
      user: signInData.user,
    };
  }

  async login(identifier: string, password: string): Promise<AuthResponse> {
    console.log('Logging in with endpoint: auth/login');
    const response = await this.request<AuthResponse>('auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: identifier, password }),
    });
    this.setToken(response.access_token);
    return response;
  }

  async updateProfile(userId: string, data: any): Promise<any> {
    const { data: user, error } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: data }
    );

    if (error) {
      throw new Error(error.message);
    }

    return user;
  }

  async changePassword(password: string): Promise<any> {
    const { data: user, error } = await supabase.auth.updateUser({ password });

    if (error) {
      throw new Error(error.message);
    }

    return user;
  }

  async getTravelPackages(featuredOnly?: boolean): Promise<TravelPackage[]> {
    let endpoint = 'travel-packages?populate=cover_image';
    if (featuredOnly) {
      endpoint += '&filters[featured][$eq]=true';
    }

    const response = await this.get<StrapiResponse<TravelPackage>>(endpoint);

    return response.data;
  }

  async getESIMProducts(): Promise<ESIMProduct[]> {
    const response = await this.get<StrapiResponse<ESIMProduct>>('esim-products?populate=image');
    return response.data;
  }

  async getTravelAccessories(): Promise<TravelAccessory[]> {
    const response = await this.get<StrapiResponse<TravelAccessory>>('travel-accessories?populate=images');
    return response.data;
  }

  async submitVisaApplication(applicationData: any, files?: FileList): Promise<ApplicationSubmission> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(applicationData));

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    }

    const token = localStorage.getItem('supabase.auth.token');
    const response = await fetch(`${this.baseURL}/api/visa-applications`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit application');
    }

    const result = await response.json();
    return result.data as ApplicationSubmission;
  }

  async submitInternationalDrivingLicenseApplication(
    applicationData: { fullName: string; email: string; paymentStatus: 'pending' | 'completed' | 'failed' },
    files: { licenseFront: File; passportPage: File; personalPhoto: File }
  ): Promise<ApplicationSubmission> {
    const uploadedLicenseFront = await this.uploadFile(files.licenseFront);
    const uploadedPassportPage = await this.uploadFile(files.passportPage);
    const uploadedPersonalPhoto = await this.uploadFile(files.personalPhoto);

    const data = {
      ...applicationData,
      licenseFront: uploadedLicenseFront.id,
      passportPage: uploadedPassportPage.id,
      personalPhoto: uploadedPersonalPhoto.id,
      type: 'international-driving-license', // Set the type for tracking
    };

    const response = await this.post<{ data: ApplicationSubmission }>(
      'international-driving-license-applications',
      { data }
    );

    return response.data;
  }

  async trackApplication(type: string, trackingId: string): Promise<ApplicationSubmission | null> {
    const endpoint = `${type}-applications?filters[tracking_id][$eq]=${trackingId}`;
    const response = await this.get<StrapiResponse<ApplicationSubmission>>(endpoint);

    if (response.data.length === 0) return null;

    return response.data[0];
  }

  async uploadFile(file: File): Promise<{ id: number; url: string }> {
    const formData = new FormData();
    formData.append('files', file);

    const token = localStorage.getItem('supabase.auth.token');
    const response = await fetch(`${this.baseURL}/api/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const result = await response.json();
    return {
      id: result[0].id,
      url: `${this.baseURL}${result[0].url}`,
    };
  }
}

const strapiAPI = new StrapiAPI();
export default strapiAPI;
