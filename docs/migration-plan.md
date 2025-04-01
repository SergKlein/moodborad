# План миграции на Next.js SaaS Starter

## Обзор

Этот документ описывает пошаговый план миграции на Next.js SaaS Starter шаблон с интеграцией AI функционала для проекта Moodboard.

## Содержание

- [Обзор](#обзор)
- [Предварительные требования](#предварительные-требования)
- [Фаза 1: Подготовка и настройка окружения](#фаза-1-подготовка-и-настройка-окружения)
- [Фаза 2: Адаптация базовой структуры](#фаза-2-адаптация-базовой-структуры)
- [Фаза 3: Интеграция AI функционала](#фаза-3-интеграция-ai-функционала)
- [Фаза 4: Реализация мудбордов](#фаза-4-реализация-мудбордов)
- [Фаза 5: Оптимизация и кэширование](#фаза-5-оптимизация-и-кэширование)
- [Фаза 6: Тестирование и развертывание](#фаза-6-тестирование-и-развертывание)
- [Контрольный список](#контрольный-список-миграции)
- [Временные оценки](#временные-оценки)
- [Риски и митигация](#риски-и-митигация)

## Предварительные требования

### Технические требования
- Node.js 18+
- pnpm 8+
- Git

### Доступы и ключи
- GitHub доступ
- Vercel аккаунт и токены
- OpenAI API ключ
- Stripe аккаунт и ключи
- Neon.tech аккаунт

### Знания и навыки
- TypeScript
- Next.js 14
- React Server Components
- Tailwind CSS
- Drizzle ORM
- tRPC

## Фаза 1: Подготовка и настройка окружения

### 1.1 Инициализация проекта
```bash
# Клонирование репозитория
git clone https://github.com/nextjs/saas-starter
cd saas-starter

# Установка зависимостей
pnpm install

# Настройка окружения
cp .env.example .env
```

### 1.2 Настройка Neon Database
```bash
# Создание проекта в Neon
# Получение Database URL и Edge URL
# Добавление в .env файл
```

### 1.3 Конфигурация переменных окружения
```env
# Основные настройки
BASE_URL=http://localhost:3000
AUTH_SECRET=your-secret-key

# База данных Neon
NEON_DATABASE_URL=postgres://user:password@...
EDGE_DATABASE_URL=postgres://user:password@...

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your-blob-token

# OpenAI для AI функционала
OPENAI_API_KEY=your-openai-key
```

## Фаза 2: Адаптация базовой структуры

### 2.1 Модификация схемы базы данных

#### Основные таблицы
```typescript
// src/db/schema/boards.ts
export const boards = pgTable('boards', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  userId: uuid('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// src/db/schema/board_items.ts
export const boardItems = pgTable('board_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  boardId: uuid('board_id').references(() => boards.id),
  blobId: varchar('blob_id', { length: 255 }).notNull(),
  url: varchar('url', { length: 1024 }).notNull(),
  position: json('position').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### Связи и индексы
```typescript
// src/db/schema/indexes.ts
export const boardsIndexes = [
  index('boards_user_id_idx').on(boards.userId),
  index('boards_created_at_idx').on(boards.createdAt),
];

export const boardItemsIndexes = [
  index('board_items_board_id_idx').on(boardItems.boardId),
  index('board_items_created_at_idx').on(boardItems.createdAt),
];
```

### 2.2 Создание миграций
```bash
# Создание новых миграций
pnpm drizzle-kit generate:pg

# Применение миграций
pnpm db:migrate
```

## Фаза 3: Интеграция AI функционала

### 3.1 Структура AI модулей

#### Сервисы
```typescript
src/
  ├─ ai/
  │   ├─ services/
  │   │   ├─ generation.ts      # Генерация изображений
  │   │   ├─ analysis.ts        # Анализ изображений
  │   │   └─ recommendations.ts # Рекомендации
  │   ├─ types/
  │   │   ├─ generation.ts
  │   │   └─ analysis.ts
  │   └─ utils/
  │       ├─ prompts.ts
  │       └─ validation.ts
```

### 3.2 Сервис для работы с изображениями
```typescript
// src/lib/blob-storage.ts
import { put, del } from '@vercel/blob';

export class ImageStorageService {
  async uploadImage(file: File) {
    const { url, blob } = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    });
    
    return {
      blobId: blob.pathname,
      url: url,
      metadata: {
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        type: blob.contentType,
      }
    };
  }

  async deleteImage(blobId: string) {
    await del(blobId);
  }
}
```

### 3.3 API роуты для AI и изображений
```typescript
src/
  └─ app/
      └─ api/
          ├─ ai/
          │   ├─ generate/
          │   │   └─ route.ts
          │   ├─ analyze/
          │   │   └─ route.ts
          │   └─ recommend/
          │       └─ route.ts
          └─ images/
              ├─ upload/
              │   └─ route.ts
              └─ delete/
                  └─ route.ts
```

## Фаза 4: Реализация мудбордов

### 4.1 Компоненты мудборда

#### Основные компоненты
```typescript
src/
  └─ components/
      └─ board/
          ├─ BoardCanvas.tsx    # Основной холст мудборда
          ├─ BoardItem.tsx      # Элемент мудборда
          ├─ DragHandle.tsx     # Компонент для drag-n-drop
          ├─ ImageUpload.tsx    # Загрузка изображений
          └─ BoardControls.tsx  # Элементы управления
```

#### Примеры реализации
```typescript
// src/components/board/BoardCanvas.tsx
export const BoardCanvas = ({ items, onReorder }: BoardCanvasProps) => {
  return (
    <div className="relative w-full h-full min-h-[600px] bg-background">
      {items.map((item) => (
        <BoardItem key={item.id} item={item} />
      ))}
    </div>
  );
};

// src/components/board/BoardItem.tsx
export const BoardItem = ({ item }: BoardItemProps) => {
  return (
    <div 
      className="absolute"
      style={{
        transform: `translate(${item.position.x}px, ${item.position.y}px) rotate(${item.position.rotation}deg)`,
        zIndex: item.position.z
      }}
    >
      <Image
        src={item.url}
        alt={item.metadata?.alt || ''}
        width={item.metadata?.width}
        height={item.metadata?.height}
        className="rounded-lg shadow-lg"
      />
    </div>
  );
};
```

### 4.2 Страницы мудборда
```typescript
src/
  └─ app/
      └─ dashboard/
          └─ boards/
              ├─ page.tsx
              ├─ [id]/
              │   └─ page.tsx
              └─ new/
                  └─ page.tsx
```

## Фаза 5: Оптимизация и кэширование

### 5.1 Настройка кэширования Next.js
```typescript
// Использование React Cache и Server Components
import { cache } from 'react'

export const getBoard = cache(async (id: string) => {
  const board = await db.query.boards.findFirst({
    where: eq(boards.id, id),
    with: {
      items: true
    }
  });
  return board;
});
```

### 5.2 Оптимизация изображений
```typescript
// src/lib/image-optimization.ts
import sharp from 'sharp';

export async function optimizeImage(file: File) {
  const buffer = await file.arrayBuffer();
  const optimized = await sharp(buffer)
    .resize(2000, 2000, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({ quality: 85 })
    .toBuffer();
  
  return new File([optimized], file.name.replace(/\.[^/.]+$/, '.webp'), {
    type: 'image/webp'
  });
}
```

## Фаза 6: Тестирование и развертывание

### 6.1 Настройка тестов

#### Unit тесты
```typescript
// src/tests/unit/board.test.ts
import { describe, it, expect } from 'vitest';
import { ImageStorageService } from '@/lib/blob-storage';

describe('ImageStorageService', () => {
  it('uploads image to Vercel Blob Storage', async () => {
    const service = new ImageStorageService();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    const result = await service.uploadImage(file);
    
    expect(result.url).toBeDefined();
    expect(result.blobId).toBeDefined();
  });
});
```

#### Интеграционные тесты
```typescript
// src/tests/integration/board.test.ts
describe('Board Integration', () => {
  it('creates board with items', async () => {
    const board = await createBoard({
      name: 'Test Board',
      userId: testUser.id,
    });
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const item = await addItemToBoard(board.id, file);
    
    expect(item.boardId).toBe(board.id);
    expect(item.url).toBeDefined();
  });
});
```

### 6.2 Развертывание

#### Настройка Vercel
```bash
# Установка Vercel CLI
pnpm add -g vercel

# Логин и привязка проекта
vercel link

# Настройка переменных окружения
vercel env pull
```

#### Настройка Neon
1. Создание production базы данных
2. Настройка connection pooling
3. Получение Edge-optimized URL

## Контрольный список миграции

### Подготовка
- [ ] Создание проекта в Vercel
- [ ] Создание проекта в Neon
- [ ] Настройка переменных окружения
- [ ] Проверка доступов к сервисам

### Разработка
- [ ] Модификация схемы базы данных
- [ ] Создание и применение миграций
- [ ] Интеграция Vercel Blob Storage
- [ ] Реализация компонентов мудборда
- [ ] Настройка оптимизации и кэширования
- [ ] Настройка аналитики и мониторинга

### Тестирование
- [ ] Написание unit-тестов
- [ ] Написание интеграционных тестов
- [ ] Тестирование производительности
- [ ] Проверка безопасности
- [ ] Тестирование доступности (a11y)

### Развертывание
- [ ] Настройка CI/CD в Vercel
- [ ] Настройка мониторинга
- [ ] Развертывание на staging
- [ ] Тестирование на staging
- [ ] Развертывание на production
- [ ] Мониторинг после деплоя

## Временные оценки

1. **Фаза 1**: 1 день
   - Настройка Vercel: 2 часа
   - Настройка Neon: 2 часа
   - Конфигурация: 4 часа

2. **Фаза 2**: 2 дня
   - Схема базы данных: 1 день
   - Миграции: 1 день

3. **Фаза 3**: 3 дня
   - AI сервисы: 1.5 дня
   - Blob Storage: 1.5 дня

4. **Фаза 4**: 4 дня
   - UI компоненты: 2 дня
   - Логика: 2 дня

5. **Фаза 5**: 2 дня
   - Кэширование: 1 день
   - Оптимизация: 1 день

6. **Фаза 6**: 2 дня
   - Тесты: 1 день
   - Деплой: 1 день

Общее время: 14 дней

## Риски и митигация

1. **Производительность базы данных**
   - Использование edge-оптимизированных URL Neon
   - Правильная настройка connection pooling
   - Мониторинг через Vercel Analytics
   - Кэширование через React Server Components

2. **Хранение изображений**
   - Оптимизация перед загрузкой
   - Использование WebP формата
   - Правильные размеры и качество
   - Мониторинг использования Blob Storage

3. **Edge функционал**
   - Тестирование на разных регионах
   - Использование edge runtime
   - Мониторинг latency
   - Правильная конфигурация кэширования

4. **Безопасность**
   - Регулярные проверки
   - Аудит кода
   - Сканирование уязвимостей
   - Мониторинг доступа

5. **Масштабирование**
   - Мониторинг нагрузки
   - Автоматическое масштабирование Neon
   - Оптимизация запросов
   - Правильное кэширование

## Поддержка и мониторинг

### Метрики для отслеживания
- Vercel Analytics и Speed Insights
- Neon Query Statistics
- Blob Storage использование
- Edge Function метрики
- Real User Monitoring (RUM)

### Инструменты мониторинга
- Vercel Dashboard
- Neon Console
- OpenTelemetry
- Sentry для ошибок
- Grafana для визуализации 