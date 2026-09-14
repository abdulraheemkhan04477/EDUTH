/**
 * Export data array to CSV file download in browser
 */
export function exportToCSV(filename: string, data: Record<string, any>[]) {
  if (!data || data.length === 0) return

  const headers = Object.keys(data[0])
  const csvRows: string[] = []

  // Header row
  csvRows.push(headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','))

  // Data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header]
      const stringified = val === null || val === undefined ? '' : String(val)
      return `"${stringified.replace(/"/g, '""')}"`
    })
    csvRows.push(values.join(','))
  }

  const csvString = csvRows.join('\n')
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export report to formatted PDF print preview
 */
export function exportToPDF(
  title: string,
  subtitle: string,
  columns: { key: string; header: string }[],
  data: Record<string, any>[]
) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const tableHeadersHtml = columns
    .map((col) => `<th style="padding: 10px 14px; text-align: left; background: #F8FAFC; border-bottom: 2px solid #E2E8F0; color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase;">${col.header}</th>`)
    .join('')

  const tableRowsHtml = data
    .map(
      (row, idx) => `
    <tr style="background: ${idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}; border-bottom: 1px solid #E2E8F0;">
      ${columns
        .map(
          (col) =>
            `<td style="padding: 10px 14px; color: #0F172A; font-size: 13px;">${row[col.key] ?? '-'}</td>`
        )
        .join('')}
    </tr>`
    )
    .join('')

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} — Report</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; }
            @page { size: A4 portrait; margin: 15mm; }
          }
          body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0F172A; padding: 30px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #4F46E5; padding-bottom: 16px; margin-bottom: 24px; }
          .brand { font-size: 24px; font-weight: 700; color: #4F46E5; }
          .title { font-size: 20px; font-weight: 700; margin: 0 0 4px 0; color: #0F172A; }
          .subtitle { font-size: 13px; color: #64748B; margin: 0; }
          .meta { text-align: right; font-size: 12px; color: #64748B; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          .footer { margin-top: 32px; border-top: 1px solid #E2E8F0; pt: 12px; font-size: 11px; color: #94A3B8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">Eduth College</div>
            <h1 class="title">${title}</h1>
            <p class="subtitle">${subtitle}</p>
          </div>
          <div class="meta">
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
            <p><strong>Campus:</strong> Main Campus</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>${tableHeadersHtml}</tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
        <div class="footer">
          Confidential — Eduth College Management System © ${new Date().getFullYear()}
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
}

/**
 * Export official class attendance register to formatted PDF print preview
 */
export function exportAttendancePDF(
  meta: {
    collegeName?: string
    course: string
    branch: string
    year: string
    semester: string
    class_name?: string
    section: string
    date: string
    lecture: string
  },
  studentsData: {
    sNo: number
    rollNo: string
    name: string
    status: string
    remark?: string
  }[]
) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const presentCount = studentsData.filter((s) => s.status.toLowerCase() === 'present').length
  const absentCount = studentsData.filter((s) => s.status.toLowerCase() === 'absent').length
  const lateCount = studentsData.filter((s) => s.status.toLowerCase() === 'late').length
  const leaveCount = studentsData.filter((s) => s.status.toLowerCase() === 'leave').length
  const totalStudents = studentsData.length
  const attendancePct = totalStudents > 0 ? Math.round(((presentCount + lateCount) / totalStudents) * 100) : 0

  const tableRowsHtml = studentsData
    .map(
      (s) => `
    <tr style="background: ${s.sNo % 2 === 1 ? '#FFFFFF' : '#F8FAFC'}; border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 8px 12px; text-align: center; color: #64748B; font-size: 12px; font-weight: 500;">${s.sNo}</td>
      <td style="padding: 8px 12px; color: #4338CA; font-size: 12px; font-weight: 600; font-family: monospace;">${s.rollNo}</td>
      <td style="padding: 8px 12px; color: #0F172A; font-size: 12px; font-weight: 700; text-transform: uppercase;">${s.name}</td>
      <td style="padding: 8px 12px; text-align: center; font-size: 12px; font-weight: 700;">
        ${
          s.status.toLowerCase() === 'present'
            ? '<span style="color: #166534; background: #DCFCE7; padding: 2px 8px; border-radius: 4px;">PRESENT</span>'
            : s.status.toLowerCase() === 'absent'
            ? '<span style="color: #991B1B; background: #FEE2E2; padding: 2px 8px; border-radius: 4px;">ABSENT</span>'
            : s.status.toLowerCase() === 'late'
            ? '<span style="color: #92400E; background: #FEF3C7; padding: 2px 8px; border-radius: 4px;">LATE</span>'
            : s.status.toLowerCase() === 'leave'
            ? '<span style="color: #1E40AF; background: #DBEAFE; padding: 2px 8px; border-radius: 4px;">LEAVE</span>'
            : '<span style="color: #64748B; background: #F1F5F9; padding: 2px 8px; border-radius: 4px;">NOT MARKED</span>'
        }
      </td>
      <td style="padding: 8px 12px; color: #64748B; font-size: 11px; font-style: italic;">${s.remark || '-'}</td>
    </tr>`
    )
    .join('')

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Attendance Report — ${meta.course} ${meta.branch} Sec ${meta.section}</title>
        <style>
          @media print {
            body { margin: 0; padding: 10mm; }
            @page { size: A4 portrait; margin: 10mm; }
          }
          body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0F172A; padding: 24px; }
          .header { border-bottom: 2px solid #3730A3; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
          .college-name { font-size: 22px; font-weight: 800; color: #3730A3; letter-spacing: -0.5px; }
          .doc-title { font-size: 14px; font-weight: 600; color: #475569; margin-top: 2px; }
          .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #F8FAFC; padding: 12px; border-radius: 6px; border: 1px solid #E2E8F0; margin-bottom: 16px; font-size: 12px; }
          .meta-item { display: flex; flex-direction: column; }
          .meta-label { font-size: 10px; text-transform: uppercase; font-weight: 700; color: #64748B; }
          .meta-val { font-weight: 700; color: #0F172A; margin-top: 2px; }
          .summary-box { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-bottom: 16px; text-align: center; }
          .summary-card { background: #FFFFFF; border: 1px solid #E2E8F0; padding: 8px; border-radius: 6px; }
          .summary-card.total { background: #F1F5F9; }
          .summary-card.present { background: #F0FDF4; border-color: #BBF7D0; }
          .summary-card.absent { background: #FEF2F2; border-color: #FECACA; }
          .summary-card.pct { background: #EEF2FF; border-color: #C7D2FE; }
          .summary-num { font-size: 18px; font-weight: 800; }
          .summary-lbl { font-size: 10px; font-weight: 600; text-transform: uppercase; color: #64748B; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th { padding: 8px 12px; text-align: left; background: #3730A3; color: #FFFFFF; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
          .footer { margin-top: 24px; border-top: 1px solid #E2E8F0; padding-top: 10px; font-size: 10px; color: #94A3B8; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="college-name">${meta.collegeName || 'RRIMT'}</div>
            <div class="doc-title">Official Student Attendance Register</div>
          </div>
          <div style="text-align: right; font-size: 11px; color: #64748B;">
            <div><strong>Date:</strong> ${meta.date}</div>
            <div><strong>Lecture:</strong> ${meta.lecture}</div>
          </div>
        </div>

        <div class="meta-grid">
          <div class="meta-item"><span class="meta-label">Course</span><span class="meta-val">${meta.course}</span></div>
          <div class="meta-item"><span class="meta-label">Branch</span><span class="meta-val">${meta.branch}</span></div>
          <div class="meta-item"><span class="meta-label">Year / Sem</span><span class="meta-val">${meta.year} (${meta.semester})</span></div>
          <div class="meta-item"><span class="meta-label">Section</span><span class="meta-val">Section ${meta.section}</span></div>
        </div>

        <div class="summary-box">
          <div class="summary-card total"><div class="summary-num" style="color: #0F172A;">${totalStudents}</div><div class="summary-lbl">Total</div></div>
          <div class="summary-card present"><div class="summary-num" style="color: #166534;">${presentCount}</div><div class="summary-lbl">Present</div></div>
          <div class="summary-card absent"><div class="summary-num" style="color: #991B1B;">${absentCount}</div><div class="summary-lbl">Absent</div></div>
          <div class="summary-card"><div class="summary-num" style="color: #92400E;">${lateCount}</div><div class="summary-lbl">Late</div></div>
          <div class="summary-card"><div class="summary-num" style="color: #1E40AF;">${leaveCount}</div><div class="summary-lbl">Leave</div></div>
          <div class="summary-card pct"><div class="summary-num" style="color: #3730A3;">${attendancePct}%</div><div class="summary-lbl">Attendance Percentage</div></div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">S.No</th>
              <th style="width: 140px;">Roll Number</th>
              <th>Student Name</th>
              <th style="width: 110px; text-align: center;">Attendance Status</th>
              <th style="width: 140px;">Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <div>Generated by Eduth College Management System</div>
          <div>Verified & Approved Official Record</div>
        </div>

        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
}

/**
 * Export official exam result report to formatted PDF print preview with dynamic subject columns
 */
export function exportExamResultsPDF(
  meta: {
    collegeName?: string
    collegeId?: string
    reportTitle?: string
    course: string
    branch: string
    year: string
    semester: string
    section: string
    generatedBy: string
    date?: string
  },
  subjects: string[],
  rows: {
    student_name: string
    roll_no: string
    marksBySubject: Record<string, number>
    totalObtained: number
    totalMax: number
  }[]
) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const formattedDate = meta.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  const reportTitle = meta.reportTitle || 'Examination & Results Report'
  const collegeName = meta.collegeName || 'RRIMT'
  const collegeId = meta.collegeId || '13695a78-0105-4bde-bc85-d664bb66637e'

  const subjectHeadersHtml = subjects
    .map((s) => `<th style="padding: 10px 12px; text-align: center; background: #3730A3; color: #FFFFFF; font-size: 11px; font-weight: 700; text-transform: uppercase;">${s}</th>`)
    .join('')

  const tableRowsHtml = rows
    .map(
      (r, idx) => `
    <tr style="background: ${idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}; border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 10px 12px; color: #0F172A; font-size: 13px; font-weight: 600;">${r.student_name}</td>
      <td style="padding: 10px 12px; color: #4338CA; font-size: 12px; font-weight: 600; font-family: monospace;">${r.roll_no}</td>
      ${subjects
        .map((s) => {
          const val = r.marksBySubject[s]
          return `<td style="padding: 10px 12px; text-align: center; color: #0F172A; font-size: 13px; font-weight: 600; font-family: monospace;">${val !== undefined ? val : '-'}</td>`
        })
        .join('')}
      <td style="padding: 10px 12px; text-align: center; color: #3730A3; font-size: 13px; font-weight: 700; font-family: monospace;">${r.totalObtained} / ${r.totalMax}</td>
    </tr>`
    )
    .join('')

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${reportTitle} — ${collegeName}</title>
        <style>
          @media print {
            body { margin: 0; padding: 10mm; }
            @page { size: A4 landscape; margin: 10mm; }
            tr { page-break-inside: avoid; }
          }
          body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0F172A; padding: 24px; }
          .header { border-bottom: 2px solid #3730A3; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
          .college-name { font-size: 22px; font-weight: 800; color: #3730A3; letter-spacing: -0.5px; }
          .doc-title { font-size: 15px; font-weight: 700; color: #0F172A; margin-top: 2px; }
          .filter-bar { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 10px 14px; border-radius: 6px; font-size: 12px; margin-bottom: 16px; color: #334155; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th { padding: 10px 12px; text-align: left; background: #3730A3; color: #FFFFFF; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
          .footer { margin-top: 24px; border-top: 1px solid #E2E8F0; padding-top: 10px; font-size: 11px; color: #64748B; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="college-name">${collegeName}</div>
            <div class="doc-title">${reportTitle}</div>
          </div>
          <div style="text-align: right; font-size: 11px; color: #64748B;">
            <div><strong>Generated Date:</strong> ${formattedDate}</div>
            <div><strong>College ID:</strong> ${collegeId}</div>
          </div>
        </div>

        <div class="filter-bar">
          <strong>Filters Applied:</strong> Course: ${meta.course} | Branch: ${meta.branch} | Year: ${meta.year} | Semester: ${meta.semester} | Section: ${meta.section}
        </div>

        <table>
          <thead>
            <tr>
              <th style="min-width: 160px;">Student Name</th>
              <th style="min-width: 120px;">Roll No</th>
              ${subjectHeadersHtml}
              <th style="text-align: center; min-width: 100px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <div>Generated Date: ${formattedDate}</div>
          <div>Generated By: ${meta.generatedBy}</div>
          <div>College ID: ${collegeId}</div>
        </div>

        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
}

