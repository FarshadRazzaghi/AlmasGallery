import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, url } from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';

import { EnumGeneratorSchema } from './interfaces';

export function enumGenerator(options: EnumGeneratorSchema): Rule {
  return async () => {

    //process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

    try {
      var uri = new URL('http://127.0.0.100:5000/api/v2/enums');
      var response = await fetch(uri, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Basic ${btoa('Farshad:Pa$$w0rd')}`,
        },
      });

      const result = await response.json();
      const templateSource: Source = apply(
        url('./files'), [
        applyTemplates({
          classify: strings.classify,
          dasherize: strings.dasherize,
          camelize: strings.camelize,
          newDate: new Date().toISOString(),
          version: '1.0.0',
          data: result,
          name: "Enum"
        }),
        move(normalize(`/${options.path}/${strings.dasherize("Generated")}`))
      ]);

      return chain([mergeWith(templateSource, MergeStrategy.Overwrite)]);
    } catch (error: any) {
      throw error;
    }
  }
}
