import mysql from 'mysql2';

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root', // Replace with your MySQL username
  password: 'mypass@root12345S', // Replace with your MySQL password
  database: 'smart_fitness_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const db = pool.promise();
