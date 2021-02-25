import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
}
