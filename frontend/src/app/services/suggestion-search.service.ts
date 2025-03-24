import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuggestionsResponse } from './../../interfaces/suggestions.model';

@Injectable({
  providedIn: 'root'
})
export class SuggestionSearchService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private _httpClient: HttpClient) {}

  getSuggestion(query: string, filters: any = {}, page: number = 1, limit: number = 2): Observable<SuggestionsResponse> {
    let params = new HttpParams()
      .set('query', query)
      .set('page', page.toString() || '1')
      .set('limit', limit.toString() || '2');

    if (filters.color && filters.color.length) {
      params = params.set('color', filters.color.join(','));
    }
    if (filters.category && filters.category.length) {
      params = params.set('category', filters.category.join(','));
    }
    if (filters.gender && filters.gender.length) {
      params = params.set('gender', filters.gender.join(','));
    }
    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }

    return this._httpClient.get<SuggestionsResponse>(`${this.apiUrl}/search`, { params });
  }
}