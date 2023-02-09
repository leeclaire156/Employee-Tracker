DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL REFERENCES employees(id),
    FOREIGN KEY (role_id)
    REFERENCES role(id)
);

INSERT INTO department (name)
VALUES ("Accounting and finances"),
       ("Marketing"),
       ("Social Media"),
       ("Sales"),
       ("Research and development");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 200000.00, 1),
       ("Accountant", 75000.00, 1),
       ("Assistant",40000.00, 2),
       ("Data Analyst", 73000.00, 3),
       ("Sales Representative",50000.00,4),
       ("Researcher", 25000.00, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sadia", "Ahmed", 1, null),
       ("Chris","Lam", 4, 1),
       ("Brandon", "Nguyen", 6, 1),
       ("Elijah", "Viloria", 2, 1),
       ("Jabril", "Nicoles", 5, 1);