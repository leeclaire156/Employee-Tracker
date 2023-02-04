const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const cTable = require('console.table');

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
        password: '',
        database: 'company_db'
    },
    console.log(`Connected to the courses_db database.`)
);

//TODO: create API Routes
//Used to add new information (Add options)
// app.post('./');

//Used to read information (View options)
app.get('/api/employee', (req, res) => {
    const sql = `SELECT id as Department_ID, name as Department_Name FROM department`;

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

//Used to update information (Update options)
// app.put();

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
