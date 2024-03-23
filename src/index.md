---
layout: wide-page.njk
title: Home of bookmarklets
description: A collection of bookmarklets. Mostly related to the CMS Sitevision.
bodyClass: page-home
---

<section class="front-hero hero is-light is-halfheight">
  <div class="front-hero__body hero-body py-2">
    <hgroup class="front-hero__column front-hero__column--text is-flex-grow-1 mr-6">
      <h1 class="title is-family-secondary has-text-centered-mobile">A collection of bookmarklets</h1>
      <p class="subtitle mb-3 has-text-centered-mobile">Mostly related to Sitevision</p>
      <p>This site was built to host various bookmarklets and simplify the development of them. Most of the bookmarklets will probably be related to Sitevision, which is the system I primarily work with.</p>
    </hgroup>
    <div class="front-hero__column front-hero__column--graphic is-flex-grow-1">
      <div class="front-hero__graphic">
        <svg class="front-hero__graphic__bookmark icon" aria-hidden="true"><use href="{{ '/assets/img/icons.svg#mdi-bookmark-outline' | url }}"></use></svg>
        <svg class="front-hero__graphic__cog icon" aria-hidden="true"><use href="{{ '/assets/img/icons.svg#mdi-cog' | url }}"></use></svg>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <h2 class="is-size-2 is-family-secondary has-text-white">Bookmarklets</h2>

  <ul class="columns is-multiline my-4">
    {%- for post in collections.bookmarklets -%}
    <li class="column is-one-third">
      <div class="box">
        <h3 class="is-size-4 mb-2"><a href="{{ post.url | url }}">{{ post.data.title }}</a></h3>
        {%- if post.data.description -%}
          <p class="mb-4">{{ post.data.description }}</p>
        {%- endif -%}
        <a class="bookmarklet-button button is-link is-medium is-fullwidth" href="{{ post.data.bookmarkUrl | url }}" aria-label="Bookmark for {{ post.data.title }}">
          <svg class="bookmarklet__icon bookmarklet__icon icon" aria-hidden="true"><use href="{{ '/assets/img/icons.svg#mdi-bookmark' | url }}"></use></svg>
          <svg class="bookmarklet__icon bookmarklet__icon--error icon" aria-hidden="true"><use href="{{ '/assets/img/icons.svg#mdi-block-helper' | url }}"></use></svg>
          <svg class="bookmarklet__icon bookmarklet__icon--success icon" aria-hidden="true"><use href="{{ '/assets/img/icons.svg#mdi-check-bold' | url }}"></use></svg>
          <span>{{ post.data.title }}</span>
        </a>
      </div>
    </li>
    {%- endfor -%}
  </ul>
</section>
