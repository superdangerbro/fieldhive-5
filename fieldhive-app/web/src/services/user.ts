import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { UserRole, UserRoles } from './base.service';

interface CreateUserParams {
  email: string;
  password: string;
  role?: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  company?: string;
}

class UserService {
  async createUser({
    email,
    password,
    role = UserRoles.CLIENT,
    firstName,
    lastName,
    phoneNumber,
    company,
  }: CreateUserParams) {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Create user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      role,
      firstName,
      lastName,
      phoneNumber,
      company,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return userCredential.user;
  }
}

export const userService = new UserService();
