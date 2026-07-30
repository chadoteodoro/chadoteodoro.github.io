window.TEODORO_CONFIG = {
  eventDate: "2026-10-17T15:00:00-03:00",
  eventStartLabel: "17 de outubro de 2026 às 15h",
  address: "Rua Dr. Bolívar, 384",

  // Coloque o número do responsável com DDI + DDD, apenas dígitos.
  // Exemplo: "5511999999999"
  whatsappNumber: "",

  whatsappMessage(name, count) {
    const people = count === 1 ? "irei sozinho(a)" : `iremos em ${count} pessoas`;
    return `Oi! 💚 Com muito carinho, confirmo minha presença no Chá de Bebê do Teodoro! 🐥✨ Meu nome é ${name} e ${people}. Estamos muito felizes por participar desse momento tão especial!`;
  }
};
