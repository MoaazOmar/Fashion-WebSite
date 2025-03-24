import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-theater',
  templateUrl: './theater.component.html',
  styleUrl: './theater.component.css'
})
export class TheaterComponent implements OnInit {
  constructor(private route:ActivatedRoute){}
  selectedSection: string = 'one';
  bannerActive: boolean = false;
  activeItem: string = '';
  dynamicGender:string = 'all';
  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.dynamicGender = param['gender'] ||'all';
      
    })
  }
  // Update which banner section is active
  selectSection(section: string): void {
    this.selectedSection = section;
  }

  // Activate the banner and show corresponding content
  activateBanner(target: string, event: Event): void {
    event.preventDefault(); // Prevent default link behavior
    this.bannerActive = true;
    this.activeItem = target;
  }

  // Close the banner and hide content
  closeBanner(): void {
    this.bannerActive = false;
    this.activeItem = '';
  }
}
