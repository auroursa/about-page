(function () {
  var thread = document.getElementById('disqus_thread');

  if (!(thread instanceof HTMLElement)) {
    return;
  }

  var pageUrl = thread.dataset.pageUrl;
  var pageIdentifier = thread.dataset.pageIdentifier;

  if (!pageUrl || !pageIdentifier) {
    return;
  }

  var loadDisqus = function () {
    window.disqus_config = function () {
      this.page.url = pageUrl;
      this.page.identifier = pageIdentifier;
    };

    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.url = pageUrl;
          this.page.identifier = pageIdentifier;
        },
      });
      return;
    }

    var existingScript = document.querySelector('script[data-disqus-script="true"]');
    if (existingScript) {
      existingScript.remove();
    }

    thread.replaceChildren();

    var disqusScript = document.createElement('script');
    disqusScript.src = 'https://cynosura-one.disqus.com/embed.js';
    disqusScript.async = true;
    disqusScript.setAttribute('data-timestamp', String(Date.now()));
    disqusScript.setAttribute('data-disqus-script', 'true');
    disqusScript.setAttribute('data-cfasync', 'false');
    document.head.appendChild(disqusScript);
  };

  // Lazy-load: only fetch Disqus when the comment section scrolls into view
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        loadDisqus();
      }
    }, { rootMargin: '200px' });

    observer.observe(thread);
  } else {
    loadDisqus();
  }
})();
