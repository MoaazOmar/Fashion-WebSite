export interface User {
    _id: any;
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface AuthResponse {
    message: string;
    user: User; // Use the User interface directly
  }