const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
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

const mainMenu = {
    type: "list",
    message: "What would you like to do?",
    choices: [
        "View All Employees", //Table with employees' id, first_name, last_name, job title (role), department,salary, and manager name should appear
        "Add Employee", // Follow with "What is the employee's first name?", "What is the employee's last name?", "What is the employee's role?" (list; department and salary information for table should come from matching with role table), "Who is the employee's manager?" (Choice)
        "Update Employee Role", // Follow with "Which employee's role do you want to update?" (Choice) and "Which role do you want to assign the selected employee?" (Choice) + confirmation message that says "Updated employee's role", maybe console info?
        "View All Roles", // Table with roles' id, title, department, and salary should appear
        "Add Role", // Follow with "What is the name of the role?", "What is the salary of the role?", and "Which department does the role belong to? (Choice)"
        "View All Departments", // Table with departments' ids and names should appear
        "Add Department", // "What is the name of the department?" + confirmation message that says "Added ${department name} to the database", maybe console info?
        /*"Update employee managers",
        "View employees by manager",
        "View employees by department",
        "Delete departments",
        "Delete roles",
        "Delete employees",
        "View total utilized budget for a department",*/
        "Quit"
    ],
    name: "toDo",
}

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
                returnRoleArrayForNewEmployee();
            } else if (data.toDo == "Update Employee Role") {
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
    db.promise().query(`SELECT CONCAT(company_db.role.title, " of the ", company_db.department.name, " Department") AS full_role_title FROM company_db.role NATURAL JOIN company_db.department`)
        .then(([data]) => {
            for (let i = 0; i < data.length; i++) {
                roleArray.push(data[i].full_role_title)
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
    db.promise().query(sql)
        .then(([data]) => {
            for (let i = 0; i < data.length; i++) {
                managerArray.push(data[i].manager_full_name)
            }
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
            message: "What is the employee's role?",
            choices: roleArray,
            name: "new_employee_role",
        },
        {
            type: "list",
            message: "Who is the employee's manager? (Refer to them by their Manager ID)",
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
    var chosen_role = data.new_employee_role.split(" of the ")[0]
    var role_department = (data.new_employee_role.split(" of the ")[1]).split(" Department")[0]
    db.query(`SELECT role.id, role.title FROM company_db.role JOIN company_db.department ON role.department_id = department.id WHERE role.title = "${chosen_role}" and name = "${role_department}"`, (err, results) => {
        var roleInfo = results.pop();
        var roleID = roleInfo.id;
        var sql = `INSERT INTO company_db.employee (employee.first_name, employee.last_name, employee.role_id, employee.manager_id) VALUES (?, ?, ?, ?)`
        var params = [data.first_name, data.last_name, roleID, managerID];
        addQuery(sql, params)
    })
}


var departmentArray = [];
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
    db.promise().query(`SELECT CONCAT(company_db.role.title, " of the ", company_db.department.name, " Department") AS full_role_title FROM company_db.role NATURAL JOIN company_db.department`)
        .then(([data]) => {
            for (let i = 0; i < data.length; i++) {
                roleArray.push(data[i].full_role_title)
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
            choices: employeeArray
        },
        {
            type: "list",
            message: "Which role do you want to assign the selected employee?",
            choices: roleArray,
            name: "new_role",
        },
    ]).then((data) => {
        var chosen_role = data.new_role.split(" of the ")[0]
        var role_department = (data.new_role.split(" of the ")[1]).split(" Department")[0]
        db.query(`SELECT role.id, role.title FROM company_db.role JOIN company_db.department ON role.department_id = department.id WHERE role.title = "${chosen_role}" and name = "${role_department}"`, (err, results) => {
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

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
