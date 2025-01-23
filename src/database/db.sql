CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  contraseña VARCHAR(12) NOT NULL,
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE developers (
    developer_id SERIAL PRIMARY KEY,               -- ID único para cada desarrollador
    developer_name VARCHAR(255) NOT NULL UNIQUE,           -- Nombre del desarrollador
    mentor_id INT REFERENCES developers(developer_id) NOT NULL,  -- Relación recursiva con el mentor
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Fecha de creación del registro
);

CREATE TYPE month_enum AS ENUM (
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
);

CREATE TABLE files (
    fileID_id SERIAL PRIMARY KEY,              -- ID único para cada archivo
    fileID VARCHAR(4) NOT NULL, --identificador de file, se repite dutrante el año de prod
    developer_id INT REFERENCES developers(developer_id) ON DELETE CASCADE,  -- Relacionado con la tabla 'developers'
    mentor_id INT REFERENCES developers(developer_id) ON DELETE CASCADE,
    release_month month_enum NOT NULL,              -- Mes de lanzamiento (ENERO-FEBRERO...)
    fiscal_year INT NOT NULL,                -- Año fiscal
    calidad NUMERIC(5,2) NOT NULL, -- Calidad (es un numero decimal.)
    tiempo_desarrollo NUMERIC(5,2) NOT NULL, -- TIEMPO de desarrollo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Fecha de creación del registro
);

-- Crear un índice compuesto para las columnas 'release_month' y 'fiscal_year'
CREATE INDEX idx_release_month_fiscal_year ON files(release_month, fiscal_year);

INSERT INTO developers (developer_name, mentor_id) VALUES
('Jazmin Toledo',1),('ALexis Huerta',2),('Avelino Gomez',3),('Brandon Marquez',1),('Miguel Sanchez',1),('Javier Belmont',1),('Noe Rodriguez',1)