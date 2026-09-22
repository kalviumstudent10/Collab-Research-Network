import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const initialForm = { title: "", description: "", researchAreas: "", owner: "" };

function Home() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  async function loadProjects() {
    const response = await fetch(`${API_URL}/api/projects`);
    if (!response.ok) throw new Error("Could not load projects");
    return response.json();
  }

  useEffect(() => {
    loadProjects()
      .then((loadedProjects) => setProjects(loadedProjects))
      .catch(() => setMessage("Start the backend to load research projects."));
  }, []);

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function createProject(event) {
    event.preventDefault();
    setMessage("");
    const response = await fetch(`${API_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        researchAreas: form.researchAreas.split(",").map((area) => area.trim()).filter(Boolean),
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || result.message || "Could not create project.");
      return;
    }
    setProjects([result, ...projects]);
    setForm(initialForm);
    setMessage("Project saved to MongoDB.");
  }

  return (
    <main>
      <header>
        <p>RESEARCH CONNECT</p>
        <h1>Make your work discoverable.</h1>
        <span>Browse active research and publish a project directly to the shared database.</span>
      </header>
      <section className="workspace">
        <form onSubmit={createProject}>
          <h2>Publish a project</h2>
          <input name="title" value={form.title} onChange={updateForm} placeholder="Project title" required />
          <textarea name="description" value={form.description} onChange={updateForm} placeholder="What are you researching?" required />
          <input name="researchAreas" value={form.researchAreas} onChange={updateForm} placeholder="Research areas, comma separated" required />
          <input name="owner" value={form.owner} onChange={updateForm} placeholder="Owner user ID" required />
          <button type="submit">Save project</button>
          {message && <small>{message}</small>}
        </form>
        <section className="projects">
          <div className="section-heading"><h2>Research projects</h2><span>{projects.length} found</span></div>
          {projects.length === 0 ? <p>No projects yet. Create the first one.</p> : projects.map((project) => (
            <article key={project._id}>
              <span>{project.status}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <small>{project.researchAreas.join(" / ")} · {project.owner?.name || "Unknown owner"}</small>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

export default Home;