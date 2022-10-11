/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable arrow-body-style */
/* eslint-disable no-bitwise */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ContactService } from 'src/app/services/contact.service';
import { FormControl } from '@angular/forms';
import { finalize, takeUntil, map } from 'rxjs/operators';
import { Contact } from '@interfaces/contact.interface';
import { FavoriteService } from '@services/favorite.service';
import { Subject } from 'rxjs';
import { ToastService } from '@services/ui/toast.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  contacts: Array<Contact> = [];
  favorites: Array<Contact> = [];
  filterProperties: Array<string> = ['name', 'email', 'phone', 'username'];
  searchInput = new FormControl('');
  firstContactListLoaded = false;

  private toast: HTMLIonToastElement;
  private pageDestroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private cdr: ChangeDetectorRef,
    private contactService: ContactService,
    private favoriteService: FavoriteService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadContactList();

    this.favoriteService.favorites$
      .pipe(
        takeUntil(this.pageDestroyed$)
      )
      .subscribe(favorites => {
        this.favorites = favorites;
        this.contacts = this.mappingFavoriteContactList([...this.contacts]);
      });
  }

  get searchHasValueAndExistContacts(): boolean {
    return this.searchInput.value && this.contacts.length > 0;
  }

  get emptyResultsIcon(): string {
    return  this.searchHasValueAndExistContacts ? 'search-outline' : 'person-outline';
  }

  get emptyResultsMessage(): string {
    return  this.searchHasValueAndExistContacts ? `No hay resultados para "${this.searchInput.value}"` : 'No hay registro de contactos';
  }

  get emptyResultsAdditionalMessage(): string {
    return  this.searchHasValueAndExistContacts ? 'Comprueba la ortografía o prueba con una nueva búsqueda' : '';
  }

  doRefresh(ev: any) {
    setTimeout(() => {
      ev.target.complete();
      this.loadContactList();
    }, 2000);
  }

  removeContact(contact: Contact): void {
    this.contacts = this.contacts.filter(({ id }) => id !== contact.id);
    this.favoriteService.favorites$ = this.favorites.filter(({ id }) => id !== contact.id);
    this.cdr.detectChanges();

    this.showToast('Contacto eliminado');
  }

  async favoriteContact(contact: Contact) {
    contact.isFavorite = true;
    this.favoriteService.favorites$ = [...this.favorites, {...contact}];
    this.cdr.detectChanges();

    this.showToast('Agregado a favoritos');
  }

  addContact() {
    console.log('Add new contact');
  }

  private loadContactList(): void {
    this.contactService.getcontacts()
      .pipe(
        map(res => {
          return  this.mappingFavoriteContactList(res);
        }),
        finalize(() => {
          this.searchInput.patchValue('');
          this.firstContactListLoaded = true;
        }),
      )
      .subscribe(res => this.contacts = res);
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

  private mappingFavoriteContactList(data: Array<Contact>): Array<Contact> {
    return [...data].map(contact => {
      contact.isFavorite = this.favorites.some(({ id }) => id === contact.id);

      return contact;
    });
  }
}
