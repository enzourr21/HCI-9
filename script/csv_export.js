/**
 * ═══════════════════════════════════════════════════════════════
 * CSV Export Utility
 * csv_export.js
 * Handles CSV and PDF export functionality
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Export students data to CSV format
 */
function exportToCSV(filename, data) {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Convert data object to CSV format
 */
function convertToCSV(data) {
    const headers = data.headers || [];
    const rows = data.rows || [];
    
    let csv = headers.map(h => `"${h}"`).join(',') + '\n';
    
    rows.forEach(row => {
        csv += row.map(cell => {
            const str = String(cell || '');
            return `"${str.replace(/"/g, '""')}"`;
        }).join(',') + '\n';
    });
    
    return csv;
}

/**
 * Export student list for a section
 */
function exportStudentList(section, students) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${section}_student_list_${timestamp}.csv`;
    
    const data = {
        headers: ['No.', 'Student Name', 'LRN', 'Status', 'Subjects', 'Total Units', 'Verified'],
        rows: students.map((student, idx) => {
            const subjects = student.subjects.map(s => s.code).join('; ') || '—';
            const totalUnits = calculateTotalUnits(student.subjects);
            return [
                idx + 1,
                student.name,
                student.lrn,
                student.status,
                subjects,
                totalUnits,
                student.verified ? 'Yes' : 'No'
            ];
        })
    };
    
    exportToCSV(filename, data);
}

/**
 * Calculate total units from subjects array
 */
function calculateTotalUnits(subjects) {
    return subjects.reduce((sum, s) => sum + (s.units || 0), 0);
}

/**
 * Print students list
 */
function printStudentList(section, students) {
    const printWindow = window.open('', '', 'width=900,height=600');
    
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${section} - Student List</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color: #333;
                }
                h1 { margin-bottom: 5px; }
                .meta { font-size: 12px; color: #666; margin-bottom: 20px; }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th {
                    background: #c0192b;
                    color: white;
                    padding: 10px;
                    text-align: left;
                    font-weight: bold;
                    font-size: 12px;
                }
                td {
                    padding: 8px 10px;
                    border-bottom: 1px solid #ddd;
                    font-size: 12px;
                }
                tr:nth-child(even) {
                    background: #f9f9f9;
                }
                .status-pending { color: #e65100; }
                .status-evaluated { color: #2e7d32; }
                .status-enrolled { color: #1565c0; }
                @media print {
                    body { margin: 0; }
                    @page { size: A4; margin: 10mm; }
                }
            </style>
        </head>
        <body>
            <h1>${section}</h1>
            <div class="meta">
                <p>Generated on: ${new Date().toLocaleString('en-PH')}</p>
                <p>Total Students: ${students.length}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>LRN</th>
                        <th>Status</th>
                        <th>Subjects</th>
                        <th>Units</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    students.forEach((student, idx) => {
        const subjects = student.subjects.map(s => s.code).join(', ') || '—';
        const totalUnits = calculateTotalUnits(student.subjects);
        const statusClass = `status-${student.status}`;
        
        html += `
                    <tr>
                        <td>${idx + 1}</td>
                        <td>${student.name}</td>
                        <td>${student.lrn}</td>
                        <td class="${statusClass}">${student.status}</td>
                        <td>${subjects}</td>
                        <td style="text-align: center;">${totalUnits}</td>
                    </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </body>
        </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 500);
}
