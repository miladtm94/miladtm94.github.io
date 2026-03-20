---
layout: archive
title: "Projects"
permalink: /portfolio/
author_profile: true
---

{% include base_path %}

A selection of projects spanning my research and software work. For open-source code, see my [GitHub profile](https://github.com/miladtm94).

## Research Projects

{% assign research_projects = site.portfolio | where: "category", "research" | sort: "date" %}
{% for post in research_projects reversed %}
  {% include archive-single.html %}
{% endfor %}

## Software & Side Projects

{% assign software_projects = site.portfolio | where: "category", "software" | sort: "date" %}
{% for post in software_projects reversed %}
  {% include archive-single.html %}
{% endfor %}
