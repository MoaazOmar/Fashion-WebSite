import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Product } from '../../../interfaces/product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [];
  editForm: FormGroup;
  showModal: boolean = false;
  selectedProduct: Product | null = null;
  newImages: File[] = [];
  imagesToDelete: string[] = [];
  selectedFiles: File[] = [] // Add this to store actual files
  // Predefined options for sizes, colors, and genders
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

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    // Initialize the edit form with validators
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', Validators.required],
      quantity: [0, Validators.min(0)],
      description: [''],
      season: [''],
      sizes: [[]],
      colors: [[]],
      gender: [[]]
    });
  }

  // Lifecycle hook to fetch products on initialization
  ngOnInit() {
    this.fetchProducts();
  }

  // Fetch all products and map image URLs
  fetchProducts() {
    this.adminService.getAllProducts().subscribe(
      (products) => {
        this.products = products.map(product => ({
          ...product,
          image: product.image.map(img => `http://localhost:3000/images/${img}`)
        }));
      }
    );
  }

  // Open the edit modal and populate the form
  openEditModal(product: Product) {
    this.selectedProduct = product;

    this.editForm.patchValue({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      description: product.description || '',
      season: product.season || '',
      sizes: product.sizes || [],
      colors: product.colors || [],
      gender: product.gender || []
    });
    this.newImages = [];
    this.showModal = true;
  }

  // Close the modal and reset state
  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
    this.newImages = [];
    this.editForm.reset();
  }

  // Handle file input changes for new images
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.newImages = Array.from(input.files);
    }
  }

  // Toggle size selection
  toggleSize(size: string) {
    const sizes = this.editForm.get('sizes')?.value || [];
    const index = sizes.indexOf(size);
    if (index === -1) {
      sizes.push(size);
    } else {
      sizes.splice(index, 1);
    }
    this.editForm.patchValue({ sizes });
  }

  // Toggle color selection
  toggleColor(color: string) {
    const colors = this.editForm.get('colors')?.value || [];
    const index = colors.indexOf(color);
    if (index === -1) {
      colors.push(color);
    } else {
      colors.splice(index, 1);
    }
    this.editForm.patchValue({ colors });
  }

  // Toggle gender selection
  toggleGender(gender: string) {
    const genders = this.editForm.get('gender')?.value || [];
    const index = genders.indexOf(gender);
    if (index === -1) {
      genders.push(gender);
    } else {
      genders.splice(index, 1);
    }
    this.editForm.patchValue({ gender: genders });
  }

  // Update the product with form data
  updateProduct() {
    if (this.editForm.invalid || !this.selectedProduct) return;

    const formData = new FormData();
    formData.append('productId', this.selectedProduct._id);
    Object.keys(this.editForm.value).forEach(key => {
      if (key === 'sizes' || key === 'colors' || key === 'gender') {
        formData.append(key, JSON.stringify(this.editForm.value[key]));
      } else {
        formData.append(key, this.editForm.value[key]);
      }
    });
    this.newImages.forEach(file => formData.append('image', file));
    // Add images to delete
    if (this.imagesToDelete.length > 0) {
      formData.append('imagesToDelete', JSON.stringify(this.imagesToDelete));
    }

    this.adminService.updateProduct(this.selectedProduct._id, formData).subscribe(
      (response) => {
        console.log('Product updated:', response);
        this.fetchProducts();
        this.closeModal();
      },
      (error) => {
        console.error('Error updating product:', error);
      }
    );
  }
  removeImage(imagePath: string) {
    // Remove from display
    this.selectedProduct!.image = this.selectedProduct!.image.filter(img => img !== imagePath);

    // Extract filename from URL and add to deletion list
    const filename = imagePath.split('/').pop() ?? '';    
    this.imagesToDelete.push(filename);
  }

  // Determine product status based on quantity
  getStatus(quantity: number): string {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 30) return 'low-stock';
    return 'active';
  }
}