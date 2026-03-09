const fs = require('fs');

const departments = ['Engineering', 'Finance', 'HR', 'Sales'];
const roles = ['employee', 'manager', 'admin'];

const users = [];

for (let i = 1; i <= 5000; i++) {
  users.push({
    email: `user${i}@example.com`,
    panNumber: `ABCDE${1000 + i}F`,
    firstName: `User${i}`,
    lastName: 'Test',
    password: 'password123',
    role: roles[i % roles.length],
    employeeId: `EMP${1000 + i}`,
    department: departments[i % departments.length],
    status: true,
    image: `user${i}.png`,
    dateOfBirth: `199${i % 10}-0${(i % 9) + 1}-01`,
  });
}

fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

console.log('users generated successfully');
