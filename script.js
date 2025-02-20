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
// 🔹 Efecto máquina de escribir
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
    console.log(`📌 updateView() llamado con sección: ${section}`);

    // 🔹 Si la sección no existe en el DOM, crearla dinámicamente
    if (!document.getElementById(section)) {
        console.warn(`⚠️ Se esperaba la sección #${section} pero no existe. Creándola...`);
        
        let newSection = document.createElement("div");
        newSection.id = section;
        newSection.classList.add("view-section");
        newSection.style.display = "none";
        
        // Contenido genérico si no hay una estructura específica
        newSection.innerHTML = `<h2>${section.toUpperCase()}</h2>`;
        
        document.body.appendChild(newSection);
        console.log(`✅ Se ha creado dinámicamente la sección #${section}`);
    }

    // 🔹 Si el usuario está logeado, evitar que vaya a login
    if (isLoggedIn && section === "login") {
        console.warn("⚠️ Intento de cambiar a login mientras está logeado. Corrigiendo a loged.");
        section = "loged";
    }

    // 🔹 Si el usuario NO está logeado, evitar que vaya a "loged"
    if (!isLoggedIn && section === "loged") {
        console.warn("⚠️ Intento de cambiar a loged sin estar logeado. Redirigiendo a login.");
        section = "login";
    }

    // 🔹 Ocultar todas las secciones antes de mostrar la nueva
    document.querySelectorAll(".view-section").forEach(el => el.style.display = "none");

    // 🔹 Mostrar la nueva sección
    let activeSection = document.getElementById(section);
    if (activeSection) {
        activeSection.style.display = "block";
        console.log(`✅ Mostrando sección: ${section}`);
    } else {
        console.error(`❌ ERROR: La sección #${section} no existe. Redirigiendo a login.`);
        updateView("login");
        return;
    }

    // 🔹 Identificar qué opción del menú debe activarse
    let activeMenu = document.querySelector(`[data-menu="${section}"]`);
    if (!activeMenu && (section === "loged" || section === "user-menu")) {
        activeMenu = document.getElementById("userWelcome");
    }
    if (!activeMenu && (section === "play-menu" || section === "juego")) {
        activeMenu = document.querySelector("[data-menu='play']");
    }

    // 🔹 Remover "active" de todos los botones y aplicarla solo al correcto
    document.querySelectorAll(".menu-option").forEach(option => option.classList.remove("active"));
    
    if (activeMenu) {
        activeMenu.classList.add("active");
        console.log(`✅ Resaltando: ${activeMenu.textContent.trim()}`);
    } else {
        console.warn(`⚠️ No se encontró un botón del menú para la sección: ${section}`);
    }
}














// Manejo del botón Back y Forward del navegador
// Manejo del idioma y la navegación
// Al cargar la página, recuperamos el idioma guardado en localStorage
document.addEventListener("DOMContentLoaded", function () {
    console.log("🔄 Página cargada. Inicializando configuración...");

    // 🟢 1. Inicialización del idioma
    const currentLanguage = localStorage.getItem("language") || "en";
    const languageSelector = document.getElementById("languageSelector");
    const languageBox = document.getElementById("languageBox");
    const playButton = document.querySelector("[data-menu='play']");

    if (languageSelector) {
        languageSelector.value = currentLanguage;
        applyLanguage(currentLanguage);
        languageSelector.addEventListener("change", function (event) {
            const selectedLanguage = event.target.value;
            localStorage.setItem("language", selectedLanguage);
            applyLanguage(selectedLanguage);
        });
    }

    // 🟢 2. Manejo de la navegación en la carga de la página
    if (!location.hash || (location.hash === "#loged" && !isLoggedIn)) {
        console.warn("⚠️ Corrigiendo hash inválido. Redirigiendo a login.");
        history.replaceState(null, "", "#login");
    }

    // 🟢 3. Manejo del selector de idioma
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

    // 🟢 4. Manejo del menú de login
    const loginBox = document.getElementById("loginBox");
    const loginOptions = document.getElementById("loginOptions");

    if (loginBox && loginOptions) {
        loginBox.addEventListener("click", function (event) {
            event.stopPropagation();

            if (isLoggedIn) {
                console.log("🟢 Usuario logeado, abriendo menú de usuario...");
                openUserMenu(); // Mostrar menú de usuario en vez del de login
            } else {
                console.log("🔴 Usuario no logeado, mostrando opciones de login...");
                if (!loginOptions.classList.contains("visible")) {
                    loginOptions.classList.add("visible");
                    showMenu("main");
                }
            }
        });
    }

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

            openUserMenu(); // ✅ Llamamos a la función sin return para que siempre abra User Menu
        });
    }



    if (playButton) {
        // 🔹 Crear dinámicamente el menú de Play
        const playMenu = document.createElement("div");
        playMenu.id = "playMenu";
        playMenu.classList.add("login-options"); // Misma clase que el menú de Log in
        playMenu.innerHTML = `
            <p class="play-option" data-mode="solo-ai">Solo vs AI</p>
            <div class="separator"></div>
            <p class="play-option" data-mode="local">One v One Local</p>
            <div class="separator"></div>
            <p class="play-option" data-mode="online">One v One Online</p>
            <div class="separator"></div>
            <p class="play-option" data-mode="create-tournament">Create Tournament</p>
            <div class="separator"></div>
            <p class="play-option" data-mode="join-tournament">Join Tournament</p>
        `;
    
        // 🔹 Agregarlo al DOM después del botón de Play
        playButton.parentNode.appendChild(playMenu);
    
        // 🔹 Asegurar que el menú de Play se alinee con el botón
        function positionPlayMenu() {
            const rect = playButton.getBoundingClientRect();
            playMenu.style.top = `${rect.top}px`; // Alinear con la parte superior del botón
            playMenu.style.left = `${rect.right + 10}px`; // Justo después del botón (ajustable)
        }
    
        positionPlayMenu(); // Llamar una vez al inicio
        window.addEventListener("resize", positionPlayMenu); // Ajustar si cambia el tamaño de la ventana
    
        // 🔹 Evento para abrir/cerrar el submenú al hacer clic en Play
        playButton.addEventListener("click", function (event) {
            event.stopPropagation();
            console.log("✅ Click detectado en el botón de Play");
    
            // 🔹 Cerrar el menú de usuario si está abierto antes de abrir Play Menu
            const userMenu = document.getElementById("loginOptions");
            if (userMenu && userMenu.classList.contains("visible")) {
                console.log("🛑 User Menu está abierto, cerrándolo antes de abrir Play Menu.");
                userMenu.classList.remove("visible");
            }
    
            // 🔹 Asegurar que el Play Menu se abre correctamente después del cierre del User Menu
            setTimeout(() => {
                playMenu.classList.toggle("visible");
                console.log(playMenu.classList.contains("visible") ? "🟢 Play Menu abierto" : "🔴 Play Menu cerrado");
    
                // 🔹 Actualizar el hash en la URL
                history.pushState(null, "", playMenu.classList.contains("visible") ? "#play-menu" : "#loged");
            }, 50);
        });
    
        // 🔹 Evento para cerrar el menú al hacer clic fuera
        document.addEventListener("click", function (event) {
            if (!playMenu.contains(event.target) && event.target !== playButton) {
                playMenu.classList.remove("visible");
            }
        });
    
        // 🔹 Manejo de clics en las opciones del submenú
        playMenu.querySelectorAll(".play-option").forEach(option => {
            option.addEventListener("click", function (event) {
                event.stopPropagation();
                console.log(`🎮 Opción seleccionada: ${option.dataset.mode}`);
                playMenu.classList.remove("visible"); // Ocultar después de seleccionar
            });
        });
    }
    
    // 🔄 Inicializando eventos de navegación...
    console.log("🔄 Inicializando eventos de navegación...");
    document.querySelectorAll(".menu-option").forEach(option => {
        if (option) {
            option.removeEventListener("click", handleMenuClick); // Evita eventos duplicados
            option.addEventListener("click", function (event) {
                updateActiveButton(option); // 🔹 Ilumina el botón actual
                const section = option.dataset.menu; // 📌 Obtener la sección desde el atributo data-menu
                
                console.log(`🟢 Se hizo clic en: ${option.id || "sin ID"} (data-menu: ${section})`);
            
                if (section) {
                    handleMenuClick(section); // ✅ Pasamos la sección corregida
                } else {
                    console.warn("⚠️ No se encontró el atributo data-menu en:", option);
                }
            });
            
            
        } else {
            console.warn("⚠️ Se intentó asignar un evento a un elemento inexistente.");
        }
    });

}); // ✅ Aquí cierra correctamente el DOMContentLoaded






// Restaurar la navegación con hashchange
window.addEventListener("hashchange", function () {
    let section = location.hash.replace("#", "") || "login";
    console.log(`🔄 (hashchange) Cambio detectado: ${section}`);

    // Si ya estamos en esta sección, no hacer nada
    if (document.querySelector(".view-section[style*='block']")?.id === section) {
        console.warn(`⚠️ updateView(${section}) bloqueado, ya estamos en esta sección.`);
        return;
    }

    // Si el usuario no está logeado y trata de ir a "loged", corregimos a "login"
    if (!isLoggedIn && section === "loged") {
        console.warn("⚠️ Intento de acceder a loged sin estar logeado. Redirigiendo a login.");
        section = "login";
        history.replaceState(null, "", "#login");
    }

    // Validamos si la sección realmente existe en el DOM
    if (!document.getElementById(section)) {
        console.warn(`⚠️ Se intentó acceder a una sección inexistente: #${section}. Redirigiendo a login.`);
        section = "login";
        history.replaceState(null, "", "#login");
    }

    // Aseguramos que todos los menús estén ocultos antes de cambiar de vista
    document.querySelectorAll(".view-section").forEach(el => el.style.display = "none");
    
    // Llamamos a updateView para cambiar la vista correctamente
    updateView(section);
});








// Cerrar el menú de usuario cuando se hace clic fuera
document.addEventListener("click", function(event) {
    const userMenu = document.getElementById("userWelcome");
    const loginOptions = document.getElementById("loginOptions");

    // Si hay un menú abierto y el clic NO fue en el menú ni en el usuario, se cierra
    if (loginOptions.classList.contains("visible") && 
        event.target !== userMenu && 
        !userMenu.contains(event.target) && 
        !loginOptions.contains(event.target)) {
        
        console.log("🔴 Clic fuera del User Menu. Cerrando...");
        loginOptions.classList.remove("visible");
        loginOptions.style.display = "none";
    }
});














// Mostrar opciones del menú de login
function showMenu(menu) {
    let loginOptions = document.getElementById("loginOptions");
    loginOptions.classList.add("visible");
    loginOptions.innerHTML = ""; 

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

    // Agregar eventos de clic a las opciones después de actualizar el menú
    setTimeout(() => {
        loginOptions.querySelectorAll(".login-option, .back-option").forEach(option => {
            option.addEventListener("click", function (event) {
                event.stopPropagation();
    
                if (option.classList.contains("intra-login")) {
                    loginWithIntra();
                    return;
                }
    
                if (option.dataset.menu === "logout") {
                    console.log("⚠️ Clic en Log out detectado. Ejecutando logoutUser()...");
                    logoutUser();
                    return;
                }
    
                // 📝 🔄 Manejamos directamente las opciones de edición sin cambiar de menú
                if (option.dataset.menu === "edit-username") {
                    let newUsername = prompt("Enter new username:");
                    if (newUsername) console.log(`📝 Username changed to: ${newUsername}`);
                    return;
                }
    
                if (option.dataset.menu === "edit-password") {
                    let newPassword = prompt("Enter new password:");
                    if (newPassword) console.log("🔑 Password updated successfully.");
                    return;
                }
    
                if (option.dataset.menu === "edit-email") {
                    let newEmail = prompt("Enter new email:");
                    if (newEmail) console.log(`📧 Email updated to: ${newEmail}`);
                    return;
                }
    
                if (option.id === "toggle-2fa") {
                    let is2FAEnabled = confirm("Do you want to enable Two-Factor Authentication?");
                    if (is2FAEnabled) {
                        console.log("✅ 2FA Enabled!");
                        option.textContent = "Disable 2FA";
                    } else {
                        console.log("❌ 2FA Disabled.");
                        option.textContent = "Enable 2FA";
                    }
                    return;
                }
    
                // Si no es ninguna de estas acciones, cambiar de menú normalmente
                showMenu(option.dataset.menu);
            });
        });
    }, 100);
    
}






function handleMenuClick(eventOrSection) {
    let section;

    // 🔹 Si `eventOrSection` es un string, lo usamos directamente
    if (typeof eventOrSection === "string") {
        section = eventOrSection;
    } 
    // 🔹 Si es un evento, obtenemos `dataset.menu`
    else if (eventOrSection && eventOrSection.currentTarget) {
        section = eventOrSection.currentTarget.dataset.menu;
    } 
    else {
        console.error("❌ ERROR: handleMenuClick() recibió un valor inválido:", eventOrSection);
        return;
    }

    console.log(`📌 handleMenuClick() llamado con sección: ${section}`);

    if (!section) {
        console.warn("⚠️ Se intentó navegar a una sección vacía.");
        return;
    }

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

        // 🔹 Marcar usuario como logueado
        isLoggedIn = true;

        // 🔹 Actualizar la UI
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

    // 🔹 Validar credenciales antes de enviar
    if (!validateEmail(login)) {
        alert("❌ Please enter a valid email.");
        return;
    }
    if (password.length < 6) {
        alert("❌ Password must be at least 6 characters long.");
        return;
    }

    console.log("✅ Datos validados. Enviando...");

    // 🔹 Enviar credenciales al backend
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
            
            // 🔹 Sincronizar isLoggedIn y actualizar la UI
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
        
        // 🔹 Simular almacenamiento de tokens
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

    // 🔹 Validaciones básicas antes de enviar
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

    // 🔹 Enviar datos al backend
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

            // 🔹 Automáticamente inicia sesión después de registrarse
            handleSignInAfterSignUp(email, password);
        } else {
            alert(`❌ ${data.error}`);
        }
    })
    .catch(error => console.error("Error:", error));
}



// 🔹 Simulación de envío de datos de Sign up al backend
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

    isLoggedIn = true; // ✅ Marcamos al usuario como logeado

    // 🔹 Habilitar todas las opciones de menú que estaban inactivas
    document.querySelectorAll(".option-box").forEach(option => {
        if (!option.classList.contains("no-border")) {
            option.classList.remove("inactive");
            option.style.pointerEvents = "auto";
            option.style.opacity = "1";
        }
    });

    // 🔹 Reemplazar el loginBox por "Welcome, Player"
    const loginBox = document.getElementById("loginBox");
    loginBox.innerHTML = `<div id="userWelcome" class="menu-option">Welcome, <strong>Player</strong></div>`;

    const userWelcome = document.getElementById("userWelcome");

    // 🔹 Evento para iluminar al hacer clic en Welcome Player
    userWelcome.addEventListener("click", function(event) {
        event.stopPropagation(); // 🛑 Evita que el clic cierre inmediatamente la caja
        console.log("🟢 Clic en Welcome Player. Alternando iluminación...");

        // 🔥 Asegurar que la clase active se añade correctamente a loginBox
        loginBox.classList.add("active"); 

        // 🔹 Resaltar el botón y abrir menú de usuario
        updateActiveButton(userWelcome);
        openUserMenu();
    });

    // 🔹 Evento para apagar la iluminación si se hace clic fuera
    document.addEventListener("click", function(event) {
        if (!loginBox.contains(event.target)) {
            console.log("🔴 Clic fuera de Welcome Player. Apagando iluminación...");
            loginBox.classList.remove("active");
        }
    });

    // 🔹 Actualizar la UI
    history.replaceState(null, "", "#loged");
    updateView("loged");
}

























//  Nueva función para mostrar el menú del usuario cuando estamos logeados.
function openUserMenu() {
    console.log("🟢 Intentando abrir menú de usuario...");

    let loginOptions = document.getElementById("loginOptions");
    let playMenu = document.getElementById("playMenu"); // 🔹 Referencia al menú de Play

    // 🔴 Si Play Menu está abierto, cerrarlo primero
    if (playMenu && playMenu.classList.contains("visible")) {
        console.log("🔴 Play Menu está abierto, cerrándolo antes de abrir User Menu...");
        playMenu.classList.remove("visible");
    }

    // 🔹 Si el usuario está logeado, abrir menú de usuario
    if (isLoggedIn) {
        console.log("✅ Usuario logeado, mostrando User Menu...");
        showMenu("userMenu");
        loginOptions.classList.add("visible");
        loginOptions.style.display = "block";

        if (location.hash !== "#user-menu") {
            history.pushState(null, "", "#user-menu");
        }
    } else {
        console.warn("⚠️ Intento de abrir User Menu sin estar logeado. Abriendo Login.");
        showMenu("main");
    }
}














// Necesitaremos una funcion de deslogeo
function logoutUser() {
    console.log("🔴 Enviando logout al backend...");

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        console.warn("⚠️ No hay token de sesión, redirigiendo a login.");
        history.replaceState(null, "", "#login");
        updateView("login");
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
        // 🔹 Borrar tokens y restablecer la UI después del logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // 🔹 Asegurar que la sección #login existe
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

        // 🔹 Redirigir al usuario al login
        history.replaceState(null, "", "#login");
        updateView("login");
    });
}





function resetUI() {
    console.log("🔄 Restableciendo la interfaz a su estado inicial...");

    // 🔹 Desactivar todas las opciones excepto el login
    document.querySelectorAll(".option-box").forEach(option => {
        if (!option.classList.contains("no-border")) {
            option.classList.add("inactive");
            option.style.pointerEvents = "none";
            option.style.opacity = "0.5";  
        }
    });

    // 🔹 Restablecer el loginBox
    const loginBox = document.getElementById("loginBox");
    loginBox.innerHTML = `<div id="userWelcome" class="menu-option active">Welcome, <strong>Player</strong></div>`;
    loginBox.style.display = "flex";
    loginBox.style.alignItems = "center";
    loginBox.style.justifyContent = "center";

    loginBox.classList.remove("inactive");
    loginBox.style.pointerEvents = "auto";
    loginBox.style.opacity = "1";

    // 🔹 Ocultar el menú de login si estaba abierto
    const loginOptions = document.getElementById("loginOptions");
    loginOptions.classList.remove("visible");
    loginOptions.style.display = "none";

    // 🔹 Eliminar eventos antiguos y volver a asignarlos
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

    // 🔹 Limpiar menús flotantes
    closeLoginMenu();

    // 🔹 Forzar la actualización del idioma
    applyLanguage(localStorage.getItem("language") || "en");

    console.log("✅ Interfaz restablecida con éxito.");
}



function closeLoginMenu() {
    console.log("🔴 Cerrando menú de usuario...");

    let loginOptions = document.getElementById("loginOptions");

    if (loginOptions) {
        loginOptions.classList.remove("visible");
        loginOptions.style.display = "none";

        // ✅ Asegurar que el contenido del menú se vacíe para evitar restos visuales
        loginOptions.innerHTML = "";
    }

    let userMenu = document.getElementById("userWelcome");
    if (userMenu) {
        console.log("🔴 Ocultando User Menu...");
        userMenu.classList.remove("active");  
    }

    // ✅ Asegurar que no haya restos en el DOM
    let floatingMenu = document.querySelector(".floating-menu");
    if (floatingMenu) {
        console.log("🗑️ Eliminando restos de menús flotantes...");
        floatingMenu.remove();
    }
}


// Asegura que solo un botón tenga la clase .active
function updateActiveButton(newActiveButton) {
    document.querySelectorAll(".menu-option").forEach(button => {
        button.classList.remove("active"); // 🔹 Desactivamos todos los botones
    });

    if (newActiveButton) {
        newActiveButton.classList.add("active"); // 🔹 Activamos solo el nuevo
    }
}







// Función para aplicar las traducciones a los elementos que tienen el atributo "data-translate"
function applyLanguage(language) {
    console.log(`🌍 Aplicando idioma: ${language}`);

    // 🔹 Guardamos la selección del usuario
    localStorage.setItem("language", language);

    // 🔹 Actualizamos todos los elementos traducibles
    document.querySelectorAll("[data-translate]").forEach(element => {
        const key = element.getAttribute("data-translate");

        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });

    // 🔹 Asegurar que el botón de login muestra el idioma correcto
    const loginText = document.getElementById("loginText");
    if (loginText && translations[language]["login"]) {
        loginText.textContent = translations[language]["login"];
    }

    // 🔹 Si el menú de usuario está abierto, actualizarlo sin cerrarlo
    const loginOptions = document.getElementById("loginOptions");
    if (isLoggedIn && loginOptions && loginOptions.classList.contains("visible")) {
        showMenu("userMenu"); 
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
        "back": "← Retour"
    }
};