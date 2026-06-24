# Content Templates

Use the shared timeline template for dated profile items such as awards, recognitions, selected service, supervision highlights, or similar lists.

## Awards And Recognitions

Edit `_data/awards.yml`. Add new items under `honours` or `recognitions`:

```yml
- icon: "🏅"
  year: "2026"
  title: "Recognition Title"
  detail: "One concise sentence explaining why it matters"
  source: "Institution, Location"
```

The awards page renders these entries through:

```liquid
{% include timeline-list.html items=site.data.awards.honours %}
{% include timeline-list.html items=site.data.awards.recognitions %}
```

## Reusing The Timeline Template

For another page, create a data file with the same fields, then render it with:

```liquid
{% include timeline-list.html items=site.data.your_file.your_section %}
```

The shared styling lives in `_sass/layout/_page.scss` under `timeline-card`.
