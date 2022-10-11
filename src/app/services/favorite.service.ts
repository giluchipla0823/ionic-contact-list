import { Injectable } from '@angular/core';
import { Contact } from '@interfaces/contact.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class FavoriteService {

    private favoritesSubject$: BehaviorSubject<Array<Contact>> = new BehaviorSubject<Array<Contact>>([]);

    private favorites: Array<Contact> = [];

    constructor() {

    }

    get favorites$(): Observable<Array<Contact>> {
        return this.favoritesSubject$.asObservable()
            .pipe(
                tap(res => this.favorites = res)
            );
    }

    set favorites$(values: any) {
        this.favoritesSubject$.next(values);
    }

    getFavorites(): Array<Contact> {
        return this.favorites;
    }
}
