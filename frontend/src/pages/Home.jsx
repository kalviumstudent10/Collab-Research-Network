import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const initialForm = { title: "", description: "", researchAreas: "", owner: "" };
const initialUser = { name: "", email: "", password: "", department: "" };
const initialRequest = { sender: "", recipient: "", project: "", message: "" };

function Home() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [userForm, setUserForm] = useState(initialUser);
  const [requestForm, setRequestForm] = useState(initialRequest);
  const [message, setMessage] = useState("");

  async function loadProjects() {
    const response = await fetch(`${API_URL}/api/projects`);
    if (!response.ok) throw new Error("Could not load projects");
    return response.json();
  }

  async function loadUsers() {
    const response = await fetch(`${API_URL}/api/users`);
    if (!response.ok) throw new Error("Could not load users");
    return response.json();
  }

  useEffect(() => {
    Promise.all([loadProjects(), loadUsers()])
      .then(([loadedProjects, loadedUsers]) => {
        setProjects(loadedProjects);
        setUsers(loadedUsers);
      })
      .catch(() => setMessage("Start the backend to load research projects."));
  }, []);

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function updateUserForm(event) {
    setUserForm({ ...userForm, [event.target.name]: event.target.value });
  }

  function updateRequestForm(event) {
    setRequestForm({ ...requestForm, [event.target.name]: event.target.value });
  }

  async function createUser(event) {
    event.preventDefault();
    setMessage("");
    const response = await fetch(`${API_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userForm),
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || result.message || "Could not create researcher.");
      return;
    }
    setUsers([...users, result].sort((first, second) => first.name.localeCompare(second.name)));
    setForm({ ...form, owner: result._id });
    setUserForm(initialUser);
    setMessage("Researcher saved to MongoDB.");
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

  async function createCollaborationRequest(event) {
    event.preventDefault();
    setMessage("");
    const response = await fetch(`${API_URL}/api/collaboration-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestForm),
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || result.message || "Could not send collaboration request.");
      return;
    }
    setRequestForm(initialRequest);
    setMessage("Collaboration request sent to MongoDB.");
  }

  async function updateProjectStatus(projectId, status) {
    setMessage("");
    const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || result.message || "Could not update project.");
      return;
    }
    setProjects(projects.map((project) => (project._id === result._id ? result : project)));
    setMessage("Project status updated with PUT.");
  }

  return (
    <main>
      <header>
        <p>RESEARCH CONNECT</p>
        <h1>Make your work discoverable.</h1>
        <span>Browse active research and publish a project directly to the shared database.</span>
      </header>
      <section className="workspace">
        <div>
          <form onSubmit={createUser}>
            <h2>Add a researcher</h2>
            <input name="name" value={userForm.name} onChange={updateUserForm} placeholder="Full name" required />
            <input name="email" type="email" value={userForm.email} onChange={updateUserForm} placeholder="Email address" required />
            <input name="password" type="password" value={userForm.password} onChange={updateUserForm} placeholder="Password (6+ characters)" minLength="6" required />
            <input name="department" value={userForm.department} onChange={updateUserForm} placeholder="Department" />
            <button type="submit">Save researcher</button>
          </form>
          <form onSubmit={createProject}>
          <h2>Publish a project</h2>
          <input name="title" value={form.title} onChange={updateForm} placeholder="Project title" required />
          <textarea name="description" value={form.description} onChange={updateForm} placeholder="What are you researching?" required />
          <input name="researchAreas" value={form.researchAreas} onChange={updateForm} placeholder="Research areas, comma separated" required />
          <select name="owner" value={form.owner} onChange={updateForm} required>
            <option value="">Select project owner</option>
            {users.map((user) => <option key={user._id} value={user._id}>{user.name} ({user.email})</option>)}
          </select>
          <button type="submit">Save project</button>
          {message && <small>{message}</small>}
          </form>
          <form onSubmit={createCollaborationRequest}>
            <h2>Request collaboration</h2>
            <select name="sender" value={requestForm.sender} onChange={updateRequestForm} required>
              <option value="">Select sender</option>
              {users.map((user) => <option key={user._id} value={user._id}>{user.name}</option>)}
            </select>
            <select name="recipient" value={requestForm.recipient} onChange={updateRequestForm} required>
              <option value="">Select recipient</option>
              {users.map((user) => <option key={user._id} value={user._id}>{user.name}</option>)}
            </select>
            <select name="project" value={requestForm.project} onChange={updateRequestForm}>
              <option value="">No specific project</option>
              {projects.map((project) => <option key={project._id} value={project._id}>{project.title}</option>)}
            </select>
            <textarea name="message" value={requestForm.message} onChange={updateRequestForm} placeholder="Why should you collaborate?" maxLength="1000" required />
            <button type="submit">Send request</button>
          </form>
        </div>
        <section className="projects">
          <div className="section-heading"><h2>Research projects</h2><span>{projects.length} found</span></div>
          {projects.length === 0 ? <p>No projects yet. Create the first one.</p> : projects.map((project) => (
            <article key={project._id}>
              <select value={project.status} onChange={(event) => updateProjectStatus(project._id, event.target.value)} aria-label={`Update status for ${project.title}`}>
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
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