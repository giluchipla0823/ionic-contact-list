/* eslint-disable @typescript-eslint/no-shadow */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contact } from '@interfaces/contact.interface';
import { FavoriteService } from '@services/favorite.service';
import { Subject } from 'rxjs';

import { EmailComposerOptions } from '@awesome-cordova-plugins/email-composer/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { ToastService } from '@services/ui/toast.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit, OnDestroy {
  contact: Contact;
  favorites: Array<Contact> = [];
  showwingToast = false;

  private pageDestroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private emailComposer: EmailComposer,
    private callNumber: CallNumber,
    private platform: Platform,
    private favoriteService: FavoriteService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.contact = this.route.snapshot.data.contact;

    this.favoriteService.favorites$.subscribe(favorites => this.favorites = favorites);
  }

  ngOnDestroy(): void {
    this.pageDestroyed$.next(true);
    this.pageDestroyed$.complete();
  }

  async openEmail() {
    console.log('openEmail');

    if (this.platform.is('capacitor')) {
      const email: EmailComposerOptions = {

        to: this.contact.email,
        subject: 'Importan Message',
        body: `Hey ${this.contact.name}, what do you thing about this image?`,
      };

      await this.emailComposer.open(email);
    } else {
      window.open(`mailto:${this.contact.email}`);
    }
  }

  call() {
    if (this.platform.is('capacitor')) {
       this.callNumber.callNumber(this.contact.phone, true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));
    } else {
      window.open(`tel:${this.contact.phone}`);
    }
  }

  toggleFavorite() {
    if (this.showwingToast) {
      return;
    }

    const isFavorite = !this.contact.isFavorite;

    const toastMessage = isFavorite ? 'Agregado a favoritos' : 'Eliminado de favoritos';

    this.contact.isFavorite = isFavorite;

    const index = this.favorites.findIndex(({ id }) => this.contact.id === id);

    if (index >= 0) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(this.contact);
    }

    this.favoriteService.favorites$ = [...this.favorites];

    this.showToast(toastMessage);
  }

  private async showToast(message: string) {

    this.showwingToast = true;

    const toast = await this.toastService.create(message);

    await toast.present();

    await toast.onDidDismiss();

    this.showwingToast = false;
  }
}
