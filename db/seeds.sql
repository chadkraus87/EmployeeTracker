-- Departments
INSERT INTO department (name) VALUES
  ('Sales'),
  ('Marketing'),
  ('Finance'),
  ('Support');

-- Roles
INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Manager', 80000, 1),
  ('Sales Representative', 65000, 1),
  ('Marketing Coordinator', 50000, 2),
  ('Finance Analyst', 60000, 3),
  ('Customer Support Manager', 70000, 4);

-- Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('Captain', 'America', 1, NULL),
  ('Jean', 'Grey', 2, 1),
  ('Doctor', 'Strange', 2, 1),
  ('Wonder', 'Woman', 4, NULL);
