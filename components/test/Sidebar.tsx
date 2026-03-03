const Sidebar = () => {
  return (
    <aside style={{ width: 220, borderRight: "1px solid #ddd", padding: 16 }}>
      <h3>Sci-Fi Movies</h3>

      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <strong>🎬 Movie</strong>
          </li>
          <li>👤 Person</li>
          <li>🎟 Screening</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
