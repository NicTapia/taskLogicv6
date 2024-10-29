import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);

  // ======================= Autenticacion =============================

    getAuth(){
      return getAuth();
    }

    // ======== Acceder ========
    singIn(user: User) {
      return signInWithEmailAndPassword(getAuth(), user.email, user.password);
    }


    // ======== Crear Usuario =======
    singUp(user: User) {
      return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
    }

    // ======== Actualizar Usuario =======
    updateUser(displayName: string) {
      return updateProfile(getAuth().currentUser, { displayName })
    }

    // ======== Enviar email para restablecer la contraseña =======
    sendRecoveryEmail(email: string) {
      return sendPasswordResetEmail(getAuth(), email);
    }

    // ======== Cerrar sesión =======
    signOut() {
      getAuth().signOut();
      localStorage.removeItem('user');
      this.utilsSvc.routerLink('/auth');
    }


    // ======================== Base de datos ==========================

    // ======= Obtener documentos de una coleccion ===========
    getCollectionData(path: string, collectionQuery?: any) {
      const ref = collection(getFirestore(), path);
      return collectionData(query(ref, collectionQuery), {idField: 'id'});
    }

    // ======= Setear un documento ===========
    setDocument(path: string, data: any) {
      return setDoc(doc(getFirestore(), path), data);
    }

    // ======= Obtener un documento ===========
    async getDocument(path: string) {
      return (await getDoc(doc(getFirestore(), path))).data();
    }

    // ======= Agregar documento ===========
    addDocument(path: string, data: any) {
      return addDoc(collection(getFirestore(), path), data);
    }

    // ======================== Almacenamiento ==========================

    // ======= Subir Imagen ===========
    async uploadImage(path: string, data_url: string) {
      return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
        return getDownloadURL(ref(getStorage(), path))
      })
    }

}
