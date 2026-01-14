# tRPC Account Dashboard Implementation

This document describes the tRPC implementation for the account dashboard.

## Overview

The account dashboard now uses tRPC instead of direct Supabase calls, providing:
- End-to-end type safety
- Better error handling
- Optimized data fetching with React Query
- Cleaner separation of concerns

## Available Procedures

### 1. `account.getDashboardData` (Recommended)

Fetches all dashboard data in a single optimized query with parallel fetching.

**Usage:**
```tsx
const { data, isLoading, error } = trpc.account.getDashboardData.useQuery(
  undefined,
  {
    enabled: !!user,
    retry: false,
  }
);

// Access data
const savedPropertiesCount = data?.stats.savedPropertiesCount || 0;
const savedSearchesCount = data?.stats.savedSearchesCount || 0;
const activeAlertsCount = data?.stats.activeAlertsCount || 0;
const recentProperties = data?.recentProperties || [];
const recentSearches = data?.recentSearches || [];
```

**Returns:**
```typescript
{
  stats: {
    savedPropertiesCount: number;
    savedSearchesCount: number;
    activeAlertsCount: number;
  };
  recentProperties: Array<SavedProperty & { property: Property }>;
  recentSearches: Array<SavedSearch>;
}
```

### 2. `account.getDashboardStats`

Fetches only the statistics (counts) without property/search details.

**Usage:**
```tsx
const { data } = trpc.account.getDashboardStats.useQuery();

// Returns:
// {
//   savedPropertiesCount: number;
//   savedSearchesCount: number;
//   activeAlertsCount: number;
// }
```

### 3. `account.getRecentSavedProperties`

Fetches recent saved properties with customizable limit.

**Usage:**
```tsx
const { data } = trpc.account.getRecentSavedProperties.useQuery({
  limit: 5, // default: 3, max: 10
});
```

### 4. `account.getRecentSavedSearches`

Fetches recent saved searches with customizable limit.

**Usage:**
```tsx
const { data } = trpc.account.getRecentSavedSearches.useQuery({
  limit: 10, // default: 5, max: 20
});
```

## Features

### Type Safety

All queries are fully typed from server to client:
- Input validation with Zod schemas
- Automatic TypeScript inference
- No manual type assertions needed

### Error Handling

The implementation gracefully handles:
- Missing database tables (returns empty arrays)
- Database connection errors
- Unauthorized access (via `protectedProcedure`)

### Performance Optimization

- Parallel queries using `Promise.allSettled()` in `getDashboardData`
- React Query caching for reduced network requests
- Batch linking for multiple concurrent requests
- Conditional fetching (only when user is authenticated)

## Authentication

All procedures use `protectedProcedure` which:
- Automatically checks if user is authenticated
- Throws `UNAUTHORIZED` error if not
- Provides `user` object in context

## Migration Notes

### Before (Direct Supabase):
```tsx
const [loading, setLoading] = useState(true);
const [savedPropertiesCount, setSavedPropertiesCount] = useState(0);

useEffect(() => {
  if (user) {
    const loadData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('saved_properties')
        .select('*')
        .eq('user_id', user.id);
      
      setSavedPropertiesCount(data?.length || 0);
      setLoading(false);
    };
    loadData();
  }
}, [user]);
```

### After (tRPC):
```tsx
const { data, isLoading } = trpc.account.getDashboardData.useQuery(
  undefined,
  { enabled: !!user }
);

const savedPropertiesCount = data?.stats.savedPropertiesCount || 0;
```

## Benefits

1. **Less Code**: ~200 lines removed from the component
2. **Better DX**: Full autocomplete and type checking
3. **Performance**: Automatic caching and optimistic updates
4. **Maintainability**: Business logic separated from UI
5. **Testability**: Server logic can be tested independently

## Next Steps

Consider implementing tRPC for:
- `/saved` page (saved properties CRUD)
- `/account/personas` page (saved searches management)
- `/account/settings` page (user profile updates)
- Property details page
- Search functionality
