const pageIdentifierToPageComponent = {};
const pages = import.meta.glob('../views/**/*.jsx', { eager: true });

for (const key in pages) {
  if (pages.hasOwnProperty(key)) {
    const identifier = key.replace('../views/', '').split('.')[0];
    pageIdentifierToPageComponent[identifier] = pages[key].default;
  }
}

export { pageIdentifierToPageComponent };
