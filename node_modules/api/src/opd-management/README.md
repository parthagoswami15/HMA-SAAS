# OPD Management Module

This module provides comprehensive Outpatient Department (OPD) management functionality for the healthcare application. It handles patient visits, encounters, prescriptions, queue management, and more.

## Features

- **Patient Visits Management**: Schedule, update, and track patient visits
- **Clinical Encounters**: Document patient-provider interactions
- **Electronic Prescriptions**: Create and manage patient prescriptions
- **Queue Management**: Manage patient flow with token system
- **Orders Management**: Handle lab and imaging orders
- **Document Management**: Upload and retrieve patient documents
- **Billing Integration**: Generate and process bills
- **ICD-10 Integration**: Standardized diagnosis coding
- **Vitals Tracking**: Record and monitor patient vitals

## API Endpoints

### Visits
- `POST /opd/visits` - Create a new visit
- `GET /opd/visits/:id` - Get visit by ID
- `PUT /opd/visits/:id` - Update a visit
- `DELETE /opd/visits/:id` - Delete a visit

### Encounters
- `POST /opd/encounters` - Create a new encounter
- `GET /opd/encounters/:id` - Get encounter by ID
- `PUT /opd/encounters/:id` - Update an encounter
- `POST /opd/encounters/:id/complete` - Complete an encounter

### Prescriptions
- `POST /opd/prescriptions` - Create a new prescription
- `GET /opd/patients/:patientId/prescriptions` - Get all prescriptions for a patient
- `GET /opd/patients/:patientId/prescriptions/active` - Get active prescriptions

### Queue Management
- `POST /opd/queue/token` - Generate a new queue token
- `GET /opd/queue/current` - Get current token
- `POST /opd/queue/next` - Call next token

### Orders
- `POST /opd/orders` - Create a new order
- `GET /opd/encounters/:encounterId/orders` - Get orders for an encounter

### Documents
- `POST /opd/documents` - Upload a document
- `GET /opd/patients/:patientId/documents` - Get all documents for a patient

### Billing
- `POST /opd/bills/generate` - Generate a bill for an encounter
- `POST /opd/bills/:billId/pay` - Process a payment for a bill

### ICD-10 and Diagnosis
- `GET /opd/icd10?query=:query` - Search ICD-10 codes
- `POST /opd/diagnoses` - Create a new diagnosis
- `GET /opd/patients/:patientId/diagnoses` - Get all diagnoses for a patient

### Vitals
- `POST /opd/vitals` - Record patient vitals
- `GET /opd/patients/:patientId/vitals` - Get vitals history for a patient

## Authentication & Authorization

All endpoints require JWT authentication. The following roles are supported:

- `ADMIN`: Full access to all endpoints
- `DOCTOR`: Access to clinical functions (encounters, prescriptions, etc.)
- `NURSE`: Access to vitals, basic patient management
- `RECEPTIONIST`: Access to visit scheduling, queue management
- `BILLING`: Access to billing and payment functions

## Error Handling

The API returns appropriate HTTP status codes and error messages in the following format:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

## Validation

Input validation is performed using class-validator decorators. Invalid requests will return a 400 status code with validation error details.

## Rate Limiting

API rate limiting is implemented to prevent abuse. The default limit is 100 requests per 15 minutes per IP address.

## Testing

To run the test suite:

```bash
npm test opd
```

## Environment Variables

The following environment variables are required:

```
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
UPLOAD_DIR=./uploads
```

## Dependencies

- @nestjs/common
- @nestjs/typeorm
- typeorm
- @nestjs/swagger
- class-validator
- class-transformer
- multer (for file uploads)
- jsonwebtoken (for authentication)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
