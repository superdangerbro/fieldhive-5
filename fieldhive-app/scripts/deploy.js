#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

// Configuration
const config = {
  projectId: 'fieldhive-5-0',
  services: ['firestore', 'functions', 'hosting', 'storage'],
};

// Helper to run commands
const runCommand = (command, args, options = {}) => {
  return new Promise((resolve, reject) => {
    console.log(`\n> ${command} ${args.join(' ')}`);
    
    const proc = spawn(command, args, {
      stdio: 'inherit',
      ...options,
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with code ${code}`));
        return;
      }
      resolve();
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
};

// Main deployment script
async function deploy() {
  try {
    // Build Functions
    console.log('\n📦 Building Functions...');
    await runCommand('npm', ['--prefix', 'functions', 'run', 'build']);

    // Run linting
    console.log('\n🔍 Running linting...');
    await runCommand('npm', ['--prefix', 'functions', 'run', 'lint']);

    // Deploy to Firebase
    console.log('\n🚀 Deploying to Firebase...');
    const deployArgs = ['deploy', '--project', config.projectId];
    
    // Add specific services if provided
    if (config.services.length > 0) {
      config.services.forEach(service => {
        deployArgs.push('--only', service);
      });
    }

    await runCommand('firebase', deployArgs);

    console.log('\n✅ Deployment completed successfully!');
  } catch (error) {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Make script executable
if (require.main === module) {
  const scriptPath = __filename;
  try {
    require('fs').chmodSync(scriptPath, '755');
  } catch (error) {
    console.warn('Failed to make script executable:', error);
  }
  
  // Run deployment
  deploy().catch(error => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });
}
