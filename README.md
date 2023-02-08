# Employee Tracker


## Description

This project is a command-line application that functions as a content management system (CMS), able to manage a company's employee database. The main menu will allow the user to view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee's role.
<!-- BONUS: Update employee managers. View employees by manager. View employees by department. Delete departments, roles, and employees. View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.-->

This project utilizes [Node.js version 16.18.0](https://nodejs.org/en/) and the [Inquirer version 8.2.4](https://www.npmjs.com/package/inquirer) package from [npm, Inc.](https://www.npmjs.com/) to create a main menu for content management while utilizing the [Node MySQL 2 version 3.1.0](https://www.npmjs.com/package/mysql2) package from [npm, Inc.](https://www.npmjs.com/) to access the database for displaying and editing employee records.


## Table of Contents
- [Installation](#installation)
    - [Git/Git Bash](#gitgit-bash---strongly-recommended)
    - [Visual Studio Code](#visual-studio-code-vsc---strongly-recommended)
    - [Node](#node-version-16---required-to-download-node-based-dependencies-ie-inquirer-my-sql-2-express-and-consoletable)
    - [Inquirer](#inquirer-version-824---required-to-prompt-questions)
    - [Node My SQL 2](#node-my-sql-2-version-310---required-for-accessing-database)
    - [express](#express-version-4182---required-for-connecting-and-creating-routes-to-database)
    - [console.table](#consoletable-version-0100---required-for-printing-mysql-rows-into-console-log)
- [Usage](#usage---for-the-purposes-of-this-demonstration-git-bash-will-be-used-as-my-preferred-terminal)
- [Credits](#credits)
- [Questions](#questions)


## Installation

Make sure the following are downloaded:

### `Git/GitBash` - *Strongly Recommended*
* While this application can be run using with the default **command prompt**, it is easier to clone this repository by using Git/GitBash, which can be downloaded [here](https://git-scm.com/downloads).

### `Visual Studio Code [VSC]` - *Strongly Recommended*

* If you'd like to make changes to this code or the README file generated, Visual Studio Code is recommended and can be downloaded for free [here](https://code.visualstudio.com/download).

### `Node version 16` - **REQUIRED** to download node-based dependencies (i.e. Inquirer, My SQL 2, express, and console.table)
* Go to [Node's homepage, https://nodejs.org/en/](https://nodejs.org/en/), then [Downloads](https://nodejs.org/en/download/) and scroll down to the [Previous Releases](https://nodejs.org/en/download/releases/) bullet point. 

* Toggle between the results until the desired version 16 package and click Download. This application was developed with [Node.js version 16.18.0](https://nodejs.org/dist/v16.18.0/), click on [node-v16.18.0-x64.msi](https://nodejs.org/download/release/v16.18.0/node-v16.18.0-x64.msi) to download.

* The Full-Stack Blog also has [instructions on how to download Node](https://coding-boot-camp.github.io/full-stack/nodejs/how-to-install-nodejs).

### `Inquirer version 8.2.4` - **REQUIRED** to prompt questions

* This **MUST** be installed into this repository, start by opening the command line interface.

* If you have Visual Code Studio, add the README Generator repository to the workspace. Then, go to 'Settings' either through the cog icon in the lower left corner and clicking Settings, go to File -> Preferences -> Settings in the menu bar, or the key combo of Ctrl+,

* Then, change the settings in "Terminal: Explorer Kind" to "external" in the drop down menu.

![Changing "Terminal: Explorer Kind" Settings](./assets/screenshots/External-Terminal-Settings-1.PNG)
        
* Change the filepath of the "Terminal > External: [respective operating system]" settings to the preferred command line interface program (either your system's Command Prompts's file path or Git/Git Bash's file path)

![Changing "Terminal > External" Settings](./assets/screenshots/External-Terminal-Settings-1.PNG)

* After that, right-click the repository and select "Open in External Terminal"

![User uses Visual Studio Code to access repository through external terminal](./assets/screenshots/External-Terminal-Method-1-1.PNG)

![Note the match from Visual Studio Code to the opened external terminal](./assets/screenshots/External-Terminal-Method-1-2.PNG)


* If you do not have VSC, open the preferred terminal.

* Use "cd Desktop" to first reach the Desktop, cd stands for change directory.

* Continue using "cd" to navigate through the file path to reach the location of this repository on your computer.

![User uses Change Directory (cd) to access repository through external terminal](./assets/screenshots/External-Terminal-Method-2.PNG)

* Once this repository has been reached, type in `npm i inquirer@8.2.4` into the terminal and hit `Enter`.

### `Node My SQL 2 version 3.1.0` - **REQUIRED** for accessing database

* Follow the same methods from [Inquirer v8.2.4 Installation Section](#inquirer-version-824---required-to-prompt-questions) to reach this repository if you've already exited out of the command-line, then type in `npm i mysql2` and hit `Enter`.

### `express version 4.18.2` - **REQUIRED** for connecting and creating routes to database

* Follow the same methods from [Inquirer v8.2.4 Installation Section](#inquirer-version-824---required-to-prompt-questions) to reach this repository if you've already exited out of the command-line, then type in `npm i express` and hit `Enter`.

### `console.table version 0.10.0` - **REQUIRED** for printing MySQL rows into console log

* Follow the same methods from [Inquirer v8.2.4 Installation Section](#inquirer-version-824---required-to-prompt-questions) to reach this repository if you've already exited out of the command-line, then type in `npm i console.table` and hit `Enter`.

![User installs inquirer, MySQL 2, express, and console.table using command line](./assets/screenshots/npm-i-consoletable.PNG)


## Usage - for the purposes of this demonstration, Git Bash will be used as my preferred terminal

* A video of this application's usage can be viewed [here](#blank). If the link is non-functional, a copy of the video can be found in the "assets" folder.

* To use this application, start by using either of the two methods described in the [Inquirer v8.2.4 Installation Section](#inquirer-version-824---required-to-prompt-questions) to reach this repository through the preferred terminal.

Method 1:
![User uses Visual Studio Code to access repository through external terminal](./assets/screenshots/External-Terminal-Method-1-1.PNG)

![Note the match from Visual Studio Code to the opened external terminal](./assets/screenshots/External-Terminal-Method-1-2.PNG)

Method 2:

![User uses Change Directory (cd) to access repository through external terminal](./assets/screenshots/External-Terminal-Method-2.PNG)

* Once this repository has been reached, type in `node server.js` into the terminal and hit `Enter`. This will start the questions prompt. Answer the questions as according to the project in question.
![Initializing the app with 'node index.js' in the external terminal](./assets/screenshots/External-Terminal-Initializing.PNG)

* The first question will ...
![First question asked through the terminal is "What is the name of your file?"](./)


## Credits

* Sincerest thanks to [MaSandra Ewing, or mewing 0328](https://github.com/mewing0328) for sharing her code that is currently responsible for `updateRole`. `Add Role`, and `Add Employee` dynamically created a choice array based on the current SQL columns, and for teaching me the SQL function `NATURAL JOIN`.

* Code for inquirer validation as a separate function credit goes to [udalmik](https://stackoverflow.com/users/1584167/udalmik):<br></br> https://stackoverflow.com/questions/57321266/how-to-test-inquirer-validation

* `string.length()` method supplemental lesson provided by [W3 Schools](https://www.w3schools.com/default.asp):<br></br> https://www.w3schools.com/jsref/jsref_length_string.asp

* Linking within table credit goes to [Γιώργος Τερζής (or Giórgos Terzís)](https://stackoverflow.com/users/8697140/%ce%93%ce%b9%cf%8e%cf%81%ce%b3%ce%bf%cf%82-%ce%a4%ce%b5%cf%81%ce%b6%ce%ae%cf%82):<br></br> https://stackoverflow.com/questions/18680680/can-a-foreign-key-refer-to-a-primary-key-in-the-same-table

* Information for console.table dependency provided by [Node Package Manager](https://www.npmjs.com/):<br></br> https://www.npmjs.com/package/console.table

* Information for MySQL2 dependency provided by [Node Package Manager](https://www.npmjs.com/):<br></br> https://www.npmjs.com/package/mysql2

* Credit for querying function in server.js, responsible for invoking and connecting inquirer to SQL via query, belongs to "Adding to a table with Inquirer results" (3:51 minutes in) by [Lindsay Chapin](https://www.youtube.com/@lindsaychapin7392):<br></br> https://www.youtube.com/watch?v=gZugKSoAyoY&t=624s

* SQL Joins supplemental lesson provided by [W3 Schools](https://www.w3schools.com/default.asp):<br></br> https://www.w3schools.com/sql/sql_join.asp

* SQL Multiple Joins supplemental lesson provided by [SQL Shack](https://www.sqlshack.com/):<br></br> https://www.sqlshack.com/sql-multiple-joins-for-beginners-with-examples/

* Credit for self joining code in `query` array in server.js goes to [Martyna Sławińska](https://learnsql.com/authors/martyna-slawinska/) in her article, "What Is a Self Join in SQL? An Explanation With Seven Examples":<br></br> https://learnsql.com/blog/what-is-self-join-sql/

* SQL Server `CONCAT()` Function supplemental lesson provided by [W3 Schools](https://www.w3schools.com/default.asp):<br></br> https://www.w3schools.com/sql/func_sqlserver_concat.asp

* Converting an Object to an Array in Javascript supplemental lesson provided by [JavaScript Tutorial](https://www.javascripttutorial.net/):<br></br> https://www.javascripttutorial.net/object/convert-an-object-to-an-array-in-javascript/

* `map()` vs `forEach()` supplemental lesson provided by [Brandon Morelli](https://medium.com/@bmorelli25):<br></br> https://codeburst.io/javascript-map-vs-foreach-f38111822c0f

* SQL INSERT INTO supplemental lesson provided by [W3 Schools](https://www.w3schools.com/default.asp):<br></br> https://www.w3schools.com/sql/sql_insert.asp

* SQL DELETE supplemental lesson provided by [W3 Schools](https://www.w3schools.com/default.asp):[]():<br></br> https://www.w3schools.com/sql/sql_delete.asp

* SQL Server `Concat with +` supplemental lesson provided by [W3 Schools](https://www.w3schools.com/default.asp):<br></br> https://www.w3schools.com/sql/func_sqlserver_concat_with_plus.asp

* How to pass variables credit to [Paul Stephenson](https://stackoverflow.com/users/5536/paul-stephenson):<br></br> https://stackoverflow.com/questions/407048/accessing-variables-from-other-functions-without-using-global-variables

* How to update on a joined SQL table provided credit to [LeeTee](https://stackoverflow.com/users/1001034/leetee):<br></br> https://stackoverflow.com/questions/9588423/sql-server-inner-join-when-updating

* How to exit a process information provided by [Mayank Agarwal](https://www.tutorialspoint.com/index.htm):<br></br> https://www.tutorialspoint.com/how-to-exit-a-process-in-node-js

* SQL `NOT` keyword supplemental lesson provided by [W3 Schools](https://www.w3schools.com/default.asp):<br></br> https://www.w3schools.com/sql/sql_ref_not.asp

* SQL `NOT` keyword supplemental lesson provided by [Tech on the Net](https://www.techonthenet.com/):<br></br> https://www.techonthenet.com/sql/not.php

* []():<br></br> link

* []():<br></br> link

* []():<br></br> link

* []():<br></br> link

* []():<br></br> link

* []():<br></br> link

* []():<br></br> link

* []():<br></br> link


## Questions
If you have any questions, my GitHub profile is [www.github.com/leeclaire156](www.github.com/leeclaire156), and my email is [lee.claire156@gmail.com](mailto:lee.claire156@gmail.com).