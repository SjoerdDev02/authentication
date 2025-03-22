use http::Method;

pub const PROTECTED_ROUTES: &[(&str, &Method)] = &[
    ("/api/user", &Method::GET),
    ("/api/user", &Method::PATCH),
    ("/api/user", &Method::DELETE),
    ("/api/auth/logout", &Method::POST),
];
