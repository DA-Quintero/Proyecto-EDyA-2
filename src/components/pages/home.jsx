import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "../../App.scss";
import { useSelector } from "react-redux";
import MapaSedes from "./MapaSedes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';


export default function Home() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mapaAbierto, setMapaAbierto] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // Servicios
  const servicios = [
    {
      id: 1,
      icono: <FontAwesomeIcon icon={faBookOpen} />,
      titulo: "Préstamo de libros",
      descripcion: "Más de 50000 títulos disponibles para préstamo gratuito"
    },
    {
      id: 2,
      icono: "📡",
      titulo: "WiFi gratuito",
      descripcion: "Acceso a internet de alta velocidad en todas nuestras sedes"
    },
    {
      id: 3,
      icono: "👥",
      titulo: "Salas de estudio",
      descripcion: "Espacios colaborativos e individuales para estudiar"
    },
    {
      id: 4,
      icono: "📅",
      titulo: "Eventos culturales",
      descripcion: "Talleres, conferencias y actividades para toda la familia"
    },
    {
      id: 5,
      icono: "💻",
      titulo: "Recursos digitales",
      descripcion: "E-books, audiolibros y bases de datos especializadas"
    },
    {
      id: 6,
      icono: "🎓",
      titulo: "Soporte académico",
      descripcion: "Asesoría para investigación y trabajos académicos"
    }
  ];

  // Catálogo destacado
  const catalogoNovedades = [
    { id: 1, titulo: "El código de la vida", autor: "Walter Isaacson", emoji: "📘", badge: "Disponible" },
    { id: 2, titulo: "Historia del tiempo", autor: "George Ruiz", emoji: "⏰", badge: "Disponible" },
    { id: 3, titulo: "Arte y ciencia", autor: "Ana Martínez", emoji: "🎨", badge: "Disponible" }
  ];

  const catalogoPopulares = [
    { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", emoji: "📗", badge: "Disponible" },
    { id: 2, titulo: "Don Quijote", autor: "Miguel de Cervantes", emoji: "📕", badge: "Disponible" },
    { id: 3, titulo: "La sombra del viento", autor: "Carlos Ruiz Zafón", emoji: "🌬️", badge: "Disponible" }
  ];

  const catalogoInfantil = [
    { id: 1, titulo: "El principito", autor: "Antoine de Saint-Exupéry", emoji: "👑", badge: "Disponible" },
    { id: 2, titulo: "Harry Potter", autor: "J.K. Rowling", emoji: "⚡", badge: "Disponible" },
    { id: 3, titulo: "Matilda", autor: "Roald Dahl", emoji: "📚", badge: "Disponible" }
  ];

  // Sedes
  const sedes = [
    {
      id: 1,
      nombre: "Sede Central",
      badge: "Principal",
      direccion: "Av. Principal 123, Centro",
      telefono: "(555) 123-4567",
      horario: "Lun-Vie: 8:00-20:00, Sáb-Dom: 9:00-18:00",
      servicios: ["Préstamo", "Sala infantil", "Auditorio", "WiFi"]
    },
    {
      id: 2,
      nombre: "Sede Norte",
      direccion: "Calle del Sol 456, Zona Norte",
      telefono: "(555) 123-4568",
      horario: "Lun-Vie: 9:00-18:00, Sáb: 10:00-16:00",
      servicios: ["Préstamo", "Sala de estudio", "WiFi"]
    },
    {
      id: 3,
      nombre: "Sede Sur",
      direccion: "Carrera 8 #789, Zona Sur",
      telefono: "(555) 123-4569",
      horario: "Lun-Vie: 9:00-18:00, Sáb: 10:00-16:00",
      servicios: ["Préstamo", "WiFi", "Sala infantil"]
    },
    {
      id: 4,
      nombre: "Sede Este",
      direccion: "Calle 15 #321, Zona Este",
      telefono: "(555) 123-4570",
      horario: "Lun-Vie: 8:00-19:00, Sáb: 9:00-17:00",
      servicios: ["Préstamo", "Sala de estudio", "Auditorio", "WiFi"]
    }
  ];

  // Eventos
  const eventos = [
    {
      id: 1,
      titulo: "Club de lectura: Clásicos latinoamericanos",
      imagen: "📖",
      categoria: "Para todos",
      fecha: "15 de noviembre, 2025",
      hora: "18:00 - 20:00",
      lugar: "Sede Central - Sala de eventos",
      capacidad: "Cupo: 20 personas"
    },
    {
      id: 2,
      titulo: "Taller de escritura creativa",
      imagen: "✍️",
      categoria: "Talleres",
      fecha: "18 de noviembre, 2025",
      hora: "16:00 - 18:00",
      lugar: "Sede Norte - Auditorio",
      capacidad: "Cupo: 15 personas"
    },
    {
      id: 3,
      titulo: "Taller de escritura creativa",
      imagen: "🎨",
      categoria: "Infantil",
      fecha: "20 de noviembre, 2025",
      hora: "11:00 - 13:00",
      lugar: "Sede Sur - Sala infantil",
      capacidad: "Cupo: 25 personas"
    }
  ];

  return (
    <div className="homeContainer">
      {/* Navbar */}
      <header className="homeHeader">
        <div className="homeHeaderContent">
          <div className="homeLogo">
            <span className="homeLogoIcon"><FontAwesomeIcon icon={faBookOpen} /></span>
            <h1 className="homeLogoText">Librería Municipal</h1>
          </div>

          <button
            className="homeMenuButton"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span>☰</span>
          </button>

          <nav className="homeNav">
            <a href="#inicio">Inicio</a>
            <a href="#catalogo">Catálogo</a>
            <a href="#sedes">Sedes</a>
            <a href="#eventos">Eventos</a>
            <a href="#contacto">Contacto</a>
            {user ? (
              <div className="homeProfileContainer" onClick={() => navigate("/profile")}>
                <img 
                  src={user.photoURL || "https://via.placeholder.com/40"} 
                  alt="Profile" 
                  className="homeProfilePic" 
                />
              </div>
            ) : (
              <button className="homeLoginButton" onClick={() => navigate("/login")}>
                Cerrar sesión
              </button>
            )}
          </nav>
        </div>

        {/* Menu móvil */}
        {menuAbierto && (
          <nav className="homeMobileMenu">
            <div className="homeMobileMenuContent">
              <a href="#inicio" onClick={() => setMenuAbierto(false)}>Inicio</a>
              <a href="#catalogo" onClick={() => setMenuAbierto(false)}>Catálogo</a>
              <a href="#sedes" onClick={() => setMenuAbierto(false)}>Sedes</a>
              <a href="#eventos" onClick={() => setMenuAbierto(false)}>Eventos</a>
              <a href="#contacto" onClick={() => setMenuAbierto(false)}>Contacto</a>
              {user ? (
                <div className="homeMobileProfileContainer" onClick={() => navigate("/profile")}>
                  <img 
                    src={user.photoURL || "https://via.placeholder.com/40"} 
                    alt="Profile" 
                    className="homeProfilePic" 
                  />
                  <span>Mi perfil</span>
                </div>
              ) : (
                <button className="homeLoginButton" onClick={() => navigate("/login")}>
                  Cerrar sesión
                </button>
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
          <h2>Descubre un mundo de conocimiento en tu ciudad</h2>
          <p>Accede a más de libros, recursos digitales y espacios de estudio en nuestras 5 sedes. ¡Obtén tu credencial de biblioteca y comienza hoy!</p>
          <div className="homeHeroButtons">
            <button 
              className="homeRegisterButton"
              onClick={() => {
                document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <FontAwesomeIcon icon={faBookOpen} /> Explorar catálogo
            </button>
            <button 
              className="homeExploreButton" 
              onClick={() => {
                document.getElementById('sedes')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              📍 Ver sedes
            </button>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="homeSection">
        <h3 className="homeSectionTitle">Nuestros servicios</h3>
        <p className="homeSectionSubtitle">Ofrecemos una amplia gama de servicios diseñados para apoyar tu aprendizaje y desarrollo personal</p>
        <div className="homeServicesGrid">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="homeServiceCard">
              <div className="homeServiceIcon">{servicio.icono}</div>
              <h4>{servicio.titulo}</h4>
              <p>{servicio.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Catálogo Destacado */}
      <section id="catalogo" className="homeSectionWhite">
        <div className="homeSection">
          <h3 className="homeSectionTitle">Catálogo destacado</h3>
          <p className="homeSectionSubtitle">Descubre nuestras últimas adquisiciones y los títulos más solicitados</p>
          
          <div className="homeCatalogoContainer">
            {/* Novedades */}
            <div className="homeCatalogoCategoria">
              <div className="homeCatalogHeader">
                <h4>Novedades</h4>
              </div>
              <div className="homeCatalogoLista">
                {catalogoNovedades.map((libro) => (
                  <div key={libro.id} className="homeCatalogoItem">
                    <div className="homeCatalogoEmoji">{libro.emoji}</div>
                    <div className="homeCatalogoInfo">
                      <h5>{libro.titulo}</h5>
                      <p className="homeCatalogoAutor">{libro.autor}</p>
                      <span className="homeCatalogoBadge">{libro.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Más populares */}
            <div className="homeCatalogoCategoria">
              <div className="homeCatalogHeader">
                <h4>Más populares</h4>
              </div>
              <div className="homeCatalogoLista">
                {catalogoPopulares.map((libro) => (
                  <div key={libro.id} className="homeCatalogoItem">
                    <div className="homeCatalogoEmoji">{libro.emoji}</div>
                    <div className="homeCatalogoInfo">
                      <h5>{libro.titulo}</h5>
                      <p className="homeCatalogoAutor">{libro.autor}</p>
                      <span className="homeCatalogoBadge">{libro.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Literatura infantil */}
            <div className="homeCatalogoCategoria">
              <div className="homeCatalogHeader">
                <h4>Literatura infantil</h4>
              </div>
              <div className="homeCatalogoLista">
                {catalogoInfantil.map((libro) => (
                  <div key={libro.id} className="homeCatalogoItem">
                    <div className="homeCatalogoEmoji">{libro.emoji}</div>
                    <div className="homeCatalogoInfo">
                      <h5>{libro.titulo}</h5>
                      <p className="homeCatalogoAutor">{libro.autor}</p>
                      <span className="homeCatalogoBadge">{libro.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="homeVerCatalogoBtn">
            <Link to="/catalog">Ver catálogo completo</Link>
          </div>
        </div>
      </section>

      {/* Sedes */}
      <section id="sedes" className="homeSection">
        <h3 className="homeSectionTitle">Nuestras sedes</h3>
        <p className="homeSectionSubtitle">4 sedes estratégicamente ubicadas en toda la ciudad para estar siempre cerca de ti</p>
        <div className="homeSedesGrid">
          {sedes.map((sede) => (
            <div key={sede.id} className="homeSedeCard">
              {sede.badge && <span className="homeSedeBadge">{sede.badge}</span>}
              <h4>{sede.nombre}</h4>
              <p className="homeSedeInfo">📍 {sede.direccion}</p>
              <p className="homeSedeInfo">📞 {sede.telefono}</p>
              <p className="homeSedeInfo">🕒 {sede.horario}</p>
              <div className="homeSedeServicios">
                <strong>Servicios:</strong>
                <div className="homeSedeServiciosList">
                  {sede.servicios.map((servicio, idx) => (
                    <span key={idx} className="homeSedeServicioTag">{servicio}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="homeVerSedesBtn">
          <button onClick={() => setMapaAbierto(true)}>Ver mapa</button>
        </div>
      </section>

      {/* Eventos */}
      <section id="eventos" className="homeSectionWhite">
        <div className="homeSection">
          <h3 className="homeSectionTitle">Próximos eventos</h3>
          <p className="homeSectionSubtitle">Participa en nuestras actividades culturales y educativas gratuitas</p>
          <div className="homeEventosGrid">
            {eventos.map((evento) => (
              <div key={evento.id} className="homeEventoCard">
                <div className="homeEventoImagen">{evento.imagen}</div>
                <div className="homeEventoContent">
                  <span className="homeEventoCategoria">{evento.categoria}</span>
                  <h4>{evento.titulo}</h4>
                  <p className="homeEventoDetalle">📅 {evento.fecha}</p>
                  <p className="homeEventoDetalle">🕒 {evento.hora}</p>
                  <p className="homeEventoDetalle">📍 {evento.lugar}</p>
                  <p className="homeEventoDetalle">👥 {evento.capacidad}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="homeFooter">
        <div className="homeFooterContent">
          <div className="homeFooterGrid">
            <div className="homeFooterSection">
              <div className="homeFooterLogo">
                <span><FontAwesomeIcon icon={faBookOpen} /></span>
                <h4>Librería Municipal</h4>
              </div>
              <p>Fomentando la lectura y el conocimiento en nuestra ciudad</p>
              <div className="homeFooterSocial">
                <a href="#" aria-label="Facebook">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="#" aria-label="Instagram">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="#" aria-label="Twitter">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              </div>
            </div>
            <div className="homeFooterSection">
              <h4>Enlaces rápidos</h4>
              <ul>
                <li><a href="#catalogo">Catálogo</a></li>
                <li><a href="#sedes">Nuestras sedes</a></li>
                <li><a href="#eventos">Eventos</a></li>
                <li><Link to="/profile">Perfil</Link></li>
              </ul>
            </div>
            <div className="homeFooterSection">
              <h4>Contacto</h4>
              <ul>
                <li className="homeFooterContact">📍 Av. Principales 123, Centro</li>
                <li className="homeFooterContact">📧 info@libreriamunicipal.org</li>
                <li className="homeFooterContact">📞 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="homeFooterBottom">
            <p>© 2025 Biblioteca Municipal. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modal del Mapa de Sedes */}
      {mapaAbierto && <MapaSedes onClose={() => setMapaAbierto(false)} />}
    </div>
  );
}
