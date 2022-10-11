import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactsPageRoutingModule } from './contacts-routing.module';

import { ContactsPage } from './contacts.page';
import { SharedDirectivesModule } from '../../../directives/shared-directives.module';
import { SharedComponentsModule } from '../../../components/shared-components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ContactsPageRoutingModule,
    SharedDirectivesModule,
    SharedComponentsModule,
    PipesModule
  ],
  declarations: [ContactsPage]
})
export class ConntactsPageModule {}
