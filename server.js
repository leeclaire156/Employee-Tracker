const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const { mainMenu, employeesArray, departmentsArray, managersArray, rolesArray } = require('./utils/questions');
const { nameValidation, salaryValidation } = require('./utils/validation');

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

//TODO: fix naming conventions for clarity
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
                addDepartment();
            } else if (data.toDo == "Add Role") {
                returnDepartmentArray();
            } else if (data.toDo == "Add Employee") {
                // inquirer.prompt(addEmployee)
                //     .then((data) => {
                //         const sql = `INSERT INTO company_db.employee (employee.first_name, employee.last_name, employee.role_id, employee.manager_id) VALUES (?, ?, ?, ?)`;
                //         const params = [data.first_name, data.last_name, data.role_id, data.manager_id];
                //         addQuery(sql, params);
                //     });
                returnRoleArrayForNewEmployee();
            }
            else if (data.toDo == "Update Employee Role") {
                returnEmployeeArray();
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
            else { process.exit(); }
        })

}

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

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "name",
            validate: nameValidation,
        },
    ]).then((data) => {
        const sql = `INSERT INTO company_db.department (name) VALUES (?)`;
        const params = [data.name];
        addQuery(sql, params);
    });
}

function returnRoleArrayForNewEmployee() { //TODO Add department name for clarity
    db.promise().query(`SELECT company_db.role.title FROM company_db.role`)
        .then(([data]) => {
            for (let i = 0; i < data.length; i++) {
                roleArray.push(data[i].title) // my rows array had dept_name as the beginning part of each department
            }
            returnManagerArray(roleArray);
        })
};

const managerArray = [];

function returnManagerArray() {
    var sql = `SELECT CONCAT(first_name, ' ', last_name) as manager_full_name FROM company_db.employee 
                JOIN company_db.role
                    ON company_db.employee.role_id = company_db.role.id
                WHERE role.title = "Manager";`
    db.promise().query(sql)//Returns Managers names for array in inquirer questions
        .then(([data]) => {
            for (let i = 0; i < data.length; i++) {
                managerArray.push(data[i].manager_full_name) // my rows array had dept_name as the beginning part of each department
            }
            // console.log(managerArray) //returns sadia ahmed, chris lam, and brandon nguyen
            askEmployeeQuestions(roleArray, managerArray);
        })
};

function askEmployeeQuestions() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "first_name",
            validate: nameValidation,
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "last_name",
            validate: nameValidation,
        },
        {
            type: "list",
            message: "What is the employee's role?", //refer to rolesArray, should be changed to role titles as options in the future
            choices: roleArray,
            name: "chosen_role",
        },
        {
            type: "list",
            message: "Who is the employee's manager? (Refer to them by their Manager ID)", //refer to managersArray, should be changed to manager names as options in the future
            choices: managerArray,
            name: "chosen_manager",
        },
    ]).then((data) => {
        reverseSearchManager(data);
    })
}

function reverseSearchManager(data) {
    var manager_first_name = (data.chosen_manager).split(" ")[0]
    var manager_last_name = (data.chosen_manager).split(" ")[1]
    db.query(`SELECT * FROM company_db.employee WHERE employee.first_name = "${manager_first_name}" AND employee.last_name = "${manager_last_name}"`, (err, results) => {
        var managerInfo = results.pop();
        var managerID = managerInfo.id;
        reverseSearchRole(data, managerID)
    })
}

function reverseSearchRole(data, managerID) {
    db.query(`SELECT * FROM company_db.role WHERE role.title = "${data.chosen_role}"`, (err, results) => {
        var roleInfo = results.pop();
        var roleID = roleInfo.id;
        var sql = `INSERT INTO company_db.employee (employee.first_name, employee.last_name, employee.role_id, employee.manager_id) VALUES (?, ?, ?, ?)`
        var params = [data.first_name, data.last_name, roleID, managerID];
        addQuery(sql, params)
    })
}


var departmentArray = [];
// run a SQL query for the current departments
function returnDepartmentArray() {
    db.promise().query(`SELECT company_db.department.name FROM company_db.department`)
        .then(([data]) => {
            for (let i = 0; i < data.length; i++) {
                departmentArray.push(data[i].name)
            }
            addRoleQuestions(departmentArray);
        })
};


function addRoleQuestions() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the role?",
            name: "title",
            validate: nameValidation,
        },
        {
            type: "input",
            message: "What is the salary of the role?",
            name: "salary",
            validate: salaryValidation,
        },
        {
            type: "list",
            message: "Which department does the role belong to?", //refer to departmentArray
            choices: departmentArray,
            name: "department_id",
        },
    ]).then((data) => {
        db.query(`SELECT * FROM company_db.department WHERE name = "${data.department_id}";`, (err, results) => {
            if (err) {
                console.error(err);
            } else {
                console.log(results);
                var departmentInfo = results.pop();
                var sql = `INSERT INTO company_db.role (role.title, role.salary, role.department_id) VALUES (?, ?, ?)`
                var params = [data.title, data.salary, departmentInfo.id];
                addQuery(sql, params);
            }
        })
    })
}

const query = [ //DONT TOUCH ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

// //Used to read information (View options) DONT TOUCH
function viewQuery(query) {
    const sql = query;
    db.query(sql, (err, data) => {
        const table = cTable.getTable(data)
        console.log(table);
        init();
    });
}

// returnEmployeeArray(), returnRoleArray(), updateRoleQuestions() and updateRole() are used to update an employee's role
const employeeArray = [];
const roleArray = [];

// run a SQL query for the current employees
function returnEmployeeArray() {
    db.promise().query(`SELECT id, CONCAT(first_name, ' ', last_name) as full_name FROM company_db.employee`)
        .then(([data]) => {
            for (var i = 0; i < data.length; i++) {
                employeeArray.push(data[i].full_name)
            }
            returnRoleArray(employeeArray);
        })
};

// run a SQL query for the current roles
function returnRoleArray() {
    db.promise().query(`SELECT company_db.role.title FROM company_db.role`)
        .then(([data]) => {
            for (let i = 0; i < data.length; i++) {
                roleArray.push(data[i].title) // my rows array had dept_name as the beginning part of each department
            }
            updateRoleQuestions(employeeArray, roleArray);
        })
};


function updateRoleQuestions() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'update_employee',
            message: "Which employee's role do you want to update?",
            choices: employeeArray //shows each department from the const which was for looped above
        },
        {
            type: "list",
            message: "Which role do you want to assign the selected employee?", //refer to rolesArray -- TODO: Add roletitle of department for clarity
            choices: roleArray,
            name: "new_role",
        },
    ]).then((data) => {
        db.query(`SELECT * FROM company_db.role WHERE title = "${data.new_role}";`, (err, results) => {
            if (err) {
                console.error(err);
            } else {
                var jobInfo = results.pop()
                var first_name = (data.update_employee).split(" ")[0]
                var last_name = (data.update_employee).split(" ")[1]
                var params = [jobInfo.id, first_name, last_name]
                var sql =
                    `UPDATE company_db.employee
                        JOIN company_db.role
                        ON company_db.employee.role_id = company_db.role.id
                    SET role_id = ?
                    WHERE employee.first_name = ?
                        AND employee.last_name = ?`
                updateQuery(sql, params);
            }
        })
    })
}

function updateQuery(sql, params) {
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error(err);
        } else if (!result.affectedRows) {
            console.log('Employee not found');
        } else {
            console.log(`successfully changed employee's role`);
        }
        init()
    })
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//KEEP BELOW
// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
