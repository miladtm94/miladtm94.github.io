---
layout: archive
title: "Projects"
permalink: /portfolio/
author_profile: true
---

<nav id="portfolio-quicknav" class="sticky-quicknav" style="background:var(--global-bg-color); border:none; border-bottom:1px solid rgba(42,122,226,0.15); border-radius:0; box-shadow:none; padding:0.45em 0; margin-bottom:2em;">
  <div style="display:flex; flex-wrap:wrap; align-items:center; gap:0.4em 0.6em;">
    <a href="#research-projects" style="text-decoration:none; font-size:0.85em; padding:0.25em 0.65em; border-radius:4px; border:1px solid rgba(42,122,226,0.3); color:#2a7ae2; white-space:nowrap; background:var(--global-bg-color);">🔬&nbsp;Research Projects</a>
    <a href="#github-repos" style="text-decoration:none; font-size:0.85em; padding:0.25em 0.65em; border-radius:4px; border:1px solid rgba(42,122,226,0.3); color:#2a7ae2; white-space:nowrap; background:var(--global-bg-color);">🐙&nbsp;GitHub Repositories</a>
  </div>
</nav>

# Research Projects
{: id="research-projects" style="scroll-margin-top:3.5em;" }

{% assign research_projects = site.portfolio | where: "category", "research" | sort: "date" %}
{% for post in research_projects reversed %}
  {% include archive-single.html %}
{% endfor %}

---

# Selected GitHub Repositories
{: id="github-repos" style="scroll-margin-top:3.5em;" }

<div id="gh-repo-loading" style="font-size:0.9em; opacity:0.6; padding:1em 0;">
  <i class="fas fa-circle-notch fa-spin"></i>&nbsp; Loading repositories&hellip;
</div>

<div id="gh-repo-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(290px, 1fr)); gap:1em;"></div>

<script>
(function () {
  var USER = 'miladtm94';

  /* ── Add or remove repo names here to control what is shown. ──
     Order in this list = order of the cards displayed.           */
  var SHOW = [
    'SecureISAC-UAV-DRL',
    'FBL-FadingChannels-AIL',
    'UIRS-THz-CovertComm',
    'SPC-UAV-Relay',
    'FaceRecognition-FaceNet',
    'Investment-Portfolio-Tracker',
    'AI-Trading-Engine',
    'Job-Seeking-Mate'
  ];

  var grid    = document.getElementById('gh-repo-grid');
  var loading = document.getElementById('gh-repo-loading');

  var langColors = {
    'Python': '#3572a5', 'JavaScript': '#f1e05a', 'TypeScript': '#2b7489',
    'MATLAB': '#e16737', 'C++': '#f34b7d', 'C': '#555555',
    'Java': '#b07219', 'HTML': '#e34c26', 'CSS': '#563d7c',
    'Go': '#00add8', 'Rust': '#dea584', 'Julia': '#a270ba',
    'R': '#198ce7', 'Shell': '#89e051', 'Jupyter Notebook': '#da5b0b'
  };

  function timeAgo(iso) {
    var diff = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (diff < 1)   return 'today';
    if (diff < 7)   return diff + 'd ago';
    if (diff < 30)  return Math.floor(diff / 7)  + 'w ago';
    if (diff < 365) return Math.floor(diff / 30) + 'mo ago';
    return Math.floor(diff / 365) + 'y ago';
  }

  function buildCard(repo) {
    var lc  = langColors[repo.language] || '#959da5';
    var div = document.createElement('div');
    div.style.cssText = [
      'border:1px solid var(--global-border-color)', 'border-radius:8px',
      'padding:1em 1.2em', 'display:flex', 'flex-direction:column',
      'gap:0.55em', 'background: var(--global-bg-color)', 'transition:box-shadow 0.15s'
    ].join(';');
    div.onmouseenter = function () { div.style.boxShadow = '0 4px 14px rgba(0,0,0,0.1)'; };
    div.onmouseleave = function () { div.style.boxShadow = ''; };

    div.innerHTML =
      '<div style="display:flex; justify-content:space-between; align-items:center; gap:0.5em;">' +
        '<a href="' + repo.html_url + '" target="_blank" rel="noopener"' +
          ' style="font-weight:700; font-size:0.93em; text-decoration:none; color: var(--global-link-color); word-break:break-word;">' +
          '<i class="fab fa-github" style="color: var(--global-text-color); margin-right:0.4em;"></i>' + repo.name +
        '</a>' +
        (repo.archived ? '<span style="font-size:0.7em; border:1px solid var(--global-border-color); color: var(--global-text-color); padding:0.1em 0.45em; border-radius:12px;">archived</span>' : '') +
      '</div>' +
      (repo.description ? '<p style="margin:0; font-size:0.84em; opacity:0.75; line-height:1.55;">' + repo.description.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</p>' : '') +
      '<div style="display:flex; flex-wrap:wrap; gap:0.8em; font-size:0.8em; opacity:0.68; margin-top:auto;">' +
        (repo.language ? '<span><i class="fas fa-circle" style="color:' + lc + '; font-size:0.65em; vertical-align:middle; margin-right:0.3em;"></i>' + repo.language + '</span>' : '') +
        '<span>&#9733; ' + repo.stargazers_count + '</span>' +
        '<span>Updated ' + timeAgo(repo.updated_at) + '</span>' +
      '</div>';

    return div;
  }

  fetch('https://api.github.com/users/' + USER + '/repos?per_page=100&type=public')
    .then(function (r) { return r.json(); })
    .then(function (repos) {
      loading.style.display = 'none';
      if (!Array.isArray(repos)) {
        grid.innerHTML = '<p style="opacity:0.6; font-size:0.9em;">Could not load repositories (API rate limit may apply).</p>';
        return;
      }
      /* Keep only the listed repos, in the order specified in SHOW */
      var show = SHOW.map(function (name) {
        return repos.find(function (r) { return r.name === name; });
      }).filter(Boolean);

      if (show.length === 0) {
        grid.innerHTML = '<p style="opacity:0.6; font-size:0.9em;">No matching repositories found.</p>';
        return;
      }
      show.forEach(function (repo) { grid.appendChild(buildCard(repo)); });
    })
    .catch(function () {
      loading.innerHTML = '<p style="opacity:0.6; font-size:0.9em;">Could not load repositories.</p>';
    });
})();
</script>

{% include sticky-nav.html %}
