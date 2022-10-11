import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Contact } from '@interfaces/contact.interface';
import { FavoriteService } from '@services/favorite.service';
import { ToastService } from '@services/ui/toast.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit, OnDestroy {

  favorites: Array<Contact> = [];

  private toast: HTMLIonToastElement;
  private pageDestroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private favoriteService: FavoriteService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.favoriteService.favorites$
      .pipe(
        takeUntil(this.pageDestroyed$)
      )
      .subscribe(favorites => {
        this.favorites = favorites;

        console.log('favorites page', this.favorites);
      });
  }

  ngOnDestroy(): void {
    this.pageDestroyed$.next(true);
    this.pageDestroyed$.complete();
  }

  deleteFavorite(contact: Contact) {
    this.favoriteService.favorites$ = this.favorites.filter(({ id }) => id !== contact.id);
    this.cdr.detectChanges();

    this.showToast('Eliminado de favoritos');
  }

  private async showToast(message: string) {
    if (this.toast) {
      await this.toast.dismiss();
    }

    this.toast = await this.toastService.create(message);

    await this.toast.present();

    await this.toast?.onDidDismiss();

    this.toast = null;
  }

}
