import { apply, applyTemplates, chain, MergeStrategy, mergeWith, move, Rule, Source, url } from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';

import { InterfaceGeneratorSchema } from './interfaces';

export function endpointGenerator(options: InterfaceGeneratorSchema): Rule {
  return async () => {

    try {
      const rules: Rule[] = [];

      const helperFiles: Source = apply(
        url('./files/API-Helper'), [
        applyTemplates({
          newDate: new Date().toISOString(),
          version: '1.0.0',
        }),
        move(normalize(`/${options.path}/${strings.dasherize("Generated")}/helpers`))
      ]);
      rules.push(mergeWith(helperFiles, MergeStrategy.Overwrite));

      const response = await fetch(options.url);
      const json = await response.json();

      const schematics = await generateSchematics(json);
      const interfaceSource: Source = apply(
        url('./files/API-Interface'), [
        applyTemplates({
          newDate: new Date().toISOString(),
          version: '1.0.0',
          classify: strings.classify,
          dasherize: strings.dasherize,
          camelize: strings.camelize,
          formatEnumToJSDoc: formatEnumToJSDoc,
          formatInterfaceToJSDoc: formatInterfaceToJSDoc,
          data: schematics,
          name: "api-schematics"
        }),
        move(normalize(`/${options.path}/${strings.dasherize("Generated")}`))
      ]);
      rules.push(mergeWith(interfaceSource, MergeStrategy.Overwrite));

      const services = await generateHttpServices(json, '');
      Object.entries(services).forEach(([tag, methods]) => {
        const serviceSource: Source = apply(
          url('./files/API-SERVICE'), [
          applyTemplates({
            newDate: new Date().toISOString(),
            version: '1.0.0',
            classify: strings.classify,
            dasherize: strings.dasherize,
            camelize: strings.camelize,
            generateMethodSignature: generateMethodSignature,
            data: methods,
            serviceName: tag
          }),
          move(normalize(`/${options.path}/${strings.dasherize("Generated")}/services`))
        ]);

        rules.push(mergeWith(serviceSource, MergeStrategy.Overwrite));
      });

      return chain(rules);
    } catch (error: any) {
      throw error;
    }
  }
}

async function generateSchematics(json: any): Promise<any> {
  const components = json['components'];
  if (!components) return;

  const schemas = components['schemas'];
  if (!schemas) return;

  const listSchemas = [];
  for (const schemaName in schemas) {
    const schema = schemas[schemaName];
    const generatedSchema = generateSchema(schemaName, schema, json);
    if (generatedSchema) {
      listSchemas.push(generatedSchema);
    }
  }

  return listSchemas;
}

async function generateHttpServices(json: any, tagFilter: string = ''): Promise<any> {
  const paths = json['paths'];
  const pathMethods = [];
  const groupedByTags = new Map();

  for (const p in paths) {
    const path = paths[p];
    for (const method in path) {
      const operation = path[method];

      if (tagFilter && (!operation.tags || !operation.tags.includes(tagFilter))) {
        continue;
      }

      const parameters = getParameters(operation.parameters) || [];
      const requestBodyType = getRequestBody(operation);
      const responseType = getResponseType(operation);
      const methodName = toCamelCase(operation.operationId);

      const methodInfo = {
        name: methodName,
        path: p,
        method: method.toUpperCase(),
        tags: operation.tags || ['untagged'],
        description: operation.description || operation.summary || 'No description available',
        parameters: parameters.map((param) => ({
          name: toCamelCase(param.name),
          type: param.type,
          required: param.required,
          in: param.in,
          description: param.description,
        })),
        requestBody: requestBodyType
          ? {
            type: requestBodyType,
            required: operation.requestBody?.required || false,
          }
          : null,
        response: {
          type: responseType,
          isArray: isArrayResponse(operation.responses),
          successCode: getSuccessResponse(operation.responses)?.code,
        },
      };

      pathMethods.push(methodInfo);

      // Group by tags
      methodInfo.tags.forEach((tag: string) => {
        if (!groupedByTags.has(tag)) {
          groupedByTags.set(tag, []);
        }
        groupedByTags.get(tag).push(methodInfo);
      });
    }
  }

  return Object.fromEntries(groupedByTags);
}

function generateSchema(name: string, schema: any, json: any): any | null {
  if (!schema) return null;

  const description = schema.description || `No description available`;
  const kind = schema.enum ? 'enum' : 'interface';

  return {
    name,
    description,
    type: convertToTypeScriptType(schema, false),
    kind,
    values: kind === 'enum' ? generateEnumValues(schema) : generateInterfaceValues(schema, json),
  };
}

function getResponseType(operation: any): string {
  const successResponse = getSuccessResponse(operation.responses);
  if (!successResponse) return 'any';
  if (successResponse.code === '204') return 'void';

  const schema = successResponse.response.content?.['application/json']?.schema;
  if (!schema) return 'any';

  return convertToTypeScriptType(schema, true);
}

function getRequestBody(operation: any): string | null {
  if (!operation.requestBody) return null;

  const content = operation.requestBody.content['application/json'];
  if (!content?.schema) return null;

  if (content.schema['$ref']) {
    return `models.${content.schema['$ref'].split('/').pop()}`;
  }

  return 'any';
}

function getSuccessResponse(responses: any): { code: string; response: any } | null {
  if (!responses) return null;

  const successCodes = ['200', '201', '202', '204'];
  for (const code of successCodes) {
    if (responses[code]) {
      return { code, response: responses[code] };
    }
  }

  const other2XX = Object.keys(responses).find((code) => code.startsWith('2'));

  return other2XX ? { code: other2XX, response: responses[other2XX] } : null;
}

function generateEnumValues(schema: any): any[] {
  return schema.enum?.map((value: any, index: number) => ({
    value,
    type: typeof value,
    description: schema['x-enumDescriptions']?.[index + 1] || `Value ${value}`,
  })) || [];
}

function generateInterfaceValues(schema: any, json: any): any[] {
  if (!schema.properties) return [];

  return Object.entries(schema.properties).map(([key, prop]: [string, any]) => {
    let propertyDescription = prop.description;
    let propertyType = convertToTypeScriptType(prop, false);

    // Handle array property descriptions
    if (prop.type === 'array' && prop.items) {
      if (prop.items['$ref'] && !propertyDescription) {
        const refSchema = getRefSchema(prop.items['$ref'], json);
        propertyDescription = refSchema?.description;
        propertyType = `Array<${convertToTypeScriptType(prop.items, false)}>`;
      }
      propertyDescription = `${propertyDescription || 'items'}`;
    }
    // Handle regular $ref properties
    else if (prop['$ref'] && !propertyDescription) {
      const refSchema = getRefSchema(prop['$ref'], json);
      propertyDescription = refSchema?.description;
    }

    return {
      name: key,
      type: propertyType,
      description: propertyDescription || `No description available`,
      isRequired: (schema.required || []).includes(key),
    };
  });
}

function convertToTypeScriptType(schema: any, imported: boolean): string {
  if (!schema) return 'any';

  // Handle $ref types
  if (schema['$ref']) {
    return `${imported ? 'models.' : ''}${schema['$ref'].split('/').pop()}`;
  }

  // Handle arrays with enhanced support
  if (schema.type === 'array' && schema.items) {
    const itemType = convertToTypeScriptType(schema.items, imported);
    return `${itemType}[]`;
  }

  // Handle enums
  if (schema.enum) {
    return schema.enum.map((e: any) => (typeof e === 'string' ? `'${e}'` : e)).join(' | ');
  }

  // Handle objects with properties
  if (schema.type === 'object' && schema.properties) {
    const properties: any = Object.entries(schema.properties)
      .map(([key, prop]) => {
        const propType = convertToTypeScriptType(prop, imported);
        //const isRequired = (schema.required || []).includes(key);
        return `${toCamelCase(key)}${(<any>prop).nullable ? '?' : ''}: ${propType}`;
      })
      .join(';\n    ');
    return `{\n    ${properties}\n}`;
  }

  // Handle basic types
  const typeMapping: Record<string, string> = {
    integer: 'number',
    number: 'number',
    boolean: 'boolean',
    string: 'string',
    null: 'null',
    object: 'Record<string, any>',
  };

  return typeMapping[schema.type] || 'any';
}

function getParameters(parameters: any): any[] {
  if (!parameters) {
    return [];
  }

  const list = [];
  for (const parameter of parameters) {
    const paramType = getParameterType(parameter);
    list.push({
      name: parameter.name,
      type: paramType,
      required: parameter.required || false,
      in: parameter.in,
      description: parameter.description || '',
    });
  }

  return list;
}

function getParameterType(parameter: any): string {
  if (!parameter.schema) return 'any';
  return convertToTypeScriptType(parameter.schema, true);
}

function getRefSchema(ref: string, json: any): any {
  const refPath = ref.replace(/^#\//, '').split('/');
  return refPath.reduce((acc, key) => acc?.[key], json);
}

function formatEnumToJSDoc(schema: any): string {
  const enumDocs = schema.values.map((item: any) => ` * \`${item.value}\` - ${item.description}`).join('\n');

  return `/**
 * ${schema.description}
 *
 * Values:
${enumDocs}
 *
 * @type {${schema.type}}
 */
export type ${schema.name} = ${schema.type};`;
}

function formatInterfaceToJSDoc(schema: any): string {
  const propertyDocs = schema.values.map((prop: any) => ` * @property {${prop.type}} ${prop.isRequired ? prop.name : `[${prop.name}]`} - ${prop.description}`).join('\n');

  return `/**
 * ${schema.description}
 *
 * @interface ${schema.name}
${propertyDocs}
 */
export interface ${schema.name} ${schema.type}`;
}

function generateMethodSignature(operation: any): string {
  const parameters = operation.parameters || [];
  const requestBodyType = operation.requestBody?.type || '';
  const responseType = operation.response.type;
  const methodName = operation.name || operation.operationId;
  const formattedPath = operation.path.replace(/{([^}]+)}/g, '${$1}');

  // Build parameter string
  const methodParams = parameters
    .map((param: any) => `${toCamelCase(param.name)}${param.required ? '' : '?'}: ${param.type}`)
    .concat(requestBodyType && (operation.method.toLowerCase() === 'post' || operation.method.toLowerCase() === 'put') ? [`body: ${requestBodyType}`] : [])
    .filter(Boolean)
    .join(', ');

  const successResponse = getSuccessResponse(operation.responses);
  const responseSchema = successResponse?.response?.content?.['application/json']?.schema;
  const isArray = isArrayResponse(responseSchema);
  const is204 = successResponse?.code === '204';

  // Generate parameter descriptions
  const paramDescriptions = parameters
    .map((param: any) => ` * @param {${param.type}} ${toCamelCase(param.name)} - ${param.description || 'No description available'}`)
    .concat(requestBodyType ? [` * @param {${requestBodyType}} body - Request body`] : [])
    .join('\n');

  // Get operation description
  const description = operation.description || operation.summary || 'No description available';

  return `/**
  * ${description}
  * @method ${operation.method.toUpperCase()}
  * @path ${operation.path}
  ${paramDescriptions}
  * @returns {Promise<BaseHttpResponse<${responseType}>>} ${isArray ? 'Array of ' : ''}${responseType} response
  */
  public async ${methodName}(${methodParams}${methodParams.length > 0 ? ', ': ''}options?: RequestOptions): Promise<BaseHttpResponse<${responseType}>> {

    try {
      let url = \`${formattedPath}\`;
      ${getQueryParameterString(parameters)}

      const response = await firstValueFrom(
        this.${operation.method.toLowerCase()}<${requestBodyType ? requestBodyType + ', ' : ''}${responseType}>(
          url${(operation.method.toLowerCase() === 'post' || operation.method.toLowerCase() === 'put') && requestBodyType ? ', body' : ''}, undefined, options
        )
      );
      const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

      return {
        status: true,
        totalCount,
        data: ${is204 ? 'undefined' : isArray ? 'response.body || []' : 'response.body!'}
      };
    }
    catch (error: any) {
      return {
        status: false,
        errorCode: (error as HttpErrorResponse).status,
        message: (error as HttpErrorResponse).message || 'An error occurred',
      }
    }
  }`;
}

function getQueryParameterString(parameters: any[]): string {
  if (!parameters?.length) return '';

  const queryParams = parameters.filter((p) => p.in === 'query');
  if (!queryParams.length) return '';

  return `
        const queryString = HttpHelper.getQueryString({${queryParams.map((p) => toCamelCase(p.name)).join(', ')}});
        if (queryString) {
            url += \`?\${queryString}\`;
        }`;
}

function isArrayResponse(schema: any): boolean {
  return schema?.type === 'array' || (schema?.['$ref'] && schema?.['$ref'].includes('Array'));
}

function toCamelCase(str: string): string {
  return str.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')).replace(/^(.)/, (c) => c.toLowerCase());
}
