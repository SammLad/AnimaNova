import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/home.css';

export default function Home() {
    return (
        <div className="home-wrapper">
            {/* HEADER / MENÚ PRINCIPAL */}
            <header className="navbar-wildcare">
                <div className="container d-flex flex-wrap align-items-center justify-content-between py-3 gap-3">
                    <a
                        href="#inicio"
                        className="text-decoration-none text-dark d-flex align-items-center gap-2"
                    >
                        <div className="logo-flower">🐾</div>
                        <span className="display-font brand-title">WildCare</span>
                    </a>

                    <nav className="d-flex flex-wrap gap-3 align-items-center">
                        <a href="#inicio" className="nav-link-custom">
                            Inicio
                        </a>
                        <a href="#donaciones" className="nav-link-custom">
                            Donaciones
                        </a>
                        <a href="#adopciones" className="nav-link-custom">
                            Adopciones
                        </a>
                        <a href="#blog" className="nav-link-custom">
                            Blog del Cuidador
                        </a>

                        {/* BOTÓN NAVEGACIÓN A LOGIN */}
                        <Link to="/login" className="btn-ingresar">
                            Ingresar
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="container py-5">
                {/* INICIO */}
                <section id="inicio" className="section-gap">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-12">
                            <div className="card-white p-4">
                                <h1 className="display-font text-success">
                                    ¡Bienvenidos a WildCare!
                                </h1>
                                <p className="mt-3">
                                    Somos una comunidad dedicada al cuidado, rescate y protección de
                                    los animales domésticos y salvajes.
                                </p>
                                <p>
                                    Ayudamos a encontrar hogares responsables, promovemos las
                                    adopciones y compartimos información para mejorar la vida
                                    animal.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 mt-4">
                        <div className="col-md-4">
                            <div className="card-white p-4 h-100 text-center">
                                <div className="icon-badge text-danger">❤️</div>
                                <h4 className="mt-3">Protección animal</h4>
                                <p>Promovemos el respeto y el cuidado de los animales.</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card-white p-4 h-100 text-center">
                                <div className="icon-badge text-success">🏡</div>
                                <h4 className="mt-3">Adopción responsable</h4>
                                <p>Ayudamos a los animales a encontrar una familia.</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card-white p-4 h-100 text-center">
                                <div className="icon-badge text-warning">🎁</div>
                                <h4 className="mt-3">Ayuda solidaria</h4>
                                <p>Apoyamos a los refugios mediante donaciones.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* DONACIONES */}
                <section id="donaciones" className="section-gap py-5">
                    <div className="text-center mb-4">
                        <h2 className="display-font text-success">
                            ❤️ Donaciones
                        </h2>
                        <p className="text-muted">
                            Cada aporte ayuda a mejorar la vida de los animales.
                        </p>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card-white p-4 text-center h-100 d-flex flex-column">
                                <div className="icon-badge text-success">🥣</div>
                                <h4 className="mt-3">Alimentación</h4>
                                <p>Contribuye con alimentos para los animales rescatados.</p>
                                <div className="mt-auto">
                                    <h3 className="text-success mb-3">$10</h3>
                                    <button className="btn btn-outline-success rounded-pill w-100">
                                        Quiero ayudar
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card-white p-4 text-center h-100 d-flex flex-column">
                                <div className="icon-badge text-danger">🏥</div>
                                <h4 className="mt-3">Atención veterinaria</h4>
                                <p>Apoya los cuidados y tratamientos veterinarios.</p>
                                <div className="mt-auto">
                                    <h3 className="text-success mb-3">$25</h3>
                                    <button className="btn btn-outline-success rounded-pill w-100">
                                        Quiero ayudar
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card-white p-4 text-center h-100 d-flex flex-column">
                                <div className="icon-badge text-warning">🏠</div>
                                <h4 className="mt-3">Refugios</h4>
                                <p>Ayuda a mejorar los espacios donde viven los animales.</p>
                                <div className="mt-auto">
                                    <h3 className="text-success mb-3">$50</h3>
                                    <button className="btn btn-outline-success rounded-pill w-100">
                                        Quiero ayudar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ADOPCIONES */}
                <section id="adopciones" className="section-gap py-5">
                    <div className="text-center mb-4">
                        <h2 className="display-font text-success">
                            🏡 Adopciones
                        </h2>
                        <p className="text-muted">
                            Encuentra un compañero y dale una oportunidad de tener un hogar.
                        </p>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card-white p-4 h-100 d-flex flex-column">
                                <h4 className="mt-2">Max</h4>
                                <p className="text-muted">Perro · Amigable y juguetón.</p>
                                <div className="mt-auto">
                                    <button className="btn btn-success rounded-pill w-100">
                                        Adoptar
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card-white p-4 h-100 d-flex flex-column">
                                <h4 className="mt-2">Luna</h4>
                                <p className="text-muted">Gata · Tranquila y cariñosa.</p>
                                <div className="mt-auto">
                                    <button className="btn btn-success rounded-pill w-100">
                                        Adoptar
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card-white p-4 h-100 d-flex flex-column">
                                <h4 className="mt-2">Rocky</h4>
                                <p className="text-muted">Perro · Activo y sociable.</p>
                                <div className="mt-auto">
                                    <button className="btn btn-success rounded-pill w-100">
                                        Adoptar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BLOG DEL CUIDADOR */}
                <section id="blog" className="section-gap py-5">
                    <div className="text-center mb-4">
                        <h2 className="display-font text-success">
                            📖 Blog del Cuidador
                        </h2>
                        <p className="text-muted">
                            Consejos sencillos para cuidar, proteger y comprender a los animales.
                        </p>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <article className="card-white p-4 h-100">
                                <h4 className="mt-2">Cuidados básicos</h4>
                                <p className="mb-0">
                                    Aprende sobre alimentación adecuada, higiene, ejercicio y
                                    visitas al veterinario.
                                </p>
                            </article>
                        </div>

                        <div className="col-md-4">
                            <article className="card-white p-4 h-100">
                                <h4 className="mt-2">Adoptar con responsabilidad</h4>
                                <p className="mb-0">
                                    Conoce la importancia de preparar tu hogar y asumir el
                                    compromiso de cuidar a un animal.
                                </p>
                            </article>
                        </div>

                        <div className="col-md-4">
                            <article className="card-white p-4 h-100">
                                <h4 className="mt-2">Protección animal</h4>
                                <p className="mb-0">
                                    Descubre cómo actuar responsablemente y ayudar a los animales de
                                    tu comunidad.
                                </p>
                            </article>
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="footer-wildcare text-center py-4">
                <p className="mb-1">© 2026 WildCare</p>
                <p className="mb-0">Cuidamos, protegemos y damos nuevas oportunidades.</p>
            </footer>
        </div>
    );
}