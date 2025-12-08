-- The database todoDb is already created by Docker env
GRANT ALL PRIVILEGES ON *.* TO 'todoUser'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

USE todoDb;

CREATE TABLE IF NOT EXISTS todo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL
);
