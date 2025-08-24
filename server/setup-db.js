const { exec } = require('child_process');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📝 Database Setup Guide');
console.log('---------------------');

// Check if XAMPP/WAMP is running
console.log('\n🔍 Checking for MySQL service...');

// Function to run commands
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      } else {
        resolve(stdout);
      }
    });
  });
};

// Main setup function
const setupDatabase = async () => {
  try {
    // 1. Check if MySQL is running
    console.log('\n🚀 Step 1: Checking MySQL service...');
    try {
      await runCommand('mysql --version');
      console.log('✅ MySQL is installed');
    } catch (error) {
      console.log('❌ MySQL is not installed or not in PATH');
      console.log('\n💡 Please install MySQL or start XAMPP/WAMP');
      console.log('1. Download XAMPP: https://www.apachefriends.org/');
      console.log('2. Install and start MySQL service');
      console.log('3. Add MySQL to your PATH if needed');
      return;
    }

    // 2. Create database
    console.log('\n🚀 Step 2: Creating database...');
    try {
      await runCommand('mysql -u root -e "CREATE DATABASE IF NOT EXISTS web_landing_page;"');
      console.log('✅ Database created successfully');
    } catch (error) {
      console.log('❌ Failed to create database');
      console.log('\n💡 Try these solutions:');
      console.log('1. Make sure MySQL service is running');
      console.log('2. Check your MySQL root password');
      console.log('3. Try running this script as administrator');
      return;
    }

    console.log('\n🎉 Setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Start the backend server: npm start');
    console.log('2. In a new terminal, start the frontend: cd .. && npm start');
    
  } catch (error) {
    console.error('\n❌ An error occurred during setup:', error.message);
  } finally {
    readline.close();
  }
};

// Start the setup
setupDatabase();
