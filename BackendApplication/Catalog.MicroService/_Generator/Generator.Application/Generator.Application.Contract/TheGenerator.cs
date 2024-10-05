using Generator.Shared;
using Generator.Shared.Extensions;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Collections.Immutable;
using System.Text;

namespace Generator.Catalog.Application.Contract;

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
        GenerateUseCase(context, members);
    }

    private static void GenerateRepository(SourceProductionContext context, INamedTypeSymbol[] nodes)
    {
        // RSB = IRepositoryStringBuilder
        var IRSB = new StringBuilder();

        IRSB.GenerateHeader();
        IRSB.GenerateNameSpace(Constants.ApplicationRepositoryNamespace);

        for (int i = 0; i < nodes.Length; i++)
        {
            IRSB.AppendLine($"public partial interface {nodes[i].MetadataName.ToRepository(true)} : {nodes[i].MetadataName.ToBaseRepository(true)} {{ }}");
        }

        context.AddSource($"I{Constants.RepositoryPostfix}.g.cs", IRSB.ToString());
    }

    private static void GenerateUseCase(SourceProductionContext context, INamedTypeSymbol[] nodes)
    {
        // RSB = IRepositoryStringBuilder
        var IRSB = new StringBuilder();

        IRSB.GenerateHeader();
        IRSB.GenerateNameSpace(Constants.ApplicationUseCaseNamespace);

        for (int i = 0; i < nodes.Length; i++)
        {
            IRSB.AppendLine($"public partial interface {nodes[i].MetadataName.ToUseCase(true)} : {nodes[i].MetadataName.ToBaseUseCase(true)} {{ }}");
        }

        context.AddSource($"I{Constants.UseCasePostfix}.g.cs", IRSB.ToString());
    }
}
