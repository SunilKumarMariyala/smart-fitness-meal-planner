import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const createDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'fitness_planner'}`);
    console.log('✅ Database created successfully');
  } catch (error) {
    console.error('❌ Error creating database:', error);
  } finally {
    await connection.end();
  }
};

const runMigrations = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fitness_planner'
  });

  try {
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        gender ENUM('male', 'female', 'other') NOT NULL,
        height DECIMAL(5,2) NOT NULL,
        weight DECIMAL(5,2) NOT NULL,
        goal ENUM('weight_loss', 'muscle_gain', 'maintenance') NOT NULL,
        role ENUM('user', 'trainer', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅ Users table created');

    // Create workout_meal_plans table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS workout_meal_plans (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        week_start_date DATE NOT NULL,
        day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
        exercises JSON NOT NULL,
        meals JSON NOT NULL,
        completed_exercises JSON DEFAULT ('[]'),
        completed_meals JSON DEFAULT ('[]'),
        weight_log DECIMAL(5,2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_date (user_id, week_start_date),
        INDEX idx_day (day)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅ Workout_meal_plans table created');

    console.log('✅ All migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await connection.end();
  }
};

const migrate = async () => {
  await createDatabase();
  await runMigrations();
  process.exit(0);
};

migrate();
