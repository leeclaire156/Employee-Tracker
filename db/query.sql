-- To view departments. Table with departments' ids and names should appear
SELECT id as "Department ID", name as "Department Name" 
    FROM company_db.department

-- To view roles. Table with roles' id, title, department, and salary should appear
SELECT role.id as "Role ID", role.title as "Title", department.name as "Department", role.salary as "Salary"
    FROM company_db.role 
    JOIN company_db.department
    ON company_db.department.id = role.department_id;

-- To view employees. Table with employees' id, first_name, last_name, job title (role), department,salary, and manager name should appear
SELECT
    employee.id as "Employee ID",
    employee.first_name as "First Name",
    employee.last_name as "Last Name",
    role.title as Title,
    department.name as Department,
    role.salary as Salary,
    concat(manager.first_name, " ", manager.last_name) as "Manager Name"
    FROM company_db.employee employee
    LEFT JOIN company_db.employee manager ON employee.manager_id = manager.id
    LEFT JOIN company_db.role ON company_db.role.id = employee.role_id
    LEFT JOIN company_db.department ON company_db.department.id = role.department_id;


-- To view roles as their full title. Table with role.title + with the department.name the role.title belongs to should appear.
SELECT CONCAT(company_db.role.title, " of the ", company_db.department.name, " Department") 
    AS full_role_title 
    FROM company_db.role
    LEFT JOIN company_db.department 
    ON company_db.department.id = company_db.role.department_id

-- To view managers. Table with manager's first and last name concatented should appear.
SELECT CONCAT(first_name, ' ', last_name) as 
    FROM company_db.employee 
    JOIN company_db.role
    ON company_db.employee.role_id = company_db.role.id
    WHERE role.title = "Manager";

-- To reverse search managers using matching first and last names. Matching manager should appear.
SELECT * 
    FROM company_db.employee 
    WHERE employee.first_name = "${manager_first_name}" 
    AND employee.last_name = "${manager_last_name}"

-- To reverse search roles using matching role titles and departments. Matching role should appear.
SELECT role.id, role.title 
    FROM company_db.role 
    JOIN company_db.department 
    ON role.department_id = department.id
    WHERE role.title = "${chosen_role}" 
    AND name = "${role_department}"

-- To add a new employee
INSERT INTO company_db.employee (employee.first_name, employee.last_name, employee.role_id, employee.manager_id) 
    VALUES (?, ?, ?, ?)

-- To view departments by names only. Table with all departments' names should appear.
SELECT company_db.department.name 
    FROM company_db.department

-- To reverse search department information using the department id.
SELECT * 
    FROM company_db.department 
    WHERE name = "${data.department_id}"

-- To create a new role.
INSERT INTO company_db.role (role.title, role.salary, role.department_id) 
    VALUES (?, ?, ?)

-- To view employees' by their full name. Table with manager's first and last name concatented should appear.
SELECT id, CONCAT(first_name, ' ', last_name) as full_name 
    FROM company_db.employee

-- To update an employee's role using matching first and last name.
UPDATE company_db.employee
    JOIN company_db.role
    ON company_db.employee.role_id = company_db.role.id
    SET role_id = ?
    WHERE employee.first_name = ?
    AND employee.last_name = ?