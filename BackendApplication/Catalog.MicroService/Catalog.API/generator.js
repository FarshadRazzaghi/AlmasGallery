console.clear();

const openApi = {
	openapi: '3.0.1',
	info: {
		title: 'Almas Gallery API reference',
		description: 'API endpoints for Almas Gallery',
		contact: {
			name: 'Farshad Razzaghi',
			url: 'https://github.com/FarshadRazzaghi',
			email: 'f.razaghi22@gmail.com',
		},
		version: '1.0.0',
	},
	paths: {
		'/api/v1/custom-field-groups': {
			get: {
				tags: ['CustomField Group'],
				summary: 'Get all CustomField Groups',
				description: 'Returns a list of custom field groups based on the provided filter, including their custom fields.',
				operationId: 'CustomFieldGroupGetList',
				parameters: [
					{
						name: 'IncludeCustomFields',
						in: 'query',
						schema: {
							type: 'boolean',
						},
					},
					{
						name: 'GroupType',
						in: 'query',
						schema: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/CustomFieldGroupEntityType',
							},
						},
					},
					{
						name: 'GroupName',
						in: 'query',
						schema: {
							type: 'array',
							items: {
								type: 'string',
							},
						},
					},
					{
						name: 'Page',
						in: 'query',
						schema: {
							type: 'integer',
							format: 'int32',
						},
					},
					{
						name: 'PageSize',
						in: 'query',
						schema: {
							type: 'integer',
							format: 'int32',
						},
					},
				],
				responses: {
					200: {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/CustomFieldGroupResponse',
									},
								},
							},
						},
					},
					400: {
						description: 'Bad Request',
					},
					401: {
						description: 'Unauthorized',
					},
					500: {
						description: 'Internal Server Error',
					},
				},
			},
			post: {
				tags: ['CustomField Group'],
				summary: 'Add CustomField Group',
				description: 'Inserts a new custom field group.',
				operationId: 'AddCustomFieldGroup',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/CustomFieldGroupRequest',
							},
						},
					},
					required: true,
				},
				responses: {
					201: {
						description: 'Created',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/CustomFieldGroupResponse',
								},
							},
						},
					},
					400: {
						description: 'Bad Request',
					},
					401: {
						description: 'Unauthorized',
					},
					500: {
						description: 'Internal Server Error',
					},
				},
			},
		},
		'/api/v1/custom-field-groups/{customFieldGroupId}': {
			get: {
				tags: ['CustomField Group'],
				summary: 'Get a CustomField Group',
				description: 'Returns a single custom field group by the given ID, including its custom fields.',
				operationId: 'CustomFieldGroupGetById',
				parameters: [
					{
						name: 'customFieldGroupId',
						in: 'path',
						required: true,
						schema: {
							type: 'integer',
							format: 'int64',
						},
					},
				],
				responses: {
					200: {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/CustomFieldGroupResponse',
								},
							},
						},
					},
					401: {
						description: 'Unauthorized',
					},
					404: {
						description: 'Not Found',
					},
					500: {
						description: 'Internal Server Error',
					},
				},
			},
			put: {
				tags: ['CustomField Group'],
				summary: 'Update CustomField Group',
				description: 'Updates an existing custom field group by the given ID.',
				operationId: 'UpdateCustomFieldGroup',
				parameters: [
					{
						name: 'customFieldGroupId',
						in: 'path',
						required: true,
						schema: {
							type: 'integer',
							format: 'int64',
						},
					},
				],
				requestBody: {
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/CustomFieldGroupRequest',
							},
						},
					},
					required: true,
				},
				responses: {
					200: {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/CustomFieldGroupResponse',
								},
							},
						},
					},
					400: {
						description: 'Bad Request',
					},
					401: {
						description: 'Unauthorized',
					},
					404: {
						description: 'Not Found',
					},
					500: {
						description: 'Internal Server Error',
					},
				},
			},
			delete: {
				tags: ['CustomField Group'],
				summary: 'Delete CustomField Group',
				description: 'Deletes an existing custom field group by the given ID.',
				operationId: 'DeleteCustomFieldGroup',
				parameters: [
					{
						name: 'customFieldGroupId',
						in: 'path',
						required: true,
						schema: {
							type: 'integer',
							format: 'int64',
						},
					},
				],
				responses: {
					204: {
						description: 'No Content',
					},
					400: {
						description: 'Bad Request',
					},
					404: {
						description: 'Not Found',
					},
					401: {
						description: 'Unauthorized',
					},
					500: {
						description: 'Internal Server Error',
					},
				},
			},
		},
		'/api/v1/product-categories': {
			get: {
				tags: ['Product Category'],
				summary: 'Get all Product Categories',
				description: 'Returns a list of product categories based on the provided filter, including their product categories.',
				operationId: 'ProductCategoryGetList',
				parameters: [
					{
						name: 'IncludeCustomFieldGroups',
						in: 'query',
						schema: {
							type: 'boolean',
						},
					},
					{
						name: 'Page',
						in: 'query',
						schema: {
							type: 'integer',
							format: 'int32',
						},
					},
					{
						name: 'PageSize',
						in: 'query',
						schema: {
							type: 'integer',
							format: 'int32',
						},
					},
				],
				responses: {
					200: {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/ProductCategoryResponse',
									},
								},
							},
						},
					},
					401: {
						description: 'Unauthorized',
					},
					500: {
						description: 'Internal Server Error',
					},
				},
			},
			post: {
				tags: ['Product Category'],
				summary: 'Add Product Category',
				description: 'Inserts a new product category.',
				operationId: 'AddProductCategory',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ProductCategoryRequest',
							},
						},
					},
					required: true,
				},
				responses: {
					201: {
						description: 'Created',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/ProductCategoryResponse',
								},
							},
						},
					},
					400: {
						description: 'Bad Request',
					},
					401: {
						description: 'Unauthorized',
					},
					500: {
						description: 'Internal Server Error',
					},
				},
			},
		},
		'/api/v1/product-categories/{productCategoryId}': {
			get: {
				tags: ['Product Category'],
				summary: 'Get a Product Category',
				description: 'Returns a single product category by the given ID, including its product categories.',
				operationId: 'ProductCategoryGetById',
				parameters: [
					{
						name: 'productCategoryId',
						in: 'path',
						required: true,
						schema: {
							type: 'integer',
							format: 'int64',
						},
					},
				],
				responses: {
					200: {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/ProductCategoryResponse',
								},
							},
						},
					},
					401: {
						description: 'Unauthorized',
					},
					404: {
						description: 'Not Found',
					},
					500: {
						description: 'Internal Server Error',
					},
				},
			},
			put: {
				tags: ['Product Category'],
				summary: 'Update Product Category',
				description: 'Updates an existing product category by the given ID.',
				operationId: 'UpdateProductCategory',
				parameters: [
					{
						name: 'productCategoryId',
						in: 'path',
						required: true,
						schema: {
							type: 'integer',
							format: 'int64',
						},
					},
				],
				requestBody: {
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ProductCategoryRequest',
							},
						},
					},
					required: true,
				},
				responses: {
					200: {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/ProductCategoryResponse',
								},
							},
						},
					},
					400: {
						description: 'Bad Request',
					},
					401: {
						description: 'Unauthorized',
					},
					404: {
						description: 'Not Found',
					},
					500: {
						description: 'Internal Server Error',
					},
				},
			},
			delete: {
				tags: ['Product Category'],
				summary: 'Delete Product Category',
				description: 'Deletes an existing product category by the given ID.',
				operationId: 'DeleteProductCategory',
				parameters: [
					{
						name: 'productCategoryId',
						in: 'path',
						required: true,
						schema: {
							type: 'integer',
							format: 'int64',
						},
					},
				],
				responses: {
					204: {
						description: 'No Content',
					},
					400: {
						description: 'Bad Request',
					},
					404: {
						description: 'Not Found',
					},
					401: {
						description: 'Unauthorized',
					},
					500: {
						description: 'Internal Server Error',
					},
				},
			},
		},
	},
	components: {
		schemas: {
			CustomFieldDataType: {
				type: 'integer',
			},
			CustomFieldGroupEntityType: {
				type: 'integer',
			},
			CustomFieldGroupLocationType: {
				type: 'integer',
			},
			CustomFieldGroupRequest: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
					},
					entityType: {
						$ref: '#/components/schemas/CustomFieldGroupEntityType',
					},
					customFields: {
						type: 'array',
						items: {
							$ref: '#/components/schemas/CustomFieldRequest',
						},
					},
				},
			},
			CustomFieldGroupResponse: {
				type: 'object',
				properties: {
					id: {
						type: 'integer',
						format: 'int64',
					},
					name: {
						type: 'string',
					},
					entityType: {
						$ref: '#/components/schemas/CustomFieldGroupEntityType',
					},
					customFields: {
						type: 'array',
						items: {
							$ref: '#/components/schemas/CustomFieldResponse',
						},
					},
				},
			},
			CustomFieldRequest: {
				type: 'object',
				properties: {
					id: {
						type: 'integer',
						format: 'int64',
					},
					uniqueId: {
						type: 'string',
						format: 'uuid',
					},
					name: {
						type: 'string',
					},
					dataType: {
						$ref: '#/components/schemas/CustomFieldGroupEntityType',
					},
					isActive: {
						type: 'boolean',
					},
					isRequired: {
						type: 'boolean',
					},
					helpText: {
						type: 'string',
						nullable: true,
					},
					placeHolder: {
						type: 'string',
						nullable: true,
					},
					initialValue: {
						type: 'string',
						nullable: true,
					},
					validation: {
						type: 'string',
						nullable: true,
					},
					parentUniqueId: {
						type: 'string',
						format: 'uuid',
						nullable: true,
					},
					parentCondition: {
						type: 'string',
						nullable: true,
					},
				},
			},
			CustomFieldResponse: {
				type: 'object',
				properties: {
					id: {
						type: 'integer',
						format: 'int64',
					},
					name: {
						type: 'string',
					},
					dataType: {
						$ref: '#/components/schemas/CustomFieldDataType',
					},
					isActive: {
						type: 'boolean',
					},
					isRequired: {
						type: 'boolean',
					},
					helpText: {
						type: 'string',
						nullable: true,
					},
					placeHolder: {
						type: 'string',
						nullable: true,
					},
					initialValue: {
						type: 'string',
						nullable: true,
					},
					validation: {
						type: 'string',
						nullable: true,
					},
					parentId: {
						type: 'integer',
						format: 'int64',
						nullable: true,
					},
					parentCondition: {
						type: 'string',
						nullable: true,
					},
				},
			},
			ProductCategoryCustomFieldGroupRequest: {
				type: 'object',
				properties: {
					id: {
						type: 'integer',
						format: 'int64',
					},
					isActive: {
						type: 'boolean',
					},
					customFieldGroupId: {
						type: 'integer',
						format: 'int64',
					},
					customFieldGroupLocation: {
						$ref: '#/components/schemas/CustomFieldGroupLocationType',
					},
				},
			},
			ProductCategoryCustomFieldGroupResponse: {
				type: 'object',
				properties: {
					id: {
						type: 'integer',
						format: 'int64',
					},
					name: {
						type: 'string',
					},
					customFieldGroupId: {
						type: 'integer',
						format: 'int64',
					},
					customFieldGroupLocation: {
						$ref: '#/components/schemas/CustomFieldGroupLocationType',
					},
					isActive: {
						type: 'boolean',
					},
				},
			},
			ProductCategoryRequest: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
					},
					description: {
						type: 'string',
					},
					parentId: {
						type: 'integer',
						format: 'int64',
						nullable: true,
					},
					customFieldGroups: {
						type: 'array',
						items: {
							$ref: '#/components/schemas/ProductCategoryCustomFieldGroupRequest',
						},
					},
				},
			},
			ProductCategoryResponse: {
				type: 'object',
				properties: {
					id: {
						type: 'integer',
						format: 'int64',
					},
					name: {
						type: 'string',
					},
					description: {
						type: 'string',
						nullable: true,
					},
					parentId: {
						type: 'integer',
						format: 'int64',
						nullable: true,
					},
					customFieldGroups: {
						type: 'array',
						items: {
							$ref: '#/components/schemas/ProductCategoryCustomFieldGroupResponse',
						},
					},
				},
			},
		},
		securitySchemes: {
			Authentication: {
				type: 'http',
				description: 'JWT Authorization header using the basic scheme.',
				scheme: 'basic',
				bearerFormat: 'Username:Password',
			},
		},
	},
	security: [
		{
			Authentication: [],
		},
	],
	tags: [
		{
			name: 'CustomField Group',
		},
		{
			name: 'Product Category',
		},
	],
};

const groupBy = function (xs, key) {
	return xs.reduce(function (rv, x) {
		(rv[x[key]] ??= []).push(x);
		return rv;
	}, {});
};

const getParameters = function (element) {
	const parameters = [];
	if (element.parameters) {
		const methodParameters = element.parameters.filter((x) => x.in == 'query' || x.in == 'path');
		if (methodParameters.length > 0) {
			for (let index = 0; index < methodParameters.length; index++) {
				const parameter = methodParameters[index];
				parameters.push({
					name: parameter.name,
					index: index,
					required: parameter.required ?? false,
					type: getType(parameter, 'parameter'),
				});
			}
		}
	}

	const requestBody = element.requestBody;
	if (requestBody) {
		const contentTypes = Object.values(requestBody.content);
		if (contentTypes.length > 0) {
			for (let index = 0; index < contentTypes.length; index++) {
				const parameter = contentTypes[index];
				parameters.push({
					name: 'model',
					index: index,
					required: requestBody.required ?? false,
					type: getType(parameter, 'requestBody'),
				});
			}
		}
	}

	return parameters;
};

const createMethodParameters = function (element) {
	const parameters = element.parameters;
	const parameterStringBuilder = [];
	if (parameters) {
		const methodParameters = parameters.filter((x) => x.in == 'query' || x.in == 'path');
		if (methodParameters.length > 0) {
			for (let index = 0; index < methodParameters.length; index++) {
				const parameter = methodParameters[index];
				parameterStringBuilder.push(`${parameter.name}${!parameter.required ? '?' : ''}: ${getType(parameter, 'parameter')}`);
			}
		}
	}

	const requestBody = element.requestBody;
	if (requestBody) {
		const contentTypes = Object.values(requestBody.content);
		if (contentTypes.length > 0) {
			for (let index = 0; index < contentTypes.length; index++) {
				const parameter = contentTypes[index];
				parameterStringBuilder.push(`requestBody${!requestBody.required ? '?' : ''}: ${getType(parameter, 'requestBody')}`);
			}
		}
	}

	return parameterStringBuilder.join(' ,');
};

const getType = function (element, parameterType) {
	let schema = element.schema;
	let type = schema.type;

	if (parameterType == 'parameter' && schema.items) {
		if (schema.items.$ref) {
			type = schema.items.$ref.replace('#/components/schemas/', '');
		} else {
			type = schema.items.type;
		}
	}

	if (parameterType == 'requestBody' && schema) {
		if (schema.$ref) {
			type = schema.$ref.replace('#/components/schemas/', '');
		} else {
			type = schema.type;
		}
	}

	if (type == 'array') {
		type = `${type}[]`;
	}

	if (type == 'integer') {
		type = 'number';
	}

	return type;
};

const paths = openApi.paths;
//console.log(paths);

const list = [];
for (const path in paths) {
	if (Object.prototype.hasOwnProperty.call(paths, path)) {
		const element = paths[path];
		for (const key in element) {
			if (Object.prototype.hasOwnProperty.call(element, key)) {
				const method = element[key];
				const model = method;
				model.method = key;
				model.path = path;
				method.groupName = method.tags ? method.tags[0] : 'Shared';
				list.push(model);
			}
		}
	}
}

const groupedList = Object.groupBy(list, (x) => x.groupName);
for (const key in groupedList) {
	var groupedString = '';
	if (Object.prototype.hasOwnProperty.call(groupedList, key)) {
		const element = groupedList[key];
		for (let index = 0; index < element.length; index++) {
			const child = element[index];
			const parameters = getParameters(child);
			console.log(parameters);

			var childString = `const ${child.operationId} = (${createMethodParameters(child)}) => {}`;
			//console.log(childString);
		}
	}
}
