/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AvatarUtil } from '@utils/avatar.util';
import { Contact } from '@interfaces/contact.interface';

const BASE_URL_API = 'https://jsonplaceholder.typicode.com';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private http: HttpClient
  ) { }

  getcontacts(): Observable<Array<Contact>> {
    return this.http.get<Array<Contact>>(`${BASE_URL_API}/users`)
      .pipe(
        map(contacts => contacts.map(contact => this.mappingContactData(contact)))
      );
  }

  getContactById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${BASE_URL_API}/users/${id}`)
      .pipe(
        map(contact => this.mappingContactData(contact))
      );
  }

  private mappingContactData(contact: Contact): Contact {
    const splitName = contact.name.split(' ');
    contact.color = AvatarUtil.intToRGB(AvatarUtil.hashCode(contact.name));
    contact.avatarLetter = `${splitName[0].charAt(0)}${splitName[1].charAt(0)}`.toUpperCase();
    contact.isFavorite = false;
    return contact;
  }
}
