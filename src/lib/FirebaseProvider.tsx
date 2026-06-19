import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

interface FirebaseContextType {
  user: User | null;
  db: Firestore | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);

  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    if (token) {
      sessionStorage.setItem("oauth_access_token", token);
    } else {
      sessionStorage.removeItem("oauth_access_token");
    }
  };

  useEffect(() => {
    // Load cached token from session storage on init
    const cached = sessionStorage.getItem("oauth_access_token");
    if (cached) {
      setAccessTokenState(cached);
    }

    async function initFirebase() {
      try {
        const response = await fetch("/firebase-applet-config.json");
        if (!response.ok) throw new Error("Config not found");
        const config = await response.json();
        
        const app = initializeApp(config);
        const firestore = getFirestore(app, config.firestoreDatabaseId);
        const auth = getAuth(app);
        
        setDb(firestore);
        
        onAuthStateChanged(auth, (u) => {
          setUser(u);
          setLoading(false);
        });
      } catch (err) {
        console.error("Firebase init failed, using mock mode:", err);
        setLoading(false);
      }
    }
    initFirebase();
  }, []);

  const login = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/spreadsheets");
    provider.addScope("https://www.googleapis.com/auth/gmail.readonly");
    provider.addScope("https://www.googleapis.com/auth/gmail.send");
    
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setAccessToken(credential.accessToken);
      }
    } catch (e) {
      console.error("OAuth sign-in failed:", e);
      throw e;
    }
  };

  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setAccessToken(null);
  };

  return (
    <FirebaseContext.Provider value={{ user, db, loading, login, logout, accessToken, setAccessToken }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error("useFirebase must be used within FirebaseProvider");
  return context;
};
