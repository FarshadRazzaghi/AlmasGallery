using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace AlmasGallery.Catalog.Infrastructure.Repository.Extensions;

internal static class RepositoryExtensions
{
    public static IQueryable<TEntity> Including<TEntity>(this IQueryable<TEntity> dbSet, params Expression<Func<TEntity, object>>[] includeExpressions) where TEntity : class
    {
        if (includeExpressions != null)
        {
            foreach (var expression in includeExpressions)
            {
                dbSet = dbSet.Include(expression);
            }
        }

        return dbSet;
    }
}
