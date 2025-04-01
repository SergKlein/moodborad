# Настройки системы (System Settings)

## Оглавление

- [Настройки системы (System Settings)](#настройки-системы-system-settings)
  - [Оглавление](#оглавление)
  - [Обзор](#обзор)
  - [Конфигурация приложения](#конфигурация-приложения)
    - [Основные параметры](#основные-параметры)
    - [Кэширование](#кэширование)
  - [Настройки AI](#настройки-ai)
    - [Модели](#модели)
    - [Промпты](#промпты)
  - [Настройки безопасности](#настройки-безопасности)
    - [Аутентификация](#аутентификация)
    - [CORS](#cors)
  - [Настройки производительности](#настройки-производительности)
    - [Лимиты](#лимиты)
    - [Оптимизация](#оптимизация)
  - [Настройки интерфейса](#настройки-интерфейса)
    - [Тема](#тема)
    - [Адаптивность](#адаптивность)
  - [Настройки уведомлений](#настройки-уведомлений)
    - [Email](#email)
    - [Push](#push)
  - [Настройки интеграций](#настройки-интеграций)
    - [Внешние сервисы](#внешние-сервисы)
    - [Мониторинг](#мониторинг)

## Обзор

Этот документ описывает все конфигурационные параметры и настройки платформы Moodboard. Настройки разделены на логические группы и включают значения по умолчанию, допустимые диапазоны и рекомендации по использованию.

## Конфигурация приложения

### Основные параметры

1. **Общие настройки**:
   ```typescript
   interface AppConfig {
     name: string;
     version: string;
     environment: 'development' | 'staging' | 'production';
     debug: boolean;
     maintenance: {
       enabled: boolean;
       message?: string;
     };
   }
   ```

2. **Региональные настройки**:
   ```typescript
   interface LocaleConfig {
     defaultLocale: string;
     supportedLocales: string[];
     fallbackLocale: string;
     dateFormat: string;
     timeFormat: string;
     timezone: string;
   }
   ```

### Кэширование

1. **Redis**:
   ```typescript
   interface CacheConfig {
     driver: 'redis';
     prefix: string;
     ttl: number;
     maxSize: number;
     invalidation: {
       strategy: 'immediate' | 'lazy';
       patterns: string[];
     };
   }
   ```

2. **Стратегии**:
   ```yaml
   cache:
     strategies:
       assets:
         ttl: 7d
         invalidation: immediate
       api:
         ttl: 1h
         invalidation: lazy
       session:
         ttl: 24h
         invalidation: immediate
   ```

## Настройки AI

### Модели

1. **Конфигурация моделей**:
   ```typescript
   interface AIModelConfig {
     provider: 'replicate' | 'openai';
     model: string;
     version: string;
     parameters: {
       temperature: number;
       maxTokens: number;
       topP: number;
       frequencyPenalty: number;
       presencePenalty: number;
     };
   }
   ```

2. **Ограничения**:
   ```yaml
   ai_limits:
     requests:
       per_user: 100
       per_hour: 1000
     concurrent:
       per_user: 2
       total: 20
     size:
       max_input: 4096
       max_output: 8192
   ```

### Промпты

1. **Шаблоны**:
   ```typescript
   interface PromptTemplate {
     id: string;
     type: 'text_to_image' | 'image_to_image' | 'style_transfer';
     template: string;
     parameters: {
       required: string[];
       optional: string[];
     };
     defaults: Record<string, any>;
   }
   ```

2. **Валидация**:
   ```yaml
   prompt_validation:
     min_length: 10
     max_length: 1000
     required_fields:
       - type
       - content
       - style
     forbidden_words: []
   ```

## Настройки безопасности

### Аутентификация

1. **JWT**:
   ```typescript
   interface AuthConfig {
     jwt: {
       secret: string;
       expiresIn: string;
       refreshIn: string;
       algorithm: string;
     };
     session: {
       name: string;
       secure: boolean;
       httpOnly: boolean;
       maxAge: number;
     };
   }
   ```

2. **Ограничения**:
   ```yaml
   auth_limits:
     max_attempts: 5
     lockout_duration: 15m
     password_policy:
       min_length: 8
       require_numbers: true
       require_symbols: true
       require_uppercase: true
     session:
       max_concurrent: 5
       absolute_timeout: 24h
   ```

### CORS

1. **Настройки**:
   ```typescript
   interface CorsConfig {
     origin: string[];
     methods: string[];
     allowedHeaders: string[];
     exposedHeaders: string[];
     credentials: boolean;
     maxAge: number;
   }
   ```

2. **Правила**:
   ```yaml
   cors_rules:
     allowed_origins:
       - https://moodboard.app
       - https://*.moodboard.app
     allowed_methods:
       - GET
       - POST
       - PUT
       - DELETE
     max_age: 86400
   ```

## Настройки производительности

### Лимиты

1. **API**:
   ```typescript
   interface RateLimits {
     window: string;
     max: number;
     blacklist: string[];
     whitelist: string[];
     headers: boolean;
     skipFailedRequests: boolean;
   }
   ```

2. **Ресурсы**:
   ```yaml
   resource_limits:
     upload:
       max_size: 10MB
       allowed_types:
         - image/jpeg
         - image/png
         - image/webp
     request:
       timeout: 30s
       max_payload: 5MB
     response:
       timeout: 60s
       max_size: 10MB
   ```

### Оптимизация

1. **Изображения**:
   ```typescript
   interface ImageConfig {
     quality: number;
     format: 'jpeg' | 'webp' | 'avif';
     sizes: number[];
     placeholder: 'blur' | 'empty';
     cache: boolean;
   }
   ```

2. **Компрессия**:
   ```yaml
   compression:
     enabled: true
     level: 6
     threshold: 1024
     types:
       - text/html
       - text/css
       - application/javascript
       - application/json
   ```

## Настройки интерфейса

### Тема

1. **Цвета**:
   ```typescript
   interface ThemeConfig {
     colors: {
       primary: string;
       secondary: string;
       accent: string;
       background: string;
       text: string;
     };
     darkMode: {
       enabled: boolean;
       auto: boolean;
     };
   }
   ```

2. **Компоненты**:
   ```yaml
   ui_components:
     buttons:
       radius: 8px
       padding: 12px
       animation: true
     inputs:
       radius: 6px
       padding: 10px
       validation: true
     cards:
       radius: 12px
       shadow: true
   ```

### Адаптивность

1. **Брейкпоинты**:
   ```typescript
   interface Breakpoints {
     xs: number;
     sm: number;
     md: number;
     lg: number;
     xl: number;
     xxl: number;
   }
   ```

2. **Сетка**:
   ```yaml
   grid:
     columns: 12
     gap: 16px
     container:
       padding: 16px
       max_width: 1280px
     breakpoints:
       mobile: 320px
       tablet: 768px
       desktop: 1024px
   ```

## Настройки уведомлений

### Email

1. **SMTP**:
   ```typescript
   interface EmailConfig {
     provider: 'smtp' | 'sendgrid' | 'ses';
     from: {
       name: string;
       email: string;
     };
     templates: {
       welcome: string;
       reset: string;
       notification: string;
     };
   }
   ```

2. **Шаблоны**:
   ```yaml
   email_templates:
     welcome:
       subject: "Добро пожаловать в Moodboard"
       priority: high
     notification:
       subject: "Новое уведомление"
       priority: normal
     digest:
       subject: "Еженедельный дайджест"
       priority: low
   ```

### Push

1. **Конфигурация**:
   ```typescript
   interface PushConfig {
     enabled: boolean;
     provider: 'firebase' | 'onesignal';
     vapidKeys: {
       public: string;
       private: string;
     };
     topics: string[];
   }
   ```

2. **Правила**:
   ```yaml
   push_rules:
     quiet_hours:
       start: "22:00"
       end: "08:00"
     batching:
       enabled: true
       interval: 15m
     priority:
       high: immediate
       normal: batched
       low: digest
   ```

## Настройки интеграций

### Внешние сервисы

1. **API**:
   ```typescript
   interface ExternalServices {
     analytics: {
       provider: string;
       trackingId: string;
       options: Record<string, any>;
     };
     storage: {
       provider: string;
       bucket: string;
       region: string;
     };
     search: {
       provider: string;
       index: string;
       apiKey: string;
     };
   }
   ```

2. **Webhooks**:
   ```yaml
   webhooks:
     endpoints:
       - url: https://api.example.com/webhook
         events:
           - prompt.created
           - prompt.completed
         retry:
           attempts: 3
           delay: 5s
     security:
       signature_header: X-Signature
       timestamp_header: X-Timestamp
       max_age: 300s
   ```

### Мониторинг

1. **Метрики**:
   ```typescript
   interface MonitoringConfig {
     provider: 'sentry' | 'datadog';
     sampleRate: number;
     environment: string;
     tags: Record<string, string>;
     ignoreErrors: string[];
   }
   ```

2. **Логирование**:
   ```yaml
   logging:
     level: info
     format: json
     outputs:
       - type: file
         path: /var/log/moodboard.log
         rotation: daily
       - type: stdout
         format: pretty
     fields:
       service: moodboard
       version: 1.0.0
   ```