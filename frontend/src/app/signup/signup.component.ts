import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {  passwordsMatchValidator , strongPasswordValidator , noBadWordsDuringCreationUsername } from './customValidators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor( private router: Router , private _AuthService: AuthService) {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required , noBadWordsDuringCreationUsername()]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required ,strongPasswordValidator()]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: passwordsMatchValidator });
  }

  onSubmit() {
    const { username, email, password , confirmPassword } = this.signupForm.value;
    this._AuthService.signup(this.signupForm.value).subscribe({
      next: (response)=>{
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';
        setTimeout(()=> {
          this.router.navigate(['/login']);
        } , 1000)
  
      },
      error:(error) => {
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.successMessage = '';
          }
    })

    }
}
