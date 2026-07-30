window.TEODORO_CONFIG = {
  eventDate: "2026-10-17T15:00:00-03:00",
  eventStartLabel: "17 de outubro de 2026 às 15h",
  address: "R. Dr. Bolívar, 382 - Ponto Chic, Nova Iguaçu - RJ, 26030-480",

  // Coloque o número do responsável com DDI + DDD, apenas dígitos.
  // Exemplo: "5511999999999"
  whatsappNumber: "5521984172980",

  whatsappMessage(name, count) {
    const people = count === 1 ? "irei sozinho(a)" : `iremos em ${count} pessoas`;
    return `Olá! Com muita alegria, venho confirmar minha presença no Chá de Bebê do Teodoro. Meu nome é ${name} e ${people}. Agradeço pelo convite e será um prazer celebrar esse momento tão especial com vocês!`;
  }
};
