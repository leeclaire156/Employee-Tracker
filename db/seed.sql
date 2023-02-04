INSERT INTO department (name)
VALUES ("Accounting and finances"), --1--
       ("Marketing"), --2--
       ("Social Media"), --3--
       ("Sales"), --4--
       ("Research and development"); --5--

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 200000.00, 1), --1---
       ("Accountant", 75000.00, 1), --2---
       ("Assistant",40000.00, 2), --3---
       ("Data Analyst", 73000.00, 3), --4---
       ("Sales Representative",50000.00,4), --5---
       ("Researcher", 25000.00, 5); --6---

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sadia", "Ahmed", 1, null),
       ("Chris","Lam", 4, 1),
       ("Brandon", "Nguyen", 6, 1),
       ("Elijah", "Viloria", 2, 1),
       ("Jabril", "Nicoles", 5, 1);