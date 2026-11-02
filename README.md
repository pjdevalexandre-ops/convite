# ✨ Convite Web - Chá Revelação (Alexandre & Nyara)
### Menino ou Menina? • Jorge Tales ou Kiara Maria

Convite web delicado, sofisticado e responsivo desenvolvido com **HTML, CSS e JavaScript puros** (sem frameworks), pronto para publicar no **Netlify** e ser compartilhado pelo **WhatsApp**.

---

## 📱 Estrutura e Destaques

- **Tela de Abertura Interativa:** Envelope animado elegante com selo e efeito 3D suave. Ao tocar, abre o convite e inicia a música de fundo com fade-in.
- **Hero & Ponto Focal:** Um grande `?` com auréola e animações suaves de flutuação, estrelinhas cintilantes e balões nas cores suaves.
- **Música Exclusiva:** Definida apenas pelos pais. O convidado possui apenas um botão flutuante discreto para pausar/retomar a música.
- **Contagem Regressiva:** Atualização em tempo real até **15 de Novembro de 2026 às 12:00**.
- **Equilíbrio Cromático Absoluto:** Rosa (`#E8CFCB`) e Azul (`#CBD8E2`) utilizados em proporções milimetricamente iguais para não dar nenhuma pista do sexo do bebê. O branco é o protagonista da sofisticação.
- **Dê Seu Palpite & Placar da Intuição:** O convidado escolhe se acha que é Menino (Jorge Tales) ou Menina (Kiara Maria), digita seu nome e confirma o voto direto no próprio convite. Uma barrinha de votação bipartida animada atualiza em tempo real a porcentagem e a contagem de palpites da intuição dos convidados, com chuva de confetes e salvamento local.
- **Localização & Calendário:** Botão para abrir no **Google Maps** e botão para baixar o evento direto na agenda (**arquivo `.ics`** compatível com iPhone, Android e Google Calendar).
- **Confirmar Presença (RSVP com Quantidade de Pessoas):** O convidado informa seu nome, seleciona quantas pessoas irão com ele (com controle interativo de `+` e `−`) e pode listar o nome dos acompanhantes. Ao tocar no botão, o WhatsApp abre com o texto completo já preenchido informando o total exato de pessoas para os pais.
- **Efeito Confete:** Chuva de confetes leves e delicados ao abrir o convite, votar e confirmar presença.
- **Acessibilidade:** Respeita `prefers-reduced-motion` para pessoas com sensibilidade a movimentos.

---

## 🚀 Como Publicar no Netlify em 1 Minuto

1. Acesse **[app.netlify.com/drop](https://app.netlify.com/drop)** no seu navegador.
2. Faça login na sua conta do Netlify (ou crie uma gratuita em segundos).
3. Arraste a pasta inteira deste projeto (`jorge ou kiara`) e solte na tela.
4. O Netlify publicará o site instantaneamente e gerará um link público (exemplo: `https://cha-revelacao-jorge-ou-kiara.netlify.app`).
5. Se desejar, você pode alterar o nome do subdomínio gratuitamente nas configurações de site do Netlify (*Site configuration > Change site name*).

---

## 🎵 Música de Fundo Configurada

O arquivo de áudio já está inserido e pronto:
- **Faixa:** `Here Comes The Sun (Remastered 2009) - The Beatles.mp3`
- **Caminho:** `assets/Here Comes The Sun (Remastered 2009) - The Beatles.mp3`
- Ao tocar para abrir o envelope, a música começa com fade-in suave em loop (com volume moderado de 40%) e o botão flutuante permite ao convidado pausar/retomar quando quiser.

---

## ✏️ Como Personalizar os Dados do Evento

Todas as informações editáveis estão concentradas no início do arquivo `script.js` dentro do objeto `CONFIG`:

```javascript
const CONFIG = {
  parents: 'Alexandre & Nyara',
  boyName: 'Jorge Tales',
  girlName: 'Kiara Maria',
  eventDate: '2026-11-15T12:00:00',
  eventDateDisplay: '15 de Novembro de 2026',
  eventTimeDisplay: 'A partir das 12:00',
  venueName: 'Vila Santo Antônio, Km 1',
  venueAddress: 'Ao lado do Restaurante Píer',
  mapsUrl: 'https://www.google.com/maps?q=-1.6303670406341553,-47.48479080200195&z=17&hl=pt-BR',
  whatsappNumber: '5591984829252',
  ...
};
```

Basta alterar os textos conforme necessário.

---

## 📂 Arquivos do Projeto

- `index.html` - Estrutura semântica, metatags Open Graph para o WhatsApp e SVGs ilustrados.
- `style.css` - Estilização completa, variáveis de paleta, tipografia e animações fluidas.
- `script.js` - Objeto de configuração central, lógica do envelope, contagem regressiva, áudio, confetes e geração do `.ics`.
- `assets/` - Pasta destinada ao arquivo `musica.mp3`.
