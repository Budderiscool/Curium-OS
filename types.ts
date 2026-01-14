import React from 'react';

export enum OSStatus {
  BOOTING = 'BOOTING',
  FAILURE = 'FAILURE',
  OOBE = 'OOBE',
  LOGIN = 'LOGIN',
  DESKTOP = 'DESKTOP'
}

export enum FileType {
  FILE = 'FILE',
  DIRECTORY = 'DIRECTORY',
  SYSTEM = 'SYSTEM',
  APP = 'APP'
}

export interface VFile {
  name: string;
  path: string;
  type: FileType;
  content?: string;
  icon?: string;
  isCritical?: boolean;
}

export interface User {
  username: string;
  passwordHash: string;
  theme: 'dark' | 'light';
  settings: {
    accentColor: string;
    wallpaper: string;
    glassOpacity: number;
    pinnedApps: string[];
    usageStats: Record<string, number>;
  };
  accessibility: {
    textScaling: number;
    highContrast: boolean;
    reducedMotion: boolean;
  };
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: string;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AppManifest {
  id: string;
  name: string;
  description: string;
  icon: string;
  component: React.FC<any>;
}