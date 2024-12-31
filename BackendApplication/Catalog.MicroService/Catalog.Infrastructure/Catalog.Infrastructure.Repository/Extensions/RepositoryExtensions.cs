using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Catalog.Infrastructure.Repository.Extensions;

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
