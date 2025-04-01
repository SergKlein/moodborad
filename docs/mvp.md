# Moodboard MVP Documentation

## Table of Contents

- [Moodboard MVP Documentation](#moodboard-mvp-documentation)
  - [Table of Contents](#table-of-contents)
  - [Simple Overview](#simple-overview)
    - [What We're Creating?](#what-were-creating)
    - [Basic Features for Users](#basic-features-for-users)
      - [1. Registration and Login](#1-registration-and-login)
      - [2. Project Creation](#2-project-creation)
      - [3. Working with Results](#3-working-with-results)
      - [4. Restrictions of Free Version](#4-restrictions-of-free-version)
    - [Technical Features](#technical-features)
  - [Core Features](#core-features)
    - [Essential Functionality](#essential-functionality)
  - [Related Documents](#related-documents)

## Simple Overview

### What We're Creating?

We're developing a web application that helps people create interior design with the help of artificial intelligence. The user describes the room they want to decorate, and the system generates design options.

### Basic Features for Users

#### 1. Registration and Login

- You can register using email or Google account
- For security, a one-time confirmation code is used
- Each new user gets 10 free attempts to create design

#### 2. Project Creation

- Step-by-step assistant will guide you through the entire process
- You can choose the room type (e.g., bedroom, kitchen, living room)
- You can specify the style and specific requirements for the design
- The system will immediately suggest 3 design options for you to choose from

#### 3. Working with Results

- You can save liked options
- You can download images in different formats
- You have the option to leave a review for each option
- Access to the history of all created projects

#### 4. Restrictions of Free Version

- 10 free attempts to create design
- Maximum 10 generations per day
- Up to 50 generations per month
- Option to buy additional attempts

### Technical Features

- The site works quickly (page load time less than 2 seconds)
- Design creation takes no more than 15 seconds
- The system works reliably (99.9% uptime)

## Core Features

### Essential Functionality

```typescript
interface MVPTargets {
  users: {
    initial: 100;           // Initial user base
    growth: '10% weekly';   // Expected growth
    concurrent: 20;         // Concurrent users
  };
  performance: {
    pageLoad: '< 2s';      // Page load time
    generation: '< 15s';    // AI generation time
    availability: '99.9%';  // System uptime
  };
}
```

// ... existing code ...

## Related Documents

- [Full Architecture](./architecture.md)
- [Complete API Specification](./api.md)
- [Security Guidelines](./security.md)
- [Development Guide](./development.md)

_Last updated: 2024-03-27_