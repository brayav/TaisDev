import {
    BookOpen,
    Bot,
    Coffee,
    Download,
    Gamepad2,
    Github,
    Heart,
    Instagram,
    Layers,
    Layout,
    Linkedin,
    Mail,
    Music,
    Palette,
    Server,
    Sparkles,
    Star,
    Target,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// IMPORTACIONES (Asegúrate de que los archivos existan en la misma carpeta)
import BounceCards from './BounceCards';
import Galaxy from './Galaxy';

// --- CONFIGURACIÓN PARA LAS TARJETAS ---
const bounceImages = [
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&q=80",
    "https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&q=80",
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80",
    "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&q=80",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80"
];

const transformStylesDesktop = [
    "rotate(10deg) translate(-150px)",
    "rotate(5deg) translate(-70px)",
    "rotate(-3deg)",
    "rotate(5deg) translate(70px)",
    "rotate(-5deg) translate(150px)"
];

const transformStylesMobile = [
    "rotate(8deg) translate(-65px)",
    "rotate(4deg) translate(-30px)",
    "rotate(-2deg)",
    "rotate(4deg) translate(30px)",
    "rotate(-8deg) translate(65px)"
];

// --- COMPONENTES UI INTERNOS ---
const TiltCard = ({ children, className = "", noTilt = false }) => {
    const cardRef = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    return (
        <div ref={cardRef} onMouseMove={(e) => {
            if (!cardRef.current || noTilt) return;
            const rect = cardRef.current.getBoundingClientRect();
            setRotation({ x: ((e.clientY - rect.top) / rect.height - 0.5) * -15, y: ((e.clientX - rect.left) / rect.width - 0.5) * 15 });
        }} onMouseLeave={() => { setIsHovering(false); setRotation({ x: 0, y: 0 }); }} onMouseEnter={() => setIsHovering(true)}
            className={`relative transition-all duration-200 ease-out transform-gpu ${className}`}
            style={{ transform: isHovering && !noTilt ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)` : 'perspective(1000px) scale3d(1, 1, 1)', zIndex: isHovering ? 10 : 1 }}>
            <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-200 bg-white/5 rounded-xl" style={{ opacity: isHovering ? 1 : 0 }} />
            {children}
        </div>
    );
};

const SkillBadge = ({ name, color, icon: Icon }) => {
    const colors = { blue: '#3b82f6', cyan: '#06b6d4', green: '#22c55e', yellow: '#eab308', orange: '#f97316', red: '#ef4444', purple: '#a855f7', pink: '#ec4899', gray: '#6b7280' };
    const c = colors[color] || '#3b82f6';
    return (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 hover:bg-white/10 transition-all group cursor-default backdrop-blur-sm hover:scale-105 duration-300"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = c; e.currentTarget.style.boxShadow = `0 0 15px ${c}60`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}>
            {Icon && <Icon size={14} className={color === 'yellow' ? 'text-yellow-400' : 'text-white/80'} />}
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c, boxShadow: `0 0 8px ${c}80` }}></div>
            <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">{name}</span>
        </div>
    );
};

const TechStack = ({ stack }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {stack.map((category, idx) => (
            <TiltCard key={idx} noTilt={true} className="h-full">
                <div className="h-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-pink-500/40 transition-colors shadow-lg hover:shadow-pink-500/20 duration-300">
                    <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
                        <div className={`p-2.5 rounded-lg bg-gradient-to-br ${category.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}><category.icon size={20} /></div>
                        <div>
                            <h3 className="font-bold text-gray-100 text-sm tracking-wide">{category.title}</h3>
                            <p className="text-xs text-gray-400 mt-1">{category.subtitle}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">{category.skills.map((skill, sIdx) => <SkillBadge key={sIdx} name={skill.name} color={skill.color} icon={skill.icon} />)}</div>
                </div>
            </TiltCard>
        ))}
    </div>
);

const ProjectCarousel = ({ projects }) => {
    const [idx, setIdx] = useState(0);
    const [touch, setTouch] = useState({ start: 0, end: 0 });
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const i = setInterval(() => setIdx(p => (p + 1) % projects.length), 5000);
        return () => clearInterval(i);
    }, [projects.length, isPaused]);

    return (
        <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md shadow-xl hover:shadow-pink-500/20 transition-all duration-300"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={e => setTouch({ ...touch, start: e.targetTouches[0].clientX })}
            onTouchMove={e => setTouch({ ...touch, end: e.targetTouches[0].clientX })}
            onTouchEnd={() => {
                if (touch.start - touch.end > 75) setIdx((idx + 1) % projects.length);
                if (touch.start - touch.end < -75) setIdx((idx - 1 + projects.length) % projects.length);
            }}>
            <div className="relative h-56 sm:h-64 md:h-80 lg:h-96 group">
                <img src={projects[idx].image} alt={projects[idx].title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-pink-400 text-[10px] sm:text-xs font-mono tracking-widest uppercase border border-pink-500/50 px-2 py-0.5 rounded bg-pink-500/10 backdrop-blur-sm">Proyecto 0{idx + 1}</span>
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-cyan-400 text-[10px] uppercase font-bold ml-1">En Activo</span>
                        </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-1 sm:mb-2 leading-tight uppercase italic">{projects[idx].title}</h3>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base mb-3 sm:mb-6 max-w-lg line-clamp-2 sm:line-clamp-none">{projects[idx].desc}</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-4">{projects[idx].tags.map(tag => <span key={tag} className="text-[8px] sm:text-[10px] uppercase font-bold px-2 sm:px-3 py-1 bg-white/10 text-white rounded border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors">{tag}</span>)}</div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Desarrollado con {projects[idx].tools}</span>
                        <a href={projects[idx].link} target="_blank" rel="noopener noreferrer" className="text-pink-400 text-xs hover:text-pink-300 transition-colors flex items-center gap-1">
                            Ver más <Sparkles size={12} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full border border-white/10">
                {projects.map((_, i) => (
                    <button key={i} onClick={() => setIdx(i)} className="group p-1">
                        <span className={`block rounded-full transition-all duration-300 ${i === idx ? 'bg-pink-500 w-2.5 h-2.5 shadow-[0_0_10px_#ec4899]' : 'bg-white/30 w-2 h-2 group-hover:bg-white/50'}`} />
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- DATA MEJORADA ---
const PORTFOLIO_DATA = {
    profile: {
        name: "Tais",
        handle: "@TaisDev.",
        role: "Administradora de Empresas",
        subRole: "Gestión • Anime • Eficiencia",
        avatar: "/profiles.png",
        bio: "¡Konnichiwa! Soy Tais, una profesional apasionada por la gestión empresarial y la cultura japonesa. Como administradora, me especializo en optimizar procesos y liderar equipos con metodologías ágiles inspiradas en la disciplina samurái. Mi enfoque combina análisis de datos con creatividad estratégica, buscando siempre la mejora continua y resultados tangibles. En mi tiempo libre, disfruto del anime, cuido de mis dos gatos (Mochi y Sushi), y exploro nuevas formas de fusionar la eficiencia empresarial con la estética y filosofía oriental.",
        vision: "Mi visión es transformar organizaciones mediante estrategias innovadoras que equilibren productividad y bienestar, creando ambientes de trabajo donde cada miembro pueda desarrollar su máximo potencial mientras disfruta del proceso.",
        cvLink: "#"
    },
    socials: [
        { icon: Github, link: "https://github.com/TaisDev", label: "GitHub", desc: "Proyectos y código" },
        { icon: Linkedin, link: "https://linkedin.com/in/TaisDev", label: "LinkedIn", desc: "Red profesional" },
        { icon: Instagram, link: "https://instagram.com/TaisDev", label: "Instagram", desc: "Vida cotidiana" },
        { icon: Mail, link: "mailto:TaisDev@gmail.com", label: "Email", desc: "Contacto directo" }
    ],
    stats: [
        { value: "3+", label: "Años de Experiencia", desc: "En gestión y optimización", color: "text-pink-500" },
        { value: "25+", label: "Proyectos Completados", desc: "Con éxito documentado", color: "text-purple-500" },
        { value: "98%", label: "Satisfacción Clientes", desc: "Tasa de retención", color: "text-cyan-500" },
        { value: "15K+", label: "Horas de Estudio", desc: "Anime y manga incluidos", color: "text-yellow-500" }
    ],
    stack: [
        {
            title: "Gestión & Estrategia",
            subtitle: "Core Business Skills",
            icon: Layout,
            gradient: "from-pink-500 to-purple-600",
            skills: [
                { name: "Planificación Estratégica", color: "purple", icon: Target },
                { name: "Gestión de Proyectos", color: "pink", icon: TrendingUp },
                { name: "Análisis de Datos", color: "blue", icon: Layers },
                { name: "Mejora de Procesos", color: "green", icon: Zap },
                { name: "Liderazgo de Equipos", color: "cyan", icon: Users },
                { name: "Control Presupuestario", color: "orange", icon: BookOpen }
            ]
        },
        {
            title: "Herramientas de Oficina",
            subtitle: "Tech Stack Profesional",
            icon: Server,
            gradient: "from-cyan-500 to-blue-600",
            skills: [
                { name: "Microsoft Office Suite", color: "blue", icon: null },
                { name: "Google Workspace", color: "green", icon: null },
                { name: "Trello & Asana", color: "cyan", icon: null },
                { name: "Power BI / Tableau", color: "yellow", icon: null },
                { name: "SAP Básico", color: "purple", icon: null },
                { name: "CRM Systems", color: "pink", icon: null }
            ]
        },
        {
            title: "Intereses & Pasiones",
            subtitle: "Beyond Business",
            icon: Heart,
            gradient: "from-red-500 to-orange-500",
            skills: [
                { name: "Anime & Manga", color: "red", icon: null },
                { name: "Cuidado de Gatos", color: "yellow", icon: null },
                { name: "Cultura Japonesa", color: "pink", icon: null },
                { name: "Cine Asiático", color: "purple", icon: null },
                { name: "Videojuegos", color: "blue", icon: Gamepad2 },
                { name: "Música Lo-Fi", color: "cyan", icon: Music }
            ]
        },
        {
            title: "Creatividad & Diseño",
            subtitle: "Visual Communication",
            icon: Palette,
            gradient: "from-yellow-400 to-orange-500",
            skills: [
                { name: "Canva Pro", color: "yellow", icon: null },
                { name: "Figma (UI/UX)", color: "orange", icon: null },
                { name: "Adobe Creative", color: "red", icon: null },
                { name: "Edición de Video", color: "purple", icon: null },
                { name: "Presentaciones", color: "pink", icon: null },
                { name: "Branding Visual", color: "cyan", icon: null }
            ]
        }
    ],
    projects: [
        {
            title: "Optimización Retail",
            desc: "Rediseño completo de flujos de trabajo logrando reducción del 15% en costos operativos y aumento del 25% en eficiencia mediante implementación de metodologías lean y análisis de datos predictivos.",
            image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80",
            tags: ["Gestión", "Retail", "Lean", "Análisis"],
            tools: "Excel, Power BI, Trello",
            link: "#"
        },
        {
            title: "Control Financiero v2.0",
            desc: "Desarrollo de sistema financiero personalizado con dashboards interactivos que proporcionan visibilidad en tiempo real de recursos, automatización de reportes y alertas proactivas de presupuesto.",
            image: "https://images.unsplash.com/photo-1554224155-9ffd4cd95525?w=800&q=80",
            tags: ["Finanzas", "Excel", "Automation", "Dashboard"],
            tools: "Excel Macros, Google Sheets, Apps Script",
            link: "#"
        },
        {
            title: "Anime Community Hub",
            desc: "Gestión y crecimiento de comunidad online para fans del anime, implementando estrategias de engagement, moderación de contenido y creación de eventos virtuales que aumentaron la participación en un 40%.",
            image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80",
            tags: ["Anime", "Community", "Social Media", "Eventos"],
            tools: "Discord, Canva, Instagram",
            link: "#"
        }
    ],
    hobbies: [
        { icon: BookOpen, title: "Estudio Continuo", desc: "Siempre aprendiendo sobre nuevas metodologías y culturas" },
        { icon: Coffee, title: "Café & Creatividad", desc: "Encuentro inspiración en cada taza" },
        { icon: Heart, title: "Bienestar Animal", desc: "Voluntaria en rescate de gatitos" },
        { icon: Music, title: "Producción Musical", desc: "Creando beats lo-fi para concentrarse" }
    ]
};

/**
 * 6. APP PRINCIPAL
 */
export default function App() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="min-h-screen text-gray-100 font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden relative">

            {/* FONDO GALAXY FIJO Y OSCURO */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, backgroundColor: '#05010a' }}>
                <Galaxy
                    mouseRepulsion={true}
                    mouseInteraction={true}
                    density={1.5}
                    glowIntensity={0.5}
                    saturation={0.8}
                    hueShift={240}
                />
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
                {/* Decoración Flotante Mejorada */}
                <div className="fixed top-10 right-10 opacity-30 animate-pulse z-0 pointer-events-none"><Star size={28} className="text-pink-400" /></div>
                <div className="fixed top-32 left-8 opacity-20 animate-pulse delay-1000 z-0 pointer-events-none"><Sparkles size={32} className="text-cyan-400" /></div>
                <div className="fixed bottom-20 right-16 opacity-25 animate-pulse delay-500 z-0 pointer-events-none"><Sparkles size={24} className="text-purple-400" /></div>

                {/* HERO SECTION MEJORADA */}
                <section className="w-full mb-8 sm:mb-12 animate-fade-in">
                    <TiltCard>
                        <div className="bg-gradient-to-br from-black/50 via-[#0d0416]/80 to-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-8 relative overflow-hidden group shadow-2xl hover:shadow-pink-500/20 transition-all duration-500">
                            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 mb-8 relative z-10">
                                {/* Avatar con Mejores Efectos */}
                                <div className="relative flex-shrink-0 group/avatar">
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full blur-xl opacity-30 group-hover/avatar:opacity-50 transition-opacity duration-500 animate-pulse"></div>
                                    <div className="relative p-1.5 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full animate-spin-slow">
                                        <img src={PORTFOLIO_DATA.profile.avatar} alt="Avatar" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover bg-gray-900 border-4 border-black/50" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white/20 shadow-xl backdrop-blur-sm">
                                        Nivel 25 ⭐
                                    </div>
                                </div>

                                {/* Información Principal */}
                                <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-grow">
                                    <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 animate-gradient">
                                            {PORTFOLIO_DATA.profile.name}
                                        </span>
                                        <span className="text-sm font-mono text-gray-500 border border-gray-700 px-2 py-0.5 rounded ml-3 opacity-70 align-middle">タイス</span>
                                    </h1>
                                    <p className="text-cyan-400 font-mono text-sm sm:text-base mb-3 tracking-wide flex items-center gap-2">
                                        {PORTFOLIO_DATA.profile.handle}
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    </p>
                                    <p className="text-lg text-gray-200 font-semibold mb-2">{PORTFOLIO_DATA.profile.role}</p>
                                    <p className="text-sm sm:text-base text-pink-300/80 mb-6">{PORTFOLIO_DATA.profile.subRole}</p>

                                    {/* Social Links Mejorados */}
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        {PORTFOLIO_DATA.socials.map((social, idx) => (
                                            <a key={idx} href={social.link} target="_blank" rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-pink-600/30 hover:to-purple-600/30 p-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/30 border border-transparent hover:border-pink-500/50 group/social"
                                                title={social.desc}>
                                                <social.icon size={22} />
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA Button Mejorado */}
                                <div className="flex-shrink-0 mt-6 lg:mt-0">
                                    <a href={PORTFOLIO_DATA.profile.cvLink}
                                        className="relative group overflow-hidden flex items-center gap-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-pink-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:shadow-[0_0_50px_rgba(236,72,153,0.7)] hover:scale-105 active:scale-95">
                                        <span className="relative z-10 flex items-center gap-2">
                                            <Download size={20} className="group-hover:animate-bounce" />
                                            Descargar CV
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </a>
                                </div>
                            </div>

                            {/* Stats Bar Mejorada */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-white/10">
                                {PORTFOLIO_DATA.stats.map((stat, idx) => (
                                    <div key={idx} className="group/stat text-center cursor-default transform hover:scale-105 transition-all duration-300">
                                        <p className={`text-3xl sm:text-4xl font-black ${stat.color} group-hover/stat:animate-pulse`}>
                                            {stat.value}
                                        </p>
                                        <p className="text-xs uppercase tracking-widest text-gray-400 mt-2 group-hover/stat:text-gray-300 transition-colors">
                                            {stat.label}
                                        </p>
                                        <p className="text-[10px] text-gray-500 mt-1 opacity-0 group-hover/stat:opacity-100 transition-opacity">
                                            {stat.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TiltCard>
                </section>

                {/* ABOUT SECTION MEJORADA */}
                <section className="w-full mb-12 relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-cyan-500 rounded-full"></div>
                    <div className="bg-gradient-to-br from-black/30 via-[#1a0b2e]/50 to-black/30 backdrop-blur-xl pl-8 py-6 border-l-4 border-pink-500/50 rounded-r-2xl hover:border-pink-500 transition-all duration-500 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
                                <Bot size={24} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                Sobre Mí
                                <span className="text-sm text-pink-500 font-normal opacity-70">自己紹介</span>
                            </h2>
                        </div>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-3xl mb-4">
                            {PORTFOLIO_DATA.profile.bio}
                        </p>
                        <div className="bg-black/30 p-4 rounded-lg border-l-4 border-cyan-500/50 mt-4">
                            <p className="text-sm text-gray-200 italic">
                                {PORTFOLIO_DATA.profile.vision}
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- SECCIÓN BOUNCE CARDS MEJORADA --- */}
                <section className="w-full mb-16">
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-pink-500"></div>
                        <div className="flex items-center gap-3 bg-gradient-to-r from-black/40 to-[#1a0b2e]/50 backdrop-blur-xl border border-pink-500/30 rounded-full px-6 py-3 shadow-xl">
                            <Sparkles size={20} className="text-yellow-400" />
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                                Inspiración & Pasiones
                            </h2>
                        </div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500"></div>
                    </div>

                    <div className="relative w-full flex justify-center py-6">
                        <BounceCards
                            className="custom-bounceCards cursor-pointer"
                            images={bounceImages}
                            containerWidth={500}
                            containerHeight={isMobile ? 200 : 280}
                            animationDelay={1}
                            animationStagger={0.08}
                            easeType="elastic.out(1, 0.5)"
                            transformStyles={isMobile ? transformStylesMobile : transformStylesDesktop}
                            enableHover={true}
                        />
                    </div>

                    {/* Hobbies Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                        {PORTFOLIO_DATA.hobbies.map((hobby, idx) => (
                            <TiltCard key={idx} noTilt={true}>
                                <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-pink-500/30 transition-colors duration-300 group">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 group-hover:from-pink-500/40 group-hover:to-purple-500/40">
                                            <hobby.icon size={18} className="text-pink-400" />
                                        </div>
                                        <h3 className="font-bold text-gray-100 text-sm">{hobby.title}</h3>
                                    </div>
                                    <p className="text-xs text-gray-400">{hobby.desc}</p>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                </section>

                {/* STACK SECTION MEJORADA */}
                <section className="w-full mb-16">
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500"></div>
                        <div className="flex items-center gap-3 bg-gradient-to-r from-black/40 to-[#1a0b2e]/50 backdrop-blur-xl border border-cyan-500/30 rounded-full px-6 py-3 shadow-xl">
                            <Zap size={20} className="text-yellow-400" />
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                                Habilidades & Experiencia
                            </h2>
                        </div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-blue-500"></div>
                    </div>
                    <TechStack stack={PORTFOLIO_DATA.stack} />
                </section>

                {/* PROJECTS SECTION MEJORADA */}
                <section className="w-full mb-16">
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500"></div>
                        <div className="flex items-center gap-3 bg-gradient-to-r from-black/40 to-[#1a0b2e]/50 backdrop-blur-xl border border-purple-500/30 rounded-full px-6 py-3 shadow-xl">
                            <Layers size={20} className="text-pink-500" />
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                                Proyectos Destacados
                            </h2>
                            <span className="px-3 py-1 rounded-full bg-pink-500 text-xs font-bold text-black uppercase">
                                TOP TIER
                            </span>
                        </div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500"></div>
                    </div>
                    <TiltCard>
                        <ProjectCarousel projects={PORTFOLIO_DATA.projects} />
                    </TiltCard>
                </section>

                {/* CONTACT SECTION MEJORADA */}
                <section className="w-full mb-16">
                    <TiltCard>
                        <div className="relative bg-gradient-to-br from-[#180629] via-[#1a0b2e] to-black border-2 border-pink-500/40 rounded-3xl p-10 md:p-16 overflow-hidden text-center group shadow-2xl hover:shadow-pink-500/40 transition-all duration-500">
                            {/* Animated Background Circles */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl -mr-48 -mt-48 group-hover:bg-pink-600/30 transition-all duration-700 animate-pulse" style={{ animationDuration: '4s' }} />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -ml-48 -mb-48 group-hover:bg-purple-600/30 transition-all duration-700 animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }} />

                            <div className="relative z-10">
                                <div className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 text-white mb-6 shadow-2xl animate-bounce-slow group-hover:animate-pulse">
                                    <Mail size={32} />
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
                                    ¿Listo para Colaborar?
                                </h2>
                                <p className="text-gray-300 text-base md:text-lg mb-10 max-w-2xl mx-auto">
                                    Estoy siempre abierta a nuevas oportunidades y proyectos desafiantes. Si buscas a alguien que combine eficiencia empresarial con creatividad y pasión, ¡hablemos!
                                </p>

                                <a href="https://wa.me/51907752531"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-4 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-110 active:scale-95 shadow-[0_0_40px_rgba(236,72,153,0.5)] hover:shadow-[0_0_60px_rgba(236,72,153,0.8)] group/cta">
                                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="group-hover/cta:rotate-12 transition-transform">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Iniciar Conversación
                                    <Sparkles size={20} className="animate-pulse" />
                                </a>
                            </div>
                        </div>
                    </TiltCard>
                </section>

                {/* FOOTER MEJORADO */}
                <footer className="w-full border-t-2 border-white/10 pt-10 mt-10 text-center relative">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />

                    <div className="mb-6 flex items-center justify-center gap-3">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-pink-500" />
                        <Star size={16} className="text-pink-500 animate-spin-slow" />
                        <p className="text-sm md:text-base text-gray-400 italic px-4">
                            "La excelencia no es un destino, es un viaje continuo"
                        </p>
                        <Star size={16} className="text-purple-500 animate-spin-slow" />
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500" />
                    </div>

                    <div className="mb-6">
                        <p className="font-black text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 tracking-widest mb-2">
                            TAIS DEV © 2025
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">
                            Crafted with React, Tailwind & <span className="text-pink-500 font-bold">Pasión</span> 💖
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>Todos los sistemas operativos</span>
                    </div>
                </footer>
            </main>

            {/* Custom Styles Mejorados */}
            <style>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
}