import { useState } from "react";

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ firstname: "", contact: "" });
  const [erreur, setErreur] = useState("");
  const [editId, setEditId] = useState(null);
  const [query, setQuery] = useState(""); // 👈 state du texte tapé uniquement
  const [exitingIds, setExitingIds] = useState([]);

  // 👇 liste filtrée DÉRIVÉE (pas de state, recalculée à chaque rendu)
  const filteredContacts = query.trim()
    ? contacts.filter(
        (c) =>
          c.firstname.toLowerCase().includes(query.toLowerCase()) ||
          c.contact.toLowerCase().includes(query.toLowerCase()),
      )
    : contacts;

  const inputs = [
    {
      label: "Nom",
      name: "firstname",
      type: "text",
      placeholder: "Jean Dupont",
    },
    {
      label: "Téléphone",
      name: "contact",
      type: "tel",
      placeholder: "06 12 34 56 78",
    },
  ];

  const isEditing = editId !== null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const deleteContact = (id) => {
    if (!confirm("Supprimer ?")) return;

    setExitingIds((prev) => [...prev, id]);

    setTimeout(() => {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setExitingIds((prev) => prev.filter((x) => x !== id));
    }, 250);

    if (editId === id) {
      setEditId(null);
      setForm({ firstname: "", contact: "" });
      setErreur("");
    }
  };

  const editContact = (id) => {
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return;
    const { id: _id, ...rest } = contact;
    setEditId(id);
    setForm(rest);
    setErreur("");
  };

  const resetForm = () => {
    setForm({ firstname: "", contact: "" });
    setErreur("");
    setEditId(null);
  };

  const handleForm = (e) => {
    e.preventDefault();
    const firstname = form.firstname.trim();
    const contact = form.contact.trim();

    if (!firstname || !contact) {
      setErreur("Tous les champs doivent être remplis");
      return;
    }

    if (!isEditing) {
      setContacts((prev) => [
        ...prev,
        { id: crypto.randomUUID(), firstname, contact },
      ]);
    } else {
      setContacts((prev) =>
        prev.map((c) => (c.id === editId ? { ...c, firstname, contact } : c)),
      );
      setEditId(null);
    }

    setForm({ firstname: "", contact: "" });
    setErreur("");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes slideOut {
          from { opacity: 1; transform: translateX(0)    scale(1); }
          to   { opacity: 0; transform: translateX(24px) scale(0.95); }
        }
        .anim-in  { animation: slideIn  250ms ease-out both; }
        .anim-out { animation: slideOut 250ms ease-in  both; }
      `}</style>

      <header className="sticky top-0 z-10 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-yellow-400 text-black font-black">
              C
            </span>
            <h1 className="text-lg font-bold">Carnet de contacts</h1>
          </div>
          <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-300">
            {contacts.length} contact{contacts.length > 1 ? "s" : ""}
          </span>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[380px_1fr]">
        {/* FORMULAIRE */}
        <section className="h-fit rounded-2xl border border-white/10 bg-neutral-900 p-5 md:sticky md:top-20">
          <div className="mb-4">
            <h2 className="text-lg font-bold">
              {isEditing ? "Modifier le contact" : "Nouveau contact"}
            </h2>
            <p className="text-xs text-neutral-400">
              {isEditing
                ? "Mettez à jour les informations ci-dessous."
                : "Remplissez les champs pour ajouter un contact."}
            </p>
          </div>

          <form onSubmit={handleForm} className="flex flex-col gap-4">
            {inputs.map((input) => (
              <div key={input.name} className="flex flex-col gap-1.5">
                <label
                  htmlFor={input.name}
                  className="text-sm font-semibold text-neutral-300"
                >
                  {input.label}
                </label>
                <input
                  className="rounded-lg border border-white/10 bg-neutral-800 px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
                  name={input.name}
                  type={input.type}
                  placeholder={input.placeholder}
                  onChange={handleChange}
                  value={form[input.name]}
                  required
                />
              </div>
            ))}

            {erreur && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
                {erreur}
              </p>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-yellow-300 active:scale-[0.98]"
              >
                {isEditing ? "Mettre à jour" : "Enregistrer"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-white/10 bg-neutral-800 px-4 py-2.5 text-sm font-semibold text-neutral-300 transition hover:bg-neutral-700"
              >
                {isEditing ? "Annuler" : "Vider"}
              </button>
            </div>
          </form>
        </section>

        {/* LISTE */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Contacts</h2>
            <span className="text-xs text-neutral-500">
              {query.trim()
                ? `${filteredContacts.length} / ${contacts.length}`
                : contacts.length > 0
                  ? "Cliquez sur ✏️ pour modifier"
                  : ""}
            </span>
          </div>

          {/* Barre de recherche */}
          <input
            className="rounded-lg border border-white/10 bg-neutral-800 px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
            placeholder="Rechercher un contact (nom ou téléphone)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* États vides différenciés */}
          {contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 py-16 text-center">
              <span className="text-4xl">📇</span>
              <p className="text-sm font-semibold text-neutral-300">
                Aucun contact
              </p>
              <p className="text-xs text-neutral-500">
                Ajoutez votre premier contact avec le formulaire.
              </p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 py-16 text-center">
              <span className="text-4xl">🔍</span>
              <p className="text-sm font-semibold text-neutral-300">
                Aucun résultat
              </p>
              <p className="text-xs text-neutral-500">
                Aucun contact ne correspond à « {query} ».
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {filteredContacts.map((ct) => {
                const isCurrent = editId === ct.id;
                const isExiting = exitingIds.includes(ct.id);
                const initial = ct.firstname.charAt(0).toUpperCase();
                return (
                  <li
                    key={ct.id}
                    className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                      isExiting ? "anim-out pointer-events-none" : "anim-in"
                    } ${
                      isCurrent
                        ? "border-yellow-400/60 bg-yellow-400/5"
                        : "border-white/10 bg-neutral-900 hover:border-white/20"
                    }`}
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-yellow-400 font-black text-black">
                      {initial}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold capitalize">
                        {ct.firstname}
                      </p>
                      <p className="truncate text-xs text-neutral-400">
                        {ct.contact}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        aria-label={`Éditer ${ct.firstname}`}
                        onClick={() => editContact(ct.id)}
                        className="grid h-9 w-9 place-items-center rounded-lg text-neutral-400 transition hover:bg-neutral-800 hover:text-yellow-400"
                      >
                        ✏️
                      </button>
                      <button
                        aria-label={`Supprimer ${ct.firstname}`}
                        onClick={() => deleteContact(ct.id)}
                        className="grid h-9 w-9 place-items-center rounded-lg text-neutral-400 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
