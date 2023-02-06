const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const { mainMenu, addEmployee, updateRole, addRole, addDepartment, employeesArray, departmentsArray, managersArray, rolesArray } = require('./utils/questions');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: '^^@*M0n13$',
        database: 'company_db'
    },
    console.log(`Connected to the courses_db database.`)
);

db.connect(function (error) {
    if (error) throw error;
    init();
})

const query = [
    `SELECT id as "Department ID", name as "Department Name" FROM company_db.department`,

    `SELECT role.id as "Role ID", role.title as "Title", department.name as "Department", role.salary as "Salary"
    FROM company_db.role 
    JOIN company_db.department
    ON company_db.department.id = role.department_id;`,

    `SELECT
    employee.id as "Employee ID",
    employee.first_name as "First Name",
    employee.last_name as "Last Name",
    role.title as Title,
    department.name as Department,
    role.salary as Salary,
    concat(manager.first_name, " ", manager.last_name) as "Manager Name"
FROM company_db.employee employee
LEFT JOIN company_db.employee manager
ON employee.manager_id = manager.id
LEFT JOIN company_db.role 
ON company_db.role.id = employee.role_id
LEFT JOIN company_db.department
ON company_db.department.id = role.department_id;`,
]

function init() {
    inquirer.prompt(mainMenu)
        .then((data) => {
            if (data.toDo == "View All Departments") {
                viewQuery(query[0]);
            } else if (data.toDo == "View All Roles") {
                viewQuery(query[1]);
            } else if (data.toDo == "View All Employees") {
                viewQuery(query[2]);
            } else if (data.toDo == "Add Department") {
                inquirer.prompt(addDepartment)
                    .then((data) => { addQuery(data); });
            } else if (data.toDo == "Update Employee Role") {
                returnEmployeeArray();
            }
            // else if () { }
            // else if () { }
            // else if () { }
            // else if () { }
            // else if () { }
            // else if () { }
        })

}



//TODO: create API Routes
//Used to add new information (Add options)
// function addQuery(data) {
//     const sql = `INSERT INTO department (name) VALUES (?)`;
//     const params = [data.name];
//     db.query(sql, params, (err, result) => {
//         if (err) {
//             throw error;
//         } else {
//             console.log(`Successfully added ${params} to department!`)
//         }
//         init();
//     });
// }

// //bonus add in querying for: api/budget-for department, api/employee-by-department, api/employee-by-manager
// //Used to read information (View options)
function viewQuery(query) {
    const sql = query;
    db.query(sql, (err, data) => {
        const table = cTable.getTable(data)
        console.log(table);
        init();
    });
}

//Used to update an employee's role (Something along the lines of : 1. select employee to change role, 2. select new role)
// Tested with insomnia using the following:
//http://localhost:3001/api/employee/3
//JSON.body:
// {
// 	"role_id": 6
// }
//Succeeded
app.put('/api/employee/:id', (req, res) => {
    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
    const params = [req.body.role_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Employee not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

app.get('/api/employee', (req, res) => {
    const sql = `SELECT
        employee.id as "Employee ID",
        employee.first_name as "First Name",
        employee.last_name as "Last Name",
        role.title as Title, 
        role.salary as Salary, 
        department.name as Department, 
        concat(manager.first_name, " ", manager.last_name) as "Manager_Name"
    FROM company_db.employee employee
    LEFT JOIN company_db.employee manager
    ON employee.manager_id = manager.id
    LEFT JOIN company_db.role 
    ON company_db.role.id = employee.role_id
    LEFT JOIN company_db.department
    ON company_db.department.id = role.department_id;`;

    db.query(sql, (err, data) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const dataObject = (res.json({
            data: data
        }));
        const table = cTable.getTable(data)
        console.log(table);
    });
});


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
