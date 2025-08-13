import jsPDF from 'jspdf';
// removed autotable (table no longer used)
// import autoTable from 'jspdf-autotable';
import { Calculation } from '@/types';

const formatDate = (ts: number) =>
  new Date(ts).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

function drawHeader(doc: jsPDF, brand: string, title: string) {
  const w = doc.internal.pageSize.getWidth();
  doc.setFillColor(32, 129, 226);
  doc.rect(0, 0, w, 70, 'F');
  doc.setTextColor('#ffffff');
  doc.setFontSize(18);
  doc.text(brand, 40, 40);
  doc.setFontSize(12);
  doc.text(title, 40, 58);
  doc.setTextColor('#000000');
}

export function exportCalculationsPdf(calcs: Calculation[]) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const brand = 'PATIKS';
  const title = 'Recent Calculations Report';
  const generated = formatDate(Date.now());

  drawHeader(doc, brand, title);
  doc.setFontSize(10);
  doc.text(`Generated: ${generated}`, 40, 85);

  let y = 110;
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottomMargin = 60;
  const gap = 14;
  doc.setFont('helvetica', 'normal');

  calcs.forEach((c, idx) => {
    const blockLines: string[] = [];
    blockLines.push(`${idx + 1}. ${c.type}  (${formatDate(c.timestamp)})`);
    if (c.description) blockLines.push(`Description: ${c.description}`);
    if (c.result) blockLines.push(`Result: ${c.result}`);
    if (c.formula) {
      blockLines.push('Formula:');
      const formulaLines = doc.splitTextToSize(c.formula, 500);
      formulaLines.forEach((l: string) => blockLines.push('  ' + l));
    }

    // Wrap each logical line further if needed
    const rendered: string[] = [];
    blockLines.forEach(line => {
      const parts = doc.splitTextToSize(line, 520);
      parts.forEach((p: string) => rendered.push(p));
    });

    const neededHeight = rendered.length * 12 + gap;
    if (y + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      drawHeader(doc, brand, title);
      doc.setFontSize(10);
      doc.text(`Generated: ${generated}`, 40, 85);
      y = 110;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(rendered[0], 40, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    for (let i = 1; i < rendered.length; i++) {
      y += 12;
      doc.text(rendered[i], 50, y); // indent content lines
    }
    y += gap;
  });

  // Footer on last page
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    const footerY = pageHeight - 20;
    doc.setFontSize(8);
    doc.setTextColor(120);
    const footerText = `${brand} • Page ${p}/${pages} • © Mihir Chandratre`;
    const textWidth = doc.getTextWidth(footerText);
    doc.text(footerText, doc.internal.pageSize.getWidth() - 40 - textWidth, footerY);
    doc.setTextColor(0);
  }

  doc.save('calculations_report.pdf');
}
// (Optional future enhancement: embed logo.png in header via doc.addImage once converted to base64)
