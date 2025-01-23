const { pool } = require("../db.js");

module.exports.insertData = async (req, res) => {
  try {
    const data = req.body;

    const mentorName = await pool.query(
      `SELECT developer_id FROM developers WHERE developer_name = $1`,
      [data.mentor_name]
    );
    if (mentorName.rowCount === 0) {
      // Si no se encuentra el mentor, lanzamos un error
      throw new Error(`Mentor con nombre ${data.mentor_name} no encontrado.`);
    }

    const mentor_id = mentorName.rows[0].developer_id;

    const developerExist = await pool.query(
      `SELECT developer_id FROM developers WHERE developer_name = $1`,
      [data.developer_name]
    );

    let developerId;

    if (developerExist.rowCount > 0) {
      // Si el desarrollador ya existe, usamos su developer_id
      developerId = developerExist.rows[0].developer_id;
    } else {
      // Si el desarrollador no existe, lo insertamos y obtenemos su developer_id
      const resDev = await pool.query(
        `INSERT INTO developers (developer_name, mentor_id)
         VALUES ($1, $2)
         RETURNING developer_id`,
        [data.developer_name, mentor_id]
      );

      developerId = resDev.rows[0].developer_id;
    }

    const checkFile = await pool.query(
      `SELECT 1 FROM files
       WHERE fileid = $1
       AND developer_id = $2
       AND release_month = $3
       AND fiscal_year = $4`,
      [data.fileid, developerId, data.release_month, data.fiscal_year]
    );

    if (checkFile.rowCount > 0) {
      // Si ya existe un archivo con esos mismos datos, lanzamos un error
      throw new Error(
        `El archivo con fileID ${data.fileid} ya existe para el desarrollador ${data.developer_name} en el mes ${data.release_month} del año fiscal ${data.fiscal_year}.`
      );
    }

    await pool.query(
      `INSERT INTO files (fileid, developer_id, mentor_id, release_month, fiscal_year, calidad, tiempo_desarrollo)
      VALUES ($1, $2, $3, $4, $5,$6,$7)`,
      [
        data.fileid,
        developerId,
        mentor_id,
        data.release_month,
        data.fiscal_year,
        data.calidad,
        data.tiempo_desarrollo,
      ]
    );
    res.status(200).json({ message: "Datos insertados correctamente" });
  } catch (error) {
    console.log(error);
    await pool.query("ROLLBACK");
    console.error("Error al insertar los datos:", error);
    res
      .status(500)
      .json({ message: "Error al insertar los datos", error: error.message });
  }
};
////////////
module.exports.mensualReport = async (req, res) => {
  const data = req.body;
  const query = `SELECT d.developer_name, f.fileid, f.release_month, f.fiscal_year, f.calidad, f.tiempo_desarrollo
       FROM files f
       JOIN developers d ON f.developer_id = d.developer_id
       WHERE f.release_month = $1 AND f.fiscal_year = $2`;

  const result = await pool.query(query, [
    data.release_month,
    data.fiscal_year,
  ]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Info not found" });
  }
  res.status(200).json(result.rows);
};

module.exports.developerReport = async (req, res) => {
  const data = req.body;
  const query = `SELECT d.developer_name, f.fileid, f.release_month, f.fiscal_year, f.calidad, f.tiempo_desarrollo
       FROM files f
       JOIN developers d ON f.developer_id = d.developer_id
       WHERE f.release_month = $1 AND f.fiscal_year = $2 AND d.developer_name = $3`;

  const result = await pool.query(query, [
    data.release_month,
    data.fiscal_year,
    data.developer_name,
  ]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Info not found" });
  }
  res.status(200).json(result.rows);
};

module.exports.mentorReport = async (req, res) => {
  const data = req.body;

  const mentorName = await pool.query(
    `SELECT developer_id FROM developers WHERE developer_name = $1`,
    [data.mentor_name]
  );

  const mentorId = mentorName.rows[0].developer_id;

  const { rows } = await pool.query(
    `SELECT f.*, d.developer_name
FROM files f
JOIN developers d ON f.developer_id = d.developer_id
WHERE f.release_month = $1
  AND f.fiscal_year = $2
  AND f.mentor_id = $3; `,
    [data.release_month, data.fiscal_year, mentorId]
  );
  if (rows.length === 0) {
    return res.status(404).json({ message: "Info not found" });
  }
  res.json(rows);
};
