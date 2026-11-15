const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

async function loadProjects() {
  const status = document.getElementById("projectStatus");
  try {
    const response = await fetch("/api/projects");
    if (!response.ok) throw new Error("API unavailable");
    const projects = await response.json();
    if (!projects.length) return;
    document.getElementById("projectGrid").innerHTML = projects.map((project, index) => `
      <article class="project-card">
        <div class="project-number">${String(index + 1).padStart(2, "0")}</div>
        <div class="project-symbol">${index === 0 ? "♧" : "▦"}</div>
        <h3>${escapeHTML(project.title)}</h3>
        <p>${escapeHTML(project.description)}</p>
        <div class="tags">${(project.tags || []).map(tag => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
      </article>`).join("");
    status.textContent = "Project information successfully loaded from the database.";
  } catch (_error) {
    status.textContent = "Showing the project details included with this website. Connect the database to enable live project loading.";
  }
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
loadProjects();

document.getElementById("contactForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("formStatus");
  const data = Object.fromEntries(new FormData(form).entries());
  status.textContent = "Sending...";
  try {
    const response = await fetch("/api/messages", {
      method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to send message.");
    status.textContent = result.message;
    form.reset();
  } catch (error) {
    status.textContent = error.message + " Make sure the server and database are connected.";
  }
});