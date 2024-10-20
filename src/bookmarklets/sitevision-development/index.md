---
layout: bookmarklet.njk
title: Sitevision development
description: Easy toggling of Profiling, JSDebug and Version.
date: 2024-10-20
---

This bookmarklet toggles three handy Sitevision functionalities:

* **Profiling**: Displays a table with render times for all portlets and modules on the page, allowing you to evaluate performance.
* **JSDebug**: Disables asset minification and bundling, revealing the original filenames for stylesheets (CSS) and client scripts (JavaScript), useful for pinpointing source files.
* **Version**: Switches the view to the offline version of the page, showing the draft in the CMS without the editor interface. Ideal for previewing unpublished content.

_The Version switch is only shown when you are logged in since the offline version requires you to be authenticated._

<div class="overlap-images">
  <img src="/sitevision-development/sitevision-development-1.png" alt="Screenshot with the bookmarklet's modal in view." />
  <img src="/sitevision-development/sitevision-development-2.png" alt="Screenshot with profiling activated." />
</div>
