import t from"./node_modules/canvas-confetti/dist/confetti.module.js";import{getBookmarkElement as e,isBookmarkElement as s}from"./utils.js";const o=t.shapeFromPath({path:"M17.016 3q0.797 0 1.383 0.609t0.586 1.406v15.984l-6.984-3-6.984 3v-15.984q0-0.797 0.586-1.406t1.383-0.609h10.031z"}),a=["#001427","#708D81","#F4D58D","#BF0603","#8D0801","#FCFAF9","#364156","#CDCDCD"],d="bookmarklet-drag",r="bookmarklet-drag--active",n="bookmarklet-button--draging",i="bookmarklet-button--error",c="bookmarklet-button--success";window.addEventListener("click",(t=>{const{target:s}=t,o=e(s);o&&(o.classList.remove(i),o.offsetWidth,o.classList.add(i),t.preventDefault())})),window.addEventListener("animationend",(t=>{const{target:e}=t;s(e)&&e.classList.remove(i,c)})),window.addEventListener("dragstart",(t=>{const{target:e}=t;s(e)&&(e.classList.add(n),document.getElementById(d).classList.add(r))})),window.addEventListener("dragend",(e=>{const{target:i,dataTransfer:l}=e;"copy"===l.dropEffect&&(i.classList.add(c),t({shapes:[o],disableForReducedMotion:!0,particleCount:150,spread:120,colors:a})),s(i)&&(i.classList.remove(n),document.getElementById(d).classList.remove(r))}));
