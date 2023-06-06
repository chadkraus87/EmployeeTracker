const connection = require('../db/connection');
const Role = require('../models/Role');
const Employee = require('../models/Employee');
const Department = require('../models/Department');

// View all departments
async function viewAllDepartments() {
  const [rows] = await connection.query('SELECT * FROM department');
  const departments = rows.map((row) => new Department(row.id, row.name));
  return departments;
}

// View all roles
async function viewAllRoles() {
  const [rows] = await connection.query('SELECT * FROM role');
  const roles = rows.map((row) => new Role(row.id, row.title, row.salary, row.department_id));
  return roles;
}

// View all employees
async function viewAllEmployees() {
  try {
    const [rows] = await connection.execute(`
      SELECT 
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title,
        department.name AS department,
        role.salary,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM
        employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

// View employees by manager
async function viewEmployeesByManager(managerId) {
  const [rows] = await connection.query('SELECT * FROM employee WHERE manager_id = ?', [managerId]);
  const employees = rows.map((row) => new Employee(row.id, row.first_name, row.last_name, row.role_id, row.manager_id));
  return employees;
}

// View employees by department
async function viewEmployeesByDepartment(departmentId) {
  const [rows] = await connection.query('SELECT * FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = ?)', [departmentId]);
  const employees = rows.map((row) => new Employee(row.id, row.first_name, row.last_name, row.role_id, row.manager_id));
  return employees;
}

// Add a department
async function addDepartment(department) {
  const result = await connection.query('INSERT INTO department SET ?', department);
  return result;
}

// Add a role
async function addRole(role) {
  const { title, salary, departmentId } = role;
  const result = await connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
  return result;
}

// Add an employee
async function addEmployee(employee) {
  const { firstName, lastName, roleId, managerId } = employee;
  const result = await connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
  return result;
}

// Update an employee's role
async function updateEmployeeRole(employeeId, roleId) {
  const result = await connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);
  return result;
}

// Function to update an employee's manager
async function updateEmployeeManager(employeeId, managerId) {
  return new Promise((resolve, reject) => {
    connection.query(
      'UPDATE employees SET manager_id = ? WHERE id = ?',
      [managerId, employeeId],
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );
  });
}

// Delete a department
async function deleteDepartment(departmentId) {
  const result = await connection.query('DELETE FROM department WHERE id = ?', [departmentId]);
  return result;
}

// Delete a role
async function deleteRole(roleId) {
  const result = await connection.query('DELETE FROM role WHERE id = ?', [roleId]);
  return result;
}

// Delete an employee
async function deleteEmployee(employeeId) {
  const result = await connection.query('DELETE FROM employee WHERE id = ?', [employeeId]);
  return result;
}

// View total utilized budget of a department
async function viewDepartmentBudget(departmentId) {
  const [rows] = await connection.query('SELECT SUM(salary) AS total_budget FROM role WHERE department_id = ?', [departmentId]);
  const { total_budget } = rows[0];
  return total_budget;
}

module.exports = {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
  deleteDepartment,
  deleteRole,
  deleteEmployee,
  viewDepartmentBudget
};
