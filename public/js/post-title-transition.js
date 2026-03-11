const POST_TITLE_NAME = 'post-title';

function isPrimaryClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function isPostDetailPathname(pathname) {
  return pathname.startsWith('/posts/') && pathname !== '/posts/' && !pathname.startsWith('/posts/category/');
}

function getPostSlugFromHref(href) {
  try {
    const url = new URL(href, window.location.origin);

    if (url.origin !== window.location.origin) {
      return null;
    }

    const normalizedPath = url.pathname.length > 1 && url.pathname.endsWith('/')
      ? url.pathname.slice(0, -1)
      : url.pathname;

    if (!isPostDetailPathname(normalizedPath)) {
      return null;
    }

    return decodeURIComponent(normalizedPath.slice('/posts/'.length));
  } catch {
    return null;
  }
}

function clearListTitleTransitionNames() {
  document.querySelectorAll('[data-post-list-title]').forEach((title) => {
    title.style.viewTransitionName = 'none';
  });
}

function assignClickedTitleTransition(link, slug) {
  const title = link.querySelector('[data-post-list-title]') ?? link.closest('article')?.querySelector('[data-post-list-title]');

  if (!(title instanceof HTMLElement) || title.dataset.postSlug !== slug) {
    return;
  }

  clearListTitleTransitionNames();
  title.style.viewTransitionName = POST_TITLE_NAME;
}

function handlePostTitleClick(event) {
  if (!isPrimaryClick(event)) {
    return;
  }

  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const link = target.closest('a[href]');

  if (!(link instanceof HTMLAnchorElement)) {
    return;
  }

  if (link.target === '_blank' || link.hasAttribute('download') || link.hasAttribute('data-astro-reload')) {
    return;
  }

  const slug = getPostSlugFromHref(link.href);

  if (!slug) {
    return;
  }

  assignClickedTitleTransition(link, slug);
}

document.addEventListener('click', handlePostTitleClick, true);
document.addEventListener('astro:page-load', clearListTitleTransitionNames);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', clearListTitleTransitionNames, { once: true });
} else {
  clearListTitleTransitionNames();
}
