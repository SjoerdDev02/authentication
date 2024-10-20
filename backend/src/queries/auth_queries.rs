pub const CREATE_USER: &str = r#"
    INSERT INTO users (name, email, password_hash)
    VALUES (?, ?, ?)
"#;

pub const DELETE_USER: &str = r#"
    DELETE FROM users 
    WHERE id = ?;
"#;

pub const CONFIRM_USER: &str = r#"
    UPDATE users
    SET is_confirmed = true
    WHERE id = ?;
"#;

pub const UPDATE_USER_EMAIL_AND_NAME: &str = r#"
    UPDATE users 
    SET email = ?, name = ?
    WHERE id = ?;
"#;

pub const UPDATE_USER_PASSWORD: &str = r#"
    UPDATE users 
    SET password_hash = ?
    WHERE id = ?;
"#;

pub const GET_USER_BY_EMAIL: &str = r#"
    SELECT id, name, email, password_hash
    FROM users
    WHERE email = ?;
"#;

pub const GET_USER_BY_ID: &str = r#"
    SELECT id, name, email
    FROM users
    WHERE id = ?;
"#;
