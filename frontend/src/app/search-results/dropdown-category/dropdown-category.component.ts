import { Component, EventEmitter , Output , Input, OnInit, ElementRef, HostListener  } from '@angular/core';
import { Set } from '../../../interfaces/distinctAndCount.model';
@Component({
  selector: 'app-dropdown-category',
  templateUrl: './dropdown-category.component.html',
  styleUrl: './dropdown-category.component.css'
})
export class DropdownCategoryComponent implements OnInit{
@Input() totalCategories:Set[] =[]
@Output() categorySelected = new EventEmitter<string>
constructor(private elementRef: ElementRef) {} 
ngOnInit(): void {
}

@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  // If the click target is NOT inside this component, close the dropdown.
  if (!this.elementRef.nativeElement.contains(event.target)) {
    this.isOpen = false;
  }
}

isOpen:boolean =false
selectedCategory:string =''


toggleDropdown(event: MouseEvent){
  event.stopPropagation();
  this.isOpen = !this.isOpen
}
selectCategory(category:string){
  this.selectedCategory = category
  this.categorySelected.emit(category)
  this.isOpen = false;
}
}
