
import { OSStatus, User } from '../types';
import { fs } from './FileSystem';
import { cloud } from './CloudStorage';

class KernelService {
  private status: OSStatus = OSStatus.BOOTING;
  private currentUser: User | null = null;

  constructor() {
    this.load();
  }

  private async load() {
    this.currentUser = await cloud.loadProfile();
  }

  getStatus(): OSStatus {
    const integrity = fs.getIntegrityReport();
    if (!integrity.hasKernel) return OSStatus.FAILURE;
    return this.status;
  }

  setStatus(status: OSStatus) {
    this.status = status;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async login(user: User) {
    this.currentUser = user;
    await cloud.saveProfile(user);
  }

  async updateUser(updates: Partial<User>) {
    if (!this.currentUser) return;
    this.currentUser = { ...this.currentUser, ...updates };
    await cloud.saveProfile(this.currentUser);
    window.dispatchEvent(new CustomEvent('curium_user_updated'));
  }

  trackAppUsage(appId: string) {
    if (!this.currentUser) return;
    const stats = { ...this.currentUser.settings.usageStats };
    stats[appId] = (stats[appId] || 0) + 1;
    this.updateUser({ settings: { ...this.currentUser.settings, usageStats: stats } });
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('curium_user');
  }

  reinstall() {
    fs.reset();
    this.logout();
    this.status = OSStatus.OOBE;
    window.location.reload();
  }
}

export const kernel = new KernelService();
