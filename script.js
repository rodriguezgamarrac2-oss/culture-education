// ==================================================
// CULTURE & EDUCATION
// CATÁLOGO DINÁMICO: CORTES + SEMINARIOS
// ==================================================


// ==================================================
// 1. CONFIGURACIÓN
// ==================================================

const GOOGLE_SHEETS_API_URL =
  "https://script.google.com/macros/s/AKfycbyIXUADe-sKLQ31nOEe1FnRPtC-pH2KSofCCF2Ad-63L0JpUXkIlKRSQwPahzpdvTUe/exec";

// WHATSAPP PRINCIPAL DE LA ACADEMIA

const WHATSAPP_NUMBER = "51935925357";


// ==================================================
// 2. ELEMENTOS HTML
// ==================================================

const cutsGrid =
  document.getElementById("cutsGrid");

const seminarsGrid =
  document.getElementById("seminarsGrid");

const menuToggle =
  document.getElementById("menuToggle");

const mainNav =
  document.getElementById("mainNav");

const yearElement =
  document.getElementById("year");


// ==================================================
// 3. MENÚ PARA CELULARES
// ==================================================

if (menuToggle && mainNav) {

  menuToggle.addEventListener("click", () => {

    const isOpen =
      mainNav.classList.toggle("open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú" : "Abrir menú"
    );

    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';

  });


  // CERRAR MENÚ AL PRESIONAR UN ENLACE

  mainNav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      mainNav.classList.remove("open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      menuToggle.setAttribute(
        "aria-label",
        "Abrir menú"
      );

      menuToggle.innerHTML =
        '<i class="fa-solid fa-bars"></i>';

    });

  });

}


// ==================================================
// 4. MENSAJES DEL CATÁLOGO
// ==================================================

function showMessage(container, message) {

  if (!container) return;

  container.replaceChildren();

  const paragraph =
    document.createElement("p");

  paragraph.className =
    "catalog-status";

  paragraph.textContent =
    message;

  container.appendChild(paragraph);

}


// ==================================================
// 5. VALIDAR IMÁGENES
// ==================================================

function safeImageUrl(value) {

  if (!value) return "";

  try {

    const url =
      new URL(String(value).trim());

    return url.protocol === "https:"
      ? url.href
      : "";

  } catch {

    return "";

  }

}


// ==================================================
// 6. CREAR BOTONES DE WHATSAPP
// ==================================================

function createCardButton(item, type) {

  const link =
    document.createElement("a");

  const nombreTipo =
    type === "SEMINARIO"
      ? "el seminario"
      : "el corte";

  const message =
    `Hola, Culture & Education. Quisiera información sobre ${nombreTipo}: ${item.titulo}.`;

  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  link.href = whatsappURL;

  link.target = "_blank";

  link.rel = "noopener noreferrer";

  link.className = "card-link";


  const label =
    document.createElement("span");

  label.textContent =
    item.texto_boton || "SOLICITAR INFORMACIÓN";


  const arrow =
    document.createElement("span");

  const icon =
    document.createElement("i");

  icon.className =
    "fa-solid fa-arrow-up-right-from-square";

  arrow.appendChild(icon);

  link.append(label, arrow);

  return link;

}


// ==================================================
// 7. CREAR IMAGEN DE TARJETA
// ==================================================

function createCardImage(item, type, number) {

  const imageBox =
    document.createElement("div");

  imageBox.className =
    "card-image";


  const imageUrl =
    safeImageUrl(item.imagen_url);


  if (imageUrl) {

    const image =
      document.createElement("img");

    image.src = imageUrl;

    image.alt =
      `${type === "SEMINARIO" ? "Seminario" : "Corte"}: ${item.titulo || "Barbería"}`;

    image.loading = "lazy";

    image.referrerPolicy =
      "no-referrer";

    image.onerror = () => {

      image.remove();

    };

    imageBox.appendChild(image);

  }


  const label =
    document.createElement("span");

  label.textContent =
    `${type} / ${String(number).padStart(2, "0")}`;

  imageBox.appendChild(label);

  return imageBox;

}


// ==================================================
// 8. CREAR CONTENIDO DE TARJETA
// ==================================================

function createCardContent(item, type) {

  const content =
    document.createElement("div");

  content.className =
    "card-content";


  // ETIQUETA

  const tag =
    document.createElement("p");

  tag.className =
    "card-tag";

  tag.textContent =
    item.etiqueta ||
    (type === "SEMINARIO"
      ? "FORMACIÓN BARBER"
      : "ESTILO BARBER");


  // TÍTULO

  const title =
    document.createElement("h3");

  title.textContent =
    item.titulo || "Sin título";


  // DESCRIPCIÓN

  const description =
    document.createElement("p");

  description.className =
    "card-description";

  description.textContent =
    item.descripcion ||
    "Solicita más información sobre este contenido.";


  content.append(
    tag,
    title,
    description
  );


  // INFORMACIÓN ADICIONAL

  if (item.detalle) {

    const detail =
      document.createElement("p");

    detail.className =
      "card-detail";

    detail.textContent =
      item.detalle;

    content.appendChild(detail);

  }


  // BOTÓN

  content.appendChild(
    createCardButton(item, type)
  );

  return content;

}


// ==================================================
// 9. TARJETAS DE CORTES
// ==================================================

function createCutCard(item, index) {

  const card =
    document.createElement("article");

  card.className =
    "catalog-card cut-card";

  card.appendChild(
    createCardImage(item, "CORTE", index + 1)
  );

  card.appendChild(
    createCardContent(item, "CORTE")
  );

  return card;

}


// ==================================================
// 10. TARJETAS DE SEMINARIOS
// DISEÑO HORIZONTAL
// ==================================================

function createSeminarCard(item, index) {

  const card =
    document.createElement("article");

  card.className =
    "catalog-card seminar-card";

  card.appendChild(
    createCardImage(item, "SEMINARIO", index + 1)
  );

  card.appendChild(
    createCardContent(item, "SEMINARIO")
  );

  return card;

}


// ==================================================
// 11. MOSTRAR LOS DOS CATÁLOGOS
// ==================================================

function renderCatalog(data) {

  // VALIDAR RESPUESTA

  if (
    !data ||
    data.ok !== true ||
    !Array.isArray(data.cortes) ||
    !Array.isArray(data.seminarios)
  ) {

    console.error(
      "Respuesta inesperada de Google Sheets:",
      data
    );

    showMessage(
      cutsGrid,
      "No se pudo leer la hoja Cortes. Revisa los encabezados y Apps Script."
    );

    showMessage(
      seminarsGrid,
      "No se pudo leer la hoja Seminarios. Revisa los encabezados y Apps Script."
    );

    return;

  }


  // ======================================
  // MOSTRAR TODOS LOS CORTES
  // ======================================

  cutsGrid.replaceChildren();

  if (data.cortes.length === 0) {

    showMessage(
      cutsGrid,
      "Todavía no hay cortes publicados. Agrega filas activas en la hoja Cortes."
    );

  } else {

    data.cortes.forEach((item, index) => {

      cutsGrid.appendChild(
        createCutCard(item, index)
      );

    });

  }


  // ======================================
  // MOSTRAR TODOS LOS SEMINARIOS
  // ======================================

  seminarsGrid.replaceChildren();

  if (data.seminarios.length === 0) {

    showMessage(
      seminarsGrid,
      "Todavía no hay seminarios publicados. Agrega filas activas en la hoja Seminarios."
    );

  } else {

    data.seminarios.forEach((item, index) => {

      seminarsGrid.appendChild(
        createSeminarCard(item, index)
      );

    });

  }

}


// ==================================================
// 12. CONECTAR CON GOOGLE SHEETS
// MEDIANTE JSONP
// ==================================================

function loadCatalog() {

  showMessage(
    cutsGrid,
    "Cargando cortes..."
  );

  showMessage(
    seminarsGrid,
    "Cargando seminarios..."
  );


  const callbackName =
    `cultureEducation_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

  const separator =
    GOOGLE_SHEETS_API_URL.includes("?")
      ? "&"
      : "?";


  const requestScript =
    document.createElement("script");

  let completed = false;


  // RECIBIR INFORMACIÓN

  window[callbackName] = (data) => {

    completed = true;

    try {

      renderCatalog(data);

    } catch (error) {

      console.error(
        "Error al mostrar los catálogos:",
        error
      );

      showMessage(
        cutsGrid,
        "Ocurrió un error al mostrar los cortes."
      );

      showMessage(
        seminarsGrid,
        "Ocurrió un error al mostrar los seminarios."
      );

    } finally {

      delete window[callbackName];

      requestScript.remove();

    }

  };


  // ERROR DE CONEXIÓN

  requestScript.onerror = () => {

    if (completed) return;

    delete window[callbackName];

    requestScript.remove();

    showMessage(
      cutsGrid,
      "No se pudo conectar con Google Sheets. Verifica Apps Script."
    );

    showMessage(
      seminarsGrid,
      "No se pudo conectar con Google Sheets. Verifica Apps Script."
    );

  };


  // SOLICITAR DATOS

  requestScript.src =
    `${GOOGLE_SHEETS_API_URL}${separator}prefix=${encodeURIComponent(callbackName)}&v=${Date.now()}`;

  document.head.appendChild(requestScript);

}


// ==================================================
// 13. AÑO AUTOMÁTICO
// ==================================================

if (yearElement) {

  yearElement.textContent =
    new Date().getFullYear();

}


// ==================================================
// 14. INICIAR CATÁLOGOS
// ==================================================

loadCatalog();


// ==================================================
// FIN DEL JAVASCRIPT
// CULTURE & EDUCATION
// ==================================================