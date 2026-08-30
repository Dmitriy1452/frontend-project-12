### Hexlet tests and linter status:
[![Actions Status](https://github.com/Dmitriy1452/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Dmitriy1452/frontend-project-12/actions)

Ссылка на приложение - https://frontend-project-12-gbis.onrender.com

# Быстрый старт

Эти инструкции помогут вам развернуть копию проекта на локальной машине.

## Требования

*   [Node.js](https://nodejs.org/) (версия 20.x.x или выше)

### Установка и запуск

1.  **Клонируйте репозиторий:**
    git clone git@github.com:Dmitriy1452/frontend-project-12.git
    cd frontend-project-12

2. Установите зависимости:
    Эта команда установит все необходимые пакеты как для фронтенд-части, так и для сервера.

    make install

3. Соберите фронтенд-приложение:

    make build

4. Запустите сервер:
    Эта команда запустит бэкенд-сервер, который также будет раздавать собранные статические файлы фронтенда.

    make start

5. Откройте приложение:
    После запуска сервера, откройте в браузере адрес: http://localhost:5001
