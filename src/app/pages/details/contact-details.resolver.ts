/* eslint-disable @typescript-eslint/no-shadow */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ContactService } from '@services/contact.service';
import { FavoriteService } from '@services/favorite.service';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class ContactDetailsResolver implements Resolve<any> {

    constructor(
        private contactService: ContactService,
        private favoriteService: FavoriteService
    ) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const { id } = route.params;

        return this.contactService.getContactById(Number(id))
            .pipe(
                map(contact => {
                    contact.isFavorite = this.favoriteService.getFavorites().some(({ id }) => id === contact.id);
                    return contact;
                })
            );
    }
}
