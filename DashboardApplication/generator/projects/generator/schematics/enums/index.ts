import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, url } from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';

import { GeneratorSchema } from './interfaces';

export function enumGenerator(options: GeneratorSchema): Rule {
  return async () => {

    try {
      var uri = new URL('http://127.0.0.100:5000/api/v2/enums');
      var response = await fetch(uri, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Basic ${btoa('Farshad: Pa$$w0rd')}`,
        },
      });

      const result: { [key: string]: { name: string, value: string }[] } = await response.json();
      const templateSource: Source = apply(
        url('./files'), [
        applyTemplates({
          classify: strings.classify,
          dasherize: strings.dasherize,
          camelize: strings.camelize,
          data: result,
          name: "Enum"
        }),
        move(normalize(`/${options.path}/${strings.dasherize("Generated")}`))
      ]);

      return chain([mergeWith(templateSource, MergeStrategy.AllowOverwriteConflict)]);
    } catch (error: any) {
      throw error;
    }
  }
}
