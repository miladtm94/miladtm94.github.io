---
layout: single
title: "Contact"
permalink: /contact/
author_profile: true
---

I welcome inquiries related to research collaborations, academic positions, project proposals, or general questions. Please fill out the form below or email me directly at [milad.tatarmamaghani@gmail.com](mailto:milad.tatarmamaghani@gmail.com).

<form action="https://formspree.io/f/mdawjpdk" method="POST" style="margin-top:1.5em;">

  <div style="display:flex; flex-wrap:wrap; gap:1em; margin-bottom:1em;">
    <div style="flex:1; min-width:200px;">
      <label for="name" style="display:block; font-size:0.88em; font-weight:600; margin-bottom:0.3em;">Full Name <span style="color:#c0392b;">*</span></label>
      <input type="text" id="name" name="name" required placeholder="Your name"
        style="width:100%; padding:0.55em 0.75em; border:1px solid rgba(128,128,128,0.35); border-radius:4px; font-size:0.95em; background:transparent; color:inherit; box-sizing:border-box;">
    </div>
    <div style="flex:1; min-width:200px;">
      <label for="email" style="display:block; font-size:0.88em; font-weight:600; margin-bottom:0.3em;">Email Address <span style="color:#c0392b;">*</span></label>
      <input type="email" id="email" name="email" required placeholder="your@email.com"
        style="width:100%; padding:0.55em 0.75em; border:1px solid rgba(128,128,128,0.35); border-radius:4px; font-size:0.95em; background:transparent; color:inherit; box-sizing:border-box;">
    </div>
  </div>

  <div style="margin-bottom:1em;">
    <label for="subject" style="display:block; font-size:0.88em; font-weight:600; margin-bottom:0.3em;">Subject <span style="color:#c0392b;">*</span></label>
    <select id="subject" name="subject" required
      style="width:100%; padding:0.55em 0.75em; border:1px solid rgba(128,128,128,0.35); border-radius:4px; font-size:0.95em; background:transparent; color:inherit; box-sizing:border-box;">
      <option value="" disabled selected>Select a topic…</option>
      <option value="Research Collaboration">Research Collaboration</option>
      <option value="Academic Position">Academic Position / Opportunity</option>
      <option value="Project Inquiry">Project Inquiry</option>
      <option value="Student Supervision">Student Supervision</option>
      <option value="Speaking / Seminar">Speaking / Seminar Invitation</option>
      <option value="General Inquiry">General Inquiry</option>
    </select>
  </div>

  <div style="margin-bottom:1.2em;">
    <label for="message" style="display:block; font-size:0.88em; font-weight:600; margin-bottom:0.3em;">Message <span style="color:#c0392b;">*</span></label>
    <textarea id="message" name="message" required rows="6" placeholder="Your message…"
      style="width:100%; padding:0.55em 0.75em; border:1px solid rgba(128,128,128,0.35); border-radius:4px; font-size:0.95em; background:transparent; color:inherit; resize:vertical; box-sizing:border-box;"></textarea>
  </div>

  <!-- Honeypot spam filter -->
  <input type="text" name="_gotcha" style="display:none;">

  <button type="submit" class="btn btn--primary">
    <i class="fas fa-paper-plane"></i>&nbsp; Send Message
  </button>

</form>
