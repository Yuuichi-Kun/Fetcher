document
  .getElementById("apiForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const apiUrl = document.getElementById("apiUrl").value.trim(); // Mengambil nilai dari input URL
    const userId = document.getElementById("userId") ? document.getElementById("userId").value : null; // Ambil User ID jika ada
    const apiTableContainer = document.getElementById("apiResponse"); // Menyimpan data hasil

    if (!apiUrl) {
      apiTableContainer.innerHTML = "<p>Please enter a valid API URL</p>";
      return;
    }

    apiTableContainer.innerHTML = "Fetching data..."; // Tampilkan pesan fetching

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Error fetching data: " + response.statusText);
      }

      const data = await response.json();

      // Clear previous content
      apiTableContainer.innerHTML = ""; 

      if (Array.isArray(data) && data.length > 0) {
        apiTableContainer.appendChild(generateTableDOM(data));
      } else if (typeof data === 'object' && data !== null) {
        apiTableContainer.appendChild(generateTableDOM([data])); // Untuk objek tunggal, jadikan sebagai array
      } else {
        apiTableContainer.innerText = "No data found";
      }
    } catch (error) {
      apiTableContainer.textContent = `Error: ${error.message}`;
    }
  });

// Function untuk menangani objek bersarang seperti 'address' dan 'company'
function generateTableDOM(data) {
  const table = document.createElement("table");
  table.className = "table table-bordered";

  // Create table header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  Object.keys(data[0]).forEach((key) => {
    const th = document.createElement("th");
    th.innerText = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize first letter
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");
  data.forEach((item) => {
    const row = document.createElement("tr");
    Object.keys(item).forEach((key) => {
      const td = document.createElement("td");

      if (typeof item[key] === "object" && item[key] !== null) {
        // Handle nested object for address and company
        if (key === "address") {
          td.innerHTML = `
            ${item[key].street}, ${item[key].suite}, ${item[key].city}, ${item[key].zipcode}
            <br/>
            Geo: (${item[key].geo.lat}, ${item[key].geo.lng})
          `;
        } else if (key === "company") {
          td.innerHTML = `
            ${item[key].name} <br/>
            CatchPhrase: ${item[key].catchPhrase} <br/>
            BS: ${item[key].bs}
          `;
        } else {
          td.innerText = "Object";
        }
      } else {
        td.innerText = item[key];
      }
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  return table;
}
