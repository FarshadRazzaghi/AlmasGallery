using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Xml.Linq;

namespace Catalog.API.Helpers;

public class OpenApiSchemaTransformer : IOpenApiSchemaTransformer
{
    public Task TransformAsync(OpenApiSchema schema, OpenApiSchemaTransformerContext context, CancellationToken cancellationToken)
    {
        var type = context.JsonTypeInfo.Type;
        if (type.IsEnum)
        {
            schema.Format = "int32";
            schema.Enum = [.. Enum.GetValues(type)
                                  .Cast<object>()
                                  .Select(enumValue => new OpenApiObject
                                  {
                                      ["name"] = new OpenApiString(enumValue.ToString()),
                                      ["value"] = new OpenApiInteger(Convert.ToInt32(enumValue))
                                  })
                                  .Cast<IOpenApiAny>()];
        }

        if ((type.IsClass || type.IsEnum))
        {
            if (type.FullName == "Microsoft.AspNetCore.Mvc.ProblemDetails")
            {
                schema.Description = "A machine-readable format for specifying errors in HTTP API responses based on https://tools.ietf.org/html/rfc7807.";
            }

            if (type.Namespace != null && type.Namespace.Contains("Catalog."))
            {
                schema.Description = GetXmlDocumentation(type, "summary");
                AddPropertyDescriptions(schema, type);

                /*
                if (type.IsArray)
                {
                    var elementType = type.GetElementType();
                    if (elementType != null)
                    {
                        var exampleElement = GetExampleValueForType(elementType);
                        if (exampleElement != null)
                        {
                            var array = new OpenApiArray
                        {
                            exampleElement,
                            exampleElement
                        };
                            schema.Example = array;
                        }
                    }
                }
                else
                {
                    var exampleObject = Activator.CreateInstance(type);
                    if (exampleObject != null)
                    {
                        foreach (var property in type.GetProperties(BindingFlags.Public | BindingFlags.Instance))
                        {
                            var exampleValue = GetExampleValue(property);
                            if (exampleValue != null)
                            {
                                schema.Example ??= new OpenApiObject();
                                ((OpenApiObject)schema.Example)[property.Name] = exampleValue;
                            }
                        }
                    }
                }
                */
            }
        }

        return Task.CompletedTask;
    }

    private static void AddPropertyDescriptions(OpenApiSchema schema, Type type)
    {
        foreach (var property in type.GetProperties(BindingFlags.Public | BindingFlags.Instance))
        {
            if (IsSystemProperty(property))
            {
                continue;
            }

            schema.Properties ??= new Dictionary<string, OpenApiSchema>();

            var description = GetXmlDocumentation(property, "summary");

            var camelCaseName = ToCamelCase(property.Name);
            if (schema.Properties.TryGetValue(camelCaseName, out OpenApiSchema? value))
            {
                value.Description = description;
            }
            else
            {
                schema.Properties[camelCaseName] = new OpenApiSchema
                {
                    Description = description
                };
            }
        }
    }

    private static bool IsSystemProperty(PropertyInfo property)
    {
        // List of unwanted system-level properties
        var unwantedProperties = new[]
        {
            "Length", "LongLength", "Rank", "SyncRoot", "IsReadOnly", "IsFixedSize", "IsSynchronized"
        };

        return unwantedProperties.Contains(property.Name);
    }

    private static IOpenApiAny? GetExampleValue(PropertyInfo property)
    {
        if (property.PropertyType == typeof(string))
        {
            return new OpenApiString("ExampleString");
        }
        if (property.PropertyType == typeof(int) || property.PropertyType == typeof(long))
        {
            return new OpenApiInteger(123);
        }
        if (property.PropertyType == typeof(bool))
        {
            return new OpenApiBoolean(true);
        }
        if (property.PropertyType.IsEnum)
        {
            var enumValue = Enum.GetValues(property.PropertyType).Cast<object>().FirstOrDefault();
            return enumValue != null ? new OpenApiString(enumValue.ToString()!) : null;
        }
        if (property.PropertyType == typeof(Guid))
        {
            return new OpenApiString(Guid.NewGuid().ToString());
        }

        if (property.PropertyType.IsArray)
        {
            var elementType = property.PropertyType.GetElementType();
            if (elementType != null)
            {
                var exampleElement = GetExampleValueForType(elementType);
                if (exampleElement != null)
                {
                    var array = new OpenApiArray
                    {
                        exampleElement,
                        exampleElement
                    };
                    return array;
                }
            }
        }

        return null;
    }

    private static IOpenApiAny? GetExampleValueForType(Type type)
    {
        // Handle common types for array elements
        if (type == typeof(string))
        {
            return new OpenApiString("ExampleString");
        }
        if (type == typeof(int) || type == typeof(long))
        {
            return new OpenApiInteger(123);
        }
        if (type == typeof(bool))
        {
            return new OpenApiBoolean(true);
        }
        if (type.IsEnum)
        {
            var enumValue = Enum.GetValues(type).Cast<object>().FirstOrDefault();
            return enumValue != null ? new OpenApiString(enumValue.ToString()!) : null;
        }
        if (type == typeof(Guid))
        {
            return new OpenApiString(Guid.NewGuid().ToString());
        }

        // Default to null for unsupported types
        return null;
    }

    private static string? GetXmlDocumentation(MemberInfo member, string tagName)
    {
        string memberName;

        if (member is Type type)
        {
            memberName = $"T:{type.FullName}";
        }
        else if (member is PropertyInfo property)
        {
            memberName = $"P:{property.DeclaringType?.FullName}.{property.Name}";
        }
        else
        {
            return null; // Unsupported member type
        }

        var xmlComments = LoadXmlComments(member.DeclaringType ?? (Type)member);
        var memberElement = xmlComments.Descendants("member").FirstOrDefault(m => m.Attribute("name")?.Value == memberName);
        return memberElement?.Element(tagName)?.Value.Trim();
    }

    private static XDocument LoadXmlComments(Type type)
    {
        var assemblyDirectory = Path.GetDirectoryName(type.Assembly.Location);

        if (assemblyDirectory == null)
        {
            return new XDocument();
        }

        var xmlFileName = $"{type.Assembly.GetName().Name}.xml";
        var xmlPath = Path.Combine(assemblyDirectory, xmlFileName);

        if (File.Exists(xmlPath))
        {
            return XDocument.Load(xmlPath);
        }

        return new XDocument();
    }

    private static string ToCamelCase(string name)
    {
        if (string.IsNullOrEmpty(name) || char.IsLower(name[0]))
        {
            return name;
        }

        return char.ToLowerInvariant(name[0]) + name[1..];
    }
}
