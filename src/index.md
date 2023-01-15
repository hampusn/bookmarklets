---
layout: wide-page.njk
title: Home of bookmarklets
bodyClass: page-home
---

<section class="front-hero hero is-light is-halfheight">
  <div class="front-hero__body hero-body">
    <hgroup class="front-hero__column front-hero__column--text is-flex-grow-1 mr-6">
      <h1 class="title is-family-secondary">A collection of bookmarklets</h1>
      <p class="subtitle mb-3">Mostly related to Sitevision</p>
      <p>This site was built to host various bookmarklets and simplify the development of them. Most of the bookmarklets will probably be related to Sitevision, which is the system I primarily work with.</p>
    </hgroup>
    <div class="front-hero__column front-hero__column--graphic is-flex-grow-1">
      <div class="front-hero__graphic">
        <span aria-hidden="true" class="front-hero__graphic__bookmark icon"><span class="mdi mdi-bookmark-outline"></span></span>
        <span aria-hidden="true" class="front-hero__graphic__cog icon"><span class="mdi mdi-cog"></span></span>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <h2 class="is-size-2 is-family-secondary has-text-white">Bookmarklets</h2>

  <div class="">
    <ul class="columns is-multiline my-4">
      {%- for post in collections.bookmarklets -%}
      <li class="column is-one-third">
        <div class="box">
          <h3 class="is-size-4 mb-2"><a href="{{ post.url | url }}">{{ post.data.title }}</a></h3>
          {%- if post.data.description -%}
            <p class="mb-4">{{ post.data.description }}</p>
          {%- endif -%}
          <a class="button is-link is-medium is-fullwidth" href="{{ post.data.bookmarkUrl | url }}" aria-label="Bookmark for {{ post.data.title }}">
            <span class="icon">
              <span class="mdi mdi-bookmark" aria-hidden="true"></span>
            </span>
            <span>{{ post.data.title }}</span>
          </a>
        </div>
      </li>
      {%- endfor -%}
    </ul>
  </div>
</section>
