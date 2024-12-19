use std::env;

pub fn get_environment_variable(var_name: &str) -> Result<String, String> {
    env::var(var_name).map_err(|_| format!("Missing environment variable: {}", var_name))
}
