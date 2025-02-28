// 🎥 Efecto Matrix en los fondos, columna 1 y 12
function createMatrixEffect(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const columns = Math.floor(canvas.width / 14);
    const drops = Array(columns).fill(0);

    function draw() {
        ctx.fillStyle = 'rgba(39, 33, 35, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff00';
        ctx.font = '14px monospace';

        drops.forEach((y, i) => {
            const text = String.fromCharCode(0x30A0 + Math.random() * 96);
            ctx.fillText(text, i * 14, y * 14);
            if (y * 14 > canvas.height || Math.random() > 0.95) drops[i] = 0;
            drops[i]++;
        });
    }

    setInterval(draw, 50);
}

createMatrixEffect('matrixCanvas');
createMatrixEffect('matrixCanvasRight');



// Efecto solo para que aparezca en plan consola escribiendo poco a poco
//  Efecto máquina de escribir
function typeWriterEffect(element, text, speed, callback) {
    let index = 0;

    // Evitar que el texto se duplique al vaciarlo incorrectamente
    if (element.dataset.typed === "true") return;
    element.dataset.typed = "true"; // Evita que se repita la animación en el mismo elemento

    element.innerHTML = ""; // Vacía el contenido antes de empezar

    function write() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(write, speed);
        } else if (callback) {
            callback(); // Llamamos a la siguiente acción si existe
        }
    }

    write();
}




let isLoggedIn = false;

function navigateTo(section) {
    if (!section) {
        console.warn("⚠️ Se intentó navegar a una sección vacía.");
        return;
    }

    if (!isLoggedIn && section !== "login") {
        console.warn(`⛔ Acceso denegado a ${section} porque el usuario no está logeado.`);
        return;
    }

    console.log(`🔄 Navegando a: ${section}`);
    history.pushState({ page: section }, "", `#${section}`);
    updateView(section);
}



function updateView(section) {
    console.log(`updateView() llamado con sección: ${section}`);

    // Si la sección no existe en el DOM, la creamos dinámicamente
    if (!document.getElementById(section)) {
        console.warn(`⚠️ Se esperaba la sección #${section} pero no existe. Creándola...`);

        let newSection = document.createElement("div");
        newSection.id = section;
        newSection.classList.add("view-section");
        newSection.style.display = "none";

        newSection.innerHTML = `<h2>${section.toUpperCase()}</h2>`;

        document.body.appendChild(newSection);
        console.log(`✅ Se ha creado dinámicamente la sección #${section}`);
    }

    // Redirigir entre login y loged según el estado del usuario
    if (section === "loged" && !isLoggedIn) {
        console.warn("⚠️ Usuario no logeado intentó acceder a loged. Redirigiendo a login.");
        section = "login";
    } else if (section === "login" && isLoggedIn) {
        console.warn("⚠️ Usuario ya logeado intentó acceder a login. Redirigiendo a loged.");
        section = "loged";
    }

    // Ocultar todas las secciones antes de mostrar la nueva
    document.querySelectorAll(".view-section").forEach(el => el.style.display = "none");

    // Asegurar que loged tiene la estructura correcta
    if (section === "loged") {
        let logedSection = document.getElementById("loged");
        if (!logedSection) {
            logedSection = document.createElement("div");
            logedSection.id = "loged";
            logedSection.classList.add("view-section");
            logedSection.innerHTML = `<h2 data-translate="welcome-player"><strong>${translations[localStorage.getItem("language") || "en"]["welcome-player"]}</strong></h2>`;
            document.body.appendChild(logedSection);
            console.log("✅ Se ha creado dinámicamente la sección #loged");
        } 

        //  Actualizar el texto de #userWelcome sin sobrescribirlo
        const userWelcome = document.getElementById("userWelcome");
        if (userWelcome) {
            const usernameText = userWelcome.querySelector("strong");
            if (usernameText) {
                usernameText.textContent = translations[localStorage.getItem("language") || "en"]["welcome-player"];
            }
        }

        logedSection.style.display = "block";
    }

    // Mostrar la nueva sección
    let activeSection = document.getElementById(section);
    if (activeSection) {
        activeSection.style.display = "block";
        console.log(`✅ Mostrando sección: ${section}`);
    } else {
        console.error(`❌ ERROR: La sección #${section} no existe. Redirigiendo a login.`);
        updateView("login");
    }
}















// Manejo del botón Back y Forward del navegador
// Manejo del idioma y la navegación
// Al cargar la página, recuperamos el idioma guardado en localStorage
document.addEventListener("DOMContentLoaded", function () {
    console.log("🔄 Página cargada. Inicializando configuración...");

    const playButton = document.querySelector("[data-menu='play']");



    // 1. Inicialización del idioma
    const currentLanguage = localStorage.getItem("language") || "en";
    const languageSelector = document.getElementById("languageSelector");
    const languageBox = document.getElementById("languageBox");

    if (languageBox && languageSelector) {
        // Evento para abrir el selector con Enter o Espacio
        languageBox.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                console.log("Enter/Espacio detectado en LanguageBox");

                // Mostrar el selector y enfocar
                languageSelector.classList.add("visible");
                languageSelector.focus();
            }
        });

        // Evento para capturar Enter en el selector y cambiar el idioma
        languageSelector.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                const selectedLanguage = languageSelector.value;
                console.log(`🌍 Confirmando idioma: ${selectedLanguage}`);

                localStorage.setItem("language", selectedLanguage);
                applyLanguage(selectedLanguage);

                // Ocultar el selector y devolver foco a languageBox
                languageSelector.classList.remove("visible");
                languageBox.focus();
            } else if (event.key === "Escape") {
                event.preventDefault();
                console.log("❌ Cancelando cambio de idioma.");
                languageSelector.classList.remove("visible");
                languageBox.focus();
            }
        });

        // Evento de clic para abrir/cerrar el selector
        languageBox.addEventListener("click", (event) => {
            event.stopPropagation();
            languageSelector.classList.toggle("visible");
            languageSelector.focus();
        });

        // Cerrar selector si se hace clic fuera
        document.addEventListener("click", (event) => {
            if (!languageBox.contains(event.target) && !languageSelector.contains(event.target)) {
                languageSelector.classList.remove("visible");
            }
        });

        // Asegurar que el idioma seleccionado persiste
        languageSelector.value = currentLanguage;
        applyLanguage(currentLanguage);
    }
    

    // 2. Manejo de la navegación en la carga de la página
    if (!isLoggedIn && location.hash !== "#login") {
        console.warn("⚠️ Usuario no autenticado. Redirigiendo a login.");
        history.replaceState(null, "", "#login");
    }
    
    // 3. Manejo del selector de idioma
    if (languageBox && languageSelector) {
        languageBox.addEventListener("click", (event) => {
            event.stopPropagation();
            languageSelector.classList.toggle("visible");
        });

        document.addEventListener("click", (event) => {
            if (!languageBox.contains(event.target) && !languageSelector.contains(event.target)) {
                languageSelector.classList.remove("visible");
            }
        });
    }

    // 4. Manejo del menú de login y eventos de accesibilidad
    const loginBox = document.getElementById("loginBox");

    if (!loginBox) {
        console.error("❌ ERROR: loginBox no encontrado.");
        return;
    }

    console.log("✅ loginBox encontrado. Asignando eventos...");

    loginBox.setAttribute("tabindex", "0"); //  Permitir navegación con Tab

    //  Evento de clic normal
    loginBox.addEventListener("click", function (event) {
        event.stopPropagation();
        if (isLoggedIn) {
            console.log("🟢 Usuario logeado, abriendo menú de usuario...");
            openUserMenu(event);
        } else {
            console.log("🔴 Usuario no logeado, mostrando opciones de login...");
            showMenu("main");
        }
    });

    //  Evento de teclado (Enter o Espacio simulan clic)
    loginBox.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            console.log("Enter o Espacio presionado en Log in / Sign up");
            loginBox.click(); // Simula un clic normal
        }
    });

    //  Permitir que TODOS los botones de menú dinámicos se comporten igual
    document.querySelectorAll(".menu-option").forEach(menuOption => {
        if (menuOption.id !== "languageBox") { // Excluir el LanguageBox
            menuOption.setAttribute("tabindex", "0"); // Asegurar que sean navegables
            menuOption.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    console.log(`Enter/Espacio detectado en: ${menuOption.dataset.menu || "sin data-menu"}`);
                    menuOption.click(); // Simula un clic
                }
            });
        }
    });

    console.log("✅ Todos los eventos han sido asignados correctamente.");

    // 🟢 5. Asegurar que el menú de usuario se abre correctamente
    const userWelcome = document.getElementById("userWelcome");

    if (userWelcome) {
        userWelcome.removeEventListener("click", openUserMenu); // Evita eventos duplicados
        userWelcome.addEventListener("click", function (event) {
            event.stopPropagation(); // 🛑 Evita que el clic cierre el Play Menu si está abierto
            console.log("🟢 Se ha hecho clic en Welcome Player. Abriendo User Menu...");

            const playMenu = document.getElementById("playMenu");

            if (playMenu && playMenu.classList.contains("visible")) {
                console.log("🛑 Play Menu está abierto, cerrándolo antes de abrir User Menu.");
                playMenu.classList.remove("visible");
            }

            openUserMenu(event);
        });
    }
    
    // Asegurar que el menú de juego se cree solo una vez
    if (!document.getElementById("playMenu")) {
        const playMenu = document.createElement("div");
        playMenu.id = "playMenu";
        playMenu.classList.add("login-options");
        playMenu.innerHTML = `
            <p class="play-option" data-mode="solo-ai" data-text="solo-ai"></p>
            <div class="separator"></div>
            <p class="play-option" data-mode="local" data-text="local"></p>
            <div class="separator"></div>
            <p class="play-option" data-mode="online" data-text="online"></p>
            <div class="separator"></div>
            <p class="play-option" data-mode="create-tournament" data-text="create-tournament"></p>
            <div class="separator"></div>
            <p class="play-option" data-mode="join-tournament" data-text="join-tournament"></p>
        `;
        playButton.parentNode.appendChild(playMenu);

        //  Traducir opciones del menú de juego cuando se crea
        document.querySelectorAll("#playMenu .play-option").forEach(option => {
            const key = option.dataset.text;
            option.textContent = translations[localStorage.getItem("language") || "en"][key] || key;
        });

        // Función para posicionar el menú dinámicamente
        function positionPlayMenu() {
            const rect = playButton.getBoundingClientRect();
            const availableSpaceRight = window.innerWidth - rect.right;
            const menuWidth = 280; // Ancho del menú de Play
        
            let newLeft = rect.right;
            if (availableSpaceRight < menuWidth) {
                const overlap = menuWidth - availableSpaceRight;
                newLeft = rect.right - overlap;
            }
            if (newLeft < rect.left) {
                newLeft = rect.left;
            }
        
            playMenu.style.top = `${rect.top}px`;
            playMenu.style.left = `${newLeft}px`;
            playMenu.style.width = `${menuWidth}px`;
        
            // 🔹 Hacer las opciones navegables con Tab
            playMenu.querySelectorAll(".play-option").forEach(option => {
                option.setAttribute("tabindex", "0");
            });
        
            // 🔹 Enfocar el primer elemento del menú al abrirlo
            setTimeout(() => {
                const firstOption = playMenu.querySelector(".play-option");
                if (firstOption) firstOption.focus();
            }, 50);
        }
        
        
        

        positionPlayMenu();
        window.addEventListener("resize", positionPlayMenu);

        // 🟢 Evento de clic en el botón Play para abrir/cerrar el menú
        playButton.addEventListener("click", function (event) {
            event.stopPropagation();
            // Se podia entrar enel menu sin logearnos
            if (!isLoggedIn) {
                console.warn("⛔ No puedes acceder a Play sin iniciar sesión.");
                return;
            }

            const loginOptions = document.getElementById("loginOptions");
            if (loginOptions.classList.contains("visible")) {
                loginOptions.classList.remove("visible");
            }

            positionPlayMenu();
            playMenu.classList.toggle("visible");

            // 🟢 Habilitar navegación con teclado en las opciones del submenú de Play
            playMenu.querySelectorAll(".play-option").forEach(option => {
                option.addEventListener("keydown", function (event) {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        console.log(`🎮 Enter/Espacio detectado en: ${option.dataset.mode}`);
                        option.click(); // 🔥 Simula un clic en la opción seleccionada
                    }
                });
            });


            history.pushState(null, "", playMenu.classList.contains("visible") ? "#play-menu" : "#loged");
        });

        // 🟢 Cerrar el menú si se hace clic fuera
        document.addEventListener("click", function (event) {
            if (!playMenu.contains(event.target) && event.target !== playButton) {
                playMenu.classList.remove("visible");
            }
        });

        // 🟢 Asignar eventos de clic a las opciones de juego
        playMenu.querySelectorAll(".play-option").forEach(option => {
            option.addEventListener("click", function (event) {
                event.stopPropagation();
                console.log(`🎮 Opción seleccionada: ${option.dataset.mode}`);
                playMenu.classList.remove("visible");
            });
        });

    }
    
    
    
    // 🔄 Inicializando eventos de navegación...
    console.log("🔄 Inicializando eventos de navegación...");
    document.querySelectorAll(".menu-option").forEach(option => {
        if (option.dataset.menu) {
            option.setAttribute("tabindex", "0"); // Asegurar accesibilidad
            option.removeEventListener("click", handleMenuClick); 
            option.addEventListener("click", function (event) {
                updateActiveButton(option); 
                console.log(`🟢 Se hizo clic en: ${option.id || "sin ID"} (data-menu: ${option.dataset.menu})`);
                handleMenuClick(option.dataset.menu);
            });
        }
    });
    

}); // ✅ Aquí cierra correctamente el DOMContentLoaded






// Restaurar la navegación con hashchange
window.addEventListener("hashchange", function () {
    let section = location.hash.replace("#", "") || "login";
    console.log(`🔄 (hashchange) Cambio detectado: ${section}`);

    // Validamos si la sección es válida antes de continuar
    const validSections = ["login", "loged", "play", "settings", "credits", "user-menu"];
    if (!validSections.includes(section)) {
        console.warn(`⚠️ Sección no permitida: #${section}. Redirigiendo a login.`);
        section = "login";
        history.replaceState(null, "", "#login");
    }

    // Si el usuario no está logeado y trata de ir a una sección restringida
    if (!isLoggedIn && section !== "login") {
        console.warn(`⚠️ Usuario no autenticado intentó acceder a: ${section}. Redirigiendo a login.`);
        section = "login";
        history.replaceState(null, "", "#login");
    }

    // Si el usuario está logeado y trata de ir a "login", lo enviamos a "loged"
    if (isLoggedIn && section === "login") {
        console.warn("⚠️ Usuario logeado intentó acceder a login. Redirigiendo a loged.");
        section = "loged";
        history.replaceState(null, "", "#loged");
    }

    // Si ya estamos en la sección actual, no hacer nada
    const activeSection = document.querySelector(".view-section:not([style*='none'])");
    if (activeSection?.id === section) {
        console.warn(`⚠️ updateView(${section}) bloqueado, ya estamos en esta sección.`);
        return;
    }

    // Asegurar que la sección existe en el DOM antes de actualizar la vista
    if (!document.getElementById(section)) {
        console.warn(`⚠️ Sección #${section} no encontrada en el DOM.`);
        
        // Si es una sección esperada, la creamos
        const validSections = ["login", "loged", "play", "settings", "credits", "profile-settings"];
        
        if (validSections.includes(section)) {
            console.log(`✅ Creando dinámicamente la sección #${section}...`);
            let newSection = document.createElement("div");
            newSection.id = section;
            newSection.classList.add("view-section");
            newSection.style.display = "none";
            newSection.innerHTML = `<h2>${section.toUpperCase()}</h2>`;
            document.body.appendChild(newSection);
        } else {
            console.warn(`🚨 Se intentó acceder a una sección desconocida: #${section}. Redirigiendo a login.`);
            section = "login";
            history.replaceState(null, "", "#login");
        }
    }


    // Llamamos a updateView para cambiar la vista correctamente
    updateView(section);
});











// Cerrar el menú de usuario cuando se hace clic fuera
document.addEventListener("click", function(event) {
    const loginOptions = document.getElementById("loginOptions");
    const loginBox = document.getElementById("loginBox");

    // Si el menú de login está visible y el clic ocurre fuera del loginBox y loginOptions, se cierra.
    if (loginOptions.classList.contains("visible") && 
        !loginOptions.contains(event.target) && 
        !loginBox.contains(event.target)) {
        
        console.log("🔴 Clic fuera del User Menu. Cerrando...");
        closeLoginMenu();
    }
});
















// Mostrar opciones del menú de login
function showMenu(menu) {
    console.log(`🚀 showMenu() llamado con: ${menu}`);

    let loginOptions = document.getElementById("loginOptions");

    if (!loginOptions) return;

    loginOptions.classList.add("visible");
    loginOptions.style.display = "block"; //  Asegurar que se vuelve a mostrar
    loginOptions.innerHTML = ""; //  Limpiar antes de regenerar el contenido

    // Obtener el idioma actual
    const lang = localStorage.getItem("language") || "en";

    let menuContent = "";

    if (menu === "main") {
        menuContent = 
            `<p class="login-option intra-login" data-text="already-42">${translations[lang]["already-42"]}</p>
            <div class="separator"></div>
            <p class="login-option" data-menu="sign-in" data-text="sign-in">${translations[lang]["sign-in"]}</p>
            <div class="separator"></div>
            <p class="login-option" data-menu="sign-up" data-text="sign-up">${translations[lang]["sign-up"]}</p>
            <div class="separator"></div>
            <p class="login-option" data-menu="forgot" data-text="forgot-password">${translations[lang]["forgot-password"]}</p>`
        ;
    } 
    else if (menu === "sign-in") { 
        menuContent = `
            <p class="submenu-text" data-text="sign-in">${translations[lang]["sign-in"]}</p>
            <input type="text" id="signInEmail" class="login-input" placeholder="${translations[lang]["email"]}">
            <input type="password" id="signInPassword" class="login-input" placeholder="${translations[lang]["password"]}">
            <button class="login-submit" onclick="handleSignIn()">${translations[lang]["sign-in"]}</button>
            <p class="back-option" data-menu="main" data-text="back">${translations[lang]["back"]}</p>
        `;
    }    
    else if (menu === "sign-up") { 
        menuContent = `
            <p class="submenu-text" data-text="create-account">${translations[lang]["create-account"]}</p>
            <input type="text" id="signUpUsername" class="login-input" placeholder="${translations[lang]["username"]}">
            <input type="email" id="signUpEmail" class="login-input" placeholder="${translations[lang]["email"]}">
            <input type="password" id="signUpPassword" class="login-input" placeholder="${translations[lang]["password"]}">
            <button class="login-submit" onclick="handleSignUp()">${translations[lang]["sign-up-button"]}</button>
            <p class="back-option" data-menu="main" data-text="back">${translations[lang]["back"]}</p>
        `;
    }
    else if (menu === "forgot") {
        menuContent = `
            <p class="submenu-text" data-text="reset-password">${translations[lang]["reset-password"]}</p>
            <input type="email" class="login-input" placeholder="${translations[lang]["email"]}">
            <button class="login-submit" onclick="resetPassword()">${translations[lang]["send-reset"]}</button>
            <p class="back-option" data-menu="main" data-text="back">${translations[lang]["back"]}</p>
        `;
    }
    else if (menu === "userMenu") {
        menuContent = `
            <p class="submenu-text" data-text="user-options">${translations[lang]["user-options"]}</p>
            <p class="login-option" data-menu="profile-settings" data-text="profile-settings">${translations[lang]["profile-settings"]}</p>
            <div class="separator"></div>
            <p class="login-option" data-menu="logout" data-text="logout">${translations[lang]["logout"]}</p>
        `;
    }
    else if (menu === "profile-settings") {
        menuContent = `
            <p class="submenu-text" data-text="edit-profile">${translations[lang]["edit-profile"] || "Edit Profile"}</p>
            <p class="login-option" data-menu="edit-username" data-text="edit-username">${translations[lang]["edit-username"] || "Edit Username"}</p>
            <p class="login-option" data-menu="edit-email" data-text="edit-email">${translations[lang]["edit-email"] || "Edit Email"}</p>
            <p class="login-option" data-menu="edit-password" data-text="edit-password">${translations[lang]["edit-password"] || "Edit Password"}</p>
            <div class="separator"></div>
            <p class="login-option" id="toggle-2fa" data-text="toggle-2fa">${translations[lang]["toggle-2fa"] || "Enable 2FA"}</p>
            <div class="separator"></div>
            <p class="back-option" data-menu="userMenu" data-text="back">${translations[lang]["back"] || "← Back"}</p>
        `;
    }
    
    

    loginOptions.innerHTML = menuContent;

    // Añadir tabindex a las opciones del menú dinámico
    document.querySelectorAll(".login-option").forEach(option => {
        option.setAttribute("tabindex", "0"); // Asegura que sean navegables con Tab
    });

    //  Enfocar el primer elemento navegable del menú
    setTimeout(() => {
        let firstElement = loginOptions.querySelector("[tabindex='0'], input, button");
        if (firstElement) {
            firstElement.focus();
        }
    }, 50);

    //  Simular clic cuando se presiona "Enter" o "Espacio"
    loginOptions.querySelectorAll("[tabindex='0'], button").forEach(element => {
        element.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                element.click(); // Simula un clic cuando se presiona Enter o Espacio
            }
        });
    });

    //  Agregar eventos de clic después de actualizar el menú
    setTimeout(() => {
        loginOptions.querySelectorAll(".login-option, .back-option").forEach(option => {
            option.addEventListener("click", function (event) {
                event.stopPropagation(); //  Evita que el clic cierre el menú antes de ejecutarse
        
                console.log(`🖱️ Click detectado en opción: ${option.dataset.menu || "sin menú"}`); // 🔍 Depuración
        
                if (option.classList.contains("intra-login")) {
                    loginWithIntra();
                    return;
                }
        
                if (option.dataset.menu === "logout") {
                    console.log("⚠️ Clic en Log out detectado. Ejecutando logoutUser()...");
                    logoutUser();
                    return;
                }
        
                if (["edit-username", "edit-password", "edit-email"].includes(option.dataset.menu)) {
                    openEditModal(option.dataset.menu);
                    return;
                }
        
                if (option.id === "toggle-2fa") {
                    let twoFAModal = new bootstrap.Modal(document.getElementById("twoFAModal"));
                    twoFAModal.show();
                    let confirm2FA = document.getElementById("confirm2FA");
                    confirm2FA.replaceWith(confirm2FA.cloneNode(true));
                    confirm2FA = document.getElementById("confirm2FA");
                    confirm2FA.addEventListener("click", function () {
                        console.log("✅ 2FA Enabled!");
                        option.textContent = "Disable 2FA";
                        twoFAModal.hide();
                    });
                    return;
                }
        
                if (option.dataset.menu) {
                    console.log(`📂 Abriendo submenú: ${option.dataset.menu}`); // 🔍 Depuración
                    showMenu(option.dataset.menu); 
                }
            });
        });
    });
}

// EL puto modal
function openEditModal(type) {
    let modalTitle = document.getElementById("editModalLabel");
    let modalInput = document.getElementById("editModalInput");
    let saveButton = document.getElementById("saveEdit");
    let cancelButton = document.querySelector("#editModal .btn-secondary"); // Botón de cancelar

    // **Asegurar que el modal y los elementos existen**
    if (!modalTitle || !modalInput || !saveButton || !cancelButton) {
        console.error("❌ No se encontraron los elementos del modal.");
        return;
    }

    // **Obtener idioma actual**
    let lang = localStorage.getItem("language") || "en";

    // **Resetear input antes de cambiar tipo**
    modalInput.value = "";
    modalInput.type = "text"; // Resetear a texto por defecto

    // **Asignar textos según el idioma**
    if (type === "edit-username") {
        modalTitle.textContent = translations[lang]["edit-username"];
        modalInput.placeholder = translations[lang]["edit-username-placeholder"];
    } else if (type === "edit-password") {
        modalTitle.textContent = translations[lang]["edit-password"];
        modalInput.placeholder = translations[lang]["edit-password-placeholder"];
        modalInput.type = "password";
    } else if (type === "edit-email") {
        modalTitle.textContent = translations[lang]["edit-email"];
        modalInput.placeholder = translations[lang]["edit-email-placeholder"];
        modalInput.type = "email";
    }

    // **Traducir botones del modal**
    saveButton.textContent = translations[lang]["save-button"];
    cancelButton.textContent = translations[lang]["cancel-button"];

    // **Abrir el modal correctamente con Bootstrap**
    let modal = new bootstrap.Modal(document.getElementById("editModal"));
    modal.show();

    // **Reemplazar botón para evitar múltiples eventos**
    let newSaveButton = saveButton.cloneNode(true);
    saveButton.replaceWith(newSaveButton);
    saveButton = newSaveButton; // Reasignamos el botón

    // **Asignar nuevo evento al botón de guardar**
    saveButton.onclick = function () {
        let newValue = modalInput.value.trim();
        if (!newValue) {
            alert(translations[lang]["empty-field-alert"]); // Traducir alerta
            return;
        }

        if (type === "edit-username") {
            console.log(`Nombre de usuario cambiado a: ${newValue}`);
        } else if (type === "edit-password") {
            console.log("Contraseña actualizada correctamente.");
        } else if (type === "edit-email") {
            console.log(`Email cambiado a: ${newValue}`);
        }

        // **Cerrar modal después de guardar**
        modal.hide();
    };
}


// El modal se cierra correctamente sin dejar la pantalla bloqueada
document.addEventListener("hidden.bs.modal", function () {
    console.log("🔄 Modal cerrado correctamente. Verificando backdrop...");

    // Eliminar backdrop si aún está presente
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
        backdrop.remove();
        console.log("✅ Backdrop eliminado.");
    }

    // Restablecer el scroll en la página
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";

    setTimeout(() => {
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = "";
    }, 300);
});





function handleMenuClick(eventOrSection) {
    const section = typeof eventOrSection === "string" 
        ? eventOrSection 
        : eventOrSection?.currentTarget?.dataset.menu;

    if (!section) {
        console.warn("⚠️ Se intentó navegar a una sección vacía o inválida.");
        return;
    }

    console.log(`handleMenuClick() llamado con sección: ${section}`);

    // Evitar navegación si el usuario no está logeado y no es login
    if (!isLoggedIn && section !== "login") {
        console.warn(`⛔ Acceso denegado a '${section}', usuario no autenticado.`);
        return;
    }

    history.pushState({ page: section }, "", `#${section}`);
    updateView(section);
}













// Redirigir a la autenticación de 42
function loginWithIntra() {
    console.log("🟢 Iniciando autenticación con 42...");

    const clientId = "TU_CLIENT_ID_REAL"; // Obtén este valor de la intra de 42
    const redirectUri = encodeURIComponent("http://localhost:8000/api/oauth/callback"); // Asegúrate de que coincide con el backend

    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=public`;


    console.log("🔵 Redirigiendo a:", authUrl);
    window.location.href = authUrl;
}


function checkIntraLogin() {
    console.log("🔍 Verificando autenticación con 42...");

    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access');
    const refreshToken = urlParams.get('refresh');

    if (accessToken && refreshToken) {
        console.log("✅ Tokens recibidos de la API de 42. Guardando sesión...");

        setCookie('access_token', accessToken, 1); // Guarda el token por 1 día
        setCookie('refresh_token', refreshToken, 7); // Guarda el refresh token por 7 días

        //  Marcar usuario como logueado
        isLoggedIn = true;

        //  Actualizar la UI
        activateMenus();
        closeLoginMenu();
        history.replaceState(null, "", "#loged");
        updateView("loged");
    } else {
        console.log("🔍 No se encontraron tokens en la URL. Comprobando cookies...");

        const savedAccessToken = getCookie('access_token');
        const savedRefreshToken = getCookie('refresh_token');

        if (savedAccessToken && savedRefreshToken) {
            console.log("Sesión encontrada en cookies. Restaurando...");
            isLoggedIn = true;
            activateMenus();
            closeLoginMenu();
            updateView("loged");
        } else {
            console.warn("⚠️ No hay sesión activa.");
        }
    }
}


/*
// Funcion que maneja el Sign in 
function handleSignIn() {
    const login = document.getElementById("signInEmail").value.trim();
    const password = document.getElementById("signInPassword").value.trim();

    //  Validar credenciales antes de enviar
    if (!validateEmail(login)) {
        alert("❌ Please enter a valid email.");
        return;
    }
    if (password.length < 6) {
        alert("❌ Password must be at least 6 characters long.");
        return;
    }

    console.log("✅ Datos validados. Enviando...");

    //  Enviar credenciales al backend
    fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ login: login, password: password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.access) {
            // ✅ Guardamos los tokens en cookies
            setCookie('access_token', data.access, 1);
            setCookie('refresh_token', data.refresh, 7);

            alert("✅ Login successful!");
            
            //  Sincronizar isLoggedIn y actualizar la UI
            isLoggedIn = true;
            activateMenus();
            closeLoginMenu();
        } else {
            alert("❌ Invalid credentials.");
        }
    })
    .catch(error => console.error("Error:", error));
}*/

function loginWithIntra() {
    console.log("🔵 Simulando login con API de 42...");

    setTimeout(() => {
        console.log("✅ Simulación exitosa: Usuario autenticado con intra.");
        
        //  Simular almacenamiento de tokens
        localStorage.setItem("access_token", "fakeAccessToken42");
        localStorage.setItem("refresh_token", "fakeRefreshToken42");
        
        activateMenus();
        closeLoginMenu();

    }, 1000);
}



// Validación de email con regex
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Con el Sign in: Simulacion de envio al backend
function sendSignInRequest(email, password) {
    console.log(`🔵 Enviando Sign In: Email: ${email}, Password: ${password}`);

    // Simulación de respuesta del backend cuando ya esta registrado. Ponemos test@example.com para comprobar la logica
    setTimeout(() => {
        if (email === "test@example.com") {
            alert("❌ This email is already registered.");
        } else {
            alert("✅ Account created successfully! You are now logged in.");
            activateMenus(); // Habilitar el acceso al juego
            closeLoginMenu(); // Cerrar la ventana de login
        }
    }, 1000);
}

function handleSignUp() {
    const username = document.getElementById("signUpUsername").value.trim();
    const email = document.getElementById("signUpEmail").value.trim();
    const password = document.getElementById("signUpPassword").value.trim();

    //  Validaciones básicas antes de enviar
    if (username.length < 3) {
        alert("❌ Username must be at least 3 characters long.");
        return;
    }
    if (!validateEmail(email)) {
        alert("❌ Please enter a valid email.");
        return;
    }
    if (password.length < 6) {
        alert("❌ Password must be at least 6 characters long.");
        return;
    }

    console.log("✅ Datos validados. Registrando usuario...");

    //  Enviar datos al backend
    fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            login: username, 
            name: username, 
            email: email, 
            password: password 
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(`✅ Welcome, ${username}! Your account has been created.`);

            //  Automáticamente inicia sesión después de registrarse
            handleSignInAfterSignUp(email, password);
        } else {
            alert(`❌ ${data.error}`);
        }
    })
    .catch(error => console.error("Error:", error));
}



//  Simulación de envío de datos de Sign up al backend
function sendSignUpRequest(username, email, password) {
    console.log(`🔵 Sending Sign Up: Username: ${username}, Email: ${email}, Password: ${password}`);

    // Simulación de respuesta del servidor
    setTimeout(() => {
        alert(`✅ Welcome, ${username}! Your account has been created.`);
        activateMenus(); // Habilita el acceso al juego
        closeLoginMenu(); // Cierra el menú de login
    }, 1000);
}

// COn el forgot your password. Simulacion de envio de reset link
function resetPassword() {
    console.log("🔵 Se ha hecho clic en 'Reset Password'");
    alert("✅ Simulación: Se enviaría un email con el enlace de recuperación.");
}


function activateMenus() {
    console.log("🟢 Activando menús...");

    isLoggedIn = true; // ✅ Usuario logeado

    //  Habilitar todas las opciones del menú
    document.querySelectorAll(".option-box").forEach(option => {
        if (!option.classList.contains("no-border")) {
            option.classList.remove("inactive");
            option.style.pointerEvents = "auto";
            option.style.opacity = "1";
        }
    });

    //  Cambiar solo el texto del botón de Log In a "Welcome, Player"
    const loginBox = document.getElementById("loginBox");
    if (loginBox) {
        loginBox.innerHTML = 'Welcome, <strong>Player</strong>';
    }

    //  Asegurar que el evento de clic sigue funcionando
    loginBox.removeEventListener("click", openUserMenu);
    loginBox.addEventListener("click", openUserMenu);

    //  Cerrar el menú de Log In si está abierto
    const loginOptions = document.getElementById("loginOptions");
    if (loginOptions) {
        loginOptions.classList.remove("visible");
        loginOptions.style.display = "none";
    }

    //  Actualizar la URL y la vista para evitar que se quede en Login
    history.replaceState(null, "", "#loged");
    updateView("loged");
}











//  Función para manejar el clic en "Welcome, Player"
function handleUserWelcomeClick(event) {
    event.stopPropagation(); // 🛑 Evita que el clic cierre inmediatamente la caja
    console.log("🟢 Clic en Welcome Player. Alternando iluminación...");

    const loginBox = document.getElementById("loginBox");
    loginBox.classList.add("active"); // Iluminar botón

    updateActiveButton(event.currentTarget); //  Resaltar botón
    openUserMenu(); //  Abrir menú de usuario
}

//  Función para manejar el cierre del menú cuando se hace clic fuera
function handleCloseUserMenu(event) {
    const loginBox = document.getElementById("loginBox");

    if (!loginBox.contains(event.target)) {
        console.log("🔴 Clic fuera de Welcome Player. Apagando iluminación...");
        loginBox.classList.remove("active");
    }
}
























//  Nueva función para mostrar el menú del usuario cuando estamos logeados.
// Función para manejar el menú del usuario al hacer clic en "Welcome, Player"
function openUserMenu(event) {
    event.stopPropagation(); // Evita que el clic cierre inmediatamente la caja
    console.log("🟢 Se ha hecho clic en Welcome Player. Abriendo User Menu...");

    if (!isLoggedIn) {
        console.warn("⚠️ Usuario no logeado. Mostrando menú de login.");
        showMenu("main");
        return;
    }

    //  Cerrar el menú de Play si está abierto
    const playMenu = document.getElementById("playMenu");
    if (playMenu && playMenu.classList.contains("visible")) {
        console.log("🔴 Play Menu está abierto, cerrándolo antes de abrir User Menu.");
        playMenu.classList.remove("visible");
    }

    //  Mostrar el menú de usuario asegurando que sea visible
    let loginOptions = document.getElementById("loginOptions");
    if (!loginOptions) {
        console.error("❌ No se encontró #loginOptions en el DOM.");
        return;
    }

    showMenu("userMenu");
    loginOptions.classList.add("visible");
    loginOptions.style.display = "block"; // Asegurar que no está oculto por `display: none;`

    //  Actualizar la URL si es necesario
    if (location.hash !== "#user-menu") {
        history.pushState(null, "", "#user-menu");
    }
}
















// Necesitaremos una funcion de deslogeo
function logoutUser() {
    console.log("🔴 Enviando logout al backend...");

    const accessToken = localStorage.getItem("access_token");

    isLoggedIn = false; // Forzar que el usuario está deslogueado ANTES de actualizar la UI

    if (!accessToken) {
        console.warn("⚠️ No hay token de sesión, redirigiendo a login.");
        history.replaceState(null, "", "#login");
        updateView("login");

        // ✅ Asegurar que el texto del botón de login es el correcto
        document.getElementById("loginBox").innerHTML = `<span id="loginText" data-translate="login">${translations[localStorage.getItem("language") || "en"]["login"]}</span>`;

        resetUI();
        return;
    }

    fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            console.log("✅ Logout exitoso en el backend.");
        } else {
            console.warn("⚠️ Error en el backend al cerrar sesión.");
        }
    })
    .catch(error => {
        console.error("❌ No se pudo conectar al backend para logout:", error);
    })
    .finally(() => {
        //  Borrar tokens y restablecer la UI después del logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        //  Asegurar que la sección #login existe
        let loginSection = document.getElementById("login");
        if (!loginSection) {
            console.warn("⚠️ No se encontró la sección #login, creándola dinámicamente...");
            loginSection = document.createElement("div");
            loginSection.id = "login";
            loginSection.classList.add("view-section");
            loginSection.innerHTML = `<h2 data-translate="login">${translations[localStorage.getItem("language") || "en"]["login"]}</h2>`;
            document.body.appendChild(loginSection);
            console.log("✅ Sección #login creada exitosamente.");
        }

        //  Redirigir al usuario al login
        history.replaceState(null, "", "#login");
        updateView("login");

        // ✅ Asegurar que el texto del botón de login es el correcto
        document.getElementById("loginBox").innerHTML = `<span id="loginText" data-translate="login">${translations[localStorage.getItem("language") || "en"]["login"]}</span>`;

        //  Restablecer la interfaz después del logout
        resetUI();
    });
}







function resetUI() {
    console.log("🔄 Restableciendo la interfaz a su estado inicial...");

    //  Desactivar todas las opciones excepto el login
    document.querySelectorAll(".option-box").forEach(option => {
        if (!option.classList.contains("no-border")) {
            option.classList.add("inactive");
            option.style.pointerEvents = "none";
            option.style.opacity = "0.5";  
        }
    });

    //  Restablecer el loginBox según el estado de autenticación
    const loginBox = document.getElementById("loginBox");

    if (!isLoggedIn) {
        console.log("🔄 Usuario no autenticado, mostrando 'Log in / Sign up'");
        loginBox.innerHTML = `<span id="loginText" data-translate="login">${translations[localStorage.getItem("language") || "en"]["login"]}</span>`;
    } else {
        console.log("🟢 Usuario autenticado, mostrando 'Welcome, Player'");
        loginBox.innerHTML = `<div id="userWelcome" class="menu-option active">Welcome, <strong>Player</strong></div>`;
    }

    loginBox.style.display = "flex";
    loginBox.style.alignItems = "center";
    loginBox.style.justifyContent = "center";
    loginBox.classList.remove("inactive");
    loginBox.style.pointerEvents = "auto";
    loginBox.style.opacity = "1";

    //  Ocultar el menú de login si estaba abierto
    const loginOptions = document.getElementById("loginOptions");
    loginOptions.classList.remove("visible");
    loginOptions.style.display = "none";

    // **Eliminar eventos antiguos y volver a asignarlos**
    const newLoginBox = loginBox.cloneNode(true);
    loginBox.parentNode.replaceChild(newLoginBox, loginBox);

    newLoginBox.addEventListener("click", function () {
        console.log("🟢 Se ha hecho clic en Log in / Sign in");
        if (!loginOptions.classList.contains("visible")) {
            loginOptions.classList.add("visible");
            loginOptions.style.display = "block";
            showMenu("main");
        }
    });

    // **Solución: Reasignar evento de teclado para Log in**
    newLoginBox.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            console.log("Enter o Espacio presionado en Log in / Sign up");
            newLoginBox.click(); // Simula un clic normal
        }
    });

    //  Limpiar menús flotantes
    closeLoginMenu();

    //  Forzar la actualización del idioma
    applyLanguage(localStorage.getItem("language") || "en");

    console.log("✅ Interfaz restablecida con éxito.");
}





function closeLoginMenu() {
    console.log("🔴 Cerrando menú de usuario...");

    let loginOptions = document.getElementById("loginOptions");

    if (loginOptions) {
        loginOptions.classList.remove("visible");
        loginOptions.style.display = "none";

        // ✅ No borrar el contenido de loginOptions, solo ocultarlo
    }

    let userMenu = document.getElementById("userWelcome");
    if (userMenu) {
        console.log("🔴 Ocultando User Menu...");
        userMenu.classList.remove("active");  
    }

    // ✅ Eliminar menús flotantes sin afectar loginBox
    document.querySelectorAll(".floating-menu").forEach(menu => menu.remove());
}



// Asegura que solo un botón tenga la clase .active
function updateActiveButton(newActiveButton) {
    document.querySelector(".menu-option.active")?.classList.remove("active");
    newActiveButton?.classList.add("active");
}








// Función para aplicar las traducciones a los elementos que tienen el atributo "data-translate"
function applyLanguage(language) {
    console.log(`🌍 Aplicando idioma: ${language}`);

    //  Guardamos la selección del usuario
    localStorage.setItem("language", language);

    //  Actualizamos todos los elementos con "data-translate"
    document.querySelectorAll("[data-translate]").forEach(element => {
        const key = element.getAttribute("data-translate");

        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });

    //  Actualizar los elementos con "data-text" en los submenús dinámicos
    document.querySelectorAll("[data-text]").forEach(element => {
        const key = element.getAttribute("data-text");
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });

    //  Actualizar el texto del loginBox sin eliminar eventos
    const loginBox = document.getElementById("loginBox");
    if (loginBox) {
        loginBox.innerHTML = isLoggedIn ? translations[language]["welcome-player"] : translations[language]["login"];
    }

    //  Si el menú de usuario está abierto, actualizarlo sin cerrarlo
    const loginOptions = document.getElementById("loginOptions");
    if (isLoggedIn && loginOptions && loginOptions.classList.contains("visible")) {
        showMenu("userMenu"); 
    }

    //  **Actualizar solo los textos del Play Menu sin tocar su estructura**
    const playMenu = document.getElementById("playMenu");
    if (playMenu) {
        playMenu.querySelectorAll(".play-option").forEach(option => {
            const mode = option.dataset.mode; // Obtener el modo (ej: "solo-ai", "local", etc.)
            if (translations[language][mode]) {
                option.textContent = translations[language][mode]; // ✅ Aplicar traducción sin afectar eventos
            }
        });

        //  Si el menú está visible, reajustamos su posición
        if (playMenu.classList.contains("visible")) {
            positionPlayMenu();
        }
    }

    console.log("✅ Idioma aplicado correctamente.");
}






/* LAS TRADUCCIONES */
// Definir las traducciones
const translations = {
    en: {
        "login": "Log in / Sign up",
        "welcome-player": "Welcome, Player",
        "user-options": "User Options",
        "profile-settings": "Profile Settings",
        "logout": "Log out",
        "play": "Play",
        "settings": "Settings",
        "credits": "Credits",
        "language": "Language",
        "sign-up": "Sign up",
        "sign-in": "Sign in with email",
        "already-42": "Already a 42 member? Log in with intra",
        "forgot-password": "Forgot your password?",
        "create-account": "Create an Account",
        "username": "Username",
        "email": "Email",
        "password": "Password",
        "sign-up-button": "Sign up",
        "reset-password": "Reset your password",
        "send-reset": "Send reset link",
        "edit-username": "Edit Username",
        "edit-username-placeholder": "New username",
        "edit-password": "Change Password",
        "edit-password-placeholder": "New password",
        "edit-email": "Change Email",
        "edit-email-placeholder": "New email",
        "save-button": "Save",
        "cancel-button": "Cancel",
        "empty-field-alert": "The field cannot be empty.",
        "back": "← Back"
    },
    es: {
        "login": "Iniciar sesión / Registrarse",
        "welcome-player": "Bienvenido, Jugador",
        "user-options": "Opciones de usuario",
        "profile-settings": "Configuración del perfil",
        "logout": "Cerrar sesión",
        "play": "Jugar",
        "settings": "Configuraciones",
        "credits": "Créditos",
        "language": "Idioma",
        "sign-up": "Registrarse",
        "sign-in": "Iniciar sesión con email",
        "already-42": "¿Ya eres miembro de 42? Iniciar sesión con intra",
        "forgot-password": "¿Olvidaste tu contraseña?",
        "create-account": "Crear una cuenta",
        "username": "Nombre de usuario",
        "email": "Correo electrónico",
        "password": "Contraseña",
        "sign-up-button": "Registrarse",
        "reset-password": "Restablecer tu contraseña",
        "send-reset": "Enviar enlace de restablecimiento",
        "edit-profile": "Editar perfil",
        "edit-username": "Editar nombre de usuario",
        "edit-email": "Editar correo electrónico",
        "edit-password": "Editar contraseña",
        "toggle-2fa": "Activar 2FA",
        "solo-ai": "Solo contra IA",
        "local": "Uno contra Uno Local",
        "online": "Uno contra Uno Online",
        "create-tournament": "Crear Torneo",
        "join-tournament": "Unirse a Torneo",
        "edit-username": "Editar Nombre de Usuario",
        "edit-username-placeholder": "Nuevo nombre de usuario",
        "edit-password": "Cambiar Contraseña",
        "edit-password-placeholder": "Nueva contraseña",
        "edit-email": "Cambiar Email",
        "edit-email-placeholder": "Nuevo email",
        "save-button": "Guardar",
        "cancel-button": "Cancelar",
        "empty-field-alert": "El campo no puede estar vacío.",
        "back": "← Volver"
    },
    fr: {
        "login": "Connexion / Inscription",
        "welcome-player": "Bienvenue, Joueur",
        "user-options": "Options de l'utilisateur",
        "profile-settings": "Paramètres du profil",
        "logout": "Se déconnecter",
        "play": "Jouer",
        "settings": "Paramètres",
        "credits": "Crédits",
        "language": "Langue",
        "sign-up": "S'inscrire",
        "sign-in": "Se connecter avec email",
        "already-42": "Déjà membre de 42 ? Connexion avec intra",
        "forgot-password": "Mot de passe oublié?",
        "create-account": "Créer un compte",
        "username": "Nom d'utilisateur",
        "email": "Email",
        "password": "Mot de passe",
        "sign-up-button": "S'inscrire",
        "reset-password": "Réinitialiser votre mot de passe",
        "send-reset": "Envoyer le lien de réinitialisation",
        "edit-profile": "Modifier le profil",
        "edit-username": "Modifier le nom d'utilisateur",
        "edit-email": "Modifier l'email",
        "edit-password": "Modifier le mot de passe",
        "toggle-2fa": "Activer 2FA",
        "solo-ai": "Solo contre IA",
        "local": "Un contre Un Local",
        "online": "Un contre Un en Ligne",
        "create-tournament": "Créer un Tournoi",
        "join-tournament": "Rejoindre un Tournoi",
        "edit-username": "Modifier le nom d'utilisateur",
        "edit-username-placeholder": "Nouveau nom d'utilisateur",
        "edit-password": "Changer le mot de passe",
        "edit-password-placeholder": "Nouveau mot de passe",
        "edit-email": "Changer l'email",
        "edit-email-placeholder": "Nouvel email",
        "save-button": "Enregistrer",
        "cancel-button": "Annuler",
        "empty-field-alert": "Le champ ne peut pas être vide.",
        "back": "← Retour"
    }
};