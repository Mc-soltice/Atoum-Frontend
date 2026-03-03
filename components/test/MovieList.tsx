const MovieList = () => {
  return (
    <section style={{ width: 300, borderRight: "1px solid #ddd", padding: 16 }}>
      <input
        type="text"
        placeholder="Search"
        style={{ width: "100%", marginBottom: 12 }}
      />

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <strong>Interstellar (2014)</strong>
        </li>
        <li>Guardians of the Galaxy (2014)</li>
        <li>Alien: Covenant (2017)</li>
        <li>The Martian (2015)</li>
      </ul>
    </section>
  );
};

export default MovieList;
