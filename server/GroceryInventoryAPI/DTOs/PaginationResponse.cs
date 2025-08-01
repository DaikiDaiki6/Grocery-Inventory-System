namespace GroceryInventoryAPI.DTOs;

public class PaginationResponse<T>
{
    public List<T> Data { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public bool HasPreviousPage { get; set; }
    public bool HasNextPage { get; set; }
    public int PreviousPageNumber { get; set; }
    public int NextPageNumber { get; set; }
} 