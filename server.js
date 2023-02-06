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
    LEFT JOIN company_db.employee manager ON employee.manager_id = manager.id
    LEFT JOIN company_db.role ON company_db.role.id = employee.role_id
    LEFT JOIN company_db.department ON company_db.department.id = role.department_id;`,
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
                    .then((data) => {
                        const sql = `INSERT INTO company_db.department (name) VALUES (?)`;
                        const params = [data.name];
                        addQuery(sql, params);
                    });
            } else if (data.toDo == "Add Role") {
                inquirer.prompt(addRole)
                    .then((data) => {
                        const sql = `INSERT INTO company_db.role (role.title, role.salary, role.department_id) VALUES (?, ?, ?)`;
                        const params = [data.title, data.salary, data.department_id];
                        addQuery(sql, params);
                    });
            } else if (data.toDo == "Add Employee") {
                inquirer.prompt(addEmployee)
                    .then((data) => {
                        const sql = `INSERT INTO company_db.employee (employee.first_name, employee.last_name, employee.role_id, employee.manager_id) VALUES (?, ?, ?, ?)`;
                        const params = [data.first_name, data.last_name, data.role_id, data.manager_id];
                        addQuery(sql, params);
                    });
            }
            else if (data.toDo == "Update Employee Role") {
                inquirer.prompt(updateRole)
                    .then((data) => {
                        const params = [data.role_id, data.employee_id]
                        updateQuery(params)
                    });
            }
            // else if (data.toDo == "Update employee managers") { }
            // else if (data.toDo == "View employees by manager") { }
            // else if (data.toDo == "View employees by department") { }
            // else if (data.toDo == "Delete departments") {
            //     DELETE FROM company_db.department WHERE name = "Wow";
            //  }
            // else if (data.toDo == "Delete roles",) {
            // DELETE FROM company_db.role WHERE title = "___";
            //}
            // else if (data.toDo == "Delete employees") { }
            // else if (data.toDo == "View total utilized budget for a department") { }
            // else {quit}
        })

}

//TODO: create API Routes
//Used to add new information (Add options)
function addQuery(sql, params) {
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error(`Unsuccessful`);
            console.error(err);
        } else {
            console.log(`Successfully added ${params[0]}`)
        }
        init();
    });
}

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
function updateQuery(params) {
    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error(err);
        } else if (!result.affectedRows) {
            console.log('Employee not found');
        } else {
            console.log(`successfully changed employee's role to ${params}`);
        }
    });
}






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


// EXAMPLE, TO BE DELETED:
// function viewQuery(querySet) {
//     const sql = `SELECT ${parameters[querySet]} FROM ${url[querySet]}`;
//     db.query(sql, (err, data) => {
//         const table = cTable.getTable(data)
//         console.log(table);
//         init();
//     });
// }


function returnEmployeeArray() {
    db.query(`SELECT id FROM employee`, (err, data) => {
        employeesArray = (Object.keys(data)).map(index => {
            return Number(index)
        });
        console.log(employeesArray + 'thats me!~!')
        console.log(typeof (employeesArray) + `is the Array type`);
        return employeesArray;
    });
};

app.get('/api/employee-by-id', (req, res) => {
    const sql = `SELECT id FROM employee`;

    db.query(sql, (err, data) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const dataObject = (res.json({
            data: data
        }));
        const employeeID = (Object.keys(data)).map(index => {
            return Number(index)
        });
        console.log(employeeID);
        console.log(typeof (employeeID));
        console.log(typeof (employeeID[1]));
        employeesArray = employeeID;
        console.log(employeesArray);
        return employeesArray = employeeID;
    });
});

// app.get('/api/employee-by-id', (req, res) => {
//     const sql = `SELECT id FROM employee`;

//     db.query(sql, (err, data) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         const dataObject = (res.json({
//             data: data
//         }));
//         const table = cTable.getTable(data)
//         console.log(table);
//     });
// });

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
