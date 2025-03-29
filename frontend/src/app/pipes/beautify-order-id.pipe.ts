import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'beautifyOrderId'
})
export class BeautifyOrderIdPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return '';
    const firstEight = value.substr(0, 8).toUpperCase();
    return `ORD-${firstEight}`;
  }
}
