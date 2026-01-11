export const _fetch = async (url, method, callback) => {
  const csrfToken = document.querySelector("meta[name='csrf-token']").content;

  const response = await fetch(url, {
    method,
    headers: { 'X-CSRF-Token': csrfToken, accept: 'application/json' },
  });

  if (response.status !== 200 || !callback) return response;

  const json = await response.json();
  callback(json);
};
