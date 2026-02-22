module.exports = {
  apps: [
    {
      name: 'wheatbackend',
      cwd: __dirname,
      script: 'index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3715,
      },
    },
  ],
};
