import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  constructor(public afs: AngularFirestore) {}

  public getAllCombos() {
    return this.afs
      .doc(`lists/combos`)
      .snapshotChanges()
      .pipe(
        map((changes) => {
          let data = changes.payload.data();
          return data;
        })
      );
  }

  public updateCombo(values: any) {
    return new Observable<any>((observer) => {
      const docRef = this.afs.doc(`lists/combos`);
      docRef.update(values).then(
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
