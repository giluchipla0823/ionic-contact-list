import { Injectable } from '@angular/core';
import { ToastOptions, ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(
        private toastCtrl: ToastController
    ) {

    }

    async create(message: string, duration: number = 1500, opts: ToastOptions = {}) {
        return await this.toastCtrl.create({ message, duration, ...opts });
    }
}
