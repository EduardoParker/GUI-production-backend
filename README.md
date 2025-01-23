# GUI-production-backend

esta API fue creada con el opjetivo de ingresar y optener datos de produccion de una pequeña empresa, la API proporcionadatos como son el file ID (identificador de proyecto), nombre del desarollador, nombre de su mentor, fiscal year de dicho proyecto y el mes en el que se desarrollo.
la API acepta request post, get, put, delete y patch

el request GET solo se usa para la extraer la informacion del usuario (/users/me), para brindar una informacion personaliza

el request POST se usa la autenticacion, el inicion de sesion y registro, esto solo para el ingreso a al pagina.
ya en el cuerpo de la pagina se usa el post para ingresar todos los datos de produccion. tambine se usa este request para pedir la informacion, es decir, para general reporte por mes, desarrollador o mentor, se decidio usar post por la sensibilidad de los datos.

en cuanto a la base de datos se decidio usar la tecnologia SQL por la estructura de los datos ya que se desea que todos los registros tengan la misma informacion.

la base de datos tienen las siguientes tablas.

tabla 1. files

TABLE files

fileID_id SERIAL PRIMARY KEY, -- ID único para cada archivo
fileID VARCHAR(4) NOT NULL, --identificador de file, se repite dutrante el año de prod
developer_id INT REFERENCES developers(developer_id) ON DELETE CASCADE, -- Relacionado con la tabla 'developers'
mentor_id INT REFERENCES developers(developer_id) ON DELETE CASCADE,
release_month month_enum NOT NULL, -- Mes de lanzamiento (ENERO-FEBRERO...)
fiscal_year INT NOT NULL, -- Año fiscal
calidad NUMERIC(5,2) NOT NULL, -- Calidad (es un numero decimal.)
tiempo_desarrollo NUMERIC(5,2) NOT NULL, -- TIEMPO de desarrollo
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de creación del registro

tabla 2. desarrolladores

TABLE developers
developer_id SERIAL PRIMARY KEY, -- ID único para cada desarrollador
developer_name VARCHAR(255) NOT NULL UNIQUE, -- Nombre del desarrollador
mentor_id INT REFERENCES developers(developer_id) NOT NULL, -- Relación recursiva con el mentor
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de creación del registro

estas dos tablas tienen una relacion ya que todo proyecto tiene un desarrollador y todo desarrollador tiene un mentor asi que las queries deben de juntar estas dos tablas

tabla 3. users
TABLE users
id SERIAL PRIMARY KEY,
email VARCHAR(255) NOT NULL UNIQUE,
contraseña VARCHAR(12) NOT NULL,
create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

esta tabla solo se usa para registrar los usuarios para ingresar a la pagina. esta tabla no se relaciona de ninguna manera a las otras 2 tablas.
