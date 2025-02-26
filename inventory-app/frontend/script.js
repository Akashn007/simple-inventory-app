document.addEventListener("DOMContentLoaded", () => {
    // Fetch item types and populate the dropdown
    fetch("http://localhost:5000/api/item-types")
        .then(res => res.json())
        .then(data => {
            console.log("Fetched item types:", data);
            const select = document.getElementById("itemType");
            select.innerHTML = '<option value="">Select Item Type</option>';
            data.forEach(type => {
                select.innerHTML += `<option value="${type.id}">${type.type_name}</option>`;
            });
        })
        .catch(error => console.error("Error fetching item types:", error));

    // Handle form submission
    document.getElementById("itemForm").addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent page reload
        
        const name = document.getElementById("name").value;
        const purchase_date = document.getElementById("purchaseDate").value;
        const stock_available = document.getElementById("stockAvailable").checked ? 1 : 0;
        const item_type_id = document.getElementById("itemType").value;

        if (!name || !purchase_date || !item_type_id) {
            alert("Please fill all fields!"); // Alert user if fields are empty
            return;
        }

        fetch("http://localhost:5000/api/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, purchase_date, stock_available, item_type_id })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Item added:", data);
            alert("Item added successfully!");
            location.reload(); // Reload page to update list
        })
        .catch(error => console.error("Error adding item:", error));
    });
});

// Function to fetch and display items in the table
function fetchItems() {
    fetch("http://localhost:5000/api/items")
        .then(res => res.json())
        .then(data => {
            console.log("Fetched items:", data); // Debugging log
            const tableBody = document.getElementById("itemTableBody");
            tableBody.innerHTML = ""; // Clear existing rows

            if (data.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='6'>No items found</td></tr>";
                return;
            }

            data.forEach((item, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.type_name}</td>
                    <td>${item.purchase_date}</td>
                    <td>${item.stock_available ? "✅ Yes" : "❌ No"}</td>
                    <td>
                        <button onclick="deleteItem(${item.id})">🗑 Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching items:", error));
}

// Function to delete an item
function deleteItem(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    fetch(`http://localhost:5000/api/items/${id}`, { method: "DELETE" })
        .then(() => {
            alert("Item deleted successfully!");
            fetchItems(); // Refresh table
        })
        .catch(error => console.error("Error deleting item:", error));
}

// Fetch items when page loads
fetchItems();

function deleteItem(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    fetch(`http://localhost:5000/api/items/${id}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        console.log("Delete Response:", data);
        alert("Item deleted successfully!");
        fetchItems(); // Refresh the table
    })
    .catch(error => console.error("Error deleting item:", error));
}
