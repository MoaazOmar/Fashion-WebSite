import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown-color',
  templateUrl: './dropdown-color.component.html',
  styleUrl: './dropdown-color.component.css'
})
export class DropdownColorComponent implements OnInit {
  @Input() FilteringColors: any[] = [];
  @Output() colorSelected = new EventEmitter<string>();

  ngOnInit(): void {
    
    document.addEventListener('click' , (event)=>{
      let dropdownContainer = document.querySelector('.dropdown-container')
      if(dropdownContainer && !dropdownContainer.contains(event.target as Node) ){
        this.isOpen = false
      }
    })
    
  }
  isOpen = false;
  selectedColor = '';

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    this.colorSelected.emit(color); // Emit the selected color to parent component
    this.isOpen = false; // Close the dropdown after selection
  }

}
