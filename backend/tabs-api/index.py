"""
API для получения и сохранения контента вкладок пенсионного сайта.
GET / — список всех вкладок
GET /?tab_id=north — одна вкладка
POST / — сохранить изменения вкладки
"""
import json
import os
import psycopg2

HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}

SCHEMA = "t_p51929753_pension_audit_portal"


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    if method == "GET":
        tab_id = params.get("tab_id")
        conn = get_conn()
        cur = conn.cursor()

        if tab_id:
            cur.execute(
                f"SELECT tab_id, title, subtitle, description, conditions, mistakes, badge, updated_at FROM {SCHEMA}.tab_content WHERE tab_id = %s",
                (tab_id,)
            )
            row = cur.fetchone()
            conn.close()
            if not row:
                return {"statusCode": 404, "headers": HEADERS, "body": json.dumps({"error": "not found"})}
            data = _row_to_dict(row)
        else:
            cur.execute(
                f"SELECT tab_id, title, subtitle, description, conditions, mistakes, badge, updated_at FROM {SCHEMA}.tab_content ORDER BY id"
            )
            rows = cur.fetchall()
            conn.close()
            data = [_row_to_dict(r) for r in rows]

        return {"statusCode": 200, "headers": HEADERS, "body": json.dumps(data, ensure_ascii=False, default=str)}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        tab_id = body.get("tab_id")
        if not tab_id:
            return {"statusCode": 400, "headers": HEADERS, "body": json.dumps({"error": "tab_id required"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""UPDATE {SCHEMA}.tab_content
                SET title=%s, subtitle=%s, description=%s, conditions=%s, mistakes=%s, badge=%s, updated_at=NOW()
                WHERE tab_id=%s""",
            (
                body.get("title"),
                body.get("subtitle"),
                body.get("description"),
                json.dumps(body.get("conditions", []), ensure_ascii=False),
                json.dumps(body.get("mistakes", []), ensure_ascii=False),
                body.get("badge"),
                tab_id,
            )
        )
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": HEADERS, "body": json.dumps({"ok": True})}

    return {"statusCode": 405, "headers": HEADERS, "body": json.dumps({"error": "method not allowed"})}


def _row_to_dict(row):
    return {
        "tab_id": row[0],
        "title": row[1],
        "subtitle": row[2],
        "description": row[3],
        "conditions": row[4] if isinstance(row[4], list) else json.loads(row[4] or "[]"),
        "mistakes": row[5] if isinstance(row[5], list) else json.loads(row[5] or "[]"),
        "badge": row[6],
        "updated_at": str(row[7]),
    }
