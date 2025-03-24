import { Product } from "./product.model";

export interface SuggestionsResponse {
    suggestions: Product[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    categoriesWithCounts:any;
    colorsWithCounts:any
}
