# Neon CLI Setup Guide

## Overview

This guide provides detailed instructions for installing and configuring the Neon CLI (neonctl) for managing Neon PostgreSQL databases.

## Table of Contents

- [Installation](#installation)
- [Authentication](#authentication)
- [Basic Usage](#basic-usage)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Installation

### Prerequisites

- Node.js 18+ or Homebrew (for macOS users)
- Active Neon account (sign up at https://console.neon.tech)

### Installation Methods

#### Using npm

```bash
# Install globally
npm install -g neonctl

# Verify installation
neonctl --version
```

#### Using pnpm

```bash
# Install globally
pnpm add -g neonctl

# Verify installation
neonctl --version
```

#### Using Homebrew (macOS)

```bash
# Install
brew install neonctl

# Verify installation
neonctl --version
```

## Authentication

### Generating API Key

1. Log in to [Neon Console](https://console.neon.tech)
2. Navigate to Developer Settings
3. Click "Generate API Key"
4. Save the API key securely - it will only be shown once

### Setting Up Authentication

```bash
# Login with API key
neonctl auth login --key YOUR_API_KEY

# Verify authentication
neonctl me

# Check current configuration
neonctl config get
```

## Basic Usage

### Project Management

```bash
# List all projects
neonctl projects list

# Create new project
neonctl projects create --name PROJECT_NAME

# Get project details
neonctl projects get PROJECT_ID

# Delete project
neonctl projects delete PROJECT_ID
```

### Branch Operations

```bash
# List branches
neonctl branches list --project PROJECT_ID

# Create branch
neonctl branches create --name BRANCH_NAME --project PROJECT_ID

# Get branch details
neonctl branches get BRANCH_NAME --project PROJECT_ID

# Delete branch
neonctl branches delete BRANCH_NAME --project PROJECT_ID
```

### Connection Management

```bash
# Get connection string
neonctl connection-string --branch BRANCH_NAME --project PROJECT_ID

# Get connection string with pooling
neonctl connection-string --branch BRANCH_NAME --project PROJECT_ID --pooled

# Get connection string for direct connection
neonctl connection-string --branch BRANCH_NAME --project PROJECT_ID --direct
```

### Database Operations

```bash
# List databases
neonctl databases list --project PROJECT_ID --branch BRANCH_NAME

# Create database
neonctl databases create DATABASE_NAME --project PROJECT_ID --branch BRANCH_NAME

# Delete database
neonctl databases delete DATABASE_NAME --project PROJECT_ID --branch BRANCH_NAME
```

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   ```bash
   # Verify API key
   neonctl config get
   
   # Re-authenticate
   neonctl auth login --key YOUR_API_KEY
   ```

2. **Connection Issues**
   ```bash
   # Test connection
   neonctl connection-test --project PROJECT_ID
   
   # Check project status
   neonctl projects get PROJECT_ID
   ```

3. **Permission Errors**
   ```bash
   # Check current user
   neonctl me
   
   # Verify project access
   neonctl projects list
   ```

### Debug Mode

```bash
# Enable debug output
DEBUG=neonctl* neonctl command

# Enable trace output
DEBUG=neonctl*,trace neonctl command
```

## Best Practices

### Security

1. **API Key Management**
   - Store API keys securely
   - Use environment variables
   - Rotate keys periodically
   - Never commit keys to version control

2. **Access Control**
   - Use separate API keys for different environments
   - Limit API key permissions to required operations
   - Regularly audit API key usage

### Configuration

1. **Project Organization**
   ```bash
   # Use consistent naming
   neonctl projects create --name moodboard-prod
   neonctl projects create --name moodboard-staging
   neonctl projects create --name moodboard-dev
   ```

2. **Branch Management**
   ```bash
   # Create branches with clear purposes
   neonctl branches create --name main --project moodboard-prod
   neonctl branches create --name feature-x --project moodboard-dev
   ```

### Automation

1. **CI/CD Integration**
   ```bash
   # Example GitHub Actions setup
   - name: Setup Neon CLI
     run: npm install -g neonctl
   
   - name: Configure Neon CLI
     run: neonctl auth login --key ${{ secrets.NEON_API_KEY }}
   ```

2. **Scripting**
   ```bash
   # Example backup script
   #!/bin/bash
   PROJECT_ID="your-project-id"
   BRANCH="main"
   
   # Create backup
   neonctl backups create \
     --project $PROJECT_ID \
     --branch $BRANCH
   ```

## Environment Variables

```bash
# Required environment variables
export NEON_API_KEY="your_api_key"

# Optional environment variables
export NEON_PROJECT_ID="default_project_id"
export NEON_BRANCH="default_branch"
```

## References

- [Neon Documentation](https://neon.tech/docs)
- [Neon CLI Reference](https://neon.tech/docs/reference/cli-reference)
- [Neon API Documentation](https://neon.tech/docs/reference/api-reference) 