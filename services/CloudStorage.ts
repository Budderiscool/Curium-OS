
import { User } from '../types';

class CloudStorageService {
  private endpoint = '/api/profile';

  async saveProfile(user: User): Promise<void> {
    // Save to LocalStorage for offline/fallback
    localStorage.setItem('curium_user', JSON.stringify(user));

    // Prepare for Cloudflare Workers / D1 integration
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
    const local = localStorage.getItem('curium_user');
    return local ? JSON.parse(local) : null;
  }
}

export const cloud = new CloudStorageService();
