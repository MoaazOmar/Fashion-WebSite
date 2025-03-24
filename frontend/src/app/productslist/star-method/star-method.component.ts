import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-method',
  templateUrl: './star-method.component.html',
  styleUrl: './star-method.component.css'
})
export class StarMethodComponent {
  // @Input() rating: number = 3;
  @Output() ratingChange = new EventEmitter<number>();
  rating:number = 0;
  stars = [1, 2, 3, 4, 5];
  hoverRating: number = 0;

  setRating(value: number) {
    // this.rating = value;
    this.ratingChange.emit(value);
    this.hoverRating = 0; // Reset hover when rating is set
  }

  setHoverRating(value: number) {
    this.hoverRating = value;
  }

  clearHoverRating() {
    this.hoverRating = 0;
  }

  getDisplayRating(): string {
    return this.hoverRating > 0 ? this.hoverRating.toString() : this.rating.toString();
  }
}
