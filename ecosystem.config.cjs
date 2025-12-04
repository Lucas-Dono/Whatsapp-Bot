module.exports = {
  apps: [
    {
      name: "backend",
      script: "./src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
      exp_backoff_restart_delay: 100
    },
    {
      name: "frontend",
      cwd: "./cerveceria-admin-ui",
      script: "npx",
      args: "react-scripts start",
      env: {
        PORT: 3001,
        REACT_APP_BACKEND_URL: "http://localhost:3000",
        HOST: "0.0.0.0"
      }
    }
  ]
};
  