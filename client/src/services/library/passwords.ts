const defaultPassword = '5sH8pO19f$?~';
export const passwordForAdminPanel = process.env.ADMIN_PASSWORD || defaultPassword;
console.log('Admin panel password:', passwordForAdminPanel);
