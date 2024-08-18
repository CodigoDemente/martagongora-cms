# CMS para la web martagongora.com

Este gestor de contenidos está desarrollado con [KeystoneJS](https://keystonejs.com/).

Hay una serie de requisitos a tener en cuenta para poder usarlo en local.

### Pre-requisitos

Debes tener instalado:

- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [PNPM](https://pnpm.io/es/installation)
- [NodeJS 18.18.0](https://nodejs.org/en/download/prebuilt-installer/current) (o [NVM](https://github.com/nvm-sh/nvm) en su defecto)

### Configuración

Para configurar el proyecto se usan variables de entorno.

Copia el archivo [.env.example](.env.example), renómbralo a `.env` y cambia las variables acorde a la siguiente tabla:

| Variable name               | Description                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| INSTAGRAM_CLIENT_ID         | ID de cliente de la aplicación para pedir fotos de Instagram                                     |
| INSTAGRAM_CLIENT_SECRET     | Secreto de cliente de la aplicación para pedir fotos de Instagram                                |
| INSTAGRAM_AUTH_REDIRECT_URI | URL de redirección al configurar las credenciales de la aplicación para pedir fotos de instagram |
| SESSION_SECRET              | Secreto para generar tokens y cookies de sesión                                                  |
| POSTGRES_USER               | Usuario de Postgres                                                                              |
| POSTGRES_PASSWORD           | Contraseña de Postgres                                                                           |
| POSTGRES_HOST               | Host de Postgres (`localhost` en local)                                                          |
| POSTGRES_PORT               | Puerto de Postgres (5432 por defecto)                                                            |
| POSTGRES_DB                 | Base de datos dentro de Postgres                                                                 |
| AWS_ACCESS_KEY_ID           | ID de la clave de acceso a AWS                                                                   |
| AWS_SECRET_ACCESS_KEY       | Secreto de la clave de acceso a AWS                                                              |
| S3_REGION                   | Región del bucket que almacena las imágenes                                                      |
| S3_BUCKET_NAME              | Nombre del bucket que almacena las imágenes                                                      |
| SMTP_HOST                   | Host del servidor de correo                                                                      |
| SMTP_PORT                   | Puerto del servidor de correo                                                                    |
| SMTP_USER                   | Usuario del servidor de correo                                                                   |
| SMTP_PASSWORD               | Contraseña del servidor de correo                                                                |
| CONTACT_EMAIL               | Email al que se enviarán las peticiones de contacto del formulario                               |

### Ejecución

Una vez tienes todas las herramientas instaladas y el archivo de variables de entorno, debes ejecutar:

```shell
docker compose up -d
```

Esto levanta la base de datos necesaria para el backend.

Si la instancia de Postgres que vas a usar ya la tienes desplegada y no necesitas levantarla en Docker, sáltate este paso.

El siguiente paso es instalar las dependencias:

```shell
pnpm install
```

Ahora solo queda ejecutar el proyecto lanzando el comand:

```shell
pnpm dev
```
