// Secure Authentication System
// Passwords are hashed and never stored in plain text

import { v4 as uuidv4 } from 'uuid';
import type { User, UserSession, ActivityLog } from '@/types/cms';

// Constants
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Storage keys
const USERS_KEY = 'cms_users';
const SESSION_KEY = 'cms_session';
const LOGIN_ATTEMPTS_KEY = 'cms_login_attempts';
const ACTIVITY_LOG_KEY = 'cms_activity_log';
const RESET_TOKENS_KEY = 'cms_reset_tokens';

// Simple hash function for browser compatibility
const hashPassword = (password: string): string => {
  // Create a simple but effective hash using multiple iterations
  let hash = 0;
  const salt = 'PakForcesPrep2024SecureSalt';
  const saltedPassword = password + salt;
  
  for (let i = 0; i < saltedPassword.length; i++) {
    const char = saltedPassword.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Add iteration rounds for better security
  for (let round = 0; round < 1000; round++) {
    hash = ((hash << 5) - hash) + round;
    hash = hash & hash;
  }
  
  return 'hash_' + Math.abs(hash).toString(16);
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// Default admin credentials
const DEFAULT_ADMIN_PASSWORD = 'admin_panel123';

// Initialize default admin user
export const initializeAuth = (): void => {
  if (typeof window === 'undefined') return;

  const users = getUsers();
  
  // Create default admin if no users exist
  if (users.length === 0) {
    const admin: User = {
      id: uuidv4(),
      email: 'meergyj@gmail.com',
      passwordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
      name: 'Administrator',
      role: 'admin',
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    saveUsers([admin]);
    logActivity({
      userId: admin.id,
      userName: admin.name,
      action: 'create',
      entityType: 'user',
      entityId: admin.id,
      entityName: admin.name,
      details: 'Default admin account created',
    });
  }
};

// Get all users
export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

// Save users
const saveUsers = (users: User[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Create new user (Registration)
export const registerUser = (
  email: string,
  password: string,
  name: string,
  role: User['role'] = 'editor'
): Promise<User> => {
  return new Promise((resolve, reject) => {
    const users = getUsers();
    
    // Check if email already exists
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      reject(new Error('Email already exists'));
      return;
    }

    // Validate password
    if (password.length < 6) {
      reject(new Error('Password must be at least 6 characters'));
      return;
    }

    const newUser: User = {
      id: uuidv4(),
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      name,
      role,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    users.push(newUser);
    saveUsers(users);

    logActivity({
      userId: newUser.id,
      userName: newUser.name,
      action: 'create',
      entityType: 'user',
      entityId: newUser.id,
      entityName: newUser.name,
      details: `User registered with role: ${role}`,
    });

    resolve(newUser);
  });
};

// Create new user (Admin only)
export const createUser = (
  email: string,
  password: string,
  name: string,
  role: User['role'] = 'editor'
): Promise<User> => {
  return registerUser(email, password, name, role);
};

// Update user
export const updateUser = (
  userId: string,
  updates: Partial<Omit<User, 'id' | 'passwordHash'>>
): User | null => {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);
  
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };
  saveUsers(users);

  logActivity({
    userId,
    userName: users[index].name,
    action: 'update',
    entityType: 'user',
    entityId: userId,
    entityName: users[index].name,
    details: 'User profile updated',
  });

  return users[index];
};

// Change password
export const changePassword = (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    const users = getUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      resolve(false);
      return;
    }

    // Verify current password
    if (!verifyPassword(currentPassword, user.passwordHash)) {
      resolve(false);
      return;
    }

    // Validate new password
    if (newPassword.length < 6) {
      resolve(false);
      return;
    }

    // Hash and save new password
    user.passwordHash = hashPassword(newPassword);
    saveUsers(users);

    logActivity({
      userId,
      userName: user.name,
      action: 'update',
      entityType: 'user',
      entityId: userId,
      entityName: user.name,
      details: 'Password changed',
    });

    resolve(true);
  });
};

// Reset password (for forgot password)
export const resetPassword = (token: string, newPassword: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    const tokens = JSON.parse(localStorage.getItem(RESET_TOKENS_KEY) || '{}');
    const resetData = tokens[token];

    if (!resetData || resetData.expiresAt < Date.now()) {
      resolve(false);
      return;
    }

    const users = getUsers();
    const user = users.find((u) => u.id === resetData.userId);

    if (!user) {
      resolve(false);
      return;
    }

    // Update password
    user.passwordHash = hashPassword(newPassword);
    saveUsers(users);

    // Remove used token
    delete tokens[token];
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));

    logActivity({
      userId: user.id,
      userName: user.name,
      action: 'update',
      entityType: 'user',
      entityId: user.id,
      entityName: user.name,
      details: 'Password reset via forgot password',
    });

    resolve(true);
  });
};

// Create password reset token
export const createPasswordResetToken = (email: string): string | null => {
  if (typeof window === 'undefined') return null;

  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) return null;

  const token = uuidv4();
  const tokens = JSON.parse(localStorage.getItem(RESET_TOKENS_KEY) || '{}');
  
  tokens[token] = {
    userId: user.id,
    email: user.email,
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
  };

  localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
  return token;
};

// Delete user
export const deleteUser = (userId: string): boolean => {
  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  
  if (!user) return false;

  const filtered = users.filter((u) => u.id !== userId);
  saveUsers(filtered);

  logActivity({
    userId,
    userName: user.name,
    action: 'delete',
    entityType: 'user',
    entityId: userId,
    entityName: user.name,
    details: 'User deleted',
  });

  return true;
};

// Get login attempts
const getLoginAttempts = (): Record<string, { count: number; lastAttempt: number }> => {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
  return data ? JSON.parse(data) : {};
};

// Save login attempts
const saveLoginAttempts = (attempts: Record<string, { count: number; lastAttempt: number }>): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
};

// Check if account is locked
const isAccountLocked = (email: string): boolean => {
  const attempts = getLoginAttempts();
  const userAttempts = attempts[email.toLowerCase()];
  
  if (!userAttempts) return false;
  
  if (userAttempts.count >= MAX_LOGIN_ATTEMPTS) {
    const timeSinceLastAttempt = Date.now() - userAttempts.lastAttempt;
    if (timeSinceLastAttempt < LOCKOUT_DURATION) {
      return true;
    }
    // Reset attempts after lockout duration
    delete attempts[email.toLowerCase()];
    saveLoginAttempts(attempts);
  }
  
  return false;
};

// Record failed login attempt
const recordFailedAttempt = (email: string): void => {
  const attempts = getLoginAttempts();
  const emailLower = email.toLowerCase();
  
  if (!attempts[emailLower]) {
    attempts[emailLower] = { count: 0, lastAttempt: 0 };
  }
  
  attempts[emailLower].count++;
  attempts[emailLower].lastAttempt = Date.now();
  saveLoginAttempts(attempts);
};

// Clear login attempts
const clearLoginAttempts = (email: string): void => {
  const attempts = getLoginAttempts();
  delete attempts[email.toLowerCase()];
  saveLoginAttempts(attempts);
};

// Login
export const login = (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const emailLower = email.toLowerCase();
    
    // Check if account is locked
    if (isAccountLocked(emailLower)) {
      const attempts = getLoginAttempts();
      const remainingTime = Math.ceil(
        (LOCKOUT_DURATION - (Date.now() - attempts[emailLower].lastAttempt)) / 60000
      );
      reject(new Error(`Account locked. Please try again in ${remainingTime} minutes.`));
      return;
    }

    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === emailLower);

    if (!user || !user.isActive) {
      recordFailedAttempt(emailLower);
      reject(new Error('Invalid email or password'));
      return;
    }

    // Verify password
    const isValid = verifyPassword(password, user.passwordHash);
    
    if (!isValid) {
      recordFailedAttempt(emailLower);
      reject(new Error('Invalid email or password'));
      return;
    }

    // Clear failed attempts
    clearLoginAttempts(emailLower);

    // Update last login
    user.lastLogin = new Date().toISOString();
    saveUsers(users);

    // Create session
    const session: UserSession = {
      userId: user.id,
      email: user.email,
      role: user.role,
      expiresAt: Date.now() + SESSION_DURATION,
    };
    saveSession(session);

    logActivity({
      userId: user.id,
      userName: user.name,
      action: 'login',
      entityType: 'user',
      entityId: user.id,
      entityName: user.name,
      details: 'User logged in',
    });

    resolve(user);
  });
};

// Logout
export const logout = (): void => {
  const session = getSession();
  if (session) {
    const user = getUsers().find((u) => u.id === session.userId);
    if (user) {
      logActivity({
        userId: user.id,
        userName: user.name,
        action: 'logout',
        entityType: 'user',
        entityId: user.id,
        entityName: user.name,
        details: 'User logged out',
      });
    }
  }
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
};

// Get current session
export const getSession = (): UserSession | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  
  const session: UserSession = JSON.parse(data);
  
  // Check if session is expired
  if (session.expiresAt < Date.now()) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
  
  return session;
};

// Save session
const saveSession = (session: UserSession): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const session = getSession();
  return session !== null;
};

// Check if user has required role
export const hasRole = (requiredRoles: User['role'][]): boolean => {
  const session = getSession();
  if (!session) return false;
  return requiredRoles.includes(session.role as User['role']);
};

// Get current user
export const getCurrentUser = (): User | null => {
  const session = getSession();
  if (!session) return null;
  
  const users = getUsers();
  return users.find((u) => u.id === session.userId) || null;
};

// Activity Logging
export const logActivity = (activity: Omit<ActivityLog, 'id' | 'timestamp' | 'ipAddress'>): void => {
  if (typeof window === 'undefined') return;
  
  const logs = getActivityLogs();
  const newLog: ActivityLog = {
    ...activity,
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    ipAddress: 'client-side',
  };
  
  logs.unshift(newLog);
  
  // Keep only last 1000 logs
  if (logs.length > 1000) {
    logs.pop();
  }
  
  localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(logs));
};

// Get activity logs
export const getActivityLogs = (limit: number = 100): ActivityLog[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(ACTIVITY_LOG_KEY);
  const logs = data ? JSON.parse(data) : [];
  return logs.slice(0, limit);
};

// Clear all activity logs
export const clearActivityLogs = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACTIVITY_LOG_KEY);
};

// Session renewal
export const renewSession = (): void => {
  const session = getSession();
  if (session) {
    session.expiresAt = Date.now() + SESSION_DURATION;
    saveSession(session);
  }
};

// Auto-renew session on activity
if (typeof window !== 'undefined') {
  ['click', 'keypress', 'scroll', 'mousemove'].forEach((event) => {
    window.addEventListener(event, () => {
      renewSession();
    }, { passive: true });
  });
}
