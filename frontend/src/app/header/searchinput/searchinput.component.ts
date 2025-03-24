import { Component, HostListener, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { SuggestionSearchService } from '../../services/suggestion-search.service';
import { Product } from '../../../interfaces/product.model';

@Component({
  selector: 'app-searchinput',
  templateUrl: './searchinput.component.html',
  styleUrls: ['./searchinput.component.css']
})
export class SearchinputComponent implements OnChanges , OnInit {
  @Input() isClicked: boolean = false;
  @Input() query: string = '';
  suggestions: Product[] = [];
  productDisplay = 10
  loading: boolean = false; // Add loading state

  constructor(private suggestionService: SuggestionSearchService,private renderer: Renderer2) {}
  ngOnInit(): void {
    this.headerScrolled();
  }
  @HostListener('window:scroll', [])
    onWindowScroll() {
      this.headerScrolled();
  }
  
  headerScrolled(){
    const container = document.querySelector('.container')
    if (container) {
      if (window.scrollY > 100) {
        this.renderer.addClass(container, 'header-scrolled');
       
      } else {
        this.renderer.removeClass(container, 'header-scrolled');
       
      }
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if(changes['query']) {
      const newQuery = changes['query'].currentValue;
      if(newQuery && newQuery.trim()) {
        this.loading = true; // Start loading
        this.fetchSuggestions(newQuery);
      } else {
        this.suggestions = [];
        this.loading = false;
      }
    }
  }

  fetchSuggestions(query: string) {
    this.suggestionService.getSuggestion(query, {}, 1, 10).subscribe({ 
      next: (response) => {
        this.suggestions = response.suggestions.map((product) => ({
          ...product,
          image: [`http://localhost:3000/images/${product.image}`]
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching suggestions:', err);
        this.suggestions = [];
        this.loading = false;
      }
    });
  }  
}