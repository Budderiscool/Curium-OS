
import { User } from '../types';

class CloudStorageService {
  private endpoint = '/api/profile';

  async saveProfile(user: User): Promise<void> {
    // Always update LocalStorage immediately for responsiveness
    localStorage.setItem('curium_user', JSON.stringify(user));

    // Sync to Cloudflare Workers KV
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (!response.ok) throw new Error('Cloud sync failed');
    } catch (e) {
      console.warn('Sync to Cloudflare Workers failed, staying local:', e);
    }
  }

  async loadProfile(): Promise<User | null> {
    // Attempt to load from cloud first
    try {
      const response = await fetch(this.endpoint);
      if (response.ok) {
        const cloudUser = await response.json();
        if (cloudUser) {
          localStorage.setItem('curium_user', JSON.stringify(cloudUser));
          return cloudUser;
        }
      }
    } catch (e) {
      console.warn('Load from cloud failed, using local fallback:', e);
    }

    // Fallback to LocalStorage
    const local = localStorage.getItem('curium_user');
    return local ? JSON.parse(local) : null;
  }
}

export const cloud = new CloudStorageService();
