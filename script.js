// Para poder hacer back y forward en el navegador!!
document.addEventListener("DOMContentLoaded", function () {
    // 🔹 Si la página se carga sin un hash, establecemos un estado inicial en el historial
    if (!window.location.hash) {
        history.pushState({ menu: "home" }, '', window.location.pathname);
    }

    // 🔹 Si hay un hash en la URL, lo usamos para cargar el menú correcto
    if (window.location.hash) {
        const menu = window.location.hash.substring(1);
        showMenu(menu);
    }

    // 🔹 Manejo del botón "Atrás" del navegador para cambiar entre menús
    window.addEventListener("popstate", function (event) {
        if (event.state && event.state.menu) {
            showMenu(event.state.menu);
        } else {
            showMenu("home"); // Volvemos al estado inicial
        }
    
        // 🔹 Si el usuario presiona "Atrás", también cerramos la caja de login
        let loginOptions = document.getElementById("loginOptions");
        if (loginOptions) {
            loginOptions.classList.remove("visible");
            loginOptions.style.opacity = "0";
            loginOptions.style.visibility = "hidden";
    
            // 🔹 Esperamos 300ms para eliminar el contenido y evitar "recuerdos"
            setTimeout(() => {
                loginOptions.innerHTML = "";
            }, 300);
        }
    });

    // 🔹 Manejo del botón "Atrás" para mostrar aviso en index.html (evitar salir accidentalmente)
    window.addEventListener("popstate", function (event) {
        if (!event.state || event.state.menu === "home") {
            console.log("⚠️ Intento de salir detectado.");
            const confirmExit = confirm("⚠️ Vas a salir de la página, ¿estás seguro?");
            if (!confirmExit) {
                history.pushState({ menu: "home" }, '', window.location.pathname);
            }
        }
    });
});



// Función para cambiar de menú y actualizar la URL sin recargar
function navigateTo(menu) {
    history.pushState({ menu }, '', `#${menu}`);
    showMenu(menu);
}

// !!!!! Protección del juego contra el botón "Atrás"
function enterGame() {
    console.log("🎮 Entrando al juego...");

    // 🔹 Reemplazar el estado actual para que "Atrás" no saque al usuario
    history.replaceState({ menu: "game" }, '', window.location.pathname);

    // 🔹 Evitar que "Atrás" saque al usuario del juego
    window.addEventListener("popstate", function (event) {
        if (event.state && event.state.menu === "game") {
            console.log("🚫 Botón 'Atrás' bloqueado en el juego.");
            history.pushState({ menu: "game" }, '', window.location.pathname);
        }
    });

    // 🔹 Deshabilitar teclas de navegación
    window.addEventListener("keydown", function (event) {
        if ((event.key === "Backspace" || event.key === "ArrowLeft") && event.altKey) {
            event.preventDefault();
            console.log("🚫 Navegación deshabilitada en el juego.");
        }
    });

    loadGame(); // Aquí se inicia el juego
}



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



//  Manejo del menú de login, de momento el unico que hace algo
document.addEventListener("DOMContentLoaded", function () {
    const loginBox = document.getElementById("loginBox");

    loginBox.addEventListener("click", function (event) {
        let loginOptions = document.getElementById("loginOptions");

        if (!loginOptions.classList.contains("visible")) {
            loginOptions.classList.add("visible");
            loginOptions.style.opacity = "1"; 
            loginOptions.style.visibility = "visible"; 
            showMenu("main");
        }

        event.stopPropagation(); // ❌ Evita que el clic en el loginBox lo cierre
    });

    // cerrar el LoginBox al hacer clic fuera
    document.addEventListener("click", function (event) {
        if (!loginBox.contains(event.target) && !loginOptions.contains(event.target)) {
            closeLoginMenu();
        }
    });

    // ✅ Evitar que "Welcome, Player" cierre el menú
    document.addEventListener("click", function (event) {
        if (event.target.id === "userWelcome") {
            event.stopPropagation();
            openUserMenu();
        }
    });
});





// Mostrar opciones del menú de login
function showMenu(menu) {
    let loginOptions = document.getElementById("loginOptions");
    loginOptions.classList.add("visible");
    loginOptions.innerHTML = ""; 

    let menuContent = "";

    if (menu === "main") {
        menuContent = `
            <p class="login-option intra-login" data-text="Already a 42 member? Log in with intra"></p>
            <div class="separator"></div>
            <p class="login-option" data-menu="email" data-text="Sign in with email"></p>
            <div class="separator"></div>
            <p class="login-option" data-menu="forgot" data-text="Forgot your password?"></p>
        `;
    } 
    else if (menu === "email") { 
        menuContent = `
            <p class="submenu-text" data-text="Sign in with Email"></p>
            <input type="text" id="signInEmail" class="login-input" placeholder="Email">
            <input type="password" id="signInPassword" class="login-input" placeholder="Password">
            <button class="login-submit" onclick="handleSignIn()">Sign in</button>
            <p class="back-option" data-menu="main">← Back</p>
        `;
    }    
    else if (menu === "forgot") {
        menuContent = `
            <p class="submenu-text" data-text="Reset your password"></p>
            <input type="email" class="login-input" placeholder="Enter your email">
            <button class="login-submit" onclick="resetPassword()">Send reset link</button>
            <p class="back-option" data-menu="main" data-text="← Back"></p>
        `;
    }
    // Para cuando estamos logeados, el menu del user
    else if (menu === "userMenu") {
        menuContent = `
            <p class="submenu-text" data-text="User Options"></p>
            <p class="login-option" data-menu="profile" data-text="Profile Settings"></p>
            <div class="separator"></div>
            <p class="login-option" data-menu="logout" data-text="Log out"></p>
        `;
    }
    else if (menu === "logout") {
        logoutUser();
    }
    

    loginOptions.innerHTML = menuContent;

    // 🔹 Aplicar efecto máquina de escribir en cada opción
    setTimeout(() => {
        const options = loginOptions.querySelectorAll("p[data-text]");
        let counter = 0;

        function writeNextOption() {
            if (counter < options.length) {
                let option = options[counter];
                option.innerHTML = ""; // Vacía el texto
                typeWriterEffect(option, option.dataset.text, 20, () => {
                    counter++;
                    writeNextOption();
                });
            }
        }

        writeNextOption();
    }, 100);

    // Agregar eventos de clic a las opciones después de actualizar el menú
    setTimeout(() => {
        loginOptions.querySelectorAll(".login-option, .back-option").forEach(option => {
            option.addEventListener("click", function (event) {
                event.stopPropagation();

                // Si es "Log in with intra", ejecutamos la función directamente
                if (option.classList.contains("intra-login")) {
                    loginWithIntra();
                    return;
                }

                navigateTo(option.dataset.menu);
            });
        });
    }, 100);
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

// COn el forgot your password. Simulacion de envio de reset link
function resetPassword() {
    console.log("🔵 Se ha hecho clic en 'Reset Password'");
    alert("✅ Simulación: Se enviaría un email con el enlace de recuperación.");
}

// Para cerrar el menu
function closeLoginMenu() {
    console.log("🔴 Se está cerrando el menú de login.");
    
    let loginOptions = document.getElementById("loginOptions");
    loginOptions.classList.remove("visible");

    // 🔹 Asegurar que el menú está listo para abrirse de nuevo
    setTimeout(() => {
        loginOptions.style.opacity = "0"; 
        loginOptions.style.visibility = "hidden"; 
        loginOptions.innerHTML = ""; // Borra el contenido anterior
    }, 300);
}



// Habilitar los menús después del login
function activateMenus() {
    console.log("🟢 Activando menús...");

    // 🔹 Desbloquear los menús del juego
    document.querySelectorAll(".option-box").forEach(option => {
        option.classList.remove("inactive");
        option.style.pointerEvents = "auto";
    });

    // 🔹 Buscar el loginBox y cambiar el contenido
    const loginBox = document.getElementById("loginBox");
    loginBox.innerHTML = `<span id="userWelcome">Welcome, <strong>Player</strong></span>`;

    // 🔹 Asegurar que el evento de clic se agregue solo una vez
    const userWelcome = document.getElementById("userWelcome");
    if (userWelcome) {
        userWelcome.removeEventListener("click", openUserMenu); 
        userWelcome.addEventListener("click", openUserMenu);
    }

    // ✅ Ahora abrimos el menú de usuario tras un pequeño retraso
    setTimeout(() => {
        openUserMenu();
    }, 200);
}






//  Nueva función para mostrar el menú del usuario cuando estamos logeados.
function openUserMenu() {
    console.log("🟢 Abriendo menú de usuario...");

    let loginOptions = document.getElementById("loginOptions");

    // 🔹 Asegurar visibilidad
    loginOptions.classList.add("visible");
    loginOptions.style.display = "block"; 

    // 🔹 Mostrar las opciones de usuario
    navigateTo("userMenu");
}





// Necesitaremos una funcion de deslogeo
function logoutUser() {
    console.log("🔴 Se ha hecho clic en Log out. Cerrando sesión...");
    
    // ✅ Reiniciar la UI completamente
    resetUI();
}


function resetUI() {
    console.log("🔄 Reiniciando interfaz...");

    // 🔹 Bloquear nuevamente los menús
    document.querySelectorAll(".option-box").forEach(option => {
        if (option.id !== "loginBox") {
            option.classList.add("inactive");
            option.style.pointerEvents = "none";
        }
    });

    // 🔹 Restaurar el loginBox al estado inicial
    const loginBox = document.getElementById("loginBox");
    loginBox.innerHTML = "Log in / Sign in";

    // ✅ Asegurar que el botón sigue siendo interactivo
    loginBox.classList.remove("inactive");
    loginBox.style.pointerEvents = "auto";

    // 🔹 Asegurar que loginOptions está oculto y listo para mostrarse
    let loginOptions = document.getElementById("loginOptions");
    loginOptions.classList.remove("visible");
    loginOptions.style.display = "none"; // 🔹 Ocultarlo por completo antes de reactivar

    // ✅ Evitar eventos duplicados eliminando el viejo y creando uno nuevo
    const newLoginBox = loginBox.cloneNode(true);
    loginBox.parentNode.replaceChild(newLoginBox, loginBox);

    // 🔹 Reasignar el evento de clic al nuevo loginBox
    newLoginBox.addEventListener("click", function () {
        console.log("🟢 Se ha hecho clic en Log in / Sign in");
        if (!loginOptions.classList.contains("visible")) {
            loginOptions.classList.add("visible");
            loginOptions.style.display = "block"; // 🔹 FORZAR VISIBILIDAD DEL MENÚ
            navigateTo("main");
        }
    });

    // 🔹 Cerrar el menú de usuario si estaba abierto
    closeLoginMenu();
}







