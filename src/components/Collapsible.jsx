// A card whose body folds away. Closed by default; the summary is the card's title.
export default function Collapsible({ title, children }) {
  return (
    <section className="card collapsible" aria-label={title}>
      <details>
        <summary>
          <h2>{title}</h2>
        </summary>
        <div className="collapsible-body">{children}</div>
      </details>
    </section>
  );
}
