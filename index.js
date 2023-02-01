//TODO: Create questions for inquirer and functions to invoke
// Packages needed for this application, inquirer will be used to ask questions, mysql2 will be required to access the database
const inquirer = require('inquirer');
const mysql = require('mysql2');


//These questions wil be invoked with `node index.js`
const mainMenu = {
    type: "choice",
    message: "What would you like to do?",
    choices: [
        "View All Employees", //Table with employees' id, first_name, last_name, job title (role), department,salary, and manager name should appear
        "Add Employee", // Follow with "What is the employee's first name?", "What is the employee's last name?", "What is the employee's role?" (Choice; department and salary information for table should come from matching with role table), "Who is the employee's manager?" (Choice)
        "Update Employee Role", // Follow with "Which employee's role do you want to update?" (Choice) and "Which role do you want to assign the selected employee?" (Choice) + confirmation message that says "Updated employee's role", maybe console info?
        "View All Roles", // Table with roles' id, title, department, and salary should appear
        "Add Role", // Follow with "What is the name of the role?", "What is the salary of the role?", and "Which department does the role belong to? (Choice)"
        "View All Departments", // Table with departments' ids and names should appear
        "Add Department", // "What is the name of the department?" + confirmation message that says "Added ${department name} to the database", maybe console info?
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
        name: "firstName"
    },
    {
        type: "input",
        message: "What is the employee's last name?",
        name: "lastName"
    },
    {
        type: "choice",
        message: "What is the employee's role?", //refer to rolesArray
        choices: [],
        name: "role"
    },
    {
        type: "choice",
        message: "Who is the employee's manager?", //refer to managersArray
        choices: [],
        name: "manager"
    }
]

const updateRole = [
    {
        type: "choice",
        message: "Which employee's role do you want to update?", //refer to employeesArray
        choices: [],
        name: "employeeUpdate"
    },
    {
        type: "choice",
        message: "Which role do you want to assign the selected employee?", //refer to rolesArray
        choices: [],
        name: "employeeUpdateRole"
    }
]

const addRole = [
    {
        type: "input",
        message: "What is the name of the role?",
        name: "newRole"
    },
    {
        type: "input",
        message: "What is the salary of the role?",
        name: "roleSalary"
    },
    {
        type: "choice",
        message: "Which department does the role belong to?", //refer to departmentsArray
        choices: [],
        name: "roleDepartment"
    },
]

const addDepartment = [
    {
        type: "input",
        message: "What is the name of the department?",
        name: "departmentName"
    },
]

function init() {
    inquirer.prompt(mainMenu)
        .then((data) => {
            //TODO: add functions based on input
        })
        .then(mainMenu)
}

init();