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
  const [rows] = await connection.query('SELECT * FROM employee');
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

module.exports = {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole
};
