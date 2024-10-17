use chrono::Datelike;

pub fn get_current_year() -> i32 {
    let current_date = chrono::Utc::now();
    let year = current_date.year();

    year
}
