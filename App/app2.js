
function obtenerFechaActual() {
    const hoy = new Date();
  
    const año = hoy.getFullYear();
    let mes = (hoy.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son 0-11, por eso se suma 1
    let día = hoy.getDate().toString().padStart(2, '0');
  
    return `${año}-${mes}-${día}`;
  }

  function redirigir(id) {
    const url = new URL(window.location.href);
    url.searchParams.set('FolderId', id); // Añade o reemplaza el parámetro FolderId
    window.location.href = url.toString(); // Redirige a la nueva URL con el parámetro actualizado
}

/* function cargar(file) {
    if (file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = function () {
            const arraybuffer = reader.result;

            const bytes = new Uint8Array(arraybuffer);

            const blob = new Blob([bytes], { type: file.type });
            const url = URL.createObjectURL(blob);

            const binaryString = Array.from(bytes).map( byte => String.fromCharCode(byte)).join("");
            
            const base64String = btoa(binaryString);
            console.log(file.type);
            let datosNuevos = {
                fileName : file.name,
                fileExtension : file.type,
                folderId : localStorage.getItem("carpeta"),
                createAt : "2024-07-05",
                userId : 1,
                content : base64String,
                Status : "ACTIVE"
            }

            console.log(JSON.stringify(datosNuevos));

            fetch('http://datahive.somee.com/api/files', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosNuevos)
            }).then(response => {
                return response.json();
            }).then(data => {

                if (data) {
                    alert("Se creo con exito");
                    console.log(data);
                    location.reload();
                }
            });
        }
    }
} */

function GetAllFiles(id){
    console.log(id);
    fetch(`http://datahive.somee.com/api/files/byfolderid/${id}`)
   .then(response => response.json())
   .then(data => {
        Array.from(data).forEach(element => {
            if(element.fileExtension.includes("image") && element.status == "INACTIVE"){

                const base64String = element.content;
                const binaryString = atob(base64String);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                const blob = new Blob([bytes], { type: element.fileExtension });
                const url = URL.createObjectURL(blob);

               
                    const nombreMostrado = element.fileName.length > 5 ? element.fileName.substring(0, 5) + "..." : element.fileName;
                    const agregar = document.getElementById("agregar");
                    const div = document.createElement("div");
                    div.classList.add("container", "py-6", "px-4");
                    div.innerHTML = `
                        <div class="max-w-xs rounded overflow-hidden">
                            <img class="w-12 h-12 object-cover agregar" src="${url}" oncontextmenu="openMenu2(event, this, ${element.id})" data-type="file"
                                alt="Icono de carpeta">
                            <div class=" mt-2" title="${element.fileName}">${nombreMostrado} </div>
                        </div>`;
                    document.getElementById("files").insertBefore(div, agregar);
            }

            else if(element.fileExtension.includes("pdf") && element.status == "INACTIVE"){
                const nombreMostrado = element.fileName.length > 5 ? element.fileName.substring(0, 5) + "..." : element.fileName;
                    const agregar = document.getElementById("agregar");
                    const div = document.createElement("div");
                    div.classList.add("container", "py-6", "px-4");
                    div.innerHTML = `
                        <div class="max-w-xs rounded overflow-hidden">
                            <img class="w-12 h-12 object-cover agregar" src="../Images/pdf.png" oncontextmenu="openMenu2(event, this, ${element.id})" data-type="file"
                                alt="Icono de carpeta">
                            <div class=" mt-2" title="${element.fileName}">${nombreMostrado} </div>
                        </div>`;
                    document.getElementById("files").insertBefore(div, agregar);
            }

            else if(element.fileName.includes("docx") && element.status == "INACTIVE"){
                const nombreMostrado = element.fileName.length > 5 ? element.fileName.substring(0, 5) + "..." : element.fileName;
                    const agregar = document.getElementById("agregar");
                    const div = document.createElement("div");
                    div.classList.add("container", "py-6", "px-4");
                    div.innerHTML = `
                        <div class="max-w-xs rounded overflow-hidden">
                            <img class="w-12 h-12 object-cover agregar" src="../Images/word.png" oncontextmenu="openMenu2(event, this, ${element.id})" data-type="file"
                                alt="Icono de carpeta">
                            <div class=" mt-2" title="${element.fileName}">${nombreMostrado} </div>
                        </div>`;
                    document.getElementById("files").insertBefore(div, agregar);
            }
        });
    });
}

function GetFolderContent(){
    const url = new URL(window.location.href);
    const param = new URLSearchParams(url.search);
    const folderId = param.get('FolderId');
    
    if(folderId == null){
        //se cambia por el id guardado en sesion storage
        GetIndexFolder(localStorage.getItem("user"));
        console.log(localStorage.getItem("user"));
    }
    
    else{
        GetFolderContentByParentId(folderId);
        localStorage.setItem("carpeta", folderId);
    }
}
function GetIndexFolder(id){
    fetch(`http://datahive.somee.com/api/Folders/index/${id}`)
   .then(response => response.json())
   .then(data => {
        //console.log(data);
        GetFolderContentByParentId(data.id);
        localStorage.setItem("carpeta", data.id);
    });
}

function GetFolderContentByParentId(id){
    fetch(`http://datahive.somee.com/api/Folders/Byparent/${id}`)
   .then(response => response.json())
   .then(data => {
        PintarContenidoCarpetas(data);
        GetAllFiles(id);
    });
}

function PintarContenidoArchivos(data){

}

function izquierdo(este){
    este.preventDefault();
    console.log("izquierdo")
}

function PintarContenidoCarpetas(data){
    Array.from(data).forEach(element =>{
        if(element.status == "INACTIVE"){
            const nombreMostrado = element.folderName.length > 5 ? element.folderName.substring(0, 5) + "..." : element.folderName;
            const agregar = document.getElementById("agregar");
            const div = document.createElement("div");
            div.classList.add("container", "py-6", "px-4");
            div.innerHTML = `
                <div class="max-w-xs rounded overflow-hidden">
                    <img class="w-12 h-12 object-cover agregar" onclick="redirigir(${element.id})" oncontextmenu="openMenu2(event, this, ${element.id})" data-type="folder" src="../Images/folder.webp"
                        alt="Icono de carpeta">
                    <div class=" mt-2" title="${element.folderName}">${nombreMostrado} </div>
                </div>`;
            document.getElementById("files").insertBefore(div, agregar);
        }
    });
}

function GetFolderContentById(id){
    fetch(`http://datahive.somee.com/api/Folders/Byid/${id}`)
   .then(response => response.json())
   .then(data => {
        console.log(data);
    });
}

/* function agregar() {
    const nombreCarpeta = prompt("Ingrese el nombre de la carpeta:");
    if (nombreCarpeta) { // Verificar si el usuario ingresó un nombre
        // Truncar el nombre si es demasiado largo
        const nombreMostrado = nombreCarpeta.length > 5 ? nombreCarpeta.substring(0, 5) + "..." : nombreCarpeta;
        
        let carpeta = {
            folderName : nombreCarpeta,
            parentFolderID : localStorage.getItem("carpeta"),
            userId : 1,
            createAt : obtenerFechaActual(),
            status: "ACTIVE"
        }
        const idcarpeta = 0;

        fetch('http://datahive.somee.com/api/Folders', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(carpeta)
            }).then(response => {
                return response.json();
            }).then(data => {

                if (data) {
                    const agregar = document.getElementById("agregar");
        const div = document.createElement("div");
        div.classList.add("container", "py-6", "px-4");
        div.innerHTML = `
            <div class="max-w-xs rounded overflow-hidden">
                <img class="w-12 h-12 object-cover agregar" onclick="redirigir(${data.id})" oncontextmenu="openMenu2(event, this, ${element.id})" data-type="folder" src="../Images/folder.webp"
                    alt="Icono de carpeta">
                <div class=" mt-2" title="${nombreCarpeta}">${nombreMostrado} </div>
            </div>`;
        document.getElementById("files").insertBefore(div, agregar);
                }
            });        
    }
} */



function openMenu(event) {
    const menu = document.getElementById('miniMenu');
    const button = document.getElementById('menuButton');
    
    const rect = button.getBoundingClientRect();
    menu.style.top = `${rect.top + window.scrollY + rect.height}px`;
    menu.style.left = `${rect.left + window.scrollX}px`;
    menu.classList.toggle('hidden');
}

function openMenu2(event, element, id) {
    event.preventDefault();
    const menu = document.getElementById('miniMenu2');
    const button = document.getElementById('menuButton');
    
    const rect = element.getBoundingClientRect();
    menu.style.top = `${rect.top + window.scrollY + rect.height}px`;
    menu.style.left = `${rect.left + window.scrollX}px`;
    menu.classList.toggle('hidden');

    const edit = document.getElementById("edit");
    const delet = document.getElementById("delete");
    let tipo = element.dataset.type;

    edit.setAttribute("onclick", `Editarnombre("${tipo}", ${id})`);
    delet.setAttribute("onclick", `Eliminar("${tipo}", ${id})`);
}

function agregarCarpeta() {
    agregar();
    const menu = document.getElementById('miniMenu');
    menu.classList.toggle('hidden');
}

function subirArchivo() {
}

function Eliminar(tipo, id){
    let punto = "";

    if(tipo == "folder"){
        punto = "Folders";
    }
    else{
        punto = "files";
    }
    obj = {}
    fetch(`http://datahive.somee.com/api/${punto}/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            }).then(response => {
                return response.json();
            }).then(data => {
                console.log(data);
                location.reload();
            });
}

function Editarnombre(tipo, id){
    const nombreCarpeta = prompt("Ingrese el nuevo nombre de la carpeta:");

    let punto = "";

    let obj = {
        id: id,
    };

    if(tipo == "folder"){
        obj.FolderName = nombreCarpeta;
        punto = "Folders";
    }
    else{
        obj.FileName = nombreCarpeta;
        punto = "Files";
    }
    fetch(`http://datahive.somee.com/api/${punto}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            }).then(response => {
                return response.json();
            }).then(data => {
                console.log(data);
                location.reload();
            });
}
document.addEventListener('DOMContentLoaded', function() {
    const uploadButton = document.getElementById('upload-file');
    const fileInput = document.getElementById('file-input');
  
    // Manejar el clic en el botón de subir archivo
    uploadButton.addEventListener('click', function() {
      fileInput.click(); // Simula un clic en el input file oculto
    });
  
    // Manejar la selección del archivo
    fileInput.addEventListener('change', function(event) {
      const file = event.target.files[0]; // Obtiene el archivo seleccionado
      if (file) {
        console.log('Archivo seleccionado:', file.name);
        // Aquí puedes añadir la lógica para manejar el archivo (por ejemplo, subirlo al servidor)
        cargar(file);
      }
    });
  });

document.addEventListener('click', function(event) {
    const menu = document.getElementById('miniMenu');
    const button = document.getElementById('menuButton');
    if (!menu.contains(event.target) && !button.contains(event.target)) {
        menu.classList.add('hidden');
    }
});

let modalCerrar = document.getElementById("modalCerrar");


modalCerrar.addEventListener("click", function() {
    $('#logoutModal').modal('show'); 
});

document.getElementById("confirmLogout").addEventListener("click", function() {
    window.location.href = '../pages/login.html'; 
});




// Función para alternar el tema y cambiar la imagen
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');

    if (!body.classList.contains('dark-theme')) {
        body.classList.add('dark-theme');
        body.style.backgroundColor = '#333';
        body.style.color = 'white';
      
        themeIcon.src = '../Src/Images/icons8-emoji-de-luna-llena-48.png'; 
    } else {
        body.classList.remove('dark-theme');
        body.style.backgroundColor = '';
        body.style.color = '';
        themeIcon.src = '../Images/icons8-sol-64.png';
    }
}

document.getElementById('sol').addEventListener('click', toggleTheme);