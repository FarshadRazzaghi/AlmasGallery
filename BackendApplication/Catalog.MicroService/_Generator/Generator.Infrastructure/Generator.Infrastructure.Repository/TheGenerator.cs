using Generator.Shared;
using Generator.Shared.Extensions;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Collections.Immutable;
using System.Text;

namespace Generator.Catalog.Infrastructure.Repository;

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

        GenerateRepository(context, members);
        GenerateUnitOfWork(context, members);
    }

    private static void GenerateRepository(SourceProductionContext context, INamedTypeSymbol[] nodes)
    {
        // RSB = RepositoryStringBuilder
        var RSB = new StringBuilder();

        // RSSB = RegisterServicesStringBuilder
        var RSSB = new StringBuilder();

        RSB.GenerateHeader();
        RSB.GenerateNameSpace(Constants.InfrastructureRepositoryNamespace);

        RSSB.GenerateHeader();
        RSSB.AppendLine("using Microsoft.Extensions.DependencyInjection;");
        RSSB.AppendLine("");
        RSSB.GenerateNameSpace(Constants.InfrastructureRepositoryNamespace);

        RSSB.AppendLine($"internal partial class RegisterServices");
        RSSB.AppendLine($"{{");

        RSSB.AppendLine($"private static void RepositoryConfiguration(IServiceCollection services)".TabIndent(1));
        RSSB.AppendLine($"{{".TabIndent(1));

        for (int i = 0; i < nodes.Length; i++)
        {
            RSB.AppendLine($"internal partial class {nodes[i].MetadataName.ToRepository()}({Constants.DbContextClassName.AsParameter()}) : {nodes[i].MetadataName.ToBaseRepository(false)}({Constants.DbContextClassName.Parameter()}), {nodes[i].MetadataName.ToRepository(true)} {{ }}");
            RSSB.AppendLine($"services.AddScoped<{nodes[i].MetadataName.ToRepository(true)}, {nodes[i].MetadataName.ToRepository()}>();".TabIndent(2));
        }

        RSSB.AppendLine($"}}".TabIndent(1));
        RSSB.AppendLine($"}}");

        context.AddSource($"{Constants.RepositoryPostfix}.g.cs", RSB.ToString());
        context.AddSource($"_RegisterServices.{Constants.RepositoryPostfix}.g.cs", RSSB.ToString());
    }

    private static void GenerateUnitOfWork(SourceProductionContext context, INamedTypeSymbol[] nodes)
    {
        // IUoWSB = IUnitOfWorkStringBuilder
        var IUoWSB = new StringBuilder();

        // UoWSB = UnitOfWorkStringBuilder
        var UoWSB = new StringBuilder();

        IUoWSB.GenerateHeader();
        UoWSB.GenerateHeader();

        IUoWSB.GenerateNameSpace(Constants.InfrastructureRepositoryNamespace);
        UoWSB.GenerateNameSpace(Constants.InfrastructureRepositoryNamespace);

        IUoWSB.AppendLine($"internal partial interface I{Constants.UnitOfWorkClassName}");
        IUoWSB.AppendLine($"{{");

        var dbContextParameter = $"{Constants.DbContextClassName.AsParameter()}{(nodes.Length > 0 ? ", " : "")}";
        var nodeParameters = nodes.Select(node => $"{node.MetadataName.ToRepository(true).AsParameter()}").Aggregate((a, b) => $"{a}, {b}");

        UoWSB.AppendLine($"internal partial class {Constants.UnitOfWorkClassName}({dbContextParameter}{nodeParameters})");
        UoWSB.AppendLine($": I{Constants.UnitOfWorkClassName}, IDisposable".TabIndent(1));
        UoWSB.AppendLine($"{{");

        for (int i = 0; i < nodes.Length; i++)
        {
            var property = $"{nodes[i].MetadataName.ToRepository(true)} {nodes[i].MetadataName.ToRepository()} {{ get; }}";
            IUoWSB.AppendLine(property.TabIndent(1));
            UoWSB.AppendLine($"public virtual {property} = {nodes[i].MetadataName.ToRepository().Parameter()};".TabIndent(1));
        }

        IUoWSB.AppendLine($"}}");
        UoWSB.AppendLine($"}}");

        context.AddSource($"I{Constants.UnitOfWorkClassName}.g.cs", IUoWSB.ToString());
        context.AddSource($"{Constants.UnitOfWorkClassName}.g.cs", UoWSB.ToString());
    }
}