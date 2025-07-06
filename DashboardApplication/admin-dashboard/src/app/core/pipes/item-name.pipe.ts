import { Pipe, PipeTransform } from '@angular/core';
import { FrInputValueItem } from '@fr-widget/sdk/form';

@Pipe({
  name: 'itemName',
  standalone: true,
})
export class ItemNamePipe implements PipeTransform {

  transform(value: number, dropDownItems: FrInputValueItem<number>[]): string {
    return dropDownItems.find(x => x.value == value)?.key.toString() || value.toString();
  }

}
