---
layout: archive
title: "Projects"
permalink: /portfolio/
author_profile: true
---

# Projects

<nav id="portfolio-quicknav" class="sticky-quicknav" style="background:var(--global-bg-color); border:none; border-bottom:1px solid rgba(42,122,226,0.15); border-radius:0; box-shadow:none; padding:0.45em 0; margin-bottom:2em;">
  <div style="display:flex; flex-wrap:wrap; align-items:center; gap:0.4em 0.6em;">
    <a href="#research-code" style="text-decoration:none; font-size:0.85em; padding:0.25em 0.65em; border-radius:4px; border:1px solid rgba(42,122,226,0.3); color:#2a7ae2; white-space:nowrap; background:var(--global-bg-color);">🔬&nbsp;Code</a>
    <a href="#software-repos" style="text-decoration:none; font-size:0.85em; padding:0.25em 0.65em; border-radius:4px; border:1px solid rgba(42,122,226,0.3); color:#2a7ae2; white-space:nowrap; background:var(--global-bg-color);">💻&nbsp;Software</a>
  </div>
</nav>


## Research Code
{: id="research-code" style="scroll-margin-top:3.5em;" }

<p style="font-size:0.9em; opacity:0.75; margin-top:-0.5em; margin-bottom:1.2em;">Code implementations and simulation frameworks for my research papers.</p>

<div class="project-grid">
{% assign research_code = site.data.projects | where: "category", "research" %}
{% for project in research_code %}{% include project-card.html project=project %}{% endfor %}
</div>

---

## Software Projects
{: id="software-repos" style="scroll-margin-top:3.5em;" }

<p style="font-size:0.9em; opacity:0.75; margin-top:-0.5em; margin-bottom:1.2em;">Repositories spanning fintech, AI tooling, and consumer apps.</p>

<div class="project-grid">
{% assign software_projects = site.data.projects | where: "category", "software" %}
{% for project in software_projects %}{% include project-card.html project=project %}{% endfor %}
</div>

{% include sticky-nav.html %}
