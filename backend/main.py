from __future__ import annotations

from collections import OrderedDict
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Any

import feedparser
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware


APP_NAME = "SIMPONI News API"

QUERY_KEYS = [
    "pernikahan dini Indonesia",
    "perkawinan anak Indonesia",
    "pencegahan perkawinan anak",
    "dispensasi kawin Indonesia",
    "pernikahan anak di Indonesia",
    "kebijakan pemerintah pernikahan anak",
]

RSS_FEEDS = [
    "https://news.google.com/rss/search?q={query}&hl=id&gl=ID&ceid=ID:id",
]

app = FastAPI(title=APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def clean_text(value: Any) -> str:
    if not value:
        return ""
    text = str(value).replace("\n", " ").replace("\r", " ").strip()
    return " ".join(text.split())


def parse_published_at(value: Any) -> str:
    if not value:
        return ""

    try:
        parsed = parsedate_to_datetime(value)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc).isoformat()
    except Exception:
        try:
            dt = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.astimezone(timezone.utc).isoformat()
        except Exception:
            return ""


def extract_image(entry: dict[str, Any]) -> str:
    media_content = entry.get("media_content") or []
    if isinstance(media_content, list) and media_content:
        first = media_content[0]
        if isinstance(first, dict):
            image = first.get("url") or first.get("href")
            if image:
                return image

    thumbnails = entry.get("media_thumbnail") or []
    if isinstance(thumbnails, list) and thumbnails:
        first = thumbnails[0]
        if isinstance(first, dict):
            image = first.get("url") or first.get("href")
            if image:
                return image

    return ""


def normalize_article(entry: dict[str, Any]) -> dict[str, Any]:
    title = clean_text(entry.get("title"))
    link = clean_text(entry.get("link"))
    if not title or not link:
        return {}

    description = clean_text(
        (entry.get("summary") or entry.get("summary_detail", {}).get("value"))
    )

    source = clean_text(
        (entry.get("source") or {}).get("title")
        or entry.get("author")
        or "Google News"
    )

    published_at = parse_published_at(
        entry.get("published") or entry.get("updated") or entry.get("published_parsed")
    )

    return {
        "title": title,
        "link": link,
        "source": source,
        "description": description,
        "published_at": published_at,
        "image": extract_image(entry),
    }


def fetch_google_news(limit: int = 6) -> list[dict[str, Any]]:
    merged: OrderedDict[str, dict[str, Any]] = OrderedDict()

    for query in QUERY_KEYS:
        url = RSS_FEEDS[0].format(query=query.replace(" ", "+"))
        try:
            feed = feedparser.parse(url)
        except Exception:
            continue

        for entry in feed.entries:
            doc = normalize_article(entry)
            if not doc:
                continue

            key = doc["link"]
            if key in merged:
                continue

            title_lower = doc["title"].lower()
            relevant = any(
                keyword in title_lower
                for keyword in [
                    "pernikahan dini",
                    "perkawinan anak",
                    "dispensasi",
                    "marriage",
                    "child marriage",
                    "anak",
                    "pencegahan",
                    "kawin",
                    "nikah",
                    "pernikahan",
                ]
            )
            if not relevant:
                continue

            merged[key] = doc

    items = list(merged.values())
    items.sort(key=lambda item: item.get("published_at") or "", reverse=True)
    return items[:limit]


@app.get("/api/v1/news")
def get_news(limit: int = Query(default=6, ge=1, le=12)) -> dict[str, Any]:
    items = fetch_google_news(limit=limit)
    return {
        "items": items,
        "count": len(items),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok", "service": APP_NAME}
