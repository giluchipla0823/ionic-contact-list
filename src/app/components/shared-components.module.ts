import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwipeContactItemComponent } from './swipe-contact-item/swipe-contact-item.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EmptyResultsComponent } from './empty-results/empty-results.component';

@NgModule({
  declarations: [
   SwipeContactItemComponent,
   EmptyResultsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [
    SwipeContactItemComponent,
    EmptyResultsComponent
  ]
})
export class SharedComponentsModule { }
