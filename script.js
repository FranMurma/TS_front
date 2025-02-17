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
        console.warn(`⛔ Acceso denegado a '${section}' porque el usuario no está logeado.`);
        return;
    }

    console.log(`🔄 Navegando a: ${section}`);
    history.pushState({ page: section }, "", `#${section}`);
    updateView(section);
}



function updateView(section) {
    console.trace(`📌 updateView() llamado con sección: ${section}`);

    console.log(`🔄 Actualizando vista a: ${section}`);

    // Ocultar todas las secciones visibles
    document.querySelectorAll('.view-section').forEach(sec => sec.style.display = 'none');

    // 🔹 Manejo de usuario logeado
    if (isLoggedIn) {
        if (section === "login") {
            console.warn("⚠️ Intento de cambiar a login mientras está logeado. Corrigiendo a loged.");
            section = "loged";
        }

        let logedSection = document.getElementById("loged");
        if (!logedSection) {
            console.warn("⚠️ Se esperaba la sección #loged pero no existe. Creándola...");
            logedSection = document.createElement("div");
            logedSection.id = "loged";
            logedSection.classList.add("view-section");
            if (!document.getElementById("userWelcome")) {
                logedSection.innerHTML = `<h2 data-translate="welcome-player">${translations[localStorage.getItem("language") || "en"]["welcome-player"]}</h2>`;
            }
            document.body.appendChild(logedSection);
            console.log("✅ Se ha creado dinámicamente la sección #loged");
        }

        logedSection.style.display = "block";
    } 
    // 🔹 Manejo de usuario NO logeado
    else {
        if (section === "loged") {
            console.warn("⚠️ Intento de cambiar a loged sin estar logeado. Corrigiendo a login.");
            section = "login";
        }

        let loginSection = document.getElementById("login");
        if (!loginSection) {
            console.error("❌ ERROR: La sección #login no existe en el DOM. Redirigiendo a login...");
            section = "login";
        } else {
            loginSection.style.display = "block";
        }
    }

    // 🔹 Asegurar que la sección final existe antes de mostrarla
    const activeSection = document.getElementById(section);
    if (!activeSection) {
        console.error(`❌ ERROR: La sección #${section} no existe. Redirigiendo a login.`);
        updateView("login");
        return;
    }

    console.log(`✅ Mostrando sección: ${section}`);
    activeSection.style.display = 'block';
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
        userWelcome.addEventListener("click", function (event) {
            event.stopPropagation(); // Evita que el clic cierre el menú inmediatamente
            openUserMenu();
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


        // Evento para abrir/cerrar el submenú al hacer clic en Play
        playButton.addEventListener("click", function (event) {
            event.stopPropagation();
        
            // 🔹 Cerrar el menú de login si está abierto
            const loginOptions = document.getElementById("loginOptions");
            if (loginOptions.classList.contains("visible")) {
                loginOptions.classList.remove("visible");
            }
        
            // 🔹 Alternar la visibilidad del menú de Play
            playMenu.classList.toggle("visible");
        
            // 🔹 Cambiar el hash en la URL para reflejar que estamos en el menú de Play
            if (playMenu.classList.contains("visible")) {
                history.pushState(null, "", "#play-menu");
            } else {
                history.pushState(null, "", "#loged"); // Volver al estado logeado si se cierra
            }
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
        option.addEventListener("click", handleMenuClick);
    });

}); // ✅ Aquí cierra correctamente el `DOMContentLoaded`






// Restaurar la navegación con hashchange
// Restaurar la navegación con hashchange
window.addEventListener("hashchange", function() {
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
        menuContent = `
            <p class="login-option intra-login" data-text="already-42">${translations[lang]["already-42"]}</p>
            <div class="separator"></div>
            <p class="login-option" data-menu="sign-in" data-text="sign-in">${translations[lang]["sign-in"]}</p>
            <div class="separator"></div>
            <p class="login-option" data-menu="sign-up" data-text="sign-up">${translations[lang]["sign-up"]}</p>
            <div class="separator"></div>
            <p class="login-option" data-menu="forgot" data-text="forgot-password">${translations[lang]["forgot-password"]}</p>
        `;
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






function handleMenuClick(event) {
    const section = event.currentTarget.dataset.menu;

    if (!section) {
        console.warn("⚠️ No se encontró data-menu en:", event.currentTarget.innerText);
        return;
    }

    console.log(`🟢 Se hizo clic en: ${section}`);

    // 🚨 Evitar que Play cambie el hash
    if (section === "play") {
        console.log("🎮 Click en Play: No cambiamos el hash, solo mostramos el submenú.");
        return;
    }

    // Verificar si el usuario está logeado antes de permitir navegar
    if (!isLoggedIn && section !== "login") {
        console.warn(`⛔ Acceso denegado a '${section}', usuario no autenticado.`);
        return;
    }

    // Si ya estamos en la misma sección, no hacer nada
    if (location.hash === `#${section}`) {
        console.warn(`⚠️ Ya estamos en ${section}, evitando cambio innecesario.`);
        return;
    }

    // ✅ Cerrar el menú de usuario antes de cambiar de sección
    closeLoginMenu();

    // ✅ Cambiar el hash (esto activará el evento hashchange y llamará a updateView automáticamente)
    location.hash = section;
}









// Redirigir a la autenticación de 42 (datos fake)
function loginWithIntra() {
    console.log("🟢 Se ha hecho clic en Log in with intra");

    const fakeClientId = "123456789abcdef"; // ID FALSO SOLO PARA PRUEBAS
    const fakeRedirectUri = encodeURIComponent("http://localhost:3000/fake-callback");

    const fakeAuthUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${fakeClientId}&redirect_uri=${fakeRedirectUri}&response_type=code&scope=public`;

    console.log("🔵 Simulación de redirección a:", fakeAuthUrl);
    alert("✅ Simulación exitosa: Se intentaría redirigir a 42.");

    // 🔹 Simulación de login exitoso
    setTimeout(() => {
        activateMenus(); // Desbloquea el acceso al juego
        applyLanguage(localStorage.getItem("language") || "en");
        closeLoginMenu(); // Cierra la ventana de login
    }, 1000);
}


// Funcion que maneja el Sign in 
function handleSignIn() {
    const email = document.getElementById("signInEmail").value.trim();
    const password = document.getElementById("signInPassword").value.trim();

    //  Validar email y contraseña antes de enviar
    if (!validateEmail(email)) {
        alert("❌ Please enter a valid email.");
        return;
    }
    if (password.length < 6) {
        alert("❌ Password must be at least 6 characters long.");
        return;
    }

    console.log("✅ Datos validados. Enviando...");

    // 🔹 Enviar datos al backend (simulación)
    sendSignInRequest(email, password);
}

// 🔹 Validación de email con regex
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

    console.log("✅ Sign up successful. Sending data...");

    // 🔹 Simulación de registro en el backend
    sendSignUpRequest(username, email, password);
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

    isLoggedIn = true; // Marcamos al usuario como logeado

    const loginBox = document.getElementById("loginBox");

    // ✅ Verificar si #userWelcome ya existe antes de agregarlo
    let userWelcome = document.getElementById("userWelcome");
    if (!userWelcome) {
        console.log("🔍 No existe #userWelcome. Agregándolo en loginBox...");
        loginBox.innerHTML = `<span id="userWelcome">Welcome, <strong>Player</strong></span>`;
        userWelcome = document.getElementById("userWelcome"); // Lo reasignamos después de crearlo
    } else {
        console.log("⚠️ #userWelcome ya existe, no lo agregamos de nuevo.");
    }

    // ✅ Asegurar que "Welcome, Player" tenga evento de clic solo una vez
    userWelcome.removeEventListener("click", openUserMenu); // Eliminar posibles eventos duplicados
    userWelcome.addEventListener("click", function (event) {
        console.log("🟢 Se ha hecho clic en Welcome Player. Abriendo User Menu...");
        openUserMenu();
        event.stopPropagation(); // ✅ Evita que el clic se propague y cierre el menú inmediatamente
    });

    // ✅ Activar opciones de menú
    document.querySelectorAll(".option-box").forEach(option => {
        if (!option.classList.contains("no-border")) { 
            option.classList.remove("inactive");
            option.style.pointerEvents = "auto";  
            option.style.opacity = "1";  
        }
    });

    // ✅ Cambiar el hash a "#loged" para indicar que el usuario está logeado
    history.replaceState(null, "", "#loged");

    // ✅ Forzar la actualización de la vista
    setTimeout(() => {
        updateView("loged");
    }, 50);
}




















//  Nueva función para mostrar el menú del usuario cuando estamos logeados.
function openUserMenu() {
    console.log("🟢 Abriendo menú de usuario...");

    let loginOptions = document.getElementById("loginOptions");
    let playMenu = document.getElementById("playMenu"); // 🔹 Referencia al menú de Play

    if (playMenu && playMenu.classList.contains("visible")) {
        console.log("🔴 Cerrando Play Menu antes de abrir User Menu...");
        playMenu.classList.remove("visible");
    }

    if (isLoggedIn) {
        showMenu("userMenu");
        loginOptions.classList.add("visible");
        loginOptions.style.display = "block";

        if (location.hash !== "#user-menu") {
            history.pushState(null, "", "#user-menu");
        }
    } else {
        console.warn("⚠️ Intento de abrir menú de usuario sin estar logeado. Abriendo login.");
        showMenu("main");
    }
}













// Necesitaremos una funcion de deslogeo
function logoutUser() {
    console.log("🔴 logoutUser() se está ejecutando...");
    
    isLoggedIn = false;
    localStorage.removeItem("userSession"); // Borra cualquier sesión guardada (si se usa localStorage)
    
    location.reload(); // 👈 Recargar la página para un "reset total"
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








// Función para aplicar las traducciones a los elementos que tienen el atributo "data-translate"
function applyLanguage(language) {
    localStorage.setItem("language", language); // Guardamos el idioma seleccionado

    // Actualizar todos los elementos que tengan data-translate
    document.querySelectorAll("[data-translate]").forEach((element) => {
        const key = element.getAttribute("data-translate");

        // ❌ Evitar sobrescribir loginBox si el usuario está logeado
        if (element.id === "loginBox" && isLoggedIn) {
            console.warn("⚠️ Omitiendo traducción de loginBox porque el usuario ya está logeado.");
            return;
        }
        
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });

    let loginOptions = document.getElementById("loginOptions");

    // ✅ Solo cerramos y reabrimos el menú si el usuario NO está logeado
    if (loginBox && loginOptions) {
        loginBox.addEventListener("click", function (event) {
            event.stopPropagation();
    
            if (isLoggedIn) {
                console.log("🟢 Usuario logeado, abriendo menú de usuario...");
                openUserMenu(); // Mostrar menú de usuario en vez del de login
            } else {
                console.log("🔴 Usuario no logeado, mostrando opciones de login...");
    
                // 🔹 Cerrar el menú de Play si está abierto
                const playMenu = document.getElementById("playMenu");
                if (playMenu && playMenu.classList.contains("visible")) {
                    playMenu.classList.remove("visible");
                }
    
                if (!loginOptions.classList.contains("visible")) {
                    loginOptions.classList.add("visible");
                    showMenu("main");
                }
            }
        });
    }
    
    // ✅ Si el usuario está logeado y tiene el menú de usuario abierto, lo actualizamos sin cerrarlo
    else if (isLoggedIn && loginOptions.classList.contains("visible")) {
        showMenu("userMenu"); // Asegurar que el menú de usuario no desaparezca
    }
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