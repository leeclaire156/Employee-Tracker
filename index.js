//TODO: Create questions for inquirer and functions to invoke
// Packages needed for this application, inquirer will be used to ask questions, mysql2 will be required to access the database
const inquirer = require('inquirer');
const mysql = require('mysql2');
const { nameValidation, salaryValidation } = require('./utils/validation');

//These questions wil be invoked with `node index.js`
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

const rolesArray = []
const managersArray = []
const employeesArray = []
const departmentsArray = []

const addEmployee = [
    {
        type: "input",
        message: "What is the employee's first name?",
        name: "firstName",
        validate: nameValidation,
    },
    {
        type: "input",
        message: "What is the employee's last name?",
        name: "lastName",
        validate: nameValidation,
    },
    {
        type: "list",
        message: "What is the employee's role?", //refer to rolesArray
        choices: [],
        name: "role",
    },
    {
        type: "list",
        message: "Who is the employee's manager? (Refer to them by their Manager ID)", //refer to managersArray
        choices: [],
        name: "manager",
    },
]

const updateRole = [
    {
        type: "list",
        message: "Which employee's role do you want to update?", //refer to employeesArray
        choices: [],
        name: "employeeUpdate",
    },
    {
        type: "list",
        message: "Which role do you want to assign the selected employee?", //refer to rolesArray
        choices: [],
        name: "employeeUpdateRole",
    },
]

const addRole = [
    {
        type: "input",
        message: "What is the name of the role?",
        name: "newRole",
        validate: nameValidation,
    },
    {
        type: "input",
        message: "What is the salary of the role?",
        name: "roleSalary",
        validate: salaryValidation,
    },
    {
        type: "list",
        message: "Which department does the role belong to?", //refer to departmentsArray
        choices: [],
        name: "roleDepartment",
    },
]

const addDepartment = [
    {
        type: "input",
        message: "What is the name of the department?",
        name: "departmentName",
        validate: nameValidation,
    },
]


function init() {
    inquirer.prompt(mainMenu)
        .then((data) => {
            //TODO: add functions based on input
            if ("Add Role") {
                inquirer.prompt(addRole)
            }
        })
        .then(mainMenu)
}

init();