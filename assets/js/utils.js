const t=t=>"A"===t?.nodeName&&t.href.startsWith("javascript"),a=a=>t(a)?a:a.closest('a[href^="javascript"]');export{a as getBookmarkElement,t as isBookmarkElement};
