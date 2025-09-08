# API de Gestión de Inventario

## Descripción General

Esta API permite gestionar inventario de productos en distintos almacenes, manejando la concurrencia de manera efectiva mediante un sistema de colas. Implementa una arquitectura hexagonal (puertos y adaptadores) para facilitar su mantenimiento y escalabilidad.

## Diseño de la API

La API está construida siguiendo principios de arquitectura limpia y hexagonal, dividiendo claramente las responsabilidades en:

- **Dominio**: Reglas de negocio y entidades centrales
- **Aplicación**: Casos de uso e implementación de la lógica de negocio
- **Infraestructura**: Adaptadores para comunicación con sistemas externos

### Estructura del Proyecto

```
src/
├── application/        # Configuración de la aplicación
│   └── app.module.ts   # Módulo principal de la aplicación
├── core/               # Componentes centrales y transversales
│   └── pipes/          # Pipes para validación y transformación
│       └── joi-validation.pipe.ts  # Validación con Joi
├── lot/                # Módulo de gestión de lotes
│   ├── application/    # Casos de uso para lotes
│   │   └── usecases/   # Implementación de casos de uso
│   │       ├── add-lot.usecase.ts
│   │       ├── delete-lot.usecase.ts
│   │       ├── get-lot.usecase.ts
│   │       ├── update-lot.usecase.ts
│   │       └── update-stock.usecase.ts
│   ├── domain/         # Entidades, DTOs e interfaces
│   │   ├── dtos/       # Objetos de transferencia de datos
│   │   │   ├── lot.dtos.ts
│   │   │   └── update-lot-stock-response.dto.ts
│   │   ├── interfaces/ # Interfaces y contratos
│   │   │   ├── lot.repository.interface.ts
│   │   │   └── usecases/  # Interfaces de casos de uso
│   │   └── schemas/    # Esquemas de validación
│   └── infraestructure/  # Implementación de repositorios y controladores
│       ├── controllers/  # Controladores REST
│       │   ├── lots.controller.spec.ts
│       │   └── lots.controller.ts
│       ├── entities/     # Entidades para persistencia
│       │   └── lot.entity.ts
│       ├── queue/        # Implementación del sistema de colas
│       │   └── stock-update.queue.ts
│       └── lot.repository.ts  # Implementación del repositorio
├── products/           # Módulo de gestión de productos (estructura similar)
│   ├── application/
│   ├── domain/
│   └── infraestructure/
├── warehouse/          # Módulo de gestión de almacenes (estructura similar)
│   ├── application/
│   ├── domain/
│   └── infraestructure/
└── main.ts             # Punto de entrada de la aplicación
```

También incluye:
```
database/              # Almacenamiento de datos en archivos JSON
├── lots.json
├── products.json
└── warehouses.json
scripts/               # Scripts de utilidad y pruebas
├── queue-test.mjs     # Script de prueba de concurrencia
└── simulate-lots-load.mjs  # Simulador de carga
Dockerfile             # Configuración de Docker
```

## Endpoints Principales

### Gestión de Productos

- `GET /products/get/:id` - Obtener detalle de un producto
- `POST /products` - Crear un nuevo producto
- `PUT /products/:id` - Actualizar un producto existente
- `DELETE /products/delete/:id` - Eliminar un producto

### Gestión de Lotes

- `GET /lots/get/:id` - Obtener detalle de un lote
- `POST /lots` - Crear un nuevo lote
- `PUT /lots/:id` - Actualizar información de un lote
- `DELETE /lots/delete/:id` - Eliminar un lote
- `POST /lots/bulk-update-stock` - Actualizar stock de múltiples lotes (optimizado para concurrencia)
- `GET /lots/queue-status` - Obtener estado de la cola de procesamiento

### Gestión de Almacenes

- `GET /warehouses/get/:id` - Obtener detalle de un almacén
- `POST /warehouses` - Crear un nuevo almacén
- `PUT /warehouses/:id` - Actualizar información de un almacén
- `DELETE /warehouses/delete/:id` - Eliminar un almacén

## Instrucciones de Configuración

### Requisitos Previos

- Node.js versión 18.18.0
- npm versión 9.8.1
- NestJS CLI versión 10.1.18

### Pasos para la Instalación

1. **Configurar Node.js**

   ```bash
   nvm install 18.18.0
   nvm use 18.18.0
   ```

2. **Instalar NestJS CLI**

   ```bash
   npm install -g @nestjs/cli@10.1.18
   ```

3. **Clonar el repositorio e instalar dependencias**

   ```bash
   git clone https://github.com/carlosdencausa/inventory-managment-api
   npm install
   ```

4. **Iniciar la aplicación**

   ```bash
   npm run start:dev  # Modo desarrollo
   npm run start      # Modo producción
   ```

## Arquitectura Hexagonal y Beneficios

La elección de una arquitectura hexagonal para este proyecto responde a las siguientes necesidades:

### ¿Por qué Arquitectura Hexagonal?

1. **Independencia de la infraestructura**: Separamos completamente la lógica de negocio de los mecanismos de persistencia (JSON files) y de la capa de presentación (API REST).

2. **Testabilidad mejorada**: Los casos de uso son independientes y se pueden probar sin necesidad de mocks complejos de infraestructura.

3. **Adaptabilidad**: Si en el futuro necesitamos cambiar el almacenamiento de archivos JSON a una base de datos real, solo necesitaríamos implementar nuevos adaptadores sin modificar la lógica de negocio.

4. **Control de dependencias**: Las dependencias fluyen desde el exterior hacia el dominio, manteniendo el núcleo de la aplicación aislado de detalles técnicos.

5. **Manejo de concurrencia**: La arquitectura facilita la implementación del patrón productor-consumidor en la cola para manejar actualizaciones concurrentes sin bloqueos.

### Beneficios para el Manejo de Concurrencia

El diseño elegido permite:

- **Procesar operaciones secuencialmente**: Evitando condiciones de carrera
- **Mantener la integridad de datos**: A través del sistema de colas y locks de archivos
- **Escalar horizontalmente**: La arquitectura facilita la distribución de cargas en múltiples instancias
- **Monitorización en tiempo real**: Endpoints específicos para supervisar el estado del sistema

## Diagrama de la Arquitectura

```
┌────────────────────────────────────────────────────────────────┐
│                      API REST (Controllers)                    │
└─────────────────────────────┬──────────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────────┐
│                         Use Cases                              │
│                                                                │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │  Products Use   │    │  Lots Use Cases │    │ Warehouse   │ │
│  │     Cases       │    │  + Stock Queue  │    │ Use Cases   │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
└─────────────────────────────┬──────────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────────┐
│                    Domain (DTOs, Interfaces)                   │
└─────────────────────────────┬──────────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────────┐
│                       Repositories                             │
│                                                                │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │ProductRepository│    │ LotRepository   │    │ Warehouse   │ │
│  │                 │    │ + File Locking  │    │ Repository  │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
└─────────────────────────────┬──────────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────────┐
│                     JSON File Storage                          │
└────────────────────────────────────────────────────────────────┘
```

### Sistema de Cola para Manejo de Concurrencia

```
┌──────────────┐     ┌───────────────┐      ┌────────────────┐
│  Peticiones  │     │  Stock Update │      │  JSON File with │
│    HTTP      │────▶│     Queue     │─────▶│     Locking    │
└──────────────┘     └───────────────┘      └────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Monitoreo y  │
                    │  Estadísticas │
                    └───────────────┘
```

## Características Principales

- **Manejo de concurrencia**: Sistema de colas para actualización de stock
- **Persistencia con integridad**: Bloqueo de archivos para evitar corrupción de datos
- **Arquitectura escalable**: Diseño modular que facilita agregar nuevos módulos
- **API completa**: Soporte para todas las operaciones CRUD en productos, lotes y almacenes
- **Monitorización**: Endpoints para supervisar el estado del sistema

## Estrategia Técnica

### Configuración de Docker

El proyecto incluye una configuración Docker para facilitar su despliegue en cualquier entorno:

```dockerfile
FROM node:18.18.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

Esta configuración:

- Utiliza una imagen base ligera de Node.js 18.18.0 con Alpine
- Instala las dependencias en una capa separada para aprovechar el caché
- Compila la aplicación en el contenedor
- Expone el puerto 3000 para acceso externo
- Ejecuta la aplicación en modo producción

Para ejecutar la aplicación con Docker:

```bash
# Construir la imagen
docker build -t inventory-api .

# Ejecutar el contenedor
docker run -p 3000:3000 inventory-api
```

El contenedor monta los archivos JSON de la base de datos como volúmenes para permitir la persistencia de datos entre reinicios.

### Stack Tecnológico

El backend está construido utilizando las siguientes tecnologías:

- **Framework**: NestJS 10.1.18 - Framework progresivo de Node.js
- **Lenguaje**: TypeScript 5.1.3 - Superset de JavaScript con tipado estático
- **Persistencia**: Sistema de archivos JSON con proper-lockfile para control de concurrencia
- **Validación**: Joi y class-validator para validación de datos y DTOs
- **Transformación**: class-transformer para mapeo entre entidades y DTOs
- **Testing**: Jest para pruebas unitarias e integración
- **Documentación API**: Swagger/OpenAPI para documentación automática
- **Concurrencia**: Patrón productor-consumidor implementado con EventEmitter de Node.js

La estructura del proyecto sigue una arquitectura hexagonal, también conocida como puertos y adaptadores, donde:
- Los casos de uso actúan como puertos
- Los repositorios y controladores actúan como adaptadores

### Proceso de Construcción

Este proyecto fue desarrollado utilizando técnicas modernas de Ingeniería de Software Asistida por IA:

- **GitHub Copilot**: Integrado directamente en Visual Studio Code para la generación y asistencia de código en tiempo real, permitiendo una implementación más rápida y consistente de patrones de diseño.

- **Claude Sonnet 3.7**: Utilizado como agente avanzado para:
  - Diseño de la arquitectura hexagonal
  - Implementación del sistema de colas para manejo de concurrencia
  - Documentación del código y del proyecto
  - Resolución de problemas complejos como el manejo de bloqueos de archivos

La combinación de estas herramientas de IA permitió desarrollar rápidamente una solución robusta que implementa patrones de arquitectura avanzados, manteniendo un código limpio y bien documentado.
