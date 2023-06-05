const inquirer = require('inquirer');

// Prompt for adding a department
function promptAddDepartment() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the department name:'
    }
  ]);
}

// Prompt for adding a role
function promptAddRole(departments) {
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

// Prompt for adding an employee
function promptAddEmployee(roles, employees) {
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

// Prompt for updating an employee's role
function promptUpdateEmployeeRole(employees, roles) {
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

module.exports = {
  promptAddDepartment,
  promptAddRole,
  promptAddEmployee,
  promptUpdateEmployeeRole
};
