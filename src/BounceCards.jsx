import { gsap } from 'gsap';
import { useEffect } from 'react';

export default function BounceCards({
    className = '',
    images = [],
    containerWidth = 500,
    containerHeight = 250,
    animationDelay = 0.5,
    animationStagger = 0.06,
    easeType = 'elastic.out(1, 0.8)',
    transformStyles = [], // Lo recibiremos desde App.jsx
    enableHover = true
}) {
    useEffect(() => {
        gsap.fromTo(
            '.card',
            { scale: 0 },
            {
                scale: 1,
                stagger: animationStagger,
                ease: easeType,
                delay: animationDelay
            }
        );
    }, [animationStagger, easeType, animationDelay]);

    const getNoRotationTransform = transformStr => {
        const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
        if (hasRotate) return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
        return transformStr === 'none' ? 'rotate(0deg)' : `${transformStr} rotate(0deg)`;
    };

    const getPushedTransform = (baseTransform, offsetX) => {
        const translateRegex = /translate\(([-0-9.]+)px\)/;
        const match = baseTransform.match(translateRegex);
        if (match) {
            const currentX = parseFloat(match[1]);
            const newX = currentX + offsetX;
            return baseTransform.replace(translateRegex, `translate(${newX}px)`);
        } else {
            return baseTransform === 'none' ? `translate(${offsetX}px)` : `${baseTransform} translate(${offsetX}px)`;
        }
    };

    const pushSiblings = hoveredIdx => {
        if (!enableHover) return;
        images.forEach((_, i) => {
            gsap.killTweensOf(`.card-${i}`);
            const baseTransform = transformStyles[i] || 'none';

            if (i === hoveredIdx) {
                const noRotationTransform = getNoRotationTransform(baseTransform);
                gsap.to(`.card-${i}`, {
                    transform: noRotationTransform,
                    duration: 0.4,
                    ease: 'back.out(1.4)',
                    overwrite: 'auto',
                    zIndex: 10,
                    scale: 1.1
                });
            } else {
                // REDUJE EL OFFSET PARA MÓVILES (Detección simple por ancho de carta)
                // Si la pantalla es pequeña, el empuje es menor
                const isMobile = window.innerWidth < 640;
                const pushDistance = isMobile ? 80 : 160;

                const offsetX = i < hoveredIdx ? -pushDistance : pushDistance;
                const pushedTransform = getPushedTransform(baseTransform, offsetX);
                const distance = Math.abs(hoveredIdx - i);
                const delay = distance * 0.05;

                gsap.to(`.card-${i}`, {
                    transform: pushedTransform,
                    duration: 0.4,
                    ease: 'back.out(1.4)',
                    delay,
                    overwrite: 'auto',
                    zIndex: 1,
                    scale: 1
                });
            }
        });
    };

    const resetSiblings = () => {
        if (!enableHover) return;
        images.forEach((_, i) => {
            gsap.killTweensOf(`.card-${i}`);
            const baseTransform = transformStyles[i] || 'none';
            gsap.to(`.card-${i}`, {
                transform: baseTransform,
                duration: 0.4,
                ease: 'back.out(1.4)',
                overwrite: 'auto',
                zIndex: 1,
                scale: 1
            });
        });
    };

    return (
        <div
            className={`bounceCardsContainer ${className}`}
            style={{
                // En móvil usamos 100% para que no se salga, en desktop usamos el prop
                width: '100%',
                maxWidth: containerWidth,
                height: containerHeight,
            }}
        >
            {images.map((src, idx) => (
                <div
                    key={idx}
                    className={`card card-${idx}`}
                    style={{
                        transform: transformStyles[idx] ?? 'none'
                    }}
                    onMouseEnter={() => pushSiblings(idx)}
                    onMouseLeave={resetSiblings}
                >
                    <img className="image" src={src} alt={`card-${idx}`} />
                </div>
            ))}

            <style>{`
                .bounceCardsContainer {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0 auto;
                }

                .card {
                    position: absolute;
                    /* TAMAÑO DESKTOP */
                    width: 200px;
                    aspect-ratio: 1;
                    border: 4px solid white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                    top: 0; bottom: 0; left: 0; right: 0;
                    margin: auto;
                    transition: width 0.3s ease; /* Transición suave al cambiar tamaño */
                }

                .card .image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    pointer-events: none;
                }

                /* MEDIA QUERY PARA MÓVILES */
                @media (max-width: 640px) {
                    .card {
                        /* TAMAÑO MÓVIL (Más pequeño) */
                        width: 120px; 
                        border-width: 2px;
                        border-radius: 12px;
                    }
                    /* Ajustamos la altura del contenedor si es necesario */
                    .bounceCardsContainer {
                        height: 180px !important; 
                    }
                }
            `}</style>
        </div>
    );
}