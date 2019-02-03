module.exports = {
  apps : [{
    name: "osuPlay",
    script: "dist/index.js",
    instances: 1,
    autorestart: true,
    watch: "dist",
    instance_var: "INSTANCE_ID",
    watch_options: {
      followSymlinks: false,
    },
    max_memory_restart: "700M",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    },
  }],
};
