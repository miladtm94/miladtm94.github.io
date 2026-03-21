#!/usr/bin/env python3
"""
bib_to_md.py — Convert IEEE-style BibTeX files to Jekyll _publications/ markdown.

Drops .bib files into files/bibtex/ then run:
    python3 scripts/bib_to_md.py                    # process all files/bibtex/*.bib
    python3 scripts/bib_to_md.py path/to/file.bib   # process a specific file

Rules:
  - @article              → _publications/  category: manuscripts
  - @inproceedings        → _publications/  category: conferences
  - @phdthesis / @mastersthesis → _publications/  category: theses
  - @misc / @unpublished  → _publications/  category: submitted
  - Skips entries whose title or DOI already exist in _publications/
  - Fields unavailable in the .bib are left as empty strings with # TODO comments
"""

import os, re, sys
from pathlib import Path

try:
    import bibtexparser
    from bibtexparser.bparser import BibTexParser
    from bibtexparser.customization import convert_to_unicode
except ImportError:
    print("bibtexparser not found. Run 'make venv' from the repo root to set up the environment.")
    sys.exit(1)

# ── paths ─────────────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).resolve().parent.parent
BIB_DIR   = REPO_ROOT / "files" / "bibtex"
PUB_DIR   = REPO_ROOT / "_publications"

# ── constants ─────────────────────────────────────────────────────────────────
MAIN_AUTHOR = "Mamaghani"   # bolded in citations

MONTH_NUM = {
    "jan":"01","feb":"02","mar":"03","apr":"04","may":"05","jun":"06",
    "jul":"07","aug":"08","sep":"09","oct":"10","nov":"11","dec":"12",
    "january":"01","february":"02","march":"03","april":"04","june":"06",
    "july":"07","august":"08","september":"09","october":"10",
    "november":"11","december":"12",
    **{str(i): str(i).zfill(2) for i in range(1, 13)},
}

MONTH_ABBR = {
    "01":"Jan.","02":"Feb.","03":"Mar.","04":"Apr.","05":"May","06":"Jun.",
    "07":"Jul.","08":"Aug.","09":"Sep.","10":"Oct.","11":"Nov.","12":"Dec.",
}

TYPE_TO_CATEGORY = {
    "article":       "manuscripts",
    "inproceedings": "conferences",
    "conference":    "conferences",
    "proceedings":   "conferences",
    "misc":          "submitted",
    "unpublished":   "submitted",
    "techreport":    "manuscripts",
}

# ── helpers ───────────────────────────────────────────────────────────────────

def clean(val):
    """Strip LaTeX braces and common escape sequences."""
    if not val:
        return ""
    val = re.sub(r"[{}]", "", val)
    val = re.sub(r"\\&", "&", val)
    val = re.sub(r"\\%", "%", val)
    val = re.sub(r"--", "–", val)
    val = re.sub(r"\\textit\{([^}]*)\}", r"\1", val)
    val = re.sub(r"\\emph\{([^}]*)\}", r"\1", val)
    val = re.sub(r"\\textbf\{([^}]*)\}", r"\1", val)
    return val.strip()


def slugify(title):
    s = re.sub(r"[^a-z0-9]+", "-", title.lower())
    s = re.sub(r"-+", "-", s).strip("-")
    return s[:55].rstrip("-")


def normalize(title):
    """For duplicate detection: lowercase, alphanumeric only."""
    t = re.sub(r"[^a-z0-9 ]", "", clean(title).lower())
    return re.sub(r"\s+", " ", t).strip()


def make_date(entry):
    year  = clean(entry.get("year", "2000"))
    month = clean(entry.get("month", "")).lower().strip()
    mm    = MONTH_NUM.get(month, MONTH_NUM.get(month[:3], "01")) if month else "01"
    return f"{year}-{mm}-01", mm


def parse_authors(raw):
    """Return list of (first_names, last_name) tuples."""
    raw = re.sub(r"\s+", " ", raw.replace("\n", " "))
    raw = re.sub(r"[{}]", "", raw).strip()
    parts = re.split(r"\s+and\s+", raw, flags=re.IGNORECASE)
    result = []
    for p in parts:
        p = p.strip()
        if "," in p:
            last, first = p.split(",", 1)
            result.append((first.strip(), last.strip()))
        else:
            tokens = p.split()
            if len(tokens) == 1:
                result.append(("", tokens[0]))
            else:
                result.append((" ".join(tokens[:-1]), tokens[-1]))
    return result


def abbrev_first(first):
    return " ".join(f[0] + "." for f in first.split() if f)


def format_authors_ieee(author_raw):
    """Format authors in IEEE style, bolding the main author."""
    if not author_raw:
        return "TODO: authors"
    formatted = []
    for first, last in parse_authors(author_raw):
        abbr = abbrev_first(first) if first else ""
        name = f"{abbr} {last}".strip() if abbr else last
        if MAIN_AUTHOR.lower() in last.lower():
            name = f"<strong>{name}</strong>"
        formatted.append(name)
    if len(formatted) == 1:
        return formatted[0]
    return ", ".join(formatted[:-1]) + ", and " + formatted[-1]


def detect_urls(entry):
    """Return (doiurl, paperurl, arxivurl) from doi/url/eprint fields."""
    doi_url   = ""
    paperurl  = ""
    arxivurl  = ""

    doi = clean(entry.get("doi", ""))
    if doi:
        doi_url = doi if doi.startswith("http") else f"https://doi.org/{doi}"

    eprint = clean(entry.get("eprint", ""))
    archive = clean(entry.get("archiveprefix", "")).lower()
    if eprint and "arxiv" in archive:
        arxivurl = f"https://arxiv.org/abs/{eprint}"

    url = clean(entry.get("url", ""))
    if url:
        if "arxiv.org" in url:
            arxivurl = arxivurl or url
        else:
            paperurl = url

    return doi_url, paperurl, arxivurl


def make_venue(entry, btype):
    if btype in ("article", "techreport"):
        return clean(entry.get("journal", ""))
    if btype in ("inproceedings", "conference", "proceedings"):
        bt   = clean(entry.get("booktitle", ""))
        addr = clean(entry.get("address", ""))
        return f"{bt}, {addr}" if addr and addr not in bt else bt
    return clean(entry.get("journal", entry.get("booktitle", entry.get("howpublished", ""))))


def make_citation(entry, btype):
    authors = format_authors_ieee(entry.get("author", ""))
    title   = clean(entry.get("title", ""))
    year    = clean(entry.get("year", ""))
    _, mm   = make_date(entry)
    mon     = MONTH_ABBR.get(mm, "")

    if btype == "article":
        journal = clean(entry.get("journal", ""))
        vol     = clean(entry.get("volume", ""))
        num     = clean(entry.get("number", ""))
        pages   = clean(entry.get("pages", ""))
        detail  = ", ".join(filter(None, [
            f"vol. {vol}" if vol else "",
            f"no. {num}"  if num else "",
            f"pp. {pages}" if pages else "",
            f"{mon} {year}".strip() if year else "",
        ]))
        return f'{authors}, "{title}," <em>{journal}</em>, {detail}.'

    if btype in ("inproceedings", "conference", "proceedings"):
        bt    = clean(entry.get("booktitle", ""))
        addr  = clean(entry.get("address", ""))
        pages = clean(entry.get("pages", ""))
        loc   = f", {addr}" if addr else ""
        pp    = f", pp. {pages}" if pages else ""
        yr    = f", {mon} {year}".strip() if year else ""
        return f'{authors}, "{title}," in <em>Proc. {bt}</em>{loc}{pp}{yr}.'

    return f'{authors}, "{title}," {year}.'


def entry_to_md(entry):
    btype    = entry.get("ENTRYTYPE", "misc").lower()
    title    = clean(entry.get("title", "Untitled"))
    category = TYPE_TO_CATEGORY.get(btype, "manuscripts")
    date_str, _ = make_date(entry)
    venue    = make_venue(entry, btype)
    doi_url, paperurl, arxivurl = detect_urls(entry)
    citation = make_citation(entry, btype)
    slug     = slugify(title)
    filename = f"{date_str}-{slug}.md"

    # Abstract → body
    abstract = clean(entry.get("abstract", ""))
    excerpt  = (abstract[:197] + "…") if len(abstract) > 200 else abstract

    lines = [
        "---",
        f'title: "{title}"',
        f"collection: publications",
        f"category: {category}",
        f"permalink: /publication/{slug}",
        f'excerpt: "{excerpt}"',
        f"date: {date_str}",
        f'venue: "{venue}"',
        f'doiurl: "{doi_url}"',
        f'paperurl: "{paperurl}"  # TODO: replace with direct PDF link if available',
        f'arxivurl: "{arxivurl}"',
        f'codeurl: ""  # TODO: add code repository URL if available',
        f"citation: '{citation}'",
        "---",
    ]
    if abstract:
        lines += ["", abstract]

    return "\n".join(lines), filename


# ── duplicate detection ───────────────────────────────────────────────────────

def load_existing(pub_dir):
    titles, dois = set(), set()
    for md in Path(pub_dir).glob("*.md"):
        text = md.read_text(encoding="utf-8")
        m = re.search(r'^title:\s*["\']?(.+?)["\']?\s*$', text, re.MULTILINE)
        if m:
            titles.add(normalize(m.group(1)))
        m = re.search(r'^doiurl:\s*["\'](.+?)["\']', text, re.MULTILINE)
        if m and m.group(1).strip():
            dois.add(m.group(1).strip().lower().rstrip("/"))
    return titles, dois


def is_duplicate(entry, titles, dois):
    if normalize(clean(entry.get("title", ""))) in titles:
        return True
    doi_url, _, _ = detect_urls(entry)
    if doi_url and doi_url.lower().rstrip("/") in dois:
        return True
    return False


# ── main ──────────────────────────────────────────────────────────────────────

def main():
    bib_files = [Path(a) for a in sys.argv[1:]] if len(sys.argv) > 1 \
                else sorted(BIB_DIR.glob("*.bib"))

    if not bib_files:
        print(f"No .bib files found in {BIB_DIR}")
        print("Drop your .bib files there and re-run.")
        sys.exit(0)

    existing_titles, existing_dois = load_existing(PUB_DIR)
    print(f"Found {len(existing_titles)} existing publications (duplicate check active).\n")

    created, skipped = [], []

    parser = BibTexParser(common_strings=True)
    parser.customization = convert_to_unicode

    for bib_path in bib_files:
        print(f"── {bib_path.name}")
        with open(bib_path, encoding="utf-8", errors="replace") as f:
            db = bibtexparser.load(f, parser=parser)

        for entry in db.entries:
            title = clean(entry.get("title", entry.get("ID", "?")))

            if is_duplicate(entry, existing_titles, existing_dois):
                skipped.append(title)
                print(f"  SKIP  (duplicate)  {title[:70]}")
                continue

            content, filename = entry_to_md(entry)
            out_path = PUB_DIR / filename
            out_path.write_text(content, encoding="utf-8")

            # Register in seen sets to catch intra-run duplicates
            existing_titles.add(normalize(title))
            doi_url, _, _ = detect_urls(entry)
            if doi_url:
                existing_dois.add(doi_url.lower().rstrip("/"))

            created.append((filename, title))
            print(f"  ✓     {filename}")
            print(f"        {title[:70]}")

    print(f"\n{'─'*55}")
    print(f"Created : {len(created)}")
    print(f"Skipped : {len(skipped)} duplicate(s)")
    print(f"{'─'*55}")
    if created:
        print("\nReview generated files and fill in any # TODO fields:")
        for fname, _ in created:
            print(f"  _publications/{fname}")


if __name__ == "__main__":
    main()
