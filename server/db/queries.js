var pool = require('.').pool;

const getUsers = (request, response) => {
  let limit = request.query.limit;

  // If limit is not specified, default to 10
  limit = limit !== undefined ? parseInt(limit, 10) : 10;

  pool.query(
    'SELECT * FROM clients ORDER BY id ASC LIMIT $1',
    [limit],
    (error, results) => {
      if (error) {
        console.error('Database query error:', error);
        response.status(500).json({ message: 'Failed to retrieve clients' });
        return;
      }
      // Emit the event to update clients list to all connected clients
      request.io.emit('clientsUpdated', results.rows); // Emit updated clients list

      response.status(200).json(results.rows);
    },
  );
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const generateRandomId = async () => {
  // Generate a random integer between 100000 and 999999
  const randomId = Math.floor(Math.random() * 900000) + 100000;

  // Check if the generated ID already exists in the database
  const result = await pool.query('SELECT id FROM clients WHERE id = $1', [
    randomId,
  ]);

  if (result.rowCount > 0) {
    // If the ID exists, generate a new one
    return generateRandomId();
  }

  return randomId; // Return the unique ID
};

const createUser = async (request, response) => {
  const {
    id,
    companyName,
    nif,
    clientName,
    clientType,
    phoneNumber1,
    phoneNumber2,
    phoneNumber3,
    iceo,
    country,
    province,
    postalCode,
    email1,
    email2,
    email3,
  } = request.body;

  // Validate the input fields
  if (
    !id ||
    !companyName ||
    !nif ||
    !clientName ||
    !clientType ||
    !phoneNumber1 ||
    !iceo ||
    !country ||
    !province ||
    !postalCode ||
    !email1
  ) {
    return response.status(400).send({
      message: 'All required fields must be filled.',
      status: 400,
    });
  }

  let generatedId = await generateRandomId();

  console.log(generatedId);
  // Insert the new client into the database
  pool.query(
    `INSERT INTO clients (id, company_name, nif, client_name, client_type, phone_number_1, phone_number_2, phone_number_3, iceo, country, province, postal_code, email_1, email_2, email_3)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
    [
      generatedId,
      companyName,
      nif,
      clientName,
      clientType,
      phoneNumber1,
      phoneNumber2,
      phoneNumber3,
      iceo,
      country,
      province,
      postalCode,
      email1,
      email2,
      email3,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send({
        message: `Client added with ID: ${results.rows[0].id}`,
        data: request.body,
        status: 200,
      });
    },
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    },
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
