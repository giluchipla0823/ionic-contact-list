/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild, Renderer2, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { GestureController, AnimationController, IonItem, Animation, Platform } from '@ionic/angular';
import { Contact } from '@interfaces/contact.interface';

const ANIMATION_BREAKPOINT = 70;

@Component({
  selector: 'app-swipe-contact-item',
  templateUrl: './swipe-contact-item.component.html',
  styleUrls: ['./swipe-contact-item.component.scss'],
})
export class SwipeContactItemComponent implements OnInit, AfterViewInit {
  @ViewChild(IonItem, { read: ElementRef }) item: ElementRef;
  @ViewChild('wrapper') wrapper: ElementRef;
  @ViewChild('trash', { read: ElementRef }) trashIcon: ElementRef;
  @ViewChild('favorite', { read: ElementRef }) favoriteIcon: ElementRef;

  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() favorite: EventEmitter<any> = new EventEmitter();
  @Input() contact: Contact;

  bigIcon = false;
  trashAnimation: Animation;
  favoriteAnimation: Animation;
  deleteAnimation: Animation;

  constructor(
    private router: Router,
    private gestureCtrl: GestureController,
    private animationCtrl: AnimationController,
    private renderer: Renderer2,
    private platform: Platform,
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.setupIconAnimations();
    const windowWidth = window.innerWidth;

    this.deleteAnimation = this.animationCtrl.create('delete-animation')
      .addElement(this.item.nativeElement)
      .duration(300)
      .easing('ease-out')
      .fromTo('height', 'var(--card-item-height)', '0');

    const moveGesture = this.gestureCtrl.create({
      el: this.item.nativeElement,
      gestureName: 'move',
      direction: 'x',
      threshold: 50,
      onWillStart: async () => {
        this.renderer.setStyle(this.item.nativeElement, 'will-change', 'transform');
      },
      onStart: ev => {
        this.renderer.setStyle(this.item.nativeElement, 'transition', '');
      },
      onMove: ev => {
        if (this.contact.isFavorite && ev.deltaX < 0 ) {
          return;
        }
        this.renderer.setStyle(this.item.nativeElement, 'transform', `translate3d(${ev.deltaX}px, 0, 0)`);
        this.renderer.addClass(this.item.nativeElement, 'rounded');

        if (ev.deltaX > 0) {
          this.renderer.setStyle(this.wrapper.nativeElement, 'background-color', 'var(--ion-color-primary)');
        } else if (ev.deltaX < 0) {
          this.renderer.setStyle(this.wrapper.nativeElement, 'background-color', 'green');
        }

        if (ev.deltaX > ANIMATION_BREAKPOINT && !this.bigIcon) {
          this.animateTrash(true);
        } else if (ev.deltaX > 0 && ev.deltaX < ANIMATION_BREAKPOINT && this.bigIcon) {
          this.animateTrash(false);
        }

        if (ev.deltaX < -ANIMATION_BREAKPOINT && !this.bigIcon) {
          this.animateFavorite(true);
        } else if (ev.deltaX < 0 && ev.deltaX > -ANIMATION_BREAKPOINT && this.bigIcon) {
          this.animateFavorite(false);
        }
      },
      onEnd: ev => {
        this.renderer.removeClass(this.item.nativeElement, 'rounded');
        this.renderer.setStyle(this.item.nativeElement, 'transition', '0.2s ease-out');
        this.renderer.setStyle(this.wrapper.nativeElement, 'background-color', '#FFF');

        if (ev.deltaX > ANIMATION_BREAKPOINT) {
          this.renderer.setStyle(this.item.nativeElement, 'transform', `translate3d(${windowWidth}px, 0, 0)`);
          this.deleteAnimation.play();
          this.deleteAnimation.onFinish(() => {
            this.delete.emit(true);
          });
        } else if (!this.contact.isFavorite && ev.deltaX < -ANIMATION_BREAKPOINT) {
          this.renderer.setStyle(this.item.nativeElement, 'transform', '');
          this.favorite.emit(true);
        } else {
          this.renderer.setStyle(this.item.nativeElement, 'transform', '');
        }
      }
    });
    moveGesture.enable();
  }

  setupIconAnimations(): void {
    this.trashAnimation = this.animationCtrl.create('trash-animation')
      .addElement(this.trashIcon.nativeElement)
      .duration(300)
      .easing('ease-in')
      .fromTo('transform', 'scale(1)', 'scale(1.7)');


    if (!this.contact.isFavorite) {
      this.favoriteAnimation = this.animationCtrl.create('favorite-animation')
      .addElement(this.favoriteIcon.nativeElement)
      .duration(300)
      .easing('ease-in')
      .fromTo('transform', 'scale(1)', 'scale(1.7)');
    }
  }

  openDetails(id: number): void {
    this.router.navigate(['/contact-details', id]);
  }

  animateTrash(zoomIn: boolean): void {
    this.bigIcon = zoomIn;
    if (zoomIn) {
      this.trashAnimation.direction('alternate').play();
    } else {
      this.trashAnimation.direction('reverse').play();
    }

    if (this.platform.is('capacitor')) {
      Haptics.impact({ style: ImpactStyle.Light });
    }
  }

  animateFavorite(zoomIn: boolean): void {
    this.bigIcon = zoomIn;
    if (zoomIn) {
      this.favoriteAnimation.direction('alternate').play();
    } else {
      this.favoriteAnimation.direction('reverse').play();
    }

    if (this.platform.is('capacitor')) {
      Haptics.impact({ style: ImpactStyle.Light });
    }
  }
}
