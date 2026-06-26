from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock
from typing import Any
from uuid import uuid4

from flask import Flask, jsonify, render_template, request

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
SUBMISSIONS_FILE = DATA_DIR / "submissions.jsonl"
WRITE_LOCK = Lock()

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
ADMIN_KEY = os.environ.get("ADMIN_KEY", "doi-key-nay-truoc-khi-deploy")


@app.get("/")
def home():
    return render_template("index.html")


@app.post("/api/submit")
def submit_date():
    payload: dict[str, Any] = request.get_json(silent=True) or {}

    times = payload.get("times", [])
    foods = payload.get("foods", [])
    custom_food = str(payload.get("customFood", "")).strip()

    if not isinstance(times, list) or not times:
        return jsonify({
            "success": False,
            "message": "chọn mụt bủi đyyy, ank ckuaa đọc đc suy nghĩ eiu douu 🥲🧠"
        }), 400

    if not isinstance(foods, list):
        foods = []

    allowed_times = {"Sáng", "Trưa", "Chiều", "Tối"}
    clean_times = [str(item) for item in times if str(item) in allowed_times]
    if not clean_times:
        return jsonify({
            "success": False,
            "message": "chọn mụt bủi hợp lệ đyyy 🥲🧠"
        }), 400

    clean_foods = []
    for item in foods:
        item = str(item).strip()
        if item and len(item) <= 80:
            clean_foods.append(item)

    if custom_food:
        clean_foods.append(f"Khác: {custom_food[:120]}")

    if not clean_foods:
        return jsonify({
            "success": False,
            "message": "eiu chọn mụt món đyyy, hong lẽ mìn đy ngắm nhau no bụng 🥲🍽️"
        }), 400

    record = {
        "id": uuid4().hex,
        "submitted_at_utc": datetime.now(timezone.utc).isoformat(),
        "date": "07/07",
        "times": clean_times,
        "foods": clean_foods,
        "user_agent": request.headers.get("User-Agent", "")[:300],
    }

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with WRITE_LOCK:
        with SUBMISSIONS_FILE.open("a", encoding="utf-8") as file:
            file.write(json.dumps(record, ensure_ascii=False) + "\n")

    return jsonify({
        "success": True,
        "message": "chốt kèo thành công gouuu!!! 💗",
        "ticket": {
            "date": record["date"],
            "times": record["times"],
            "foods": record["foods"],
        },
    })


def read_submissions() -> list[dict[str, Any]]:
    if not SUBMISSIONS_FILE.exists():
        return []

    records: list[dict[str, Any]] = []
    with SUBMISSIONS_FILE.open("r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if not line:
                continue
            try:
                records.append(json.loads(line))
            except json.JSONDecodeError:
                continue

    return records[-20:]


def admin_key_is_valid() -> bool:
    return request.args.get("key", "") == ADMIN_KEY


@app.get("/ank-xem-ket-qua")
def admin_results():
    if not admin_key_is_valid():
        return "Sai khóa bí mật hoặc thiếu khóa.", 403

    return render_template("admin.html", records=read_submissions())


@app.get("/api/submissions")
def list_submissions():
    if not admin_key_is_valid():
        return jsonify({"success": False, "message": "Sai khóa bí mật."}), 403

    return jsonify(read_submissions())


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
