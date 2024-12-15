use regex::Regex;
use std::collections::HashMap;

pub fn sanitize(input: &str) -> String {
    let mut entity_map: HashMap<char, &str> = HashMap::new();
    entity_map.insert('&', "&amp;");
    entity_map.insert('<', "&lt;");
    entity_map.insert('>', "&gt;");
    entity_map.insert('"', "&quot;");
    entity_map.insert('\'', "&apos;");
    entity_map.insert('/', "&amp;#x2F;");
    entity_map.insert('`', "&amp;#x60;");
    entity_map.insert('=', "&amp;#x3D;");

    let regex = match Regex::new(r"[&<>'`=/]") {
        Ok(r) => r,
        Err(_) => return input.to_string()
    };

    let result = regex.replace_all(input, |caps: &regex::Captures| {
        match caps.get(0) {
            Some(matched) => {
                let matched_char = matched.as_str().chars().next();

                match matched_char {
                    Some(chararcter) => {
                        match entity_map.get(&chararcter) {
                            Some(&entity) => entity.to_string(),
                            None => matched.as_str().to_string(),
                        }
                    }
                    None => matched.as_str().to_string(),
                }
            },
            None => String::new(),
        }
    });

    result.to_string()
}
