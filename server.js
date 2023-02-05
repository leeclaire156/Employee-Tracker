const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const { mainMenu, addEmployee, updateRole, addRole, addDepartment } = require('./utils/questions');

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


var querySet;
const url = ["department", "role", "employee"];
const parameters = ["id as Department_ID, name as Department_Name",
    "id as Role_ID, title as Role, salary as Salary, department_id as Department_ID",
    "id as Employee_ID, first_name as First_Name, last_name as Last_Name, role_id as Role_ID, manager_id as Manager_ID"]

function init() {
    inquirer.prompt(mainMenu)
        .then((data) => {
            if (data.toDo == "View All Departments") {
                querySet = 0;
                viewQuery(querySet);
            } else if (data.toDo == "View All Roles") {
                querySet = 1;
                viewQuery(querySet);
            } else if (data.toDo == "View All Employees") {
                querySet = 2;
                viewQuery(querySet);
            } else if (data.toDo == "Add Department") {
                inquirer.prompt(addDepartment)
                    .then((data) => { addQuery(data); });
            }
            // else if () { }
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
// app.post('./');
function addQuery(data) {
    const sql = `INSERT INTO department (name) VALUES (?)`;
    const params = [data.name];
    db.query(sql, params, (err, result) => {
        if (err) {
            throw error;
        } else {
            console.log(`Successfully added ${params} to department!`)
        }
        init();
    });
}

//bonus add in querying for: api/budget-for department, api/employee-by-department, api/employee-by-manager
//Used to read information (View options)
function viewQuery(querySet) {
    const sql = `SELECT ${parameters[querySet]} FROM ${url[querySet]}`;
    db.query(sql, (err, data) => {
        const table = cTable.getTable(data)
        console.log(table);
        init();
    });
}

//Used to update information (Update options)
// app.put();

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
