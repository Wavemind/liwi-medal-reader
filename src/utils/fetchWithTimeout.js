export default function(url, options, timeout = 30000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject('Server are not responding'), timeout),
    ),
  ]);
}
