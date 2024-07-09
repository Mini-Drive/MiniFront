const userId = localStorage.getItem("userId"); 

fetch(`http://localhost:5155/api/files/deleted/${userId}`)
.then(response => response.json())
.then(data => {
    const list = document.getElementById('deletedFilesList');
    list.innerHTML = ''; 

    data.forEach(file => {
        const listItem = document.createElement('li');
        const image = document.createElement('img');
        image.src = file.imageUrl; 
        image.alt = file.name; 
        image.style.width = '100px'; 
        listItem.appendChild(image);
        listItem.appendChild(document.createTextNode(file.name)); 
        list.appendChild(listItem);
    });
})
.catch(error => {
    console.error('Error fetching deleted files:', error);
});