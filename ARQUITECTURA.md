# Arquitectura de Despliegue - Motor de Decisiones en la Nube

Este documento describe la arquitectura técnica del proyecto enfocado en el Desarrollo de un sistema inteligente de aprendizaje basado en gamificación para la enseñanza de fundamentos de programación y patrones de diseño orientado a la toma de decisiones en la resolución de problemas.

## 🏗️ Topología Cloud (Microsoft Azure)

Diseñé una arquitectura distribuida nativa en la nube separando las responsabilidades en tres capas fundamentales:

1. **La Vitrina (Frontend):**
   - **Tecnología:** Angular 17+ (Standalone Components, Signals).
   - **Infraestructura:** Azure Static Web Apps.
   - **Justificación:** Un cliente ciego desplegado en una red CDN global. No consume recursos de cómputo, garantizando tiempos de carga en milisegundos mediante un pipeline de CI/CD automatizado con GitHub Actions.

2. **El Cerebro (Backend):**
   - **Tecnología:** Java 21, Spring Boot 3, Spring Security (JWT).
   - **Infraestructura:** Azure App Service (PaaS).
   - **Justificación:** Lógica estricta de evaluación y motor de decisiones aislada en un entorno administrado. Se comunica con el frontend mediante estrictas políticas de CORS.

3. **La Bóveda (Persistencia):**
   - **Tecnología:** PostgreSQL.
   - **Infraestructura:** Azure Database for PostgreSQL (Flexible Server).
   - **Justificación:** Base de datos inmutable, protegida por firewalls y variables de entorno, garantizando el desacoplamiento total de los datos y el código.
