<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="./WhatsApp Image 2024-05-02 at 6.23.35 AM.jpeg" width="400" alt="Nest Logo" /></a>
</p>

# 🔒 NestJS Authentication Platform

Este proyecto implementa un sistema de autenticación y gestión de usuarios utilizando **NestJS**, con soporte para múltiples plataformas. Incorpora buenas prácticas de seguridad, manejo de tokens de actualización (refresh tokens), y autenticación basada en Firebase para una experiencia segura y eficiente en la gestión de usuarios. 

## 🚀 Funcionalidades Principales

- 🔐 **Autenticación Segura:** Utiliza JWT y Firebase para garantizar la seguridad en el inicio de sesión y protección de rutas.
- 🔄 **Manejo de Refresh Tokens:** Mejora la seguridad al permitir la renovación de tokens sin necesidad de que el usuario vuelva a iniciar sesión.
- 🧑‍💻 **Roles de Usuario y Permisos:** Control de acceso basado en roles (administrador, usuario, desarrollador).
- 📜 **Buenas Prácticas de Seguridad:** Protección de información sensible y políticas de contraseñas seguras.
- 🌐 **Plataforma Multi-dispositivo:** Soporte para múltiples plataformas a través de Firebase Authentication.

## 🏗️ Estructura del Proyecto

```md

├── auth_continetal/ 
│   ├── src/
│   │   ├── libs/
│   │   │   ├── auth/
│   │   │   │   ├── controller/
│   │   │   │   ├── dtos/
│   │   │   │   ├── guard/
│   │   │   │   ├── jwt/
│   │   │   │   ├── service/
│   │   │   │   ├── types/
│   │   │   │   ├── utils/
│   │   │   │   └── auth.module.ts
│   │   │   ├── decorators/
│   │   │   │
│   │   │   ├── common/
│   │   │   |
│   │   │   ├── firebase/
│   │   │   ├── persistence/
│   │   │   │   └── database.connection.ts
│   │   │   └── shared-modules/
│   │   │
│   │   ├
│   │   └──── modules/
│   │           ├── users/
│   │           └── Logs/
│   ├────── main.ts
│   └──────── app.module.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 📦 Instalación

Para clonar e instalar las dependencias, sigue estos pasos:

```bash
# Clonar el repositorio
$ git clone https://github.com/cristianManco/Auth_continental.git

# Cambiar al directorio del proyecto
$ cd Auth_continental

# Instalar las dependencias
$ npm install
```

## 🏃 Ejecución de la Aplicación

```bash
# Modo de desarrollo
$ npm run start

# Modo de observación
$ npm run start:dev

# Modo de producción
$ npm run start:prod
```

## ✅ Pruebas

```bash
# Pruebas unitarias
$ npm run test

# Pruebas de integración (e2e)
$ npm run test:e2e

# Cobertura de pruebas
$ npm run test:cov
```

## 🔍 Arquitectura de Componentes

El sistema sigue una arquitectura modular con componentes claramente definidos para facilitar el mantenimiento y escalabilidad:

- **Autenticación:** Gestiona la lógica de inicio de sesión y seguridad del sistema.
- **Base de Datos:** Almacena y maneja la información de los usuarios y sus roles.
- **Interfaz de Usuario:** Proporciona un entorno gráfico de swagger para interactuar con el sistema.

## 📋 Documentación de Carpetas y Archivos

- **src/**: Contiene la lógica principal de la aplicación.
  - **develop/**: Módulo de desarrollo con funcionalidades de autenticación.
    - **authenticate/**: Funcionalidades relacionadas con la autenticación.
      - **controller/**: Controladores para manejar solicitudes relacionadas con la autenticación.
      - **dtos/**: DTOs (Data Transfer Objects) para definir la estructura de los datos transferidos.
      - **guard/**: Guards para proteger rutas y controladores.
      - **jwt/**: Funcionalidades relacionadas con la generación y validación de tokens JWT.
      - **service/**: Servicios para manejar la lógica de autenticación.
      - **types/**: Tipos de datos personalizados.
      - **auth.module.ts**: Módulo de autenticación de NestJS.

## 🛡️ Seguridad y Buenas Prácticas

- 🔍 **Validación de Datos:** Se aplican técnicas de validación para garantizar la integridad de los datos de entrada.
- 🔒 **Cifrado de Contraseñas:** Utiliza técnicas de hashing seguras para almacenar las contraseñas.
- 🕵️‍♂️ **Protección de Rutas Sensibles:** Uso de guards para garantizar que solo los usuarios autorizados accedan a recursos protegidos.
- 📅 **Expiración de Tokens:** Configuración de tiempos de expiración para mejorar la seguridad de los tokens de acceso.

## 📚 Contribuciones

¡Contribuciones son bienvenidas! Si deseas mejorar el proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama para tu característica (`git checkout -b feature/nueva-caracteristica`).
3. Realiza los cambios y haz commit (`git commit -am 'Añadir una nueva característica'`).
4. Sube los cambios a la rama (`git push origin feature/nueva-caracteristica`).
5. Crea un nuevo Pull Request.

## 📬 Contacto

Autor 😊 - [Cristian Manco](https://github.com/cristianManco)

---
