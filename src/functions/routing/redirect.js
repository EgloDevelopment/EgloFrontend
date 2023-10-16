export default async function redirect(location) {
  window.history.pushState("", "", location);
}
