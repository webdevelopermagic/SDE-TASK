document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("submitForm");
    const snippetBody = document.getElementById("snippetBody");

    // Function to fetch and display snippets
    function fetchSnippets() {
        fetch("http://your-backend-domain.com/api/snippets") // Replace with your backend URL
            .then(response => response.json())
            .then(snippets => {
                snippetBody.innerHTML = ""; // Clear previous snippets
                snippets.forEach(snippet => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${snippet.username}</td>
                        <td>${snippet.language}</td>
                        <td>${snippet.stdin}</td>
                        <td>${snippet.code.substring(0, 100)}</td>
                        <td>${new Date(snippet.created_at).toLocaleString()}</td>
                    `;
                    snippetBody.appendChild(row);
                });
            })
            .catch(error => console.error("Error fetching snippets:", error));
    }

    // Event listener for form submission
    submitForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(submitForm);
        const snippetData = {};
        formData.forEach((value, key) => {
            snippetData[key] = value;
        });

        // Submit snippet data
        fetch("http://your-backend-domain.com/api/snippets", { // Replace with your backend URL
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(snippetData)
        })
            .then(response => response.json())
            .then(() => {
                fetchSnippets(); // Refresh snippet list
                submitForm.reset(); // Clear form fields
            })
            .catch(error => console.error("Error submitting snippet:", error));
    });

    // Fetch snippets on page load
    fetchSnippets();
});
