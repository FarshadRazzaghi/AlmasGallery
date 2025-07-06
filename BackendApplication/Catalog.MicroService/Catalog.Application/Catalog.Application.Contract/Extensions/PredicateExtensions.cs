using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;

namespace AlmasGallery.Catalog.Application.Business.UseCase;

/// <summary>
/// Extension methods for combining predicates.
/// </summary>
internal static class PredicateExtensions
{
    /// <summary>
    /// Combines two predicates with a logical AND.
    /// </summary>
    /// <typeparam name="T">The type of the parameter.</typeparam>
    /// <param name="first">The first predicate.</param>
    /// <param name="second">The second predicate.</param>
    /// <returns>
    /// A new predicate that represents the logical AND of the two input predicates.
    /// If either predicate is null, the other predicate is returned.
    /// </returns>
    public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> first, Expression<Func<T, bool>> second)
    {
        if (first == null) return second;
        if (second == null) return first;

        var parameter = Expression.Parameter(typeof(T), "x");

        var leftVisitor = new ReplaceExpressionVisitor(first.Parameters[0], parameter);
        var left = leftVisitor.Visit(first.Body);

        var rightVisitor = new ReplaceExpressionVisitor(second.Parameters[0], parameter);
        var right = rightVisitor.Visit(second.Body);

        var body = Expression.AndAlso(left, right);
        return Expression.Lambda<Func<T, bool>>(body, parameter);
    }

    /// <summary>
    /// Combines two predicates with a logical OR.
    /// </summary>
    /// <typeparam name="T">The type of the parameter.</typeparam>
    /// <param name="first">The first predicate.</param>
    /// <param name="second">The second predicate.</param>
    /// <returns>
    /// A new predicate that represents the logical OR of the two input predicates.
    /// If either predicate is null, the other predicate is returned.
    /// </returns>
    public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> first, Expression<Func<T, bool>> second)
    {
        if (first == null) return second;
        if (second == null) return first;

        var parameter = Expression.Parameter(typeof(T), "x");

        var leftVisitor = new ReplaceExpressionVisitor(first.Parameters[0], parameter);
        var left = leftVisitor.Visit(first.Body);

        var rightVisitor = new ReplaceExpressionVisitor(second.Parameters[0], parameter);
        var right = rightVisitor.Visit(second.Body);

        var body = Expression.OrElse(left, right);
        return Expression.Lambda<Func<T, bool>>(body, parameter);
    }

    /// <summary>
    /// A visitor that replaces occurrences of one expression with another.
    /// </summary>
    private class ReplaceExpressionVisitor(Expression oldValue, Expression newValue) : ExpressionVisitor
    {
        private readonly Expression _oldValue = oldValue;
        private readonly Expression _newValue = newValue;

        /// <summary>
        /// Visits the given expression and replaces occurrences of the old expression with the new expression.
        /// </summary>
        /// <param name="node">The expression to visit.</param>
        /// <returns>
        /// The modified expression if the old expression is found; otherwise, the original expression.
        /// </returns>
        [return: NotNullIfNotNull(nameof(node))]
        public override Expression? Visit(Expression? node)
        {
            if (node == _oldValue)
                return _newValue;

            return base.Visit(node);
        }
    }
}
