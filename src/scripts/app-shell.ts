const searchOpenEvent = 'ptkp:search-open';
const themeChangeEvent = 'ptkp:theme-change';
const validThemes = ['light', 'dark', 'system'] as const;

type ThemePreference = (typeof validThemes)[number];

type BrowserWindow = Window & {
  __ptkpSearchLoader?: Promise<void>;
  __ptkpSearchShortcutBound?: boolean;
  __ptkpThemeMediaBound?: boolean;
};

const root = document.documentElement;
const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const isThemePreference = (value: unknown): value is ThemePreference =>
  typeof value === 'string' && validThemes.includes(value as ThemePreference);

const resolveTheme = (preference: ThemePreference): 'light' | 'dark' => {
  if (preference === 'system') {
    return colorSchemeQuery.matches ? 'dark' : 'light';
  }

  return preference;
};

const getThemePreference = (): ThemePreference => {
  try {
    const storedTheme = localStorage.getItem('ptkp-theme');
    return isThemePreference(storedTheme) ? storedTheme : 'system';
  } catch {
    return 'system';
  }
};

const storeThemePreference = (preference: ThemePreference): void => {
  try {
    localStorage.setItem('ptkp-theme', preference);
  } catch {
    return;
  }
};

const updateThemeControls = (preference: ThemePreference): void => {
  document.querySelectorAll<HTMLElement>('[data-theme-option]').forEach((button) => {
    const isSelected = button.getAttribute('data-theme-option') === preference;
    button.setAttribute('aria-pressed', String(isSelected));
  });
};

const applyTheme = (preference: ThemePreference): void => {
  root.dataset.themePreference = preference;
  root.dataset.theme = resolveTheme(preference);
  updateThemeControls(preference);
  document.dispatchEvent(
    new CustomEvent(themeChangeEvent, {
      detail: {
        preference,
        resolvedTheme: root.dataset.theme,
      },
    }),
  );
};

const initThemeToggle = (): void => {
  document.querySelectorAll<HTMLElement>('[data-theme-option]').forEach((button) => {
    if (button.dataset.themeBound === 'true') {
      return;
    }

    button.dataset.themeBound = 'true';
    button.addEventListener('click', () => {
      const preference = button.getAttribute('data-theme-option');

      if (!isThemePreference(preference)) {
        return;
      }

      storeThemePreference(preference);
      applyTheme(preference);
    });
  });

  const browserWindow = window as BrowserWindow;

  if (browserWindow.__ptkpThemeMediaBound !== true) {
    browserWindow.__ptkpThemeMediaBound = true;
    colorSchemeQuery.addEventListener('change', () => {
      if (getThemePreference() === 'system') {
        applyTheme('system');
      }
    });
  }

  if (document.querySelector('[data-theme-toggle]')) {
    applyTheme(getThemePreference());
  }
};

const initMobileNavigation = (): void => {
  document.querySelectorAll<HTMLElement>('.mobile-navigation').forEach((navigation) => {
    const toggle = navigation.querySelector<HTMLButtonElement>('.mobile-navigation__toggle');
    const panel = navigation.querySelector<HTMLElement>('.mobile-navigation__panel');

    if (!toggle || !panel || navigation.dataset.initialized === 'true') {
      return;
    }

    navigation.dataset.initialized = 'true';
    let previousFocus: HTMLElement | null = null;

    const getFocusableElements = (): HTMLElement[] =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

    const closePanel = (): void => {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      previousFocus?.focus();
      previousFocus = null;
    };

    const openPanel = (): void => {
      previousFocus =
        document.activeElement instanceof HTMLElement ? document.activeElement : toggle;
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      getFocusableElements()[0]?.focus();
    };

    toggle.addEventListener('click', () => {
      if (toggle.getAttribute('aria-expanded') === 'true') {
        closePanel();
      } else {
        openPanel();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (toggle.getAttribute('aria-expanded') !== 'true') {
        return;
      }

      if (event.key === 'Escape') {
        closePanel();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    });

    document.addEventListener('click', (event) => {
      const target = event.target;

      if (!(target instanceof Node) || toggle.contains(target) || panel.contains(target)) {
        return;
      }

      closePanel();
    });

    panel.addEventListener('click', (event) => {
      const target = event.target;

      if (target instanceof HTMLElement && target.closest('a[href]')) {
        closePanel();
      }
    });
  });
};

const initBackToTop = (): void => {
  const button = document.querySelector<HTMLButtonElement>('[data-back-to-top]');

  if (!button || button.dataset.initialized === 'true') {
    return;
  }

  button.dataset.initialized = 'true';

  const updateVisibility = (): void => {
    button.hidden = window.scrollY < 320;
  };

  button.addEventListener('click', () => {
    window.scrollTo({ behavior: reducedMotionQuery.matches ? 'auto' : 'smooth', top: 0 });
  });

  updateVisibility();
  window.addEventListener('scroll', updateVisibility, { passive: true });
};

const ensureSearch = async (): Promise<void> => {
  const browserWindow = window as BrowserWindow;

  browserWindow.__ptkpSearchLoader ??= import('./search').then(({ initSearch }) => initSearch());

  await browserWindow.__ptkpSearchLoader;
};

const openSearch = async (): Promise<void> => {
  await ensureSearch();
  document.dispatchEvent(new CustomEvent(searchOpenEvent));
};

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.closest('[contenteditable="true"]') !== null ||
    target.matches('input, textarea, select') ||
    target.closest('input, textarea, select') !== null
  );
};

const bindSearchBootstrap = (): void => {
  document.querySelectorAll<HTMLElement>('[data-search-open]').forEach((trigger) => {
    if (trigger.dataset.searchOpenBound === 'true') {
      return;
    }

    trigger.dataset.searchOpenBound = 'true';
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      void openSearch();
    });
  });

  const browserWindow = window as BrowserWindow;

  if (browserWindow.__ptkpSearchShortcutBound !== true) {
    browserWindow.__ptkpSearchShortcutBound = true;

    document.addEventListener('keydown', (event) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        void openSearch();
        return;
      }

      if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key === '/') {
        event.preventDefault();
        void openSearch();
      }
    });
  }

  if (document.querySelector('[data-search-surface="page"]')) {
    void ensureSearch();
  }
};

const initAppShell = (): void => {
  initThemeToggle();
  initMobileNavigation();
  initBackToTop();
  bindSearchBootstrap();
};

initAppShell();
document.addEventListener('astro:page-load', initAppShell);
