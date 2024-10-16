document
  .getElementById("apiForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const apiUrl = document.getElementById("apiUrl").value;
    const apiResponse = document.getElementById("apiResponse");
    apiResponse.innerHTML = "Fetching data...";

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      const data = await response.json();

      // Clear previous content
      apiResponse.innerHTML = ""; 

      // Check if the data is an array
      if (Array.isArray(data) && data.length > 0) {
        // Handling array of objects
        const table = document.createElement("table");
        table.className = "table table-striped";

        // Create table header
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        Object.keys(data[0]).forEach(key => {
          const th = document.createElement("th");
          th.innerText = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize first letter
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement("tbody");
        data.forEach(item => {
          const row = document.createElement("tr");
          Object.values(item).forEach(value => {
            const td = document.createElement("td");
            td.innerText = typeof value === 'object' ? JSON.stringify(value) : value; // Convert object to string if needed
            row.appendChild(td);
          });
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
        apiResponse.appendChild(table); // Append the table to the response box
      } else if (typeof data === 'object' && data !== null) {
        // Handling single object response
        const table = document.createElement("table");
        table.className = "table table-striped";

        // Create table header
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        Object.keys(data).forEach(key => {
          const th = document.createElement("th");
          th.innerText = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize first letter
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement("tbody");
        const row = document.createElement("tr");
        Object.values(data).forEach(value => {
          const td = document.createElement("td");
          td.innerText = typeof value === 'object' ? JSON.stringify(value) : value; // Convert object to string if needed
          row.appendChild(td);
        });
        tbody.appendChild(row);
        table.appendChild(tbody);
        apiResponse.appendChild(table); // Append the table to the response box
      } else {
        apiResponse.innerText = "No data found";
      }
    } catch (error) {
      apiResponse.innerText = `Error: ${error.message}`;
    }
  });
