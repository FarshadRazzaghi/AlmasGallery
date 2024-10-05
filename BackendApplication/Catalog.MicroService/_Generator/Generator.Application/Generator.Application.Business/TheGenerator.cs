using Generator.Shared;
using Generator.Shared.Extensions;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Immutable;
using System.Text;

namespace Generator.Catalog.Application.Business;

[Generator]
public class TheGenerator : IIncrementalGenerator
{
    public void Initialize(IncrementalGeneratorInitializationContext context)
    {
        var provider = context.SyntaxProvider.CreateSyntaxProvider(predicate: static (node, _) => node is ClassDeclarationSyntax,
                                                                   transform: static (ctx, _) => (ClassDeclarationSyntax)ctx.Node)
                              .Where(m => m is not null);

        var compilation = context.CompilationProvider.Combine(provider.Collect());
        context.RegisterSourceOutput(compilation, Execute);
    }

    private void Execute(SourceProductionContext context, (Compilation compilation, ImmutableArray<ClassDeclarationSyntax> list) tuple)
    {
        var members = Helper.GetDomainModelMembers(tuple.compilation, false);

        GenerateUseCase(context, members);
    }

    private static void GenerateUseCase(SourceProductionContext context, INamedTypeSymbol[] nodes)
    {
        // UCSB = UseCaseStringBuilder
        var UCSB = new StringBuilder();

        // RSSB = RegisterServicesStringBuilder
        var RSSB = new StringBuilder();

        UCSB.GenerateHeader();
        UCSB.AppendLine($"using {Constants.InfrastructureUnitOfWorkNamespace};");
        UCSB.AppendLine("");
        UCSB.GenerateNameSpace(Constants.ApplicationBusinessUseCaseNamespace);

        RSSB.GenerateHeader();
        RSSB.AppendLine("using Microsoft.Extensions.DependencyInjection;");
        RSSB.AppendLine("");
        RSSB.GenerateNameSpace(Constants.ApplicationBusinessUseCaseNamespace);

        RSSB.AppendLine($"internal partial class RegisterServices");
        RSSB.AppendLine($"{{");

        RSSB.AppendLine($"private static void UseCaseConfiguration(IServiceCollection services)".TabIndent(1));
        RSSB.AppendLine($"{{".TabIndent(1));

        for (int i = 0; i < nodes.Length; i++)
        {
            UCSB.AppendLine($"internal partial class {nodes[i].MetadataName.ToUseCase()}({nodes[i].MetadataName.ToRepository(true).AsParameter()}, {$"I{Constants.UnitOfWorkClassName}".AsParameter()}) : {nodes[i].MetadataName.ToBaseUseCase(false)}({nodes[i].MetadataName.ToRepository(true).Parameter()}, {Constants.UnitOfWorkClassName.Parameter()}), {nodes[i].MetadataName.ToUseCase(true)} {{ }}");
            RSSB.AppendLine($"services.AddScoped<{nodes[i].MetadataName.ToUseCase(true)}, {nodes[i].MetadataName.ToUseCase()}>();".TabIndent(2));
        }

        RSSB.AppendLine($"}}".TabIndent(1));
        RSSB.AppendLine($"}}");

        context.AddSource($"{Constants.UseCasePostfix}.g.cs", UCSB.ToString());
        context.AddSource($"_RegisterServices.{Constants.UseCasePostfix}.g.cs", RSSB.ToString());
    }
}
