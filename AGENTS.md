# Project Conventions & Guidelines

## Backend PHP API Standards (cPanel / MySQL)
All backend PHP API scripts located under `/public/api/` must follow these rules:
1. **Driver**: Use the native `mysqli` driver (`$conn = @new mysqli(...)`). Do NOT use PDO.
2. **Self-Contained & Backward-Compatible**: Use explicit, robust PHP structures such as `isset()`, `is_array()`, and `array(...)` to ensure 100% compatibility across PHP 5.6 through PHP 8.1+. Avoid strict dependencies or complex cross-file includes that can trigger silent 500 errors.
3. **Encoding & Headers**: Always set `utf8mb4` charset (`$conn->set_charset("utf8mb4");`) and CORS JSON headers (`Content-Type: application/json; charset=utf-8`).
4. **Error Handling**: Suppress raw display errors (`display_errors = 0`) in production and return structured JSON responses with `success: false` and Persian error messages.
