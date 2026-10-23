import os
import re
import json
import pymupdf

UPLOAD_DIR = os.environ.get("UPLOAD_DIR", "")
OUTPUT_JSON = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "sheetsData.json")

def parse_codeforces():
    pdf_path = os.path.join(UPLOAD_DIR, "media_1792742740572.pdf")
    doc = pymupdf.open(pdf_path)
    phases = []
    current_phase = None
    current_topic = None

    for page in doc:
        lines = [l.strip() for l in page.get_text().split("\n") if l.strip()]
        i = 0
        while i < len(lines):
            line = lines[i]
            m_ph = re.match(r"^Phase\s+(\d+)\s*[—–-]\s*(.*)", line)
            if m_ph:
                current_phase = {
                    "phaseId": int(m_ph.group(1)),
                    "phaseName": f"Phase {m_ph.group(1)} — {m_ph.group(2).strip()}",
                    "topics": []
                }
                phases.append(current_phase)
                current_topic = None
                i += 1
                continue

            m_top = re.match(r"^(\d+)\.\s*(.*?)\s*\(\d+\s+Problems?\)", line)
            if m_top and current_phase is not None:
                current_topic = {
                    "topicId": int(m_top.group(1)),
                    "topicName": m_top.group(2).strip(),
                    "problems": []
                }
                current_phase["topics"].append(current_topic)
                i += 1
                continue

            if re.match(r"^CF\s+[0-9]+[A-Z0-9]*", line):
                cf_id = line
                title = lines[i+1] if i+1 < len(lines) else ""
                rating_line = lines[i+2] if i+2 < len(lines) else ""
                rating = None
                m_r = re.search(r"(\d+)", rating_line)
                if m_r:
                    rating = int(m_r.group(1))

                code = cf_id.replace("CF ", "").strip()
                m_c = re.match(r"(\d+)([A-Z0-9]+)", code)
                if m_c:
                    link = f"https://codeforces.com/problemset/problem/{m_c.group(1)}/{m_c.group(2)}"
                else:
                    link = f"https://codeforces.com/problemset/problem/{code}"

                prob = {
                    "id": cf_id,
                    "title": title,
                    "difficulty": f"★ {rating}" if rating else "★ 800",
                    "rating": rating or 800,
                    "platform": "Codeforces",
                    "url": link
                }
                if current_topic is not None:
                    current_topic["problems"].append(prob)
                i += 3
                continue

            i += 1

    return phases

def parse_geeksforgeeks():
    pdf_path = os.path.join(UPLOAD_DIR, "media_1792742740578.pdf")
    doc = pymupdf.open(pdf_path)
    phases = []
    current_phase = None
    current_topic = None
    prob_idx = 0

    for page in doc:
        lines = [l.strip() for l in page.get_text().split("\n") if l.strip()]
        i = 0
        while i < len(lines):
            line = lines[i]
            m_ph = re.match(r"^Phase\s+(\d+)\s*[—–-]\s*(.*)", line)
            if m_ph:
                current_phase = {
                    "phaseId": int(m_ph.group(1)),
                    "phaseName": f"Phase {m_ph.group(1)} — {m_ph.group(2).strip()}",
                    "topics": []
                }
                phases.append(current_phase)
                current_topic = None
                i += 1
                continue

            m_top = re.match(r"^(\d+)\.\s*(.*?)\s*\(\d+\s+Problems?\)", line)
            if m_top and current_phase is not None:
                current_topic = {
                    "topicId": int(m_top.group(1)),
                    "topicName": m_top.group(2).strip(),
                    "problems": []
                }
                current_phase["topics"].append(current_topic)
                i += 1
                continue

            if line == "GFG" and i + 2 < len(lines) and lines[i+2] in ["Easy", "Medium", "Hard"]:
                prob_idx += 1
                title = lines[i+1]
                diff = lines[i+2]
                slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
                prob = {
                    "id": f"GFG-{prob_idx}",
                    "title": title,
                    "difficulty": diff,
                    "platform": "GeeksforGeeks",
                    "url": f"https://www.geeksforgeeks.org/problems/{slug}/1"
                }
                if current_topic is not None:
                    current_topic["problems"].append(prob)
                i += 3
                continue

            i += 1

    return phases

def parse_and_merge_leetcode():
    # 1. Parse 1160 sheet
    doc_1160 = pymupdf.open(os.path.join(UPLOAD_DIR, "media_1792742740597.pdf"))
    phases_1160 = []
    current_ph = None
    current_top = None
    topic_map = {}
    pids_set = set()
    titles_set = set()

    for page in doc_1160:
        lines = [l.strip() for l in page.get_text().split("\n") if l.strip()]
        i = 0
        while i < len(lines):
            line = lines[i]
            m_ph = re.match(r"^Phase\s+(\d+)\s*[—–-]\s*(.*)", line)
            if m_ph:
                current_ph = {
                    "phaseId": int(m_ph.group(1)),
                    "phaseName": f"Phase {m_ph.group(1)} — {m_ph.group(2).strip()}",
                    "topics": []
                }
                phases_1160.append(current_ph)
                current_top = None
                i += 1
                continue

            m_top = re.match(r"^(\d+)\.\s*(.*?)\s*\(\d+\s+Questions?\)", line)
            if m_top and current_ph is not None:
                tname = m_top.group(2).strip()
                current_top = {
                    "topicId": int(m_top.group(1)),
                    "topicName": tname,
                    "problems": []
                }
                current_ph["topics"].append(current_top)
                norm_key = re.sub(r"[^a-z0-9]", "", tname.lower())
                topic_map[norm_key] = current_top
                i += 1
                continue

            if re.match(r"^#(\d+)$", line) and i + 2 < len(lines) and lines[i+2] in ["EASY", "MEDIUM", "HARD"]:
                pid = re.match(r"^#(\d+)$", line).group(1)
                title = lines[i+1]
                diff = lines[i+2].capitalize()
                clean_title = re.sub(r"\s*\([^)]*\)", "", title).strip()
                slug = re.sub(r"[^a-z0-9]+", "-", clean_title.lower()).strip("-")
                prob = {
                    "id": f"#{pid}",
                    "title": title,
                    "difficulty": diff,
                    "platform": "LeetCode",
                    "url": f"https://leetcode.com/problems/{slug}/"
                }
                if current_top is not None:
                    current_top["problems"].append(prob)
                    pids_set.add(int(pid))
                    titles_set.add(clean_title.lower())
                i += 3
                continue

            i += 1

    # 2. Parse 1000 sheet and add any missing questions into the 1160 topics
    doc_1000 = pymupdf.open(os.path.join(UPLOAD_DIR, "media_1792742740613.pdf"))
    added_from_1000 = 0

    for p in range(4, len(doc_1000)):
        page = doc_1000[p]
        page_links = [l["uri"] for l in page.get_links() if "uri" in l]
        link_idx = 0
        lines = [l.strip() for l in page.get_text().split("\n") if l.strip()]
        curr_top = ""
        i = 0
        while i < len(lines):
            line = lines[i]
            m_top = re.match(r"^(.*?)\s*\(\d+\s+questions?\)", line, re.IGNORECASE)
            if m_top and not line.startswith("Phase") and "Topics" not in line:
                curr_top = m_top.group(1).strip()
                i += 1
                continue

            if re.match(r"^\d+$", line) and i + 2 < len(lines) and lines[i+2] in ["Easy", "Medium", "Hard"]:
                pid = int(line)
                title = lines[i+1]
                diff = lines[i+2]
                link = page_links[link_idx] if link_idx < len(page_links) else ""
                link_idx += 1

                clean_title = re.sub(r"\s*\([^)]*\)", "", title).strip()
                if pid not in pids_set and clean_title.lower() not in titles_set:
                    norm_top = re.sub(r"[^a-z0-9]", "", curr_top.lower())
                    target_topic = topic_map.get(norm_top)
                    if not target_topic:
                        for k, t in topic_map.items():
                            if k in norm_top or norm_top in k:
                                target_topic = t
                                break
                    if not target_topic and phases_1160:
                        target_topic = phases_1160[0]["topics"][0]

                    target_topic["problems"].append({
                        "id": f"#{pid}",
                        "title": title,
                        "difficulty": diff,
                        "platform": "LeetCode",
                        "url": link or f"https://leetcode.com/problems/{re.sub(r'[^a-z0-9]+', '-', clean_title.lower()).strip('-')}/"
                    })
                    pids_set.add(pid)
                    titles_set.add(clean_title.lower())
                    added_from_1000 += 1

                i += 3
                continue

            i += 1

    print(f"LeetCode: 1,160 baseline + {added_from_1000} added from 1,000 sheet = {sum(len(t['problems']) for p in phases_1160 for t in p['topics'])} total problems across {len(phases_1160)} phases.")
    return phases_1160

def build_sheets():
    cf_phases = parse_codeforces()
    gfg_phases = parse_geeksforgeeks()
    lc_merged_phases = parse_and_merge_leetcode()

    lc_total = sum(len(t["problems"]) for p in lc_merged_phases for t in p["topics"])
    cf_total = sum(len(t["problems"]) for p in cf_phases for t in p["topics"])
    gfg_total = sum(len(t["problems"]) for p in gfg_phases for t in p["topics"])

    sheets = [
        {
            "id": "leetcode",
            "name": "LeetCode DSA Mastery Sheet",
            "tagline": f"{lc_total} Curated Problems • 22 Phases • 116 Topics",
            "platform": "leetcode",
            "iconColor": "#FFA116",
            "accentColor": "#F59E0B",
            "description": "Complete curated roadmap covering all 116 sequential DSA topics, with exactly 10 questions baseline per topic plus full coverage of all unique problems.",
            "phases": lc_merged_phases
        },
        {
            "id": "codeforces",
            "name": "Codeforces DSA Mastery Sheet",
            "tagline": f"{cf_total} Curated Problems • Strict Sequential Order",
            "platform": "codeforces",
            "iconColor": "#22C55E",
            "accentColor": "#10B981",
            "description": "Curated Codeforces problems strictly organized from ★ 800 to ★ 2600 difficulty tiers across 22 phases.",
            "phases": cf_phases
        },
        {
            "id": "gfg",
            "name": "GeeksforGeeks DSA Mastery Sheet",
            "tagline": f"{gfg_total} Interview-Ready Problems • 22 Phases",
            "platform": "gfg",
            "iconColor": "#2F8D46",
            "accentColor": "#16A34A",
            "description": "Targeted practice sheet designed specifically for technical coding rounds at top tech companies.",
            "phases": gfg_phases
        }
    ]

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(sheets, f, ensure_ascii=False, indent=2)

    print(f"Generated {OUTPUT_JSON} with EXACTLY {len(sheets)} sheets (No duplicate LeetCode!).")

if __name__ == "__main__":
    build_sheets()
