# Резервное копирование и восстановление (Backup and Recovery)

## Оглавление

- [Резервное копирование и восстановление (Backup and Recovery)](#резервное-копирование-и-восстановление-backup-and-recovery)
  - [Оглавление](#оглавление)
  - [Стратегия резервного копирования](#стратегия-резервного-копирования)
    - [Типы резервных копий](#типы-резервных-копий)
    - [Политики хранения](#политики-хранения)
  - [Процедуры резервного копирования](#процедуры-резервного-копирования)
    - [База данных](#база-данных)
    - [Файлы пользователей](#файлы-пользователей)
  - [Процедуры восстановления](#процедуры-восстановления)
    - [План восстановления](#план-восстановления)
    - [Процедуры](#процедуры)
  - [Автоматизация](#автоматизация)
    - [Скрипты](#скрипты)
    - [Конфигурация](#конфигурация)
  - [Мониторинг и верификация](#мониторинг-и-верификация)
    - [Метрики](#метрики)
    - [Алерты](#алерты)

## Стратегия резервного копирования

### Типы резервных копий

```typescript
interface BackupTypes {
  full: {
    frequency: 'Еженедельно';
    retention: '3 месяца';
    components: [
      'База данных',
      'Файлы пользователей',
      'Конфигурации'
    ];
  };
  incremental: {
    frequency: 'Ежедневно';
    retention: '2 недели';
    components: [
      'Изменения в базе данных',
      'Новые файлы пользователей'
    ];
  };
  snapshot: {
    frequency: 'Каждые 6 часов';
    retention: '3 дня';
    components: [
      'Состояние базы данных',
      'Критические конфигурации'
    ];
  };
}
```

### Политики хранения

```yaml
retention_policies:
  database:
    full_backups:
      keep_last: 12  # 3 месяца
      schedule: '0 0 * * 0'  # Каждое воскресенье
    incremental:
      keep_last: 14  # 2 недели
      schedule: '0 0 * * *'  # Ежедневно
    snapshots:
      keep_last: 12  # 3 дня (4 снимка в день)
      schedule: '0 */6 * * *'  # Каждые 6 часов
  
  files:
    full_backups:
      keep_last: 12
      schedule: '0 0 * * 0'
    incremental:
      keep_last: 14
      schedule: '0 0 * * *'
```

## Процедуры резервного копирования

### База данных

1. **Полное резервное копирование**:
```typescript
interface DatabaseBackup {
  steps: [
    'Проверка состояния базы данных',
    'Создание резервной копии',
    'Сжатие и шифрование',
    'Загрузка в хранилище'
  ];
  commands: {
    check: 'pg_isready -h $DB_HOST';
    backup: 'pg_dump -Fc -Z9 -f backup.dump $DB_NAME';
    encrypt: 'gpg --encrypt --recipient $KEY_ID backup.dump';
    upload: 's3cmd put backup.dump.gpg s3://$BUCKET/db/';
  };
}
```

2. **Инкрементальное копирование**:
```yaml
incremental_backup:
  preparation:
    - verify_wal_archiving
    - check_available_space
    - validate_base_backup
  execution:
    - archive_wal_files
    - compress_archives
    - upload_to_storage
  verification:
    - check_archive_integrity
    - validate_sequence
    - test_recovery
```

### Файлы пользователей

```typescript
interface FileBackup {
  locations: {
    uploads: '/data/uploads';
    generated: '/data/generated';
    temp: '/data/temp';
  };
  exclusions: [
    '*.tmp',
    '*.log',
    'node_modules'
  ];
  methods: {
    rsync: 'Для инкрементального копирования';
    tar: 'Для полных резервных копий';
  };
}
```

## Процедуры восстановления

### План восстановления

```typescript
interface RecoveryPlan {
  priorities: {
    critical: [
      'База данных',
      'Аутентификация',
      'Основные API'
    ];
    important: [
      'Файлы пользователей',
      'Кэш',
      'Очереди'
    ];
    secondary: [
      'Аналитика',
      'Отчеты',
      'Архивы'
    ];
  };
  timeframes: {
    critical: '1 час';
    important: '4 часа';
    secondary: '24 часа';
  };
}
```

### Процедуры

```yaml
recovery_procedures:
  database:
    - name: Восстановление базы данных
      steps:
        - stop_application
        - restore_latest_backup
        - apply_wal_archives
        - verify_integrity
        - start_application
      commands:
        - pg_restore -d $DB_NAME backup.dump
        - pg_ctl promote
  
  files:
    - name: Восстановление файлов
      steps:
        - download_backup
        - verify_checksum
        - extract_files
        - restore_permissions
      commands:
        - aws s3 cp s3://$BUCKET/files .
        - tar xzf backup.tar.gz
```

## Автоматизация

### Скрипты

```typescript
interface BackupAutomation {
  scheduling: {
    cron: 'Планировщик задач';
    kubernetes: 'CronJob ресурсы';
    systemd: 'Системные таймеры';
  };
  monitoring: {
    prometheus: 'Метрики выполнения';
    grafana: 'Визуализация';
    alertmanager: 'Оповещения';
  };
  logging: {
    format: 'JSON';
    storage: 'Elasticsearch';
    retention: '30 дней';
  };
}
```

### Конфигурация

```yaml
automation_config:
  backup_job:
    schedule: '0 0 * * *'
    image: backup-tool:latest
    resources:
      cpu: '1'
      memory: '2Gi'
    env:
      - name: BACKUP_TARGET
        value: all
      - name: RETENTION_DAYS
        value: '90'
    volumes:
      - name: backup-storage
        persistentVolumeClaim:
          claimName: backup-pvc
```

## Мониторинг и верификация

### Метрики

```typescript
interface BackupMetrics {
  performance: {
    duration: 'Время выполнения';
    size: 'Размер резервной копии';
    compression_ratio: 'Степень сжатия';
  };
  reliability: {
    success_rate: 'Процент успешных операций';
    integrity_checks: 'Результаты проверок';
    recovery_tests: 'Тесты восстановления';
  };
  storage: {
    usage: 'Использование хранилища';
    retention: 'Соблюдение политик хранения';
    costs: 'Затраты на хранение';
  };
}
```

### Алерты

```yaml
backup_alerts:
  critical:
    - name: backup_failed
      condition: backup_status != 'success'
      duration: 1h
      annotations:
        summary: Ошибка резервного копирования
        description: Резервное копирование не выполнено
    
    - name: backup_size_anomaly
      condition: backup_size < 0.5 * avg_backup_size
      duration: 5m
      annotations:
        summary: Аномальный размер резервной копии
        description: Размер резервной копии значительно меньше обычного

  warning:
    - name: backup_duration_high
      condition: backup_duration > 4h
      annotations:
        summary: Длительное резервное копирование
        description: Время выполнения превышает норму

    - name: storage_usage_high
      condition: storage_usage > 80%
      annotations:
        summary: Высокое использование хранилища
        description: Необходимо очистить старые резервные копии
```