import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Generate admin password hash
const adminPassword = 'admin123'; // Change this to your desired password
const saltRounds = 10;
const passwordHash = bcrypt.hashSync(adminPassword, saltRounds);

// Generate JWT secret
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Generate admin API secret
const adminSecret = crypto.randomBytes(24).toString('hex');

console.log('🔐 Admin Credentials Generated:');
console.log('================================');
console.log(`Username: admin`);
console.log(`Password: ${adminPassword}`);
console.log(`Password Hash: ${passwordHash}`);
console.log('');
console.log('🔑 Security Keys:');
console.log('=================');
console.log(`JWT_SECRET: ${jwtSecret}`);
console.log(`ADMIN_SECRET: ${adminSecret}`);
console.log('');
console.log('📝 Copy these values to your .env.local file!');
console.log('⚠️  Keep your password safe - you\'ll need it to login!'); 