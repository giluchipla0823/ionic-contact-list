import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  pages: Array<any> = [
    { title: 'Contacts', url: '/tabs/contacts', icon: 'call' },
    { title: 'Favorites', url: '/tabs/favorites', icon: 'heart' },
    { title: 'Trash', url: '/tabs/contacts', icon: 'trash' }
  ];

  constructor() {}
}
