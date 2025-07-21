# FILM! *Backend — Production Setup*

Этот файл описывает специфичные шаги для развёртывания ***backend*** в продакшн‑режиме.

---

## Предварительные требования
- *PostgreSQL* установлен и запущен **на хосте** (не в *Docker*).  
- Конфигурация *PostgreSQL*:

  1. **`postgresql.conf`**  

     ```bash
     listen_addresses = '*'  
     port = 5432
     ```
  2. **`pg_hba.conf`**  

     ```bash
     # разрешить подключения из Docker-подсетей
     host  all  all  172.0.0.0/(8||16)  md5
     ```

- Перезапустить *PostgreSQL*:  
  ```bash
  sudo systemctl restart postgresql
  ```

## Переменные окружения (*.env.prod*)
Создать *docker/prod/.env.prod* со следующими ключами:
```bash
VITE_API_URL=https://yourBackendDomain.name/api/afisha
VITE_CDN_URL=https://yourBackendDomain.name/content/afisha

LOGGER_MODE=dev # dev | json | tskv

DATABASE_DRIVER=postgres
POSTGRES_HOST=host.docker.internal   # или 127.0.0.1, если network_mode=host
POSTGRES_PORT=5432
POSTGRES_DB=yourDbName
POSTGRES_USER=yourDbUser
POSTGRES_PASSWORD=yourDbUserPswrd
```
## Настройка конфигураций

Создать файл *docker/prod/nginx/prod.film.conf*:

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
## *HTTPS* и домены

- Настроить *A*-записи доменов на *IP* виртуальной машины;
- Установить *certbot* и выполнить:
```bash
sudo certbot --nginx -d yourFrontendDomain.name -d yourBackendDomain.name
```
*Let's Encrypt* автоматически настроит редирект на *HTTPS*.

## Запуск

В корне проекта:
```bash
make prod-start
```

Этот *Makefile* вызывает
```bash
docker-compose -f docker/prod/docker-compose.prod.yml up --build -d
```
---

После этого бэкенд автоматически подключится к внешнему *Postgres* и будет доступен внутри *Docker*‑сети для *Nginx*.