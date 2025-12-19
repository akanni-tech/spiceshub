
export function getSessionId() {
  let id = localStorage.getItem("guest_session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("guest_session", id);
  }
  return id;
}