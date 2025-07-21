# FILM!

Приложение на стеке ***React*** + ***NestJS*** + ***PostgreSQL*** с использованием *Docker* и двух окружений: **локального** и **продакшн**.

## Стек

- **Frontend**: *React* + *Vite*
- **Backend**: *NestJS* + *TypeORM*
- **Database**: *PostgreSQL*
- **Reverse Proxy**: *Nginx*
- **CI/CD**: *Docker*, *Docker Compose*
- **SSL**: *Let's Encrypt (prod only)*

---

## Установка

### 1. Клонировать и установить зависимости

```bash
git clone https://github.com/romannvz/film-react-nest.git
cd film-react-nest
cd frontend && npm install && cd ../backend && npm install && cd ..
```

### 2. Локальная разработка

```bash
Make-команды для удобного использования:

make local-up             # поднять все сервисы
make local-down           # остановить контейнеры
make local-rebuild        # пересобрать и запустить заново
make local-start          # собрать и запустить
make local-logs           # логи всех сервисов

make local-shell-backend  # shell контейнера backend
make local-shell-frontend # shell контейнера frontend
```

- Скопировать *docker/local/.env.local.example* → *docker/local/.env.local*;
- Выполнить:
```bash
make local-start   # или make local-up
```
#### После запуска

- 🌐 http://localhost:5173/ — *frontend*  
- 🌐 http://localhost:3000/api/afisha/ — *API*

---

### 3. Продакшн 

```bash
Make-команды для удобного использования:

make prod-build     # собрать образы
make prod-up        # запустить прод
make prod-down      # остановить прод
make prod-start     # собрать и запустить
```

- Скопировать *docker/prod/.env.prod.example* → *docker/local/.env.prod*;
- При необходимости заранее поднять или удостовериться в работе *PostgreSQL* на хосте (см. *backend/README.md*)
- Выполнить:
```bash
make prod-start
```
#### После запуска

- 🌐 https://yourFrontendDomain.name/ — *frontend*
- 🌐 https://yourBackendDomain.name/api/afisha/ — *API*
<!-- #### 4.1. Настройка конфигураций

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



#### 4.3. HTTPS и домены

1. Настроить A-записи доменов на IP виртуальной машины  
2. Запустить `make prod-start`  
3. Установить certbot и выполнить:

```bash
sudo certbot --nginx -d yourFrontendDomain.name -d yourBackendDomain.name
```

Let's Encrypt автоматически настроит редирект на HTTPS. -->
---

## Структура проекта

```
film-react-nest/
├── backend/               # NestJS backend
├── frontend/              # React + Vite frontend
├── docker/                # config-директория
│   ├── local/             # dev-compose, nginx, .env.local.example
│   └── prod/              # prod-compose, nginx, .env.prod.example
├── Makefile               # удобные команды
└── README.md
```
---
