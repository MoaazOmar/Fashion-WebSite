import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-sort-dropdown',
  templateUrl: './sort-dropdown.component.html',
  styleUrl: './sort-dropdown.component.css'
})
export class SortDropdownComponent {
  isOpen: boolean = false;
  @Output() sortSelected = new EventEmitter<string>();
  constructor(private elementRef: ElementRef) {}
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectSort(sort: string): void {
    this.sortSelected.emit(sort);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

}
