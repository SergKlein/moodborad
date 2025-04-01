# Развертывание (Deployment)

## Оглавление

- [Развертывание (Deployment)](#развертывание-deployment)
  - [Оглавление](#оглавление)
  - [Обзор](#обзор)
  - [Требования](#требования)
    - [Инфраструктура](#инфраструктура)
    - [Зависимости](#зависимости)
  - [Окружения](#окружения)
    - [Development](#development)
    - [Staging](#staging)
    - [Production](#production)
  - [CI/CD](#cicd)
    - [GitHub Actions](#github-actions)
    - [Vercel Integration](#vercel-integration)
  - [Мониторинг](#мониторинг)
    - [Метрики](#метрики)
    - [Алерты](#алерты)
  - [Безопасность](#безопасность)
    - [Сканирование](#сканирование)
    - [Доступ](#доступ)
  - [Резервное копирование](#резервное-копирование)
    - [База данных](#база-данных)
    - [Файлы](#файлы)
  - [Масштабирование](#масштабирование)
    - [Автоматическое](#автоматическое)
    - [Ручное](#ручное)

## Обзор

Этот документ описывает процесс развертывания и управления инфраструктурой платформы Moodboard. Система использует современный стек технологий с акцентом на автоматизацию, безопасность и масштабируемость.

## Требования

### Инфраструктура

1. **Облачные сервисы**:
   - Vercel (основное приложение)
   - Supabase (база данных)
   - Replicate (AI модели)
   - Cloudflare R2 (хранение файлов)
   - Redis Enterprise (кэширование)

2. **Системные требования**:
   ```yaml
   # Минимальные требования для production
   database:
     cpu: 4 vCPU
     memory: 16GB
     storage: 100GB
   redis:
     cpu: 2 vCPU
     memory: 8GB
   application:
     scaling:
       min_instances: 2
       max_instances: 10
   ```

### Зависимости

1. **Внешние сервисы**:
   ```typescript
   interface ExternalDependencies {
     ai: {
       replicate: {
         apiKey: string;
         webhookSecret: string;
         models: string[];
       };
       openai: {
         apiKey: string;
         organization: string;
       };
     };
     storage: {
       r2: {
         accountId: string;
         accessKeyId: string;
         secretAccessKey: string;
         bucket: string;
       };
     };
     monitoring: {
       sentry: {
         dsn: string;
         environment: string;
       };
     };
   }
   ```

2. **Переменные окружения**:
   ```bash
   # .env.production
   # База данных
   DATABASE_URL="postgresql://..."
   DIRECT_DATABASE_URL="postgresql://..."
   
   # Redis
   REDIS_URL="rediss://..."
   
   # AI сервисы
   REPLICATE_API_KEY="..."
   OPENAI_API_KEY="..."
   
   # Хранилище
   R2_ACCOUNT_ID="..."
   R2_ACCESS_KEY_ID="..."
   R2_SECRET_ACCESS_KEY="..."
   R2_BUCKET_NAME="..."
   
   # Мониторинг
   SENTRY_DSN="..."
   ```

## Окружения

### Development

1. **Локальная разработка**:
   ```bash
   # Запуск локального окружения
   pnpm dev
   
   # Запуск с моками AI
   AI_MOCK=true pnpm dev
   
   # Запуск с локальной базой
   DATABASE_LOCAL=true pnpm dev
   ```

2. **Тестовое окружение**:
   ```bash
   # Запуск тестов
   pnpm test
   
   # E2E тесты
   pnpm test:e2e
   ```

### Staging

1. **Конфигурация**:
   ```yaml
   environment: staging
   domain: staging.moodboard.app
   features:
     aiMock: false
     debugMode: true
     analytics: true
   ```

2. **Развертывание**:
   ```bash
   # Деплой в staging
   pnpm deploy:staging
   
   # Проверка статуса
   pnpm status:staging
   ```

### Production

1. **Конфигурация**:
   ```yaml
   environment: production
   domain: moodboard.app
   features:
     aiMock: false
     debugMode: false
     analytics: true
   scaling:
     minInstances: 2
     maxInstances: 10
   ```

2. **Развертывание**:
   ```bash
   # Деплой в production
   pnpm deploy:prod
   
   # Проверка статуса
   pnpm status:prod
   ```

## CI/CD

### GitHub Actions

1. **Основной пайплайн**:
   ```yaml
   name: CI/CD
   on:
     push:
       branches: [main, develop]
     pull_request:
       branches: [main, develop]
   
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Setup Node.js
           uses: actions/setup-node@v2
         - name: Install dependencies
           run: pnpm install
         - name: Run tests
           run: pnpm test
         - name: Run E2E tests
           run: pnpm test:e2e
   
     deploy:
       needs: test
       if: github.ref == 'refs/heads/main'
       runs-on: ubuntu-latest
       steps:
         - name: Deploy to Vercel
           uses: vercel/actions@v2
   ```

2. **Автоматизация**:
   - Автоматические тесты для PR
   - Линтинг и форматирование
   - Проверка типов TypeScript
   - Сканирование зависимостей
   - Анализ производительности

### Vercel Integration

1. **Настройка проекта**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/next"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/$1"
       }
     ]
   }
   ```

2. **Деплой превью**:
   - Автоматическое создание для PR
   - Проверка производительности
   - Валидация изменений
   - Тестирование интеграций

## Мониторинг

### Метрики

1. **Производительность**:
   ```typescript
   interface PerformanceMetrics {
     responseTime: {
       p50: number;
       p95: number;
       p99: number;
     };
     errorRate: number;
     successRate: number;
     aiLatency: {
       generation: number;
       processing: number;
     };
   }
   ```

2. **Ресурсы**:
   ```typescript
   interface ResourceMetrics {
     cpu: {
       usage: number;
       throttling: number;
     };
     memory: {
       used: number;
       available: number;
     };
     storage: {
       used: number;
       available: number;
     };
   }
   ```

### Алерты

1. **Критические события**:
   ```yaml
   alerts:
     high_error_rate:
       threshold: 5%
       window: 5m
       channels: [slack, email]
     
     high_latency:
       threshold: 2000ms
       window: 5m
       channels: [slack]
     
     low_resources:
       cpu_threshold: 80%
       memory_threshold: 85%
       storage_threshold: 90%
       channels: [slack, email]
   ```

2. **Уведомления**:
   - Интеграция со Slack
   - Email оповещения
   - SMS для критических событий
   - Дежурные инженеры

## Безопасность

### Сканирование

1. **Код**:
   ```bash
   # Сканирование зависимостей
   pnpm audit
   
   # Сканирование кода
   pnpm security:scan
   
   # Проверка Docker образов
   pnpm docker:scan
   ```

2. **Инфраструктура**:
   - Регулярные проверки безопасности
   - Мониторинг доступа
   - Аудит изменений
   - Сканирование уязвимостей

### Доступ

1. **SSH ключи**:
   ```bash
   # Генерация ключей
   ssh-keygen -t ed25519 -C "deploy@moodboard.app"
   
   # Добавление в CI/CD
   gh secret set SSH_KEY < ~/.ssh/id_ed25519
   ```

2. **Secrets**:
   - Хранение в Vercel
   - Ротация ключей
   - Аудит доступа
   - Шифрование данных

## Резервное копирование

### База данных

1. **Расписание**:
   ```yaml
   backups:
     full:
       schedule: "0 0 * * *"  # Ежедневно
       retention: 30d
     incremental:
       schedule: "0 */6 * * *"  # Каждые 6 часов
       retention: 7d
   ```

2. **Восстановление**:
   ```bash
   # Восстановление из бэкапа
   pnpm db:restore --backup=<backup_id>
   
   # Проверка целостности
   pnpm db:verify --backup=<backup_id>
   ```

### Файлы

1. **Хранилище**:
   ```yaml
   storage:
     backup:
       provider: r2
       schedule: "0 0 * * *"
       retention: 90d
     replication:
       enabled: true
       regions: [eu-west, us-east]
   ```

2. **Архивация**:
   - Инкрементальное копирование
   - Географическая репликация
   - Проверка целостности
   - Автоматическое восстановление

## Масштабирование

### Автоматическое

1. **Правила**:
   ```yaml
   scaling:
     rules:
       cpu:
         target: 70%
         scaleUp: 80%
         scaleDown: 60%
       memory:
         target: 75%
         scaleUp: 85%
         scaleDown: 65%
     limits:
       min: 2
       max: 10
   ```

2. **Метрики**:
   - Использование CPU
   - Потребление памяти
   - Количество запросов
   - Время отклика

### Ручное

1. **Команды**:
   ```bash
   # Изменение количества инстансов
   pnpm scale:set --instances=5
   
   # Изменение размера инстансов
   pnpm scale:size --size=2x
   ```

2. **Мониторинг**:
   - Отслеживание нагрузки
   - Анализ трендов
   - Планирование мощностей
   - Оптимизация затрат