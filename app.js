

function cargar() {
    const input = document.getElementById("file-input");
    const file = input.files[0];
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



            const img = document.createElement("img");
            img.src = url
            document.body.appendChild(img);
            
            console.log(file.type);
            let datosNuevos = {
                fileName : file.name,
                fileExtension : file.type,
                folderId : 1,
                createAt : "2024-07-05",
                userId : 1,
                content : base64String
            }

            console.log(base64String);

            fetch('http://localhost:5155/api/files', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosNuevos)
            }).then(response => {
                return response.json();
            }).then(data => {

                if (data) {
                    alert("Se creo con exito")
                }
            });
        }
    }
}