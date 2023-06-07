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

    return rows.map((row) => new Employee(row.id, row.first_name, row.last_name, row.title, row.department, row.salary, row.manager));
  } catch (error) {
    throw error;
  }
}

// View employees by manager
async function viewEmployeesByManager(managerId) {
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
    WHERE
      manager.id = ?
  `, [managerId]);

  return rows.map((row) => new Employee(row.id, row.first_name, row.last_name, row.title, row.department, row.salary, row.manager));
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
  try {
    const result = await connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);
    return result;
  } catch (error) {
    throw error;
  }
}

// Function to update an employee's manager
async function updateEmployeeManager(employeeId, managerId) {
  try {
    const [employee] = await connection.execute(
      'SELECT id, first_name, last_name FROM employee WHERE id = ?',
      [employeeId]
    );

    if (!employee.length) {
      console.log('Employee not found.');
      return;
    }

    const [manager] = await connection.execute(
      'SELECT id, first_name, last_name FROM employee WHERE id = ?',
      [managerId]
    );

    if (!manager.length) {
      console.log('Manager not found.');
      return;
    }

    await connection.execute(
      'UPDATE employee SET manager_id = ? WHERE id = ?',
      [managerId, employeeId]
    );

    console.log(`Employee '${employee[0].first_name} ${employee[0].last_name}' has been assigned the manager '${manager[0].first_name} ${manager[0].last_name}'.`);
  } catch (error) {
    throw error;
  }
}

// Delete a department
async function deleteDepartment(departmentId) {
  try {
    // Check if any roles reference the department
    const rolesInDepartment = await connection.query(
      'SELECT * FROM role WHERE department_id = ?',
      [departmentId]
    );

    if (rolesInDepartment.length > 0) {
      throw new Error('Cannot delete department. Roles are still assigned to it.');
    }

    // Delete the department
    const result = await connection.query('DELETE FROM department WHERE id = ?', [departmentId]);
    return result;
  } catch (error) {
    throw error;
  }
}

// Delete a role
async function deleteRole(roleId) {
  try {
    // Check if any employees have the role
    const employeesWithRole = await connection.query(
      'SELECT * FROM employee WHERE role_id = ?',
      [roleId]
    );

    if (employeesWithRole.length > 0) {
      throw new Error('Cannot delete role. Employees are still assigned to it.');
    }

    // Delete the role
    const result = await connection.query('DELETE FROM role WHERE id = ?', [roleId]);
    return result;
  } catch (error) {
    throw error;
  }
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
