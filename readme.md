Berikut petunjuk penggunaan API Report:

1. **Generate Report (Memulai pembuatan report)**
```bash
# Using curl
curl -X POST http://localhost:3000/api/reports/workorders \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2023-01-01",
    "endDate": "2023-12-31"
  }'

# Using JavaScript/Fetch
const response = await fetch('http://localhost:3000/api/reports/workorders', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        startDate: '2023-01-01',
        endDate: '2023-12-31'
    })
});

const result = await response.json();
// result akan berisi: { success: true, data: { jobId: 'xxx' } }
```

2. **Check Status Report (Mengecek status pembuatan report)**
```bash
# Using curl
curl http://localhost:3000/api/reports/jobs/{jobId}/status

# Using JavaScript/Fetch
const statusResponse = await fetch(`http://localhost:3000/api/reports/jobs/${jobId}/status`);
const status = await statusResponse.json();
// status akan berisi:
// {
//     success: true,
//     data: {
//         id: 'xxx',
//         status: 'COMPLETED', // atau 'PENDING', 'PROCESSING', 'FAILED'
//         fileName: 'workorders_2023-01-01_2023-12-31_1234567890.csv',
//         fileSize: '2.5 MB',
//         created_at: '2023-11-15T10:30:00Z',
//         updated_at: '2023-11-15T10:31:00Z',
//         error: null
//     }
// }
```

3. **Download Report (Mengunduh file report)**
```bash
# Using curl
curl http://localhost:3000/api/reports/jobs/{jobId}/download > report.csv

# Using JavaScript/Fetch
const downloadResponse = await fetch(`http://localhost:3000/api/reports/jobs/${jobId}/download`);
const blob = await downloadResponse.blob();
// Save file
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'report.csv';
a.click();
```

4. **List All Jobs (Melihat daftar semua report)**
```bash
# Using curl
curl http://localhost:3000/api/reports/jobs?page=1&limit=10

# Using JavaScript/Fetch
const jobsResponse = await fetch('http://localhost:3000/api/reports/jobs?page=1&limit=10');
const jobs = await jobsResponse.json();
// jobs akan berisi:
// {
//     success: true,
//     data: {
//         jobs: [...],
//         pagination: {
//             page: 1,
//             limit: 10,
//             total: 50,
//             pages: 5
//         }
//     }
// }
```

Contoh Penggunaan Lengkap dengan JavaScript:
```javascript
async function generateAndDownloadReport(startDate, endDate) {
    try {
        // 1. Generate report
        const generateResponse = await fetch('http://localhost:3000/api/reports/workorders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ startDate, endDate })
        });
        
        const { data: { jobId } } = await generateResponse.json();
        
        // 2. Poll status until complete
        let status;
        do {
            const statusResponse = await fetch(`http://localhost:3000/api/reports/jobs/${jobId}/status`);
            const statusResult = await statusResponse.json();
            status = statusResult.data.status;
            
            if (status === 'FAILED') {
                throw new Error(`Report generation failed: ${statusResult.data.error}`);
            }
            
            if (status === 'PROCESSING' || status === 'PENDING') {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            }
        } while (status === 'PROCESSING' || status === 'PENDING');
        
        // 3. Download when complete
        if (status === 'COMPLETED') {
            const downloadResponse = await fetch(`http://localhost:3000/api/reports/jobs/${jobId}/download`);
            const blob = await downloadResponse.blob();
            
            // Save file
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `workorders_${startDate}_${endDate}.csv`;
            a.click();
            
            window.URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error('Error generating report:', error);
    }
}

// Contoh penggunaan dengan UI
const ReportGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleGenerateReport = async () => {
        setLoading(true);
        setError(null);
        
        try {
            await generateAndDownloadReport('2023-01-01', '2023-12-31');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div>
            <button 
                onClick={handleGenerateReport}
                disabled={loading}
            >
                {loading ? 'Generating...' : 'Generate Report'}
            </button>
            {error && <div style={{color: 'red'}}>{error}</div>}
        </div>
    );
};
```

Catatan Penting:
1. Format tanggal harus 'YYYY-MM-DD'
2. Report generation berjalan secara asynchronous
3. Status report:
   - PENDING: Report baru dibuat
   - PROCESSING: Sedang diproses
   - COMPLETED: Selesai dan siap didownload
   - FAILED: Gagal dengan pesan error
4. File CSV akan disimpan dengan struktur:
   - `storage/reports/YYYY/MM/workorders_startDate_endDate_timestamp.csv`
5. File akan otomatis dihapus setelah X hari (sesuai CONFIG.STORAGE.RETENTION_DAYS)

Response Codes:
- 200: Sukses
- 400: Parameter tidak valid
- 404: Report tidak ditemukan
- 500: Internal server error

Monitoring:
- Logs tersimpan di `storage/logs/`
- Progress dapat dimonitor melalui status endpoint
- Error details tersimpan dalam database dan logs

Security Notes:
- Implementasikan authentication sesuai kebutuhan
- Batasi akses file berdasarkan user permissions
- Implementasikan rate limiting untuk production
- Gunakan HTTPS untuk production

Let me know if you need any clarification or have questions!