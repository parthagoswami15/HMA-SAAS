# IPD Module - Complete Implementation Documentation

## Overview
The IPD (In-Patient Department) Module provides comprehensive ward and bed management capabilities for the HMS SAAS application, including ward creation, bed allocation, occupancy tracking, and IPD analytics. This module is fully production-ready with robust error handling, real-time data integration, and comprehensive user interfaces.

## Architecture

### Backend API Structure
- **Base URL**: `/api/ipd`
- **Authentication**: JWT-based with tenant isolation
- **Framework**: NestJS with Prisma ORM
- **Database**: Multi-tenant PostgreSQL schema

### Frontend Structure
- **Framework**: Next.js 14 with TypeScript
- **UI Library**: Mantine v7
- **State Management**: Zustand
- **API Client**: Enhanced Axios with error handling

## Backend API Endpoints

### Ward Management
```typescript
POST /ipd/wards
- Body: CreateWardDto
- Response: Created ward with bed count

GET /ipd/wards
- Query Parameters: page, limit, type, search, isActive
- Response: Paginated list of wards with beds

GET /ipd/wards/:id
- Response: Detailed ward information with all beds

PATCH /ipd/wards/:id
- Body: UpdateWardDto
- Response: Updated ward information
```

### Bed Management
```typescript
POST /ipd/beds
- Body: CreateBedDto
- Response: Created bed with ward details

GET /ipd/beds
- Query Parameters: page, limit, wardId, status, search, isActive
- Response: Paginated list of beds

GET /ipd/beds/available
- Response: List of all available beds

PATCH /ipd/beds/:id/status
- Body: UpdateBedStatusDto
- Response: Updated bed with new status
```

### Statistics
```typescript
GET /ipd/stats
- Response: IPD statistics including ward and bed counts, occupancy rate
```

## Frontend Service Layer

### IPD Service (`/services/ipd.service.ts`)
```typescript
// Ward Operations
createWard(data: CreateWardDto): Promise<WardResponse>
getWards(filters?: WardFilters): Promise<WardsListResponse>
getWardById(id: string): Promise<WardResponse>
updateWard(id: string, data: UpdateWardDto): Promise<WardResponse>

// Bed Operations
createBed(data: CreateBedDto): Promise<BedResponse>
getBeds(filters?: BedFilters): Promise<BedsListResponse>
getAvailableBeds(): Promise<AvailableBedsResponse>
updateBedStatus(id: string, data: UpdateBedStatusDto): Promise<BedResponse>

// Statistics
getStats(): Promise<IpdStatsResponse>
```

## UI Components

### 1. WardForm (`/components/ipd/WardForm.tsx`)
**Purpose**: Create and edit wards
**Features**:
- Ward name input with validation
- Capacity number input
- Location and floor fields
- Description textarea
- Form validation with error messages
- Loading states and success notifications

**Props**:
```typescript
interface WardFormProps {
  opened: boolean;
  onClose: () => void;
  ward?: any;
  onSubmit: (data: CreateWardDto | UpdateWardDto) => Promise<void>;
}
```

### 2. BedForm (`/components/ipd/BedForm.tsx`)
**Purpose**: Create new beds
**Features**:
- Ward selection with search
- Bed number input
- Status dropdown (4 statuses)
- Description field
- Real-time ward loading
- Form validation with error messages

**Props**:
```typescript
interface BedFormProps {
  opened: boolean;
  onClose: () => void;
  bed?: any;
  onSubmit: (data: CreateBedDto) => Promise<void>;
}
```

**Bed Statuses**:
- **AVAILABLE**: Bed is ready for new patient
- **OCCUPIED**: Bed is currently occupied
- **MAINTENANCE**: Bed is under maintenance
- **RESERVED**: Bed is reserved for specific patient

### 3. WardDetails (`/components/ipd/WardDetails.tsx`)
**Purpose**: Display comprehensive ward information
**Features**:
- Ward status badge
- Occupancy rate calculation
- Ward information (name, capacity, location, floor)
- Bed statistics (total, available, occupied)
- Beds list table with status
- Action buttons for edit
- Metadata (created/updated dates)

**Props**:
```typescript
interface WardDetailsProps {
  opened: boolean;
  onClose: () => void;
  ward: any;
  onEdit: (ward: any) => void;
}
```

### 4. IPD Main Page (`/app/ipd/page.tsx`)
**Purpose**: Central IPD management dashboard
**Features**:
- IPD statistics cards (Wards, Beds, Available, Occupied, Occupancy Rate)
- Tabbed interface (Wards/Beds)
- Advanced filtering for both wards and beds
- Real-time search functionality
- Data tables with sorting and actions
- CRUD operations with real API integration
- Status update functionality for beds
- Error handling with user-friendly messages
- Loading states and empty states
- Responsive design for all screen sizes

## Data Models

### Ward (Backend Model)
```typescript
interface Ward {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  location?: string;
  floor?: string;
  isActive: boolean;
  tenantId: string;
  beds?: Bed[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Bed (Backend Model)
```typescript
interface Bed {
  id: string;
  wardId: string;
  bedNumber: string;
  description?: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
  isActive: boolean;
  tenantId: string;
  ward?: Ward;
  createdAt: Date;
  updatedAt: Date;
}
```

## Key Features

### 1. Ward Management
- **Complete CRUD Operations**: Create, read, update wards
- **Capacity Tracking**: Monitor ward bed capacity
- **Location Management**: Track ward locations and floors
- **Bed Count**: Automatic bed counting per ward
- **Occupancy Calculation**: Real-time occupancy rate

### 2. Bed Management
- **Bed Creation**: Add beds to specific wards
- **Status Management**: Four-level status workflow
- **Quick Status Updates**: Change bed status from dropdown menu
- **Ward Association**: Link beds to wards
- **Availability Tracking**: Track available beds

### 3. Advanced Filtering & Search
- **Multi-field Search**: Search by ward name, location, bed number
- **Ward Filter**: Filter beds by ward
- **Status Filter**: Filter beds by status
- **Real-time Updates**: Instant filtering without page reload

### 4. IPD Analytics
- **Ward Statistics**: Total wards count
- **Bed Statistics**: Total, available, occupied, maintenance, reserved
- **Occupancy Rate**: Percentage of occupied beds
- **Real-time Metrics**: Live updates on dashboard

### 5. Tabbed Interface
- **Wards Tab**: Manage all wards with bed counts
- **Beds Tab**: Manage all beds with status updates
- **Seamless Navigation**: Easy switching between views

## Security Features

### Authentication & Authorization
- **JWT Authentication**: Secure token-based access
- **Role-based Access**: Different permissions for different user roles
- **Tenant Isolation**: Multi-tenant data separation
- **Soft Delete**: Deactivation tracking with isActive flag

### Data Validation
- **Input Sanitization**: All user inputs validated and sanitized
- **Type Safety**: TypeScript ensures type safety throughout
- **Required Fields**: Validation for mandatory information
- **Capacity Validation**: Positive number validation for capacity
- **Unique Bed Numbers**: Prevent duplicate bed numbers in same ward

## Error Handling

### Frontend Error Management
```typescript
// Comprehensive error handling with user-friendly messages
try {
  const response = await ipdService.getWards(filters);
  // Handle success
} catch (error: any) {
  notifications.show({
    title: 'Error Loading Wards',
    message: error?.response?.data?.message || error?.message || 'Failed to fetch wards. Please try again.',
    color: 'red',
    autoClose: 5000,
  });
}
```

### Backend Error Responses
- **Standardized Format**: Consistent error response structure
- **HTTP Status Codes**: Proper status code usage (404, 400, 500, etc.)
- **Detailed Messages**: Informative error messages for debugging
- **Not Found Handling**: Graceful handling of missing records
- **Validation Errors**: Clear validation error messages

## API Integration Examples

### Creating a Ward
```typescript
const createWard = async (wardData: CreateWardDto) => {
  try {
    const response = await ipdService.createWard({
      name: 'General Ward A',
      capacity: 20,
      location: 'Building A, Wing 1',
      floor: '2nd Floor',
      description: 'General medical ward'
    });
    
    if (response.success) {
      notifications.show({
        title: 'Success',
        message: 'Ward created successfully',
        color: 'green'
      });
    }
  } catch (error) {
    // Error handling
  }
};
```

### Creating a Bed
```typescript
const createBed = async (bedData: CreateBedDto) => {
  try {
    const response = await ipdService.createBed({
      wardId: 'ward-123',
      bedNumber: 'A-101',
      status: 'AVAILABLE',
      description: 'Standard bed with oxygen supply'
    });
    
    if (response.success) {
      notifications.show({
        title: 'Success',
        message: 'Bed created successfully',
        color: 'green'
      });
    }
  } catch (error) {
    // Error handling
  }
};
```

### Updating Bed Status
```typescript
const updateBedStatus = async (bedId: string, newStatus: string) => {
  try {
    const response = await ipdService.updateBedStatus(bedId, {
      status: newStatus,
      notes: 'Status updated by admin'
    });
    
    if (response.success) {
      notifications.show({
        title: 'Success',
        message: 'Bed status updated successfully',
        color: 'green'
      });
    }
  } catch (error) {
    // Error handling
  }
};
```

### Getting IPD Statistics
```typescript
const fetchStats = async () => {
  try {
    const response = await ipdService.getStats();
    
    if (response.success) {
      console.log('Total Wards:', response.data.wards.total);
      console.log('Total Beds:', response.data.beds.total);
      console.log('Available Beds:', response.data.beds.available);
      console.log('Occupancy Rate:', response.data.occupancyRate);
    }
  } catch (error) {
    // Error handling
  }
};
```

## UI/UX Design

### Design Principles
- **Consistency**: Follows established design patterns from other modules
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Responsiveness**: Mobile-first responsive design
- **Performance**: Optimized loading and rendering

### Color Coding
- **Available**: Green (#40c057)
- **Occupied**: Red (#fa5252)
- **Maintenance**: Yellow (#fab005)
- **Reserved**: Blue (#228be6)
- **Active**: Green for active wards
- **Inactive**: Red for inactive wards

### Typography
- **Headers**: Bold, clear hierarchy
- **Data**: Consistent sizing and spacing
- **Labels**: Proper contrast and readability
- **Numbers**: Emphasized for statistics

## Testing Strategy

### Manual Testing Checklist
- [ ] Create new ward
- [ ] Edit existing ward
- [ ] View ward details with bed list
- [ ] Create new bed in ward
- [ ] Update bed status (all 4 statuses)
- [ ] Filter wards by search
- [ ] Filter beds by ward
- [ ] Filter beds by status
- [ ] Search beds by bed number
- [ ] Verify statistics calculations
- [ ] Test error handling scenarios
- [ ] Verify responsive design
- [ ] Test with different user roles
- [ ] Verify ward loading in bed form
- [ ] Test form validation
- [ ] Verify occupancy rate calculation

## Performance Optimizations

### Frontend Optimizations
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Debounced Search**: Optimized search performance
- **Pagination**: Efficient data loading with pagination
- **Caching**: Client-side caching for wards

### Backend Optimizations
- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Efficient data loading with pagination
- **Query Optimization**: Efficient Prisma queries with includes
- **Soft Delete**: Better performance with isActive flag
- **Aggregation**: Efficient statistics calculation

## Deployment Considerations

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-secret-key

# API Configuration
API_BASE_URL=http://localhost:3001/api
```

## Access URLs

### Development
- **Frontend**: http://localhost:3002/ipd
- **Backend API**: http://localhost:3001/api/ipd

### Production
- **Frontend**: https://your-domain.com/ipd
- **Backend API**: https://api.your-domain.com/ipd

## Dependencies

### Frontend Dependencies
```json
{
  "@mantine/core": "^7.0.0",
  "@mantine/hooks": "^7.0.0",
  "@mantine/notifications": "^7.0.0",
  "@tabler/icons-react": "^2.0.0",
  "axios": "^1.0.0",
  "zustand": "^4.0.0"
}
```

### Backend Dependencies
```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@prisma/client": "^5.0.0",
  "prisma": "^5.0.0",
  "@nestjs/jwt": "^10.0.0",
  "@nestjs/swagger": "^7.0.0"
}
```

## Future Enhancements

### Planned Features
1. **Patient Admission**: Link beds to patient admissions
2. **Bed Transfer**: Move patients between beds
3. **Discharge Management**: Track patient discharge
4. **Bed History**: Track bed usage history
5. **Ward Rounds**: Schedule and track ward rounds
6. **Nurse Assignment**: Assign nurses to wards
7. **Bed Cleaning Schedule**: Track bed cleaning status
8. **Ward Capacity Alerts**: Notify when ward is full
9. **Bed Reservation System**: Reserve beds for scheduled admissions
10. **Advanced Analytics**: Detailed occupancy reports

### Technical Improvements
1. **Real-time Updates**: WebSocket integration for live bed status
2. **Bed Visualization**: Visual ward layout with bed positions
3. **Export Functionality**: Export ward and bed data to Excel/PDF
4. **API Rate Limiting**: Enhanced security measures
5. **Audit Trail**: Complete activity logging
6. **Backup**: Automated backup solutions
7. **Multi-language**: Internationalization support
8. **Mobile App**: React Native mobile application
9. **Barcode Integration**: QR codes for beds
10. **Integration with EMR**: Link to patient medical records

## Integration Points

### Current Integrations
- **Authentication**: JWT-based authentication
- **Notifications**: Real-time notifications system
- **Multi-tenant**: Tenant isolation

### Future Integrations
- **Patient Module**: Link beds to patient admissions
- **Billing Module**: Track bed charges
- **EMR Module**: Link to patient medical records
- **Staff Module**: Assign staff to wards
- **Inventory**: Track ward supplies

## Conclusion

The IPD Module is a comprehensive, production-ready solution for in-patient department management in the HMS SAAS application. It provides robust functionality for ward and bed management, occupancy tracking, and IPD analytics. The module follows best practices for security, performance, and user experience, making it suitable for healthcare organizations of all sizes.

The implementation includes complete CRUD operations, status workflow management, advanced filtering and search, real-time statistics, and comprehensive error handling. The user interface is intuitive and responsive, providing an excellent user experience across all devices.

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: Production Ready
**Module**: IPD (In-Patient Department)
