const inquirer = require('inquirer');
const queries = require('../db/queries');

// Add a department
function promptAddDepartment() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the department name:'
    }
  ]);
}

// Add a role
async function promptAddRole() {
  const departments = await queries.viewAllDepartments();
  return inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the role title:'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the role salary:'
    },
    {
      type: 'list',
      name: 'departmentId',
      message: 'Select the department for the role:',
      choices: departments.map(department => ({
        name: department.name,
        value: department.id
      }))
    }
  ]);
}

// Add an employee
async function promptAddEmployee(roles, employees) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Enter the employee first name:'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Enter the employee last name:'
    },
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the employee role:',
      choices: roles.map(role => ({
        name: role.title,
        value: role.id
      }))
    },
    {
      type: 'list',
      name: 'managerId',
      message: 'Select the employee manager:',
      choices: employees.map(employee => ({
        name: `${employee.firstName} ${employee.lastName}`,
        value: employee.id
      }))
    }
  ]);
}

// Update an employee's role
async function promptUpdateEmployeeRole() {
  const employees = await queries.viewAllEmployees();
  const roles = await queries.viewAllRoles();
  return inquirer.prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: 'Select the employee to update:',
      choices: employees.map(employee => ({
        name: `${employee.firstName} ${employee.lastName}`,
        value: employee.id
      }))
    },
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the new role for the employee:',
      choices: roles.map(role => ({
        name: role.title,
        value: role.id
      }))
    }
  ]);
}

// Update an employee's manager
async function promptUpdateEmployeeManager(employees) {
  const employeeChoices = employees.map((employee) => ({
    name: `${employee.firstName} ${employee.lastName}`,
    value: employee.id
  }));

  const managerChoices = employees.map((employee) => ({
    name: `${employee.firstName} ${employee.lastName}`,
    value: employee.id
  }));

  if (employeeChoices.length === 0) {
    console.log('No employees found.');
    return null;
  }

  return inquirer.prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: 'Select the employee you want to update the manager for:',
      choices: employeeChoices
    },
    {
      type: 'list',
      name: 'managerId',
      message: 'Select the new manager for the employee:',
      choices: managerChoices
    }
  ]);
}

// Delete a department
async function promptDeleteDepartment() {
  const departments = await queries.viewAllDepartments();
  return inquirer.prompt([
    {
      type: 'list',
      name: 'departmentId',
      message: 'Select the department to delete:',
      choices: departments.map(department => ({
        name: department.name,
        value: department.id
      }))
    }
  ]);
}

// Prompt for deleting a role
async function promptDeleteRole() {
  const roles = await queries.viewAllRoles();
  return inquirer.prompt([
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the role to delete:',
      choices: roles.map(role => ({
        name: role.title,
        value: role.id
      }))
    }
  ]);
}

// Delete an employee
async function promptDeleteEmployee() {
  const employees = await queries.viewAllEmployees();
  return inquirer.prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: 'Select the employee to delete:',
      choices: employees.map(employee => ({
        name: `${employee.firstName} ${employee.lastName}`,
        value: employee.id
      }))
    }
  ]);
}

// Total utilized budget of a department
async function promptViewDepartmentBudget() {
  const departments = await queries.viewAllDepartments();
  return inquirer.prompt([
    {
      type: 'list',
      name: 'departmentId',
      message: 'Select the department to view the total utilized budget:',
      choices: departments.map(department => ({
        name: department.name,
        value: department.id
      }))
    }
  ]);
}

module.exports = {
  promptAddDepartment,
  promptAddRole,
  promptAddEmployee,
  promptUpdateEmployeeRole,
  promptUpdateEmployeeManager,
  promptDeleteDepartment,
  promptDeleteRole,
  promptDeleteEmployee,
  promptViewDepartmentBudget
};