import { Component, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
  animations: [
    trigger('floatAnimation', [
      state('void', style({ transform: 'translateY(50px)', opacity: 0 })),
      transition(':enter', [
        animate('800ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('checkmarkDraw', [
      transition(':enter', [
        style({ transform: 'scale(0) rotate(45deg)' }),
        animate('500ms 300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ transform: 'scale(1) rotate(45deg)' }))
      ])
    ])
  ]
})
export class SuccessComponent {
  @HostListener('window:resize')
  onResize() {
    // Handle responsive adjustments if needed
  }

  shareOnInstagram() {
    // Add social sharing logic
    console.log('Sharing to Instagram...');
  }

  continueShopping() {
    // Add navigation logic
    console.log('Continuing shopping...');
  }
}