import { EnumResource } from '../_i18n/resource/resource';
import { LocalizationService } from '../services/localization.service';

import * as FrForm from '@fr-widget/sdk/form';

export class DropdownHelper {

  public static getDropDownItemsFromEnumeration = <T>(enumeration: T, name: keyof EnumResource): FrForm.FrInputValueItem<number>[] => {

    const localizationService = LocalizationService.instance;
    const resource = localizationService.resource.enumResources[name];

    return Object.keys(enumeration as object)
      .filter(k => isNaN(Number(k)))
      .map((k, index) => {
        return ({
          order: index,
          selectable: true,
          key: (resource as any)[k.toCamelCase()] || k,
          value: (enumeration as any)[k]
        } as FrForm.FrInputValueItem<number>)
      });
  };
}
