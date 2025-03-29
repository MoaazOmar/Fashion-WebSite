import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  colors = [
    { name: 'black', class: 'black' },
    { name: 'white', class: 'white' },
    { name: 'red', class: 'red' },
    { name: 'blue', class: 'blue' },
    { name: 'green', class: 'green' },
    { name: 'yellow', class: 'yellow' },
    { name: 'purple', class: 'purple' },
    { name: 'orange', class: 'orange' },
    { name: 'pink', class: 'pink' },
    { name: 'teal', class: 'teal' },
    { name: 'gray', class: 'gray' },
    { name: 'brown', class: 'brown' },
    { name: 'navy', class: 'navy' },
    { name: 'lime', class: 'lime' },
    { name: 'magenta', class: 'magenta' },
    { name: 'cyan', class: 'cyan' },
    { name: 'olive', class: 'olive' },
    { name: 'maroon', class: 'maroon' }
  ];  
  genders = ['Male', 'Female', 'Special', 'all'];
  isDarkMode = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private themeService: ThemeService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      brand: [''],
      price: ['', Validators.required],
      stock: [0, Validators.min(0)], // Changed from quantity to stock
      season: [''],
      gender: [[]],
      description: [''],
      descriptionDetailed: [''],
      sizes: [[]],
      colors: [[]]
    });
  }

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
      document.body.classList.toggle('dark', isDark);
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files);
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => this.imagePreviews.push(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  updateSizes(event: Event, size: string): void {
    const sizes = this.productForm.get('sizes')?.value || [];
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      sizes.push(size);
    } else {
      const index = sizes.indexOf(size);
      if (index > -1) sizes.splice(index, 1);
    }
    this.productForm.patchValue({ sizes });
  }

  updateColors(event: Event, color: string): void {
    const colors = this.productForm.get('colors')?.value || [];
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      colors.push(color);
    } else {
      const index = colors.indexOf(color);
      if (index > -1) colors.splice(index, 1);
    }
    this.productForm.patchValue({ colors });
  }

  updateGender(event: Event, gender: string): void {
    const genders = this.productForm.get('gender')?.value || [];
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      genders.push(gender);
    } else {
      const index = genders.indexOf(gender);
      if (index > -1) genders.splice(index, 1);
    }
    this.productForm.patchValue({ gender: genders });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
      Object.keys(this.productForm.value).forEach(key => {
        if (key === 'sizes' || key === 'colors' || key === 'gender') {
          formData.append(key, JSON.stringify(this.productForm.value[key]));
        } else {
          formData.append(key, this.productForm.value[key]);
        }
      });
      this.selectedFiles.forEach(file => formData.append('image', file));

      this.adminService.addProduct(formData).subscribe({
        next: (response) => {
          console.log('Product added successfully', response);
          alert('Product added successfully!');
          this.resetForm();
        },
        error: (error) => console.error('Error adding product', error)
      });
    }
  }

  resetForm(): void {
    this.productForm.reset({
      name: '',
      category: '',
      brand: '',
      price: '',
      stock: 0, // Changed from quantity to stock
      season: '',
      gender: [],
      description: '',
      descriptionDetailed: '',
      sizes: [],
      colors: []
    });
    this.imagePreviews = [];
    this.selectedFiles = [];
    const fileInput = document.getElementById('product-images') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}