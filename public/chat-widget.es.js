var a = Object.defineProperty;
var o = (i, t, s) => t in i ? a(i, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : i[t] = s;
var e = (i, t, s) => o(i, typeof t != "symbol" ? t + "" : t, s);
class h {
  // Imagen para el estado abierto
  constructor() {
    e(this, "isOpen", !1);
    e(this, "container");
    e(this, "iframe");
    e(this, "button");
    e(this, "floatingText");
    e(this, "openImgSrc", "https://valeia.vercel.app/valeia_avatar_2_copia.png");
    // Imagen para el estado cerrado
    e(this, "closeImgSrc", "https://cdn-icons-png.flaticon.com/512/8695/8695043.png");
    this.container = document.createElement("div"), this.iframe = document.createElement("iframe"), this.button = document.createElement("button"), this.floatingText = document.createElement("div"), this.initializeElements(), this.attachEventListeners(), this.initializeStyles(), this.render();
  }
  initializeStyles() {
    this.iframe.style.width = "400px", this.iframe.style.height = "600px", this.iframe.style.right = "30px", this.iframe.style.bottom = "100px", this.floatingText.innerText = "¡Hola! ¿como puedo ayudarte?", this.floatingText.style.position = "absolute", this.floatingText.style.width = "300px", this.floatingText.style.textAlign = "center", this.floatingText.style.top = "10px", this.floatingText.style.right = "80px", this.floatingText.style.backgroundColor = "#3dc2eb", this.floatingText.style.color = "white", this.floatingText.style.padding = "5px", this.floatingText.style.borderRadius = "5px", this.floatingText.style.animation = "wave 2s ease-in-out infinite", this.floatingText.style.display = "inline-block";
    const t = document.styleSheets[0];
    t.insertRule(`
            @keyframes wave {
                0%, 100% {
                    transform: translateY(0);
                    transform: translateX(0);
                }
                50% {
                    transform: translateY(10px);
                    transform: translateX(10px);
                }
            }
        `, t.cssRules.length);
  }
  initializeElements() {
    this.container.style.cssText = `
            position: fixed;
            z-index: 1000;
            bottom: 30px;
            right: 30px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        `, this.iframe.src = "https://chat-ui-development.vercel.app/chat?id=asst_59IBJrdabvs9D5KlIu2zGp1c", this.iframe.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 0;
            height: 0;
            opacity: 0;
            display: none;
            transition: all 0.3s ease-in-out;
            overflow: hidden;
        `, this.button.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            height: 55px;
            width: 55px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: none;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            padding: 0;
        `, this.updateButtonImage();
  }
  attachEventListeners() {
    this.button.addEventListener("click", this.handleClick.bind(this)), this.button.addEventListener("mouseover", () => {
      this.button.style.backgroundColor = "white";
    }), this.button.addEventListener("mouseout", () => {
      this.button.style.backgroundColor = "white";
    }), window.addEventListener("resize", this.updateIframeSize.bind(this));
  }
  handleClick() {
    this.isOpen = !this.isOpen, this.updateIframeVisibility(), this.updateButtonImage();
  }
  updateIframeVisibility() {
    this.isOpen ? (this.updateIframeSize(), setTimeout(() => {
      this.iframe.style.opacity = "1", this.iframe.style.display = "block";
    }, 50)) : (this.iframe.style.opacity = "0", this.iframe.style.display = "none", setTimeout(() => {
      this.iframe.style.width = "0", this.iframe.style.height = "0";
    }, 300));
  }
  updateButtonImage() {
    const t = this.isOpen ? this.closeImgSrc : this.openImgSrc;
    this.button.style.backgroundImage = `url('${t}')`, this.button.style.backgroundSize = "cover", this.button.style.backgroundPosition = "center", this.button.style.backgroundRepeat = "no-repeat";
  }
  updateIframeSize() {
    window.innerWidth <= 1200 ? (this.iframe.style.width = "90vw", this.iframe.style.height = "80vh", this.iframe.style.maxWidth = "400px", this.iframe.style.maxHeight = "600px", this.iframe.style.right = "5vw") : (this.iframe.style.width = "400px", this.iframe.style.height = "600px", this.iframe.style.right = "30px"), this.iframe.style.bottom = "100px";
  }
  render() {
    this.container.appendChild(this.iframe), this.container.appendChild(this.button), this.container.appendChild(this.floatingText);
  }
  mount() {
    document.body.appendChild(this.container);
  }
}
function n() {
  new h().mount();
}
window.ChatWidgetConfig = window.ChatWidgetConfig || {};
window.ChatWidgetConfig.autoInit !== !1 && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n());
window.initChatWidget = n;
