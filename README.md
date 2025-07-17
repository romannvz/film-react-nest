# FILM!

Приложение на стеке **React + NestJS + PostgreSQL** с использованием Docker и двух окружений: **локального** и **продакшн**.

## Стек

- **Frontend**: React + Vite  
- **Backend**: NestJS + TypeORM  
- **Database**: PostgreSQL  
- **Reverse Proxy**: Nginx  
- **CI/CD**: Docker, Docker Compose  
- **SSL**: Let's Encrypt (prod only)

---

## Установка

### 0. Подготовка

Убедиться, что установлен `make`. Для Windows можно использовать `make` из Git Bash или WSL.

### 1. Клонировать проект

```bash
git clone https://github.com/romannvz/film-react-nest.git
cd film-react-nest
```

### 2. Установить зависимости

```bash
cd film-react-nest/frontend/
npm run install

cd film-react-nest/backend/
npm run install
```

---

### 3. Локальная разработка

Создать файл `docker/local/.env.local` на основе `docker/local/.env.local.example`:

```env
VITE_API_URL=/api/afisha       # адрес API
VITE_CDN_URL=/content/afisha   # адрес статики из backend

DATABASE_DRIVER=postgres
POSTGRES_HOST=postgres
POSTGRES_PORT=yourDbPort
POSTGRES_DB=yourDbName
POSTGRES_USER=yourDbUser
POSTGRES_PASSWORD=yourDbPassword
```

#### 3.1. Make-команды для удобного использования

```bash
make local-up             # поднять все сервисы
make local-down           # остановить контейнеры
make local-rebuild        # пересобрать и запустить заново
make local-start          # собрать и запустить
make local-logs           # логи всех сервисов

make local-shell-backend  # shell контейнера backend
make local-shell-frontend # shell контейнера frontend
```

#### 3.2. После запуска

- 🌐 http://localhost:8080/ — frontend  
- 🌐 http://localhost:3000/api/afisha/ — API

---

### 4. Продакшн 

#### Важно: на продакшне предполагается использование **внешнего, предустановленного и настроенного PostgreSQL** вне Docker.

Создать файл `docker/prod/.env.prod` на основе `docker/prod/.env.prod.example`:

```env
VITE_API_URL=https://yourBackendDomainName/api/afisha
VITE_CDN_URL=https://yourBackendDomainName/content/afisha

DATABASE_DRIVER=postgres
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=yourDbPort
POSTGRES_DB=yourDbName
POSTGRES_USER=yourDbUser
POSTGRES_PASSWORD=yourDbPassword
```

#### 4.1. Настройка конфигураций

Создать файл `docker/prod/nginx/prod.film.conf` на основе `docker/prod/nginx/prod.film.conf.example`:

```bash
server {
    listen 80;
    server_name yourFrontendDomain.name;
    ...
}

server {
    listen 80;
    server_name yourBackendDomain.name;
    ...
}
```

#### 4.2. Make-команды для удобного использования

```bash
make prod-build     # собрать образы
make prod-up        # запустить прод
make prod-down      # остановить прод
make prod-start     # собрать и запустить
```

#### 4.3. HTTPS и домены

1. Настроить A-записи доменов на IP виртуальной машины  
2. Запустить `make prod-start`  
3. Установить certbot и выполнить:

```bash
sudo certbot --nginx -d yourFrontendDomain.name -d yourBackendDomain.name
```

Let's Encrypt автоматически настроит редирект на HTTPS.

#### 4.4. После запуска

- 🌐 https://yourFrontendDomain.name/ — frontend  
- 🌐 https://yourBackendDomain.name/api/afisha/ — API


---

## Структура проекта

```
film-react-nest/
├── backend/               # NestJS backend
├── frontend/              # React frontend
├── docker/
│   ├── local/             # конфиги для разработки
│   └── prod/              # конфиги для продакшн
├── Makefile               # удобные команды
└── README.md
```
---
