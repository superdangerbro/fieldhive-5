'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { CircularProgress, Stack } from '@mui/material';
import { UserRole, UserRoles } from '@/services/base.service';

interface UserData {
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  userRole: UserRole;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  userRole: UserRoles.CLIENT,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubUser: (() => void) | undefined;

    if (user) {
      unsubUser = onSnapshot(doc(db, 'users', user.uid), (doc) => {
        if (doc.exists()) {
          setUserData(doc.data() as UserData);
        }
        setLoading(false);
      });
    } else {
      setUserData(null);
    }

    return () => {
      if (unsubUser) {
        unsubUser();
      }
    };
  }, [user]);

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      userRole: userData?.role || UserRoles.CLIENT,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
