import { Component, Input, Output, EventEmitter, HostBinding, HostListener, ElementRef } from '@angular/core';
import { Set } from '../../../interfaces/distinctAndCount.model';

@Component({
  selector: 'app-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.css'
})
export class FilterSidebarComponent {
  @Input() isOpen: boolean = false;
  @Input() FilteringColors: Set[] = [];
  @Input() totalCategories: Set[] = [];
  @Input() productPerPageHolder: number[] = [];
  @Input() selectedColors: string[] = [];
  @Input() selectedCategories: string[] = [];
  @Input() selectedGenders: string[] = [];
  @Input() itemsPerPage: number = 3;
  @Output() close = new EventEmitter<void>();
  @Output() colorSelected = new EventEmitter<string[]>();
  @Output() categorySelected = new EventEmitter<string[]>();
  @Output() genderSelected = new EventEmitter<string[]>();
  @Output() itemsPerPageSelected = new EventEmitter<number>();

  isItemsPerPageOpen: boolean = false;

  constructor(private elementRef: ElementRef) {}

  @HostBinding('class.active') get isActive() {
    return this.isOpen;
  }

  @HostListener('click', ['$event'])
  onHostClick(event: MouseEvent): void {
    if (event.target === this.elementRef.nativeElement) {
      this.close.emit();
    }
  }

  toggleColor(color: string): void {
    const index = this.selectedColors.indexOf(color);
    if (index === -1) {
      this.selectedColors.push(color);
    } else {
      this.selectedColors.splice(index, 1);
    }
    this.colorSelected.emit(this.selectedColors);
  }

  toggleCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index === -1) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.categorySelected.emit(this.selectedCategories);
  }

  toggleGender(gender: string): void {
    const index = this.selectedGenders.indexOf(gender);
    if (index === -1) {
      this.selectedGenders.push(gender);
    } else {
      this.selectedGenders.splice(index, 1);
    }
    this.genderSelected.emit(this.selectedGenders);
  }

  toggleItemsPerPageDropdown(event: MouseEvent): void {
    this.isItemsPerPageOpen = !this.isItemsPerPageOpen;
    event.stopPropagation();
  }

  selectItemsPerPage(option: number): void {
    this.itemsPerPage = option;
    this.itemsPerPageSelected.emit(option);
    this.isItemsPerPageOpen = false;
  }

  resetFilters(): void {
    console.log('Resetting filters...');
    this.selectedColors = [];
    this.selectedCategories = [];
    this.selectedGenders = [];
    this.itemsPerPage = 3;
    this.isItemsPerPageOpen = false;
    this.colorSelected.emit(this.selectedColors);
    this.categorySelected.emit(this.selectedCategories);
    this.genderSelected.emit(this.selectedGenders);
    setTimeout(() => {
      this.itemsPerPageSelected.emit(this.itemsPerPage);
      console.log('Reset complete: itemsPerPage =', this.itemsPerPage);
    }, 0); // Force into next tick
  }
  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isItemsPerPageOpen = false;
    }
  }
}