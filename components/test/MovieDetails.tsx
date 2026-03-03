const MovieDetails = () => {
  return (
    <main style={{ flex: 1, padding: 24 }}>
      <div>
        <span style={{ color: "green" }}>PUBLISHED</span>
        <p>Updated 2d ago</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>Title</label>
        <input type="text" value="Interstellar" readOnly />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>Slug</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="text" value="interstellar" readOnly />
          <button>Generate</button>
        </div>
      </div>

      <div>
        <h4>Poster Image</h4>
        <div
          style={{ border: "1px dashed #ccc", height: 250, marginBottom: 12 }}
        >
          {/* Image placeholder */}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button>Upload</button>
          <button>Browse</button>
          <button>Edit</button>
          <button style={{ color: "red" }}>Remove</button>
        </div>
      </div>
    </main>
  );
};

export default MovieDetails;
