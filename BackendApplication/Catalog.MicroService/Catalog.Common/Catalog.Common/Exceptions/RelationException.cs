namespace AlmasGallery.Catalog.Common.Exceptions;

public class RelationException(string message) : Exception(message)
{
    public RelationException() : this("Entity has Relation.") { }

    public string RelationMessage { get; set; } = string.Empty;
}