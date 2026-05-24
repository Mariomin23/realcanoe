1. Arquitectura y Autenticación (RBAC)
Enfoque CRUD: Se prohíbe el uso de secciones monolíticas en el index. La lógica se divide en módulos independientes bajo el patrón CRUD.

Roles en MongoDB: El campo "role" en los documentos de usuario define el acceso:

"role": "user": Consulta de calendario, resultados y perfil.

"role": "admin": CRUD sobre partidos, actas y plantillas de su categoría.

"role": "superadmin": Acceso total, gestión de usuarios y auditoría.

----LOGIN----
Debe tener un campo de login arriba a la derecha

El "admin" y el "superadmin" puedes hacer edits de contenido

crea la posibilidad de que los admins y super admins puedan editar el contenido desde la web. que no haya que meter la mano en el codigo.

que se puedan subir fotos a las fichas de los jugadores en /plantilla. editar nombre y subir foto

----NAVEGACION----
debe dar sensacion de navegacion
Lo que si debes hacer: 
 pinchar en el Navbar debe ir a esa seccion. 

Lo que NO debes hacer: Prohibido que este todo el contenido en el index

2. Ciberseguridad
El asistente debe aplicar las siguientes normas mínimas en cada línea de código generado:

Prevención de Inyecciones (SQL/NoSQL):

Uso obligatorio de consultas parametrizadas o prepared statements (para SQL) o validación de esquemas con Mongoose (para MongoDB).

Nunca concatenar inputs de usuario directamente en las consultas.

Validación de Entradas: Limpieza y sanitización de todo el input (formularios, parámetros de URL).

Protección de Sesiones: Validación del role en el backend antes de cualquier ejecución CRUD.

Principio de Menor Privilegio: Asegurar que los endpoints solo ejecuten la lógica estrictamente necesaria para el rol autenticado.

3. Especialista UX/UI y Bootstrap
El asistente actuará como experto en interfaces, priorizando la usabilidad deportiva:

Responsive Design Obligatorio: Todo el desarrollo debe ser estrictamente mobile-first. La interfaz debe ser completamente funcional y legible en dispositivos móviles, tablets y escritorio, sin excepciones. Se debe asegurar que las tablas y elementos de datos no se rompan ni requieran desplazamiento horizontal excesivo en pantallas pequeñas.

Framework: Uso exclusivo de Bootstrap (versión 5+) para la maquetación responsiva.

Diseño:

Uso de grids y flexbox para asegurar la correcta visualización en dispositivos móviles (tablas de resultados y actas).

Implementar componentes de Bootstrap (Cards, Modals, Tables) para mejorar la densidad de información sin saturar al usuario.

Identidad: Mantener los colores corporativos (amarillo y azul marino) del Real Canoe.

UX Deportiva:

Tablas de clasificación con lazy loading o paginación para mejorar el rendimiento.

Priorizar la legibilidad en entornos exteriores (estadios/campos) bajo luz solar directa.

4. Reglas de Negocio (Rugby)
Cálculo: Clasificaciones dinámicas basadas en puntos de bonus (ofensivos/defensivos) según normativa federativa.

Actas: Registro detallado de ensayos, transformaciones, golpes, drops y tarjetas.

Formato: Fechas DD/MM/YYYY, horas 24h HH:MM.

5. Glosario Técnico
CRUD: Create, Read, Update, Delete.

RBAC: Role-Based Access Control (Control de Acceso basado en roles).

Sanitización: Proceso de limpieza de datos de entrada para evitar código malicioso.

Componentes Bootstrap: Elementos UI reutilizables (Botones, Navegación, Grids).