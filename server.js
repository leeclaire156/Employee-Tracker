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

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


db.connect(function (error) {
    if (error) throw error;
    init();
})

var choice;
var managerArray = ["None",];
var departmentArray = [];
var employeeArray = [];
var roleArray = [];
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

const mainMenu = {
    type: "list",
    message: "What would you like to do?",
    choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        // "Update employee managers",
        // "View employees by manager",
        // "View employees by department",
        "Delete department",
        // "Delete role",
        // "Delete employee",
        // "View total utilized budget for a department",
        "Quit"
    ],
    name: "toDo",
}

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
                choice = data.toDo
                returnDepartmentArray(choice);
            } else if (data.toDo == "Add Employee") {
                choice = data.toDo
                returnRoleArray(choice);
            } else if (data.toDo == "Update Employee Role") {
                choice = data.toDo
                returnEmployeeArray(choice);
            }
            // else if (data.toDo == "Update employee managers") { }
            // else if (data.toDo == "View employees by manager") { }
            // else if (data.toDo == "View employees by department") { }
            else if (data.toDo == "Delete department") {
                choice = data.toDo
                returnDepartmentArray(choice);
            }
            // else if (data.toDo == "Delete roles",) {
            // DELETE FROM company_db.role WHERE title = "___";
            //}
            // else if (data.toDo == "Delete employees") { }
            // else if (data.toDo == "View total utilized budget for a department") { }
            else { process.exit(); }
        })

}

// Used to delete information ("View Role/Employee/Department" options)
function deleteQuery(sql, params) {
    db.query(sql, params, (err, data) => {
        if (err) {
            console.error(`Unsuccessful`);
            console.error(err);
        } else {
            console.log("Successfully deleted")
            init();
        }
    });
}

// "Add Department" functions starts here
function deleteDepartment() {
    inquirer.prompt([
        {
            type: "list",
            message: "What is the name of the department you want to delete?",
            choices: departmentArray,
            name: "name",
        },
    ]).then((data) => {
        const sql = `DELETE FROM company_db.department WHERE name = ?`;
        const params = [data.name];
        deleteQuery(sql, params);
    });
}

// Used to read information ("View Role/Employee/Department" options)
function viewQuery(query) {
    const sql = query;
    db.query(sql, (err, data) => {
        if (err) {
            console.error(`Unsuccessful`);
            console.error(err);
        } else {
            const table = cTable.getTable(data)
            console.log(table);
            init();
        }
    });
}

//Used to add new information ("Add role/employee/department" options)
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

// "Add Department" functions starts here
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

// "Add Employee" functions starts here
function returnManagerArray() {
    var sql = `SELECT CONCAT(first_name, ' ', last_name) as manager_full_name FROM company_db.employee 
                JOIN company_db.role
                    ON company_db.employee.role_id = company_db.role.id
                WHERE role.title = "Manager";`
    db.promise().query(sql)
        .then(([data]) => {
            managerArray = ["None",]; //Resets managerArray to empty
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
        if (data.chosen_manager == "None") {
            var managerID = null;
            reverseSearchRole(data, managerID);
        } else {
            reverseSearchManager(data);
        }
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
    db.query(`SELECT role.id, role.title FROM company_db.role JOIN company_db.department ON role.department_id = department.id WHERE role.title = "${chosen_role}" AND name = "${role_department}"`, (err, results) => {
        var roleInfo = results.pop();
        var roleID = roleInfo.id;
        var sql = `INSERT INTO company_db.employee (employee.first_name, employee.last_name, employee.role_id, employee.manager_id) VALUES (?, ?, ?, ?)`
        var params = [data.first_name, data.last_name, roleID, managerID];
        addQuery(sql, params)
    })
}

// "Add Role" functions start here
function returnDepartmentArray() {
    db.promise().query(`SELECT company_db.department.name FROM company_db.department`)
        .then(([data]) => {
            departmentArray = []; //Resets departmentArray to empty
            for (let i = 0; i < data.length; i++) {
                departmentArray.push(data[i].name)
            }

            if (choice == "Add Role") {
                addRoleQuestions(departmentArray);
            } else {
                deleteDepartment(departmentArray);
            }

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
            message: "Which department does the role belong to?",
            choices: departmentArray,
            name: "department_id",
        },
    ]).then((data) => {
        db.query(`SELECT * FROM company_db.department WHERE name = "${data.department_id}";`, (err, results) => {
            if (err) {
                console.error(err);
            } else {
                var departmentInfo = results.pop();
                var sql = `INSERT INTO company_db.role (role.title, role.salary, role.department_id) VALUES (?, ?, ?)`
                var params = [data.title, data.salary, departmentInfo.id];
                addQuery(sql, params);
            }
        })
    })
}

// Used to update information ("Update Employee Role" option)
function updateQuery(sql, params) {
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error(err);
        } else if (!result.affectedRows) {
            console.log('Employee not found');
        } else {
            console.log(`Successfully changed employee's role`);
        }
        init()
    })
};

// "Update (an) Employee's Role" functions start here
function returnEmployeeArray() {
    db.promise().query(`SELECT CONCAT(first_name, ' ', last_name) as full_name FROM company_db.employee JOIN company_db.role ON company_db.employee.role_id = company_db.role.id WHERE NOT  company_db.role.title = "Manager";`)
        .then(([data]) => {
            employeeArray = []; //Resets employeeArray to empty
            for (var i = 0; i < data.length; i++) {
                employeeArray.push(data[i].full_name)
            }
            returnRoleArray(employeeArray);
        })
};

function returnRoleArray() {
    db.promise().query(`SELECT CONCAT(company_db.role.title, " of the ", company_db.department.name, " Department") AS full_role_title FROM company_db.role LEFT JOIN company_db.department ON company_db.department.id = company_db.role.department_id`)
        .then(([data]) => {
            roleArray = []; //Resets roleArray to empty
            for (let i = 0; i < data.length; i++) {
                roleArray.push(data[i].full_role_title)
            }

            if (choice == "Add Employee") {
                returnManagerArray(roleArray);
            } else {
                updateRoleQuestions(employeeArray, roleArray);
            }

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

