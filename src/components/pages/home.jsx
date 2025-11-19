import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import styles from "./home.module.scss";
import { useSelector } from "react-redux";


export default function Home() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const getShortName = () => {
    if (!user?.displayName) return "";

    const parts = user.displayName.split(" ");
    const firstName = parts[0];
    const lastInitial = parts[1] ? parts[1].charAt(0).toUpperCase() : "";

    return `${firstName} ${lastInitial}`;
  };



  // Servicios principales
  const serviciosPrincipales = [
    {
      id: 1,
      icono: "📚",
      titulo: "Amplio Catálogo",
      descripcion: "Más de 10,000 libros disponibles en diferentes géneros y categorías"
    },
    {
      id: 2,
      icono: "🔍",
      titulo: "Búsqueda Avanzada",
      descripcion: "Encuentra fácilmente el libro que buscas con nuestro sistema de búsqueda"
    },
    {
      id: 3,
      icono: "📖",
      titulo: "Préstamos Digitales",
      descripcion: "Accede a libros electrónicos desde cualquier dispositivo"
    }
  ];

  // Servicios adicionales
  const serviciosAdicionales = [
    { id: 1, icono: "📱", titulo: "Reserva Online", descripcion: "Reserva tus libros desde casa" },
    { id: 2, icono: "🕐", titulo: "Horario Extendido", descripcion: "Abierto de 8am a 8pm" },
    { id: 3, icono: "👥", titulo: "Sala de Estudio", descripcion: "Espacios tranquilos para leer" },
    { id: 4, icono: "🎧", titulo: "Audiolibros", descripcion: "Escucha mientras viajas" },
    { id: 5, icono: "📰", titulo: "Revistas y Diarios", descripcion: "Publicaciones actualizadas" },
    { id: 6, icono: "💻", titulo: "Computadoras", descripcion: "Acceso gratuito a internet" }
  ];

  // Catálogo destacado
  const librosDestacados = [
    { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", genero: "Ficción", disponibles: 3 },
    { id: 2, titulo: "1984", autor: "George Orwell", genero: "Distopía", disponibles: 5 },
    { id: 3, titulo: "El principito", autor: "Antoine de Saint-Exupéry", genero: "Infantil", disponibles: 8 },
    { id: 4, titulo: "Don Quijote", autor: "Miguel de Cervantes", genero: "Clásico", disponibles: 2 },
    { id: 5, titulo: "Orgullo y Prejuicio", autor: "Jane Austen", genero: "Romance", disponibles: 4 },
    { id: 6, titulo: "El Hobbit", autor: "J.R.R. Tolkien", genero: "Fantasía", disponibles: 6 }
  ];

  // Reseñas recientes
  const resenasRecientes = [
    {
      id: 1,
      libro: "El código Da Vinci",
      usuario: "María García",
      comentario: "Un libro fascinante que te mantiene en suspenso hasta el final. Altamente recomendado.",
      calificacion: 5,
      imagen: "📕"
    },
    {
      id: 2,
      libro: "Sapiens",
      usuario: "Juan Pérez",
      comentario: "Una perspectiva única sobre la historia de la humanidad. Muy revelador y bien escrito.",
      calificacion: 5,
      imagen: "📗"
    },
    {
      id: 3,
      libro: "El alquimista",
      usuario: "Ana López",
      comentario: "Inspirador y lleno de sabiduría. Un libro que todos deberían leer al menos una vez.",
      calificacion: 4,
      imagen: "📘"
    }
  ];

  return (
    <div className={styles.homeContainer}>
      {/* Navbar */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>📚</span>
            <h1 className={styles.logoText}>BiblioTech</h1>
          </div>

          <button
            className={styles.menuButton}
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span>☰</span>
          </button>

          <nav className={styles.nav}>
            <a href="#inicio">Inicio</a>
            <a href="#servicios">Servicios</a>
            <a href="#catalogo">Catálogo</a>
            <a href="#contacto">Contacto</a>
            {user ? (
              <button
                onClick={() => navigate("/profile")}
                className="profile-button"
              >
                {getShortName()}
              </button>
            ) : (
              <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
            )}

          </nav>
        </div>

        {/* Menu móvil */}
        {menuAbierto && (
          <nav className={styles.mobileMenu}>
            <div className={styles.mobileMenuContent}>
              <a href="#inicio">Inicio</a>
              <a href="#servicios">Servicios</a>
              <a href="#catalogo">Catálogo</a>
              <a href="#contacto">Contacto</a>
              {user ? (
                <button
                  onClick={() => navigate("/profile")}
                  className="profile-button"
                >
                  {getShortName()}
                </button>
              ) : (
                <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section id="inicio" className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroBackground}></div>
        <div className={styles.heroContent}>
          <h2>Bienvenido a BiblioTech</h2>
          <p>Tu puerta al conocimiento infinito</p>
          <div className={styles.heroButtons}>
            <Link to="/register" className={styles.registerButton}>
              Registrarse
            </Link>
            <a href="#catalogo" className={styles.exploreButton}>
              Explorar Catálogo
            </a>
          </div>
        </div>
      </section>

      {/* Servicios Principales */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Nuestros Servicios</h3>
        <div className={styles.servicesGrid}>
          {serviciosPrincipales.map((servicio) => (
            <div key={servicio.id} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>{servicio.icono}</div>
              <h4>{servicio.titulo}</h4>
              <p>{servicio.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios Adicionales */}
      <section id="servicios" className={styles.sectionWhite}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Servicios Adicionales</h3>
          <div className={styles.additionalServicesGrid}>
            {serviciosAdicionales.map((servicio) => (
              <div key={servicio.id} className={styles.additionalServiceCard}>
                <div className={styles.serviceIcon}>{servicio.icono}</div>
                <h5>{servicio.titulo}</h5>
                <p>{servicio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo Destacado */}
      <section id="catalogo" className={styles.section}>
        <div className={styles.catalogHeader}>
          <h3>Catálogo Destacado</h3>
          <Link to="/catalog" className={styles.viewAllLink}>
            Ver todo →
          </Link>
        </div>
        <div className={styles.catalogGrid}>
          {librosDestacados.map((libro) => (
            <div key={libro.id} className={styles.bookCard}>
              <div className={styles.bookContent}>
                <div className={styles.bookCover}>📖</div>
                <div className={styles.bookInfo}>
                  <h4>{libro.titulo}</h4>
                  <p className={styles.bookAuthor}>{libro.autor}</p>
                  <span className={styles.bookGenre}>{libro.genero}</span>
                  <p className={`${styles.bookAvailability} ${libro.disponibles > 0 ? styles.available : styles.unavailable}`}>
                    {libro.disponibles} disponibles
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Estadísticas */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>10,000+</div>
            <div className={styles.statLabel}>Libros</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>5,000+</div>
            <div className={styles.statLabel}>Usuarios</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>50+</div>
            <div className={styles.statLabel}>Categorías</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>24/7</div>
            <div className={styles.statLabel}>Acceso Digital</div>
          </div>
        </div>
      </section>

      {/* Reseñas Recientes */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Reseñas Recientes</h3>
        <div className={styles.reviewsGrid}>
          {resenasRecientes.map((resena) => (
            <div key={resena.id} className={styles.reviewCard}>
              <div className={styles.reviewImage}>{resena.imagen}</div>
              <div className={styles.reviewContent}>
                <h4>{resena.libro}</h4>
                <div className={styles.reviewStars}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < resena.calificacion ? styles.filled : styles.empty}>
                      ⭐
                    </span>
                  ))}
                </div>
                <p className={styles.reviewText}>"{resena.comentario}"</p>
                <p className={styles.reviewAuthor}>- {resena.usuario}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerGrid}>
            <div className={styles.footerSection}>
              <h4>BiblioTech</h4>
              <p>Tu biblioteca digital del futuro</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Enlaces Rápidos</h4>
              <ul>
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#servicios">Servicios</a></li>
                <li><a href="#catalogo">Catálogo</a></li>
                <li><Link to="/login">Iniciar Sesión</Link></li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Contacto</h4>
              <ul>
                <li>📧 info@bibliotech.com</li>
                <li>📱 +1 234 567 890</li>
                <li>📍 Calle Principal 123</li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2025 BiblioTech. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
