"""
API для загрузки и получения медиафайлов (фото, видео, PDF) по вкладкам.
GET /?tab_id=north — список файлов вкладки
POST / — загрузить файл (base64 в body)
DELETE /?media_id=5 — удалить файл
"""
import json
import os
import base64
import uuid
import psycopg2
import boto3

HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}

SCHEMA = "t_p51929753_pension_audit_portal"


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_s3():
    return boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )


def cdn_url(key: str) -> str:
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    if method == "GET":
        tab_id = params.get("tab_id")
        if not tab_id:
            return {"statusCode": 400, "headers": HEADERS, "body": json.dumps({"error": "tab_id required"})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, tab_id, file_url, file_name, file_type, created_at FROM {SCHEMA}.tab_media WHERE tab_id=%s ORDER BY created_at DESC",
            (tab_id,)
        )
        rows = cur.fetchall()
        conn.close()
        data = [{"id": r[0], "tab_id": r[1], "file_url": r[2], "file_name": r[3], "file_type": r[4], "created_at": str(r[5])} for r in rows]
        return {"statusCode": 200, "headers": HEADERS, "body": json.dumps(data, ensure_ascii=False, default=str)}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        tab_id = body.get("tab_id")
        file_data = body.get("file_data")
        file_name = body.get("file_name", "file")
        file_type = body.get("file_type", "image")
        content_type = body.get("content_type", "application/octet-stream")

        if not tab_id or not file_data:
            return {"statusCode": 400, "headers": HEADERS, "body": json.dumps({"error": "tab_id and file_data required"})}

        raw = base64.b64decode(file_data)
        ext = file_name.rsplit(".", 1)[-1].lower() if "." in file_name else "bin"
        key = f"pension-tabs/{tab_id}/{uuid.uuid4()}.{ext}"

        s3 = get_s3()
        s3.put_object(Bucket="files", Key=key, Body=raw, ContentType=content_type)
        url = cdn_url(key)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.tab_media (tab_id, file_url, file_name, file_type) VALUES (%s,%s,%s,%s) RETURNING id",
            (tab_id, url, file_name, file_type)
        )
        media_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        return {"statusCode": 200, "headers": HEADERS, "body": json.dumps({"ok": True, "id": media_id, "url": url})}

    if method == "DELETE":
        media_id = params.get("media_id")
        if not media_id:
            return {"statusCode": 400, "headers": HEADERS, "body": json.dumps({"error": "media_id required"})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {SCHEMA}.tab_media WHERE id=%s", (int(media_id),))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": HEADERS, "body": json.dumps({"ok": True})}

    return {"statusCode": 405, "headers": HEADERS, "body": json.dumps({"error": "method not allowed"})}
