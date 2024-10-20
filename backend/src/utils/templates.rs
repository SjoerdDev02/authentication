use crate::utils::dates::get_current_year;
use std::collections::HashMap;
use tera::{Context, Tera};

pub fn generate_template(
    template: &str,
    template_name: &str,
    variables: HashMap<&str, String>,
) -> Result<String, tera::Error> {
    let mut tera = Tera::new("templates/**/*")?;

    tera.add_raw_template(template_name, template)?;

    let mut context = Context::new();
    context.insert("year", &get_current_year());
    context.insert("company_name", "Authentication Inc.");

    for (key, value) in variables {
        context.insert(key, &value);
    }

    let rendered = tera.render(template_name, &context)?;

    Ok(rendered)
}
