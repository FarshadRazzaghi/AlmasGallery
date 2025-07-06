import { Pipe, PipeTransform } from '@angular/core';

import * as FrForm from '@fr-widget/sdk/form';

@Pipe({
  name: 'nameFromList',
  standalone: true,
})
export class NameFromListPipe implements PipeTransform {

  transform(value: number, dropDownItems: FrForm.FrInputValueItem<number>[]): string {
    return dropDownItems.find(x => x.value == value)?.key.toString() || value.toString();
  }
}
