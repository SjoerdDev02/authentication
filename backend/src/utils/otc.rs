use rand::{distributions::Alphanumeric, thread_rng, Rng};

pub fn format_otc_key(otc: &str) -> String {
    let otc_key = format!("otc:{}", otc);

    otc_key
}

pub fn create_otc() -> String {
    let otc: String = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(6)
        .map(char::from)
        .map(|character| character.to_ascii_uppercase())
        .collect();

    otc
}