"""
Send a Mailchimp newsletter campaign for newly published blog posts.

Reads new post files from the NEW_POSTS env var (newline-separated paths),
parses front matter and extracts a preview, fills the email template,
and creates + sends a Mailchimp campaign.

Required env vars:
  MAILCHIMP_API_KEY   - Mailchimp API key (ends with -usN datacenter)
  MAILCHIMP_LIST_ID   - Mailchimp audience/list ID
  MAILCHIMP_FROM_EMAIL - Verified sender email address
  NEW_POSTS           - Newline-separated list of new post file paths
"""

import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime


def parse_front_matter(content):
    """Parse YAML front matter and return (metadata_dict, body_text)."""
    parts = content.split("---", 2)
    if len(parts) < 3:
        raise ValueError("Invalid front matter")

    fm = parts[1]
    body = parts[2].strip()

    def extract(pattern):
        m = re.search(pattern, fm)
        return m.group(1).strip() if m else ""

    return {
        "title": extract(r'title:\s*"(.+)"'),
        "date": extract(r"date:\s*(.+)"),
        "author": extract(r"-\s*name:\s*(.+)"),
        "permalink": extract(r'permalink:\s*"(.+)"'),
        "description": extract(r'description:\s*"(.+)"'),
    }, body


def extract_paragraphs(body, count=2):
    """Extract the first N plain-text paragraphs (skips blockquotes/divs)."""
    blocks = re.split(r"\n\s*\n", body)
    paragraphs = []
    for block in blocks:
        block = block.strip()
        if not block:
            continue
        if block.startswith("<blockquote") or block.startswith("<div"):
            continue
        paragraphs.append(block)
        if len(paragraphs) >= count:
            break
    return paragraphs


def format_body_html(paragraphs):
    """Wrap paragraphs in <p> tags with inline styles, fix links for email."""
    parts = []
    for p in paragraphs:
        # Convert relative URLs to absolute
        p = re.sub(r'href="/', 'href="https://markets.inc/', p)
        # Strip class attributes (not useful in email)
        p = re.sub(r'\s+class="[^"]*"', "", p)
        parts.append(f'<p style="margin: 0 0 24px 0;">\n{p}\n</p>')
    return "\n".join(parts)


def format_date(date_str):
    """Format '2026-03-10 01:00:00 +0000' to 'March 10, 2026'."""
    date_str = re.sub(r"\s*[+-]\d{4}\s*$", "", date_str).strip()
    dt = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
    return dt.strftime("%B %-d, %Y")


def mailchimp_request(endpoint, method="GET", data=None):
    """Make an authenticated Mailchimp API request."""
    api_key = os.environ["MAILCHIMP_API_KEY"]
    dc = api_key.rsplit("-", 1)[-1]
    url = f"https://{dc}.api.mailchimp.com/3.0{endpoint}"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as resp:
            resp_body = resp.read().decode()
            return json.loads(resp_body) if resp_body else {}
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"Mailchimp API error ({e.code}): {error_body}", file=sys.stderr)
        raise


def send_newsletter(post_file):
    """Parse a post file, build the email, create and send a Mailchimp campaign."""
    list_id = os.environ["MAILCHIMP_LIST_ID"]
    from_email = os.environ["MAILCHIMP_FROM_EMAIL"]

    with open(post_file) as f:
        content = f.read()

    meta, body = parse_front_matter(content)

    title = meta["title"]
    date = format_date(meta["date"])
    author = meta["author"]
    url = f"https://markets.inc{meta['permalink']}"
    description = meta["description"]
    year = str(datetime.now().year)

    paragraphs = extract_paragraphs(body, 2)
    body_html = format_body_html(paragraphs)

    # Build email HTML from template
    with open("_email/template.html") as f:
        html = f.read()

    html = html.replace("{{PREVIEW_TEXT}}", description)
    html = html.replace("{{DATE}}", date)
    html = html.replace("{{TITLE}}", title)
    html = html.replace("{{AUTHOR}}", author)
    html = html.replace("{{BODY}}", body_html)
    html = html.replace("{{URL}}", url)
    html = html.replace("{{YEAR}}", year)

    # Create campaign
    campaign = mailchimp_request("/campaigns", "POST", {
        "type": "regular",
        "recipients": {"list_id": list_id},
        "settings": {
            "subject_line": title,
            "preview_text": description,
            "title": f"Insights: {title}",
            "from_name": "Markets, Inc.",
            "reply_to": from_email,
        },
    })

    campaign_id = campaign["id"]
    print(f"Created campaign {campaign_id}: {title}")

    # Set email content
    mailchimp_request(f"/campaigns/{campaign_id}/content", "PUT", {
        "html": html,
    })
    print("Campaign content set")

    # Send
    mailchimp_request(f"/campaigns/{campaign_id}/actions/send", "POST")
    print(f"Newsletter sent: {title}")


def main():
    posts = os.environ.get("NEW_POSTS", "").strip()
    if not posts:
        print("No posts to send")
        return

    for post_file in posts.split("\n"):
        post_file = post_file.strip()
        if post_file:
            send_newsletter(post_file)


if __name__ == "__main__":
    main()
