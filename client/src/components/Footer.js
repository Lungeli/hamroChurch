export default function Footer() {
  return (
    <footer>
      <div className="container">
        <p style={{ margin: 0, fontSize: '1rem' }}>
          © {new Date().getFullYear()} RTN FG Church App. All rights reserved.
        </p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', opacity: 0.8 }}>
          Made by S Lungeli
        </p>
      </div>
    </footer>
  );
}
