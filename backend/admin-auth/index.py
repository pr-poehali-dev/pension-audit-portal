"""
Проверка пароля для входа в панель редактирования.
POST / — {"password": "..."} → {"ok": true} или 401
"""
import json
import os

HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": HEADERS, "body": ""}

    if event.get("httpMethod") != "POST":
        return {"statusCode": 405, "headers": HEADERS, "body": json.dumps({"error": "method not allowed"})}

    body = json.loads(event.get("body") or "{}")
    password = body.get("password", "")
    correct = os.environ.get("ADMIN_PASSWORD", "")

    if not correct:
        return {"statusCode": 500, "headers": HEADERS, "body": json.dumps({"error": "password not configured"})}

    if password == correct:
        return {"statusCode": 200, "headers": HEADERS, "body": json.dumps({"ok": True})}

    return {"statusCode": 401, "headers": HEADERS, "body": json.dumps({"ok": False, "error": "Неверный пароль"})}
