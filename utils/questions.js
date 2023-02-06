const { nameValidation, salaryValidation } = require('./validation');
// const { returnEmployeeArray } = require('../server')

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

var rolesArray;
var managersArray;
var employeesArray;
var departmentsArray;

const addEmployee = [
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
        choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        name: "role_id",
    },
    {
        type: "list",
        message: "Who is the employee's manager? (Refer to them by their Manager ID)", //refer to managersArray, should be changed to manager names as options in the future
        choices: [1],
        name: "manager_id",
    },
]

const updateRole = [
    {
        type: "list",
        message: "Which employee's role do you want to update?", //refer to employeesArray
        choices: [1, 2, 3, 4, 5],
        name: "employee_id",
    },
    {
        type: "list",
        message: "Which role do you want to assign the selected employee?", //refer to rolesArray
        choices: [1, 2, 3, 4, 5, 6, 10, 12, 13, 14],
        name: "role_id",
    },
]

const addRole = [
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
        message: "Which department does the role belong to?", //refer to departmentsArray
        choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        name: "department_id",
    },
]

const addDepartment = [
    {
        type: "input",
        message: "What is the name of the department?",
        name: "name",
        validate: nameValidation,
    },
]

module.exports = { mainMenu, addEmployee, updateRole, addRole, addDepartment, employeesArray, departmentsArray, managersArray, rolesArray };
// module.exports = { mainMenu, addEmployee, updateRole, addRole, addDepartment/*, employeesArray, departmentsArray, managersArray, rolesArray*/ };