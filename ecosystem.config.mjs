export default {
    apps : [{
        name: "",
        script: "./app.js",
        exec_mode: "cluster",
        instances: "max",
        env_production: {
            NODE_ENV: "production"
        },
        env_development: {
            NODE_ENV: "development"
        }
    }]
}
