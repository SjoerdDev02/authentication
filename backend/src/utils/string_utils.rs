use std::collections::HashMap;
use regex::Regex;

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

    let regex = Regex::new(r"[&<>'`=/]").expect("Invalid regex pattern");

    let result = regex.replace_all(input, |caps: &regex::Captures| {
        if let Some(matched) = caps.get(0) {
            let matched_char = matched.as_str().chars().next().unwrap_or_default();
            String::from(*entity_map.get(&matched_char).unwrap_or(&matched.as_str()))
        } else {
            String::new()
        }
    });

    result.to_string()
}