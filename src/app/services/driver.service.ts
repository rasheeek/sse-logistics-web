import { User } from './../types/user.type';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  constructor(private afs: AngularFirestore) {}

  public addUser(userDetails, email): Observable<any> {
    return new Observable<any>((observer) => {
      const docRef = this.afs.doc(`users/${email}`);
      docRef.set(userDetails).then(
        (res) => {
          observer.next(res);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  public getAlDrivers() {
    return this.afs
      .collection('users', (ref) =>
        ref.where('isAdmin', '==', false).where('isActive', '==', true)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as User;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  deleteUser(email: string) {
    return new Observable<any>((observer) => {
      const docRef = this.afs.doc(`users/${email}`);
      docRef.delete().then(
        (res) => {
          observer.next(res);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }
}
