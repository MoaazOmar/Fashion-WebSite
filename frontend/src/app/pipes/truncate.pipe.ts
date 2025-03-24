// truncate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, words: number): string {
    if (!value) return '';
    const wordArray = value.split(/\s+/); // Handle multiple spaces
    return wordArray.length > words 
      ? wordArray.slice(0, words).join(' ') + '...'
      : value;
  }
}