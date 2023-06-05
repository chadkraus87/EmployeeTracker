const inquirer = require('inquirer');

const { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } = require('./db/queries');
const Department = require('./models/Department');
const Role = require('./models/Role');
const Employee = require('./models/Employee');
const { promptAddDepartment, promptAddRole, promptAddEmployee, promptUpdateEmployeeRole } = require('./utils/prompts');

// Function to start the application
async function startApp() {
  try {
    let exit = false;

    while (!exit) {
      const { choice } = await inquirer.prompt([
        {
          type: 'list',
          name: 'choice',
          message: 'What would you like to do?',
          choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
          ]
        }
      ]);

      switch (choice) {
        case 'View all departments':
          await displayAllDepartments();
          break;

        case 'View all roles':
          await displayAllRoles();
          break;

        case 'View all employees':
          await displayAllEmployees();
          break;

        case 'Add a department':
          await addNewDepartment();
          break;

        case 'Add a role':
          await addNewRole();
          break;

        case 'Add an employee':
          await addNewEmployee();
          break;

        case 'Update an employee role':
          await updateEmployeeRoleData();
          break;

        case 'Exit':
          exit = true;
          break;
      }
    }

    console.log('Goodbye!');
    process.exit(0);
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

// Function to display all departments
async function displayAllDepartments() {
  const departments = await viewAllDepartments();
  console.table(departments);
}

// Function to display all roles
async function displayAllRoles() {
  const roles = await viewAllRoles();
  console.table(roles);
}

// Function to display all employees
async function displayAllEmployees() {
  const employees = await viewAllEmployees();
  console.table(employees);
}

// Function to add a new department
async function addNewDepartment() {
  const { name } = await promptAddDepartment();
  const department = new Department(null, name);
  await addDepartment(department);
  console.log('Department added successfully!');
}

// Function to add a new role
async function addNewRole() {
  const departments = await viewAllDepartments();
  const { title, salary, departmentId } = await promptAddRole(departments);
  const role = new Role(null, title, salary, departmentId);
  await addRole(role);
  console.log('Role added successfully!');
}

// Function to add a new employee
async function addNewEmployee() {
  const roles = await viewAllRoles();
  const employees = await viewAllEmployees();
  const { firstName, lastName, roleId, managerId } = await promptAddEmployee(roles, employees);
  const employee = new Employee(null, firstName, lastName, roleId, managerId);
  await addEmployee(employee);
  console.log('Employee added successfully!');
}

// Function to update an employee's role
async function updateEmployeeRoleData() {
  const employees = await viewAllEmployees();
  const roles = await viewAllRoles();
  const { employeeId, roleId } = await promptUpdateEmployeeRole(employees, roles);
  await updateEmployeeRole(employeeId, roleId);
  console.log('Employee role updated successfully!');
}

// Call the startApp function to start the application
startApp();
