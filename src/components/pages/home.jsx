import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "../../App.scss";
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
    <div className="homeContainer">
      {/* Navbar */}
      <header className="homeHeader">
        <div className="homeHeaderContent">
          <div className="homeLogo">
            <span className="homeLogoIcon">📚</span>
            <h1 className="homeLogoText">BiblioTech</h1>
          </div>

          <button
            className="homeMenuButton"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span>☰</span>
          </button>

          <nav className="homeNav">
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
          <nav className="homeMobileMenu">
            <div className="homeMobileMenuContent">
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
      <section id="inicio" className="homeHero">
        <div className="homeHeroOverlay"></div>
        <div className="homeHeroBackground"></div>
        <div className="homeHeroContent">
          <h2>Bienvenido a BiblioTech</h2>
          <p>Tu puerta al conocimiento infinito</p>
          <div className="homeHeroButtons">
            <Link to="/register" className="homeRegisterButton">
              Registrarse
            </Link>
            <a href="#catalogo" className="homeExploreButton">
              Explorar Catálogo
            </a>
          </div>
        </div>
      </section>

      {/* Servicios Principales */}
      <section className="homeSection">
        <h3 className="homeSectionTitle">Nuestros Servicios</h3>
        <div className="homeServicesGrid">
          {serviciosPrincipales.map((servicio) => (
            <div key={servicio.id} className="homeServiceCard">
              <div className="homeServiceIcon">{servicio.icono}</div>
              <h4>{servicio.titulo}</h4>
              <p>{servicio.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios Adicionales */}
      <section id="servicios" className="homeSectionWhite">
        <div className="homeSection">
          <h3 className="homeSectionTitle">Servicios Adicionales</h3>
          <div className="homeAdditionalServicesGrid">
            {serviciosAdicionales.map((servicio) => (
              <div key={servicio.id} className="homeAdditionalServiceCard">
                <div className="homeServiceIcon">{servicio.icono}</div>
                <h5>{servicio.titulo}</h5>
                <p>{servicio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo Destacado */}
      <section id="catalogo" className="homeSection">
        <div className="homeCatalogHeader">
          <h3>Catálogo Destacado</h3>
          <Link to="/catalog" className="homeViewAllLink">
            Ver todo →
          </Link>
        </div>
        <div className="homeCatalogGrid">
          {librosDestacados.map((libro) => (
            <div key={libro.id} className="homeBookCard">
              <div className="homeBookContent">
                <div className="homeBookCover">📖</div>
                <div className="homeBookInfo">
                  <h4>{libro.titulo}</h4>
                  <p className="homeBookAuthor">{libro.autor}</p>
                  <span className="homeBookGenre">{libro.genero}</span>
                  <p className={`homeBookAvailability ${libro.disponibles > 0 ? "homeAvailable" : "homeUnavailable"}`}>
                    {libro.disponibles} disponibles
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Estadísticas */}
      <section className="homeStats">
        <div className="homeStatsGrid">
          <div className="homeStatItem">
            <div className="homeStatNumber">10,000+</div>
            <div className="homeStatLabel">Libros</div>
          </div>
          <div className="homeStatItem">
            <div className="homeStatNumber">5,000+</div>
            <div className="homeStatLabel">Usuarios</div>
          </div>
          <div className="homeStatItem">
            <div className="homeStatNumber">50+</div>
            <div className="homeStatLabel">Categorías</div>
          </div>
          <div className="homeStatItem">
            <div className="homeStatNumber">24/7</div>
            <div className="homeStatLabel">Acceso Digital</div>
          </div>
        </div>
      </section>

      {/* Reseñas Recientes */}
      <section className="homeSection">
        <h3 className="homeSectionTitle">Reseñas Recientes</h3>
        <div className="homeReviewsGrid">
          {resenasRecientes.map((resena) => (
            <div key={resena.id} className="homeReviewCard">
              <div className="homeReviewImage">{resena.imagen}</div>
              <div className="homeReviewContent">
                <h4>{resena.libro}</h4>
                <div className="homeReviewStars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < resena.calificacion ? "homeFilled" : "homeEmpty"}>
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="homeReviewText">"{resena.comentario}"</p>
                <p className="homeReviewAuthor">- {resena.usuario}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="homeFooter">
        <div className="homeFooterContent">
          <div className="homeFooterGrid">
            <div className="homeFooterSection">
              <h4>BiblioTech</h4>
              <p>Tu biblioteca digital del futuro</p>
            </div>
            <div className="homeFooterSection">
              <h4>Enlaces Rápidos</h4>
              <ul>
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#servicios">Servicios</a></li>
                <li><a href="#catalogo">Catálogo</a></li>
                <li><Link to="/login">Iniciar Sesión</Link></li>
              </ul>
            </div>
            <div className="homeFooterSection">
              <h4>Contacto</h4>
              <ul>
                <li>📧 info@bibliotech.com</li>
                <li>📱 +1 234 567 890</li>
                <li>📍 Calle Principal 123</li>
              </ul>
            </div>
          </div>
          <div className="homeFooterBottom">
            <p>&copy; 2025 BiblioTech. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
