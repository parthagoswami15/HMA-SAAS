# How to Integrate a New Module with Backend API

This guide shows you how to integrate any new module with the backend API, following the established patterns in the HMS application.

## Step 1: Create the Service File

Create a new service file in `src/services/<module>.service.ts`:

```typescript
/**
 * [Module Name] API Service
 * Handles all [module]-related API operations
 */

import apiClient from './api-client';
import { YourType, YourStatus } from '../types/your-module';

// Define your DTOs (Data Transfer Objects)
export interface CreateItemDto {
  // Fields needed to create an item
  name: string;
  description?: string;
}

export interface UpdateItemDto {
  // Fields that can be updated
  name?: string;
  status?: YourStatus;
}

export interface ItemFilters {
  // Filters for querying items
  status?: YourStatus;
  search?: string;
  page?: number;
  limit?: number;
}

class YourModuleService {
  private baseUrl = '/your-module'; // Backend API endpoint

  /**
   * Get all items with optional filters
   */
  async getItems(filters?: ItemFilters) {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    return apiClient.get<{ data: YourType[]; total: number; page: number; limit: number }>(url);
  }

  /**
   * Get a single item by ID
   */
  async getItemById(id: string) {
    return apiClient.get<YourType>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new item
   */
  async createItem(data: CreateItemDto) {
    return apiClient.post<YourType>(this.baseUrl, data);
  }

  /**
   * Update an existing item
   */
  async updateItem(id: string, data: UpdateItemDto) {
    return apiClient.put<YourType>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete an item
   */
  async deleteItem(id: string) {
    return apiClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get statistics (optional)
   */
  async getStats() {
    return apiClient.get<any>(`${this.baseUrl}/stats`);
  }
}

const yourModuleService = new YourModuleService();
export default yourModuleService;
```

## Step 2: Export Service in Index

Update `src/services/index.ts`:

```typescript
// Add your service export
export { default as yourModuleService } from './your-module.service';

// Add your types export
export type {
  CreateItemDto,
  UpdateItemDto,
  ItemFilters
} from './your-module.service';
```

## Step 3: Update the Page Component

Update your page component at `src/app/dashboard/your-module/page.tsx`:

```typescript
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { yourModuleService, handleApiError } from '@/services';
import { YourType } from '../../../types/your-module';
import { mockYourData } from '../../../lib/mockData/your-module';

const YourModulePage = () => {
  // State management
  const [items, setItems] = useState<YourType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('main');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Load data from API
  useEffect(() => {
    loadData();
  }, [selectedStatus]); // Re-load when filters change

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = { limit: 100 };
      if (selectedStatus) filters.status = selectedStatus;

      const response = await yourModuleService.getItems(filters);
      const itemsData = response.data || [];
      setItems(Array.isArray(itemsData) ? itemsData : []);
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error loading data:', err);
      // Fallback to mock data
      setItems(mockYourData);
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on search query (client-side filtering)
  const filteredItems = useMemo(() => {
    const itemsToFilter = items.length > 0 ? items : mockYourData;
    return itemsToFilter.filter((item) => {
      const matchesSearch = 
        item.name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !selectedStatus || item.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, selectedStatus]);

  // Handle CRUD operations
  const handleCreate = async (data: any) => {
    try {
      await yourModuleService.createItem(data);
      notifications.show({
        title: 'Success',
        message: 'Item created successfully',
        color: 'green',
      });
      loadData(); // Reload data
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: handleApiError(err),
        color: 'red',
      });
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await yourModuleService.updateItem(id, data);
      notifications.show({
        title: 'Success',
        message: 'Item updated successfully',
        color: 'green',
      });
      loadData();
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: handleApiError(err),
        color: 'red',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await yourModuleService.deleteItem(id);
      notifications.show({
        title: 'Success',
        message: 'Item deleted successfully',
        color: 'green',
      });
      loadData();
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: handleApiError(err),
        color: 'red',
      });
    }
  };

  // Show loading state
  if (loading && items.length === 0) {
    return (
      <Container>
        <Center style={{ height: '400px' }}>
          <Loader size="xl" />
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      {/* Show error alert if there's an error */}
      {error && (
        <Alert color="yellow" mb="md" icon={<IconAlertCircle />}>
          {error} - Using cached data
        </Alert>
      )}

      {/* Your existing UI components */}
      <Paper p="md">
        {/* ... rest of your component */}
      </Paper>
    </Container>
  );
};

export default YourModulePage;
```

## Step 4: Key Points to Remember

### ✅ Do's

1. **Always use try-catch blocks** when calling API services
2. **Provide fallback to mock data** on errors for better UX
3. **Show loading states** while fetching data
4. **Display error messages** to users in a user-friendly way
5. **Reload data after mutations** (create, update, delete)
6. **Use TypeScript types** for all data structures
7. **Build query params properly** with URLSearchParams
8. **Keep service logic separate** from component logic

### ❌ Don'ts

1. **Don't block the UI** - always show fallback data
2. **Don't ignore errors** - log them and show user-friendly messages
3. **Don't make synchronous API calls** - always use async/await
4. **Don't hardcode API URLs** - use baseUrl in service classes
5. **Don't skip loading states** - users need feedback

## Step 5: Testing Your Integration

1. **Start the backend server**:
   ```bash
   cd apps/api
   npm run start:dev
   ```

2. **Start the frontend server**:
   ```bash
   cd apps/web
   npm run dev
   ```

3. **Test scenarios**:
   - ✅ Backend running: Should fetch real data
   - ✅ Backend stopped: Should show error but use mock data
   - ✅ Network error: Should handle gracefully
   - ✅ Empty results: Should show empty state
   - ✅ Filtering: Should apply filters correctly
   - ✅ CRUD operations: Should show success/error notifications

## Step 6: Common Patterns

### Loading Multiple Data Sources

```typescript
useEffect(() => {
  loadAllData();
}, [activeTab]);

const loadAllData = async () => {
  try {
    setLoading(true);
    setError(null);

    const [itemsRes, statsRes] = await Promise.all([
      yourModuleService.getItems({ limit: 100 }),
      yourModuleService.getStats().catch(() => ({ data: mockStats }))
    ]);

    setItems(itemsRes.data || []);
    setStats(statsRes.data || mockStats);
  } catch (err) {
    setError(handleApiError(err));
    setItems(mockItems);
  } finally {
    setLoading(false);
  }
};
```

### Tab-Based Loading

```typescript
useEffect(() => {
  loadTabData();
}, [activeTab, filters]);

const loadTabData = async () => {
  try {
    setLoading(true);
    
    if (activeTab === 'items') {
      const response = await yourModuleService.getItems(filters);
      setItems(response.data || []);
    } else if (activeTab === 'reports') {
      const response = await yourModuleService.getReports(filters);
      setReports(response.data || []);
    }
  } catch (err) {
    setError(handleApiError(err));
  } finally {
    setLoading(false);
  }
};
```

## Examples

See these integrated modules for reference:
- `src/app/dashboard/patients/page.tsx` - Basic integration
- `src/app/dashboard/laboratory/page.tsx` - Tab-based integration
- `src/app/dashboard/inventory/page.tsx` - Multi-section integration
- `src/app/dashboard/appointments/page.tsx` - Complex filtering

## Need Help?

- Check `BACKEND_INTEGRATION_STATUS.md` for integration status
- Review existing service files in `src/services/`
- Look at the API client in `src/services/api-client.ts`
- Test with the backend API documentation

---

**Happy Coding! 🚀**
