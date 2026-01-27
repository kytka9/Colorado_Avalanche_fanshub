
document.querySelectorAll('th').forEach(header => {
    header.style.cursor = 'pointer'; // Changes the cursor to a hand to make it clear that it is clickable
    header.addEventListener('click', () => {
        const table = header.closest('table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const index = Array.from(header.parentElement.children).indexOf(header);
        const isAscending = header.dataset.order === 'asc';
        
        // Function to "clean" values ​​for correct comparison
        const getCellValue = (row, idx) => {
            let val = row.children[idx].innerText || row.children[idx].textContent;
            
            // Special processing for height (e.g. 6'4")
            if (val.includes("'")) {
                const parts = val.replace('"', '').split("'");
                return (parseInt(parts[0]) * 12) + parseInt(parts[1]);
            }
            
            // If it's a number (e.g. weight or jersey number), return it as a number
            return isNaN(val) ? val.toLowerCase() : parseFloat(val);
        };

        // Sorting
        rows.sort((rowA, rowB) => {
            const v1 = getCellValue(rowA, index);
            const v2 = getCellValue(rowB, index);
            if (v1 < v2) return isAscending ? 1 : -1;
            if (v1 > v2) return isAscending ? -1 : 1;
            return 0;
        });

        // Switching the gear shift direction (up/down)
        header.dataset.order = isAscending ? 'desc' : 'asc';

        // Inserting sorted rows back into the table
        rows.forEach(row => tbody.appendChild(row));
    });
});