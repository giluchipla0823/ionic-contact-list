/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable arrow-body-style */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: Array<any>, keyword: string, properties: Array<any>): Array<any> {
    const countProperties = properties?.length || 0;

    if (countProperties === 0 || !keyword) {
      return items;
    }

    return items.filter((item: any) => {
      let itemFound = false;

      for (let i = 0; i < countProperties; i++) {
        if (new RegExp(keyword, 'gi').test(item[properties[i]])) {
          itemFound = true;
          break;
        }
      }
      return itemFound;
    });
  }

}
