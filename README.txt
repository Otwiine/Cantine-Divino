Divino CSS system

Files:
- tokens.css: design tokens / :root variables
- base.css: reset, typography, layout helpers, reveal and toast
- components.css: buttons, nav, mobile overlay, WhatsApp bubble
- sections.css: hero through footer sections
- responsive.css: responsive rules and mobile token overrides
- style.css: entry file that imports everything

Use in HTML:
<link rel="stylesheet" href="css/style.css">

For the mobile overlay CTA, use:
<a href="#reserve" class="mobile-overlay-cta">Reserve a Table</a>

Do not keep the old broad rule `.mobile-overlay a { ... }` in another file.
