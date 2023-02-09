// Importing dependencies
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const { nameValidation, salaryValidation } = require('./utils/validation');

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
    console.log(`Welcome to the Employee Tracker.`)
);

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
    ON company_db.department.id = role.department_id`,

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
    LEFT JOIN company_db.department ON company_db.department.id = role.department_id`,
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
        "Update Employee Managers",
        "View Employees By Manager",
        "View Employees By Department",
        "Delete Department",
        "Delete Role",
        "Delete Employee",
        "View Total Utilized Budget For A Department",
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
                returnRoleArray(choice);
            } else if (data.toDo == "Update Employee Managers") {
                choice = data.toDo
                returnRoleArray(choice);
            } else if (data.toDo == "View Employees By Manager") {
                choice = data.toDo
                returnManagerArray(choice)
            } else if (data.toDo == "View Employees By Department") {
                choice = data.toDo
                returnDepartmentArray(choice);
            } else if (data.toDo == "Delete Department") {
                choice = data.toDo
                returnDepartmentArray(choice);
            } else if (data.toDo == "Delete Role") {
                choice = data.toDo
                returnRoleArray(choice)
            } else if (data.toDo == "Delete Employee") {
                choice = data.toDo
                returnEmployeeArray(choice)
            } else if (data.toDo == "View Total Utilized Budget For A Department") {
                choice = data.toDo
                returnDepartmentArray(choice);
            } else {
                process.exit();
            }
        })

}

// Used to delete information ("View Role/Employee/Department" options)
function deleteQuery(sql, params) {
    db.query(sql, params, (err, data) => {
        if (err) {
            console.error(`\nUnsuccessful. Check if the item is linked to another table. \n \nEx: If you're trying to delete a department that has a set of roles associated with it, you must delete the roles first.\n`);
            console.error(err);
        } else {
            console.log("Successfully deleted")
            init();
        }
    });
}

// "Delete Department" functions starts here
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

// "Delete Role" functions starts here
function deleteRole() {
    inquirer.prompt([
        {
            type: "list",
            message: "What is the name of the role you want to delete?",
            choices: roleArray,
            name: "role_to_delete",
        },
    ]).then((data) => {
        var chosen_role = data.role_to_delete.split(" of the ")[0]
        var role_department = (data.role_to_delete.split(" of the ")[1]).split(" Department")[0]
        db.query(`SELECT role.id, role.title FROM company_db.role JOIN company_db.department ON role.department_id = department.id WHERE role.title = "${chosen_role}" AND name = "${role_department}"`, (err, results) => {
            var roleInfo = results.pop();
            var roleID = roleInfo.id;
            var sql = `DELETE FROM company_db.role WHERE role.id = ?`
            var params = [roleID];
            deleteQuery(sql, params)
        })
    });
}

// "Delete Employee" functions starts here
function deleteEmployee() {
    inquirer.prompt([
        {
            type: "list",
            message: "Which employee do you want to delete?",
            choices: employeeArray,
            name: "employee_to_delete",
        },
    ]).then((data) => {
        var first_name = (data.employee_to_delete).split(" ")[0]
        var last_name = (data.employee_to_delete).split(" ")[1]
        var sql = `DELETE FROM company_db.employee WHERE employee.first_name = ? AND employee.last_name = ?`
        var params = [first_name, last_name];
        deleteQuery(sql, params)
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
            console.log("\n" + table);
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
function returnRoleArray() {
    db.promise().query(`SELECT CONCAT(company_db.role.title, " of the ", company_db.department.name, " Department") AS full_role_title FROM company_db.role LEFT JOIN company_db.department ON company_db.department.id = company_db.role.department_id`)
        .then(([data]) => {
            roleArray = []; //Resets roleArray to empty
            for (let i = 0; i < data.length; i++) {
                roleArray.push(data[i].full_role_title)
            }

            if (choice == "Update Employee Role") {
                returnEmployeeArray(roleArray, choice)
            } else if (choice == "Delete Role") {
                deleteRole(roleArray, choice)
            } else { // Should go through this path for both addEmployee and updateManagerRole
                returnManagerArray(roleArray, choice);
            }

        })
};

function returnManagerArray() {
    var sql = `SELECT CONCAT(first_name, ' ', last_name) as manager_full_name FROM company_db.employee 
                JOIN company_db.role
                    ON company_db.employee.role_id = company_db.role.id
                WHERE role.title = "Manager";`

    if (choice == "Update Employee Managers") { //update manager route
        db.promise().query(sql)
            .then(([data]) => {
                managerArray = []; //Resets managerArray to empty
                for (let i = 0; i < data.length; i++) {
                    managerArray.push(data[i].manager_full_name)
                }
                updateManagerQuestions(roleArray, managerArray);
            })
    } else if (choice == "View Employees By Manager") { //update manager route
        db.promise().query(sql)
            .then(([data]) => {
                managerArray = []; //Resets managerArray to empty
                for (let i = 0; i < data.length; i++) {
                    managerArray.push(data[i].manager_full_name)
                }
                viewEmployeeByManagerQuestions(choice, managerArray);
            })
    } else { //Add employee route
        db.promise().query(sql)
            .then(([data]) => {
                managerArray = ["None",]; //Resets managerArray to empty but with a no manager (null) option
                for (let i = 0; i < data.length; i++) {
                    managerArray.push(data[i].manager_full_name)
                }
                addEmployeeQuestions(roleArray, managerArray);
            })
    }
};

function addEmployeeQuestions() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the employee's first name? \n(If you have two or more components to your first name, please add a hyphen to prevent errors)\n",
            name: "first_name",
            validate: nameValidation,
        },
        {
            type: "input",
            message: "What is the employee's last name? \n(If you have two or more components to your last name, please add a hyphen to prevent errors)\n",
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
        if (data.chosen_manager === "None") {
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
        if (choice == "View Employees By Manager") {
            var sql = (query[2] + `\n WHERE employee.manager_id = ${managerID};`)
            viewQuery(sql);
        } else {
            reverseSearchRole(data, managerID)
        }
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
            } else if (choice == "Delete Department") {
                deleteDepartment(departmentArray);
            } else if (choice == "View Employees By Department" || "View Total Utilized Budget For A Department") {
                choseDepartmentQuestion(departmentArray, choice)
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
            message: "What is the salary of the role (in USD)?",
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

            if (choice == "Delete Employee") {
                console.log("I am deleting an employee")
                deleteEmployee(employeeArray)
            } else {
                updateRoleQuestions(employeeArray, roleArray)
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

// "Update Employee Managers" functions start here
function updateManagerQuestions() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'update_manager',
            message: "Which manager do you want to update?",
            choices: managerArray
        },
        {
            type: "list",
            message: "Which role do you want to assign the selected manager?",
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
                var first_name = (data.update_manager).split(" ")[0]
                var last_name = (data.update_manager).split(" ")[1]
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

// "View Employees By Manager" functions start here
function viewEmployeeByManagerQuestions() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'chosen_manager',
            message: "Which manager's employees do you want to see?",
            choices: managerArray
        },
    ]).then((data) => { reverseSearchManager(data, choice) })
}

// "View Employees By Department" functions start here
function choseDepartmentQuestion() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'chosen_department',
            message: "Which department's employees do you want to see?",
            choices: departmentArray
        },
    ]).then((data) => {
        if (choice == "View Employees By Department") {
            var sql = (query[2] + `\n WHERE department.name = "${data.chosen_department}"`)
            viewQuery(sql);
        } else {
            var splitQuery2 = (query[2].split(`"Manager Name"`))
            var sql = `SELECT SUM(company_db.role.salary) AS "${data.chosen_department}'s Total Utilized Budget (in USD)"` + splitQuery2[1] + `\n WHERE department.name = "${data.chosen_department}"`
            viewQuery(sql);
        }
    })
}

