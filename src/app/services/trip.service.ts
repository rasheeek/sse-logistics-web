import { Trip } from './../types/trip.type';
import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  constructor(private afs: AngularFirestore) {}

  public getAlTrips() {
    return this.afs
      .collection('trips', (ref) => ref.orderBy('addedDate', 'asc'))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Trip;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  public getAlTripsByMonth(start, end) {
    return this.afs
      .collection('trips', (ref) =>
        ref
          .where('date', '>=', start)
          .where('date', '<=', end)
          .orderBy('date', 'asc')
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Trip;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  public getAllTripsByDate(start, end, unitNumber) {
    return this.afs
      .collection('trips', (ref) =>
        ref
          .where('date', '>=', start)
          .where('date', '<=', end)
          .where('unitNumber', '==', unitNumber)
          .orderBy('date', 'asc')
      )
      .get()
      .pipe(
        map((snapshot) => {
          let items = [];
          snapshot.docs.map((a) => {
            const data = a.data() as Trip;
            const id = a.id;
            items.push({ id, ...data });
          });
          return items;
        })
      );
  }

  public getTripById(id) {
    return new Observable<Trip>((observer) => {
      const docRef = this.afs.doc(`trips/${id}`);
      const userData = docRef.get().subscribe(
        (res: any) => {
          observer.next(res.data());
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }
}
