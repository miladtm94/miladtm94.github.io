---
layout: archive
title: "Research Projects"
permalink: /portfolio/
author_profile: true
---

{% include base_path %}

A selection of projects spanning my PhD and beyond work. For open-source code, see my [GitHub profile](https://github.com/miladtm94).

{% for post in site.portfolio reversed %}
  {% include archive-single.html %}
{% endfor %}
