export const personaggiConfig = [
  { 
    id: 'volpe', 
    nome: 'Volpe Portafortuna', 
    emoji: '🦊',
    animazioni: {
      idle: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 2 } },
      spin: { rotate: [0, 15, -15, 0], transition: { repeat: Infinity, duration: 0.4 } },
      vittoria: { y: [0, -30, 0], scale: [1, 1.3, 1], transition: { repeat: Infinity, duration: 0.5 } },
      jackpot: { rotate: 360, scale: [1, 1.5, 1], transition: { repeat: Infinity, duration: 0.5 } },
      sconfitta: { y: [0, 10, 0], opacity: [1, 0.5, 1], transition: { duration: 1 } }
    }
  },
  { 
    id: 'coniglio', 
    nome: 'Coniglio Elegante', 
    emoji: '🐰',
    animazioni: {
      idle: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1.5 } },
      spin: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 0.2 } },
      vittoria: { rotate: [0, -20, 20, 0], scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 0.6 } },
      jackpot: { y: [0, -50, 0], scale: [1, 1.5, 1], transition: { repeat: Infinity, duration: 0.4 } },
      sconfitta: { rotate: [0, 90], y: 20, opacity: 0.7, transition: { duration: 0.5 } }
    }
  },
  { 
    id: 'moneta', 
    nome: 'Moneta Sorridente', 
    emoji: '🪙',
    animazioni: {
      idle: { rotateY: [0, 360], transition: { repeat: Infinity, duration: 3, ease: "linear" } },
      spin: { rotateY: [0, 360], transition: { repeat: Infinity, duration: 0.5, ease: "linear" } },
      vittoria: { y: [0, -20, 0], rotateY: [0, 360], scale: [1, 1.4, 1], transition: { repeat: Infinity, duration: 0.8 } },
      jackpot: { scale: [1, 2, 1], rotate: [0, 360], transition: { repeat: Infinity, duration: 0.5 } },
      sconfitta: { scale: [1, 0.8, 1], opacity: 0.5, transition: { duration: 1 } }
    }
  },
];
