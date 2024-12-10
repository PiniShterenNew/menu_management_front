export const typesOptions = [
    { color: "magenta", value: "פירות טריים" },
    { color: "volcano", value: "פירות קפואים" },
    { color: "orange", value: "תמציות, ממרחים ותוספות" },
    { color: "gold", value: "אבקות" },
    { color: "lime", value: "גלידות וסורבה" },
    { color: "green", value: "מאפים ועוגיות" },
    { color: "cyan", value: "אריזות וחד פעמי" },
    { color: "blue", value: "מוצרי חלב" },
]

export const optionsUnits = [
    { value: "weight", label: "משקל", display: (value) => value >= 1 ? 'ק"ג' : "גרם" },
    { value: "volume", label: "נפח", display: (value) => value >= 1 ? 'ליטר' : 'מ"ל' },
    { value: "units", label: "יחידות", display: () => "יחידות" },
]
