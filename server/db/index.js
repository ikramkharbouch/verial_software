const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'ikram',
  host: 'localhost',
  database: 'api',
  password: 'root1234',
  port: 5432,
})

pool.connect((err) => {
  if (err) {
      console.error('Cannot connect to database:', err.message);
  } else {
      console.log('Connected to the database successfully!');
  }
});

pool.query('SELECT * FROM clients', (err, res) => {
  if (err) {
      console.error('Error fetching data:', err.message);
  } else {
      // console.log('Data:', res.rows);
      console.log('data fetched')
  }
});


module.exports = pool;