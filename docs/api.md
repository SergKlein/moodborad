# API Documentation

## Table of Contents

- [API Documentation](#api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Prerequisites](#prerequisites)
  - [Authentication](#authentication)
  - [Response Format](#response-format)
    - [Success Response](#success-response)
    - [Error Response](#error-response)
  - [Endpoints](#endpoints)
    - [Authentication](#authentication-1)
      - [Login User](#login-user)
    - [Taxonomy](#taxonomy)
      - [List Categories](#list-categories)
      - [Create Category](#create-category)
      - [Get Category](#get-category)
      - [Update Category](#update-category)
      - [Delete Category](#delete-category)
    - [Moodboards](#moodboards)
      - [Create Moodboard](#create-moodboard)
      - [Get Moodboard](#get-moodboard)
      - [Update Moodboard](#update-moodboard)
      - [Delete Moodboard](#delete-moodboard)
    - [Image Generation](#image-generation)
      - [Generate Image](#generate-image)
      - [Generate Variations](#generate-variations)
    - [Assets](#assets)
      - [Upload File](#upload-file)
  - [Error Handling](#error-handling)
    - [Error Codes](#error-codes)
  - [Rate Limiting](#rate-limiting)
  - [Security](#security)
    - [CORS Configuration](#cors-configuration)
  - [Versioning](#versioning)
    - [Version Lifecycle](#version-lifecycle)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
    - [Support](#support)

## Overview

This document outlines the API architecture and specifications for the Moodboard platform. The API is designed to provide secure, efficient, and type-safe communication between client applications and the server.

**Base URL**: `/api/v1`

## Prerequisites

- Valid API credentials
- HTTPS-enabled client
- JSON request/response capability
- Support for JWT authentication

## Authentication

All requests must include a JWT token in the Authorization header:

```http
Authorization: Bearer <token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": "<response_data>",
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 100
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

## Endpoints

### Authentication

#### Login User

Authenticates a user and returns a JWT token.

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`

```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

### Taxonomy

#### List Categories

Retrieves a paginated list of taxonomy categories.

```http
GET /taxonomy/categories
```

**Query Parameters:**

- `type` (string): Category type (style, room, color-scheme)
- `parentId` (string): Parent category ID
- `page` (number): Page number
- `perPage` (number): Items per page

**Response:** `200 OK`

```json
{
  "categories": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "type": "string",
      "path": "string",
      "visualTags": ["string"],
      "attributes": {}
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 100
  }
}
```

#### Create Category

Creates a new taxonomy category.

```http
POST /taxonomy/categories
```

**Request Body:**

```json
{
  "name": "string",
  "type": "string",
  "parentId": "string?",
  "visualTags": ["string"],
  "attributes": {}
}
```

**Response:** `201 Created`

#### Get Category

Retrieves a specific category by ID.

```http
GET /taxonomy/categories/{id}
```

**Response:** `200 OK`

#### Update Category

Updates an existing category.

```http
PUT /taxonomy/categories/{id}
```

**Request Body:**

```json
{
  "name": "string",
  "visualTags": ["string"],
  "attributes": {}
}
```

**Response:** `200 OK`

#### Delete Category

Removes a category.

```http
DELETE /taxonomy/categories/{id}
```

**Response:** `204 No Content`

### Moodboards

#### Create Moodboard

Creates a new moodboard.

```http
POST /moodboards
```

**Request Body:**

```json
{
  "name": "string",
  "description": "string?",
  "categories": ["string"],
  "attributes": {}
}
```

**Response:** `201 Created`

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "status": "draft",
  "categories": ["string"],
  "attributes": {}
}
```

#### Get Moodboard

Retrieves a specific moodboard.

```http
GET /moodboards/{id}
```

**Response:** `200 OK`

#### Update Moodboard

Updates an existing moodboard.

```http
PUT /moodboards/{id}
```

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "categories": ["string"],
  "attributes": {}
}
```

**Response:** `200 OK`

#### Delete Moodboard

Removes a moodboard.

```http
DELETE /moodboards/{id}
```

**Response:** `204 No Content`

### Image Generation

#### Generate Image

Generates images based on provided parameters.

```http
POST /generate/image
```

**Request Body:**

```json
{
  "prompt": "string",
  "style": "string?",
  "categories": ["string"],
  "attributes": {},
  "service": "openai|replicate"
}
```

**Response:** `200 OK`

```json
{
  "images": [
    {
      "url": "string",
      "width": "number",
      "height": "number"
    }
  ]
}
```

#### Generate Variations

Creates variations of an existing image.

```http
POST /generate/variations
```

**Request Body:**

```json
{
  "imageUrl": "string",
  "count": "number",
  "style": "string?",
  "attributes": {}
}
```

**Response:** `200 OK`

```json
{
  "variations": [
    {
      "url": "string",
      "width": "number",
      "height": "number"
    }
  ]
}
```

### Assets

#### Upload File

Uploads a file to the system.

```http
POST /assets/upload
```

**Request Body:** `multipart/form-data`

- `file`: File
- `type`: string (image|document)
- `metadata`: JSON string

**Response:** `201 Created`

```json
{
  "url": "string",
  "key": "string",
  "contentType": "string",
  "metadata": {}
}
```

## Error Handling

### Error Codes

| Code | Description |
|------|-------------|
| AUTH_REQUIRED | Authentication required |
| INVALID_CREDENTIALS | Invalid credentials provided |
| FORBIDDEN | Insufficient permissions |
| NOT_FOUND | Resource not found |
| VALIDATION_ERROR | Data validation error |
| RATE_LIMIT | Rate limit exceeded |
| SERVICE_ERROR | External service error |
| INTERNAL_ERROR | Internal server error |

## Rate Limiting

The API implements the following rate limits:

- Authenticated users: 1000 requests/hour
- Image generation: 100 requests/hour
- Unauthenticated users: 50 requests/hour

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Security

The API implements several security measures:

- HTTPS required for all requests
- CORS support for allowed domains
- Rate limiting for DDoS protection
- Input validation using Zod
- CSRF protection via tokens

### CORS Configuration

Allowed origins and methods are configured per environment:

```javascript
// Development
origins: ['localhost', '*.localhost']

// Production
origins: ['*.moodboard.com']
```

## Versioning

The API uses URL versioning:

- Current version: `v1`
- Base path: `/api/v{version_number}`
- Supported versions: `v1`

### Version Lifecycle

- Beta: Breaking changes with notice
- Stable: No breaking changes
- Deprecated: 6 months sunset period

## Troubleshooting

### Common Issues

1. Authentication Errors
   - Verify token is valid and not expired
   - Check token format in Authorization header

2. Rate Limiting
   - Monitor rate limit headers
   - Implement exponential backoff

3. Validation Errors
   - Check request payload against schema
   - Verify required fields are present

### Support

For API support:

- Email: api-support@moodboard.com
- Documentation: docs.moodboard.com
- Status: status.moodboard.com