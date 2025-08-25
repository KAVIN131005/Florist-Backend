-- Initialize the database with some basic structure
-- This file will be executed when the MySQL container starts for the first time

USE flower;

-- Create a simple health check table
CREATE TABLE IF NOT EXISTS health_check (
    id INT PRIMARY KEY AUTO_INCREMENT,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a health check record
INSERT INTO health_check (status) VALUES ('Database initialized successfully');

-- Grant additional privileges to the florist_user
GRANT ALL PRIVILEGES ON flower.* TO 'florist_user'@'%';
FLUSH PRIVILEGES;
