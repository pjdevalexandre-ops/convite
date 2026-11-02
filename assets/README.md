# 🎵 Como adicionar a música do Chá Revelação

Para tocar a música escolhida por vocês (Alexandre e Nyara) no convite:

1. Escolha a música desejada (formato `.mp3`).
2. Renomeie o arquivo para:
   ```
   musica.mp3
   ```
3. Salve o arquivo dentro desta pasta (`assets/`).
4. Pronto! O convite começará a reproduzir a música suavemente com fade-in assim que o convidado tocar para abrir o envelope.

---

### Dica importante:
- Se você quiser usar outro nome de arquivo ou outro formato (ex: `.m4a`, `.ogg`), basta abrir o arquivo `script.js` e alterar a linha:
  ```javascript
  musicPath: 'assets/sua-musica.mp3',
  ```
- Se nenhum arquivo de música for colocado, o convite continuará funcionando perfeitamente e o botão de música ficará oculto automaticamente, sem nenhum erro na tela.
