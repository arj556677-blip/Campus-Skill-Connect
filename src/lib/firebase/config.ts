import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  getAdditionalUserInfo,
  Auth,
  UserCredential,
} from 'firebase/auth';

// Standard Firebase configuration with environment variables and safe fallback
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoPlaceholderApiKeyForCampusConnect2026',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'campus-skill-connect.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'campus-skill-connect',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'campus-skill-connect.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1029384756',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1029384756:web:abcdef1234567890',
};

// Singleton App initialization
export const firebaseApp: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Firebase Auth Instance
export const firebaseAuth: Auth = getAuth(firebaseApp);

// OAuth Providers
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: 'select_account' });

export const githubAuthProvider = new GithubAuthProvider();
githubAuthProvider.addScope('read:user');
githubAuthProvider.addScope('user:email');

export interface AuthResult {
  user?: any;
  githubUsername?: string | null;
  accessToken?: string | null;
  error?: string;
}

/**
 * Sign in using Firebase Google OAuth
 */
export async function signInWithFirebaseGoogle(): Promise<AuthResult> {
  try {
    const isMock = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('Placeholder');
    if (isMock) {
      // In local preview without configured production Firebase keys, return demo verified credential
      return {
        user: {
          uid: 'google-user-' + Date.now(),
          displayName: 'Google Verified Builder',
          email: 'builder@google.campus.edu',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          provider: 'google',
        },
      };
    }

    const credential: UserCredential = await signInWithPopup(firebaseAuth, googleAuthProvider);
    return { user: credential.user };
  } catch (err: unknown) {
    console.warn('[Firebase Google Auth]', err);
    const msg = err instanceof Error ? err.message : 'Google authentication failed';
    return { error: msg };
  }
}

/**
 * Sign in using Firebase GitHub OAuth
 * Automatically extracts the authenticated user's GitHub username and OAuth access token
 */
export async function signInWithFirebaseGithub(): Promise<AuthResult> {
  try {
    const isMock = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('Placeholder');
    if (isMock) {
      // In local preview without configured production Firebase keys, return demo verified credential
      return {
        user: {
          uid: 'github-user-' + Date.now(),
          displayName: 'GitHub Octocat Builder',
          email: 'octocat@github.campus.edu',
          photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          provider: 'github',
        },
        githubUsername: 'octocat',
      };
    }

    const credential: UserCredential = await signInWithPopup(firebaseAuth, githubAuthProvider);
    const githubOAuthCredential = GithubAuthProvider.credentialFromResult(credential);
    const additionalInfo = getAdditionalUserInfo(credential);

    return {
      user: credential.user,
      githubUsername: additionalInfo?.username || null,
      accessToken: githubOAuthCredential?.accessToken || null,
    };
  } catch (err: unknown) {
    console.warn('[Firebase GitHub Auth]', err);
    const msg = err instanceof Error ? err.message : 'GitHub authentication failed';
    return { error: msg };
  }
}

/**
 * Sign out of Firebase
 */
export async function signOutFirebase(): Promise<void> {
  try {
    await firebaseSignOut(firebaseAuth);
  } catch (err) {
    console.warn('[Firebase SignOut]', err);
  }
}
