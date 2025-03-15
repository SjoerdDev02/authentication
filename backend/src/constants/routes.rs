use http::Method;

pub const PROTECTED_ROUTES: &[(&str, &Method)] = &[
    ("/api/user", &Method::PATCH),
    ("/api/user", &Method::DELETE),
    ("/api/user", &Method::GET),
    ("/api/auth/logout", &Method::POST),
];
