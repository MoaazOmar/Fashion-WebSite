import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slider-fashion',
  templateUrl: './slider-fashion.component.html',
  styleUrls: ['./slider-fashion.component.css']
})
export class SliderFashionComponent implements OnInit {
  brands = [
    { name: 'Gucci', logoUrl: 'https://www.logo.wine/a/logo/Gucci/Gucci-Logo.wine.svg' },
    { name: 'Louis Vuitton', logoUrl: 'https://www.logo.wine/a/logo/Louis_Vuitton/Louis_Vuitton-Logo.wine.svg' },
    { name: 'Chanel', logoUrl: 'https://www.logo.wine/a/logo/Chanel/Chanel-Logo.wine.svg' },
    { name: 'Prada', logoUrl: 'https://th.bing.com/th/id/R.0fd1cf8d6d88b87b6c5772e728988fbf?rik=fE0%2bvzVjLN%2bo9w&pid=ImgRaw&r=0' },
    { name: 'Versace', logoUrl: 'https://th.bing.com/th/id/OIP.zKW4wn8Qc-cGa75qDVeWWgHaHa?rs=1&pid=ImgDetMain' },
    // Duplicate for seamless loop
    { name: 'Gucci', logoUrl: 'https://www.logo.wine/a/logo/Gucci/Gucci-Logo.wine.svg' },
    { name: 'Louis Vuitton', logoUrl: 'https://www.logo.wine/a/logo/Louis_Vuitton/Louis_Vuitton-Logo.wine.svg' },
    { name: 'Chanel', logoUrl: 'https://www.logo.wine/a/logo/Chanel/Chanel-Logo.wine.svg' },
    { name: 'Prada', logoUrl: 'https://th.bing.com/th/id/R.0fd1cf8d6d88b87b6c5772e728988fbf?rik=fE0%2bvzVjLN%2bo9w&pid=ImgRaw&r=0' },
    { name: 'Versace', logoUrl: 'https://th.bing.com/th/id/OIP.zKW4wn8Qc-cGa75qDVeWWgHaHa?rs=1&pid=ImgDetMain' }
  ];

  constructor() {}

  ngOnInit(): void {}
}