"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useUserStore } from "@/lib/store/useUserStore";

interface ExportPDFButtonProps {
  entries: { text: string; aiAnalysis: string; date: string }[];
}

export default function ExportPDFButton({ entries }: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { userDoc } = useUserStore();

  const handleExport = async () => {
    if (entries.length === 0 || !userDoc) return;
    
    setIsExporting(true);
    
    // Create a temporary container for the PDF content
    const container = document.createElement("div");
    container.style.width = "800px";
    container.style.padding = "40px";
    container.style.backgroundColor = "#050505";
    container.style.color = "#D4AF37";
    container.style.fontFamily = "Arial, sans-serif"; // Fallback if Amiri isn't loaded by html2canvas
    container.style.direction = "rtl";
    container.style.position = "absolute";
    container.style.left = "-9999px"; // Hide off-screen
    
    // Header
    const header = document.createElement("div");
    header.style.textAlign = "center";
    header.style.borderBottom = "1px solid rgba(212,175,55,0.2)";
    header.style.paddingBottom = "20px";
    header.style.marginBottom = "30px";
    
    header.innerHTML = `
      <h1 style="font-size: 32px; margin: 0; color: #F3E5AB;">كتاب الذات</h1>
      <p style="font-size: 16px; margin-top: 10px; color: rgba(212,175,55,0.6);">خاص بـ: ${userDoc.displayName || 'النخبة'}</p>
      <p style="font-size: 14px; color: rgba(212,175,55,0.4);">Mind in a Box (عقل في صندوق)</p>
    `;
    container.appendChild(header);

    // Entries
    entries.forEach(entry => {
      const entryDiv = document.createElement("div");
      entryDiv.style.marginBottom = "40px";
      
      entryDiv.innerHTML = `
        <div style="font-size: 12px; color: rgba(212,175,55,0.4); margin-bottom: 5px;">${entry.date}</div>
        <div style="background-color: rgba(255,255,255,0.02); padding: 15px; border: 1px solid rgba(212,175,55,0.1); border-radius: 4px; margin-bottom: 15px;">
          <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #e5e5e5;">${entry.text}</p>
        </div>
        <div style="padding: 15px; border-right: 3px solid #D4AF37;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #D4AF37;">حكمة الأوراكل:</h3>
          <p style="margin: 0; font-size: 15px; line-height: 1.8; color: #D4AF37; opacity: 0.9;">${entry.aiAnalysis}</p>
        </div>
      `;
      container.appendChild(entryDiv);
    });

    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: '#050505',
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Mind_In_A_Box_Journal_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error("PDF Export Error:", error);
    } finally {
      document.body.removeChild(container);
      setIsExporting(false);
    }
  };

  return (
    <button 
      onClick={handleExport}
      disabled={isExporting || entries.length === 0}
      className="text-neutral-500 hover:text-gold transition-colors flex items-center gap-2 font-inter text-sm disabled:opacity-50"
    >
      <Download size={16} /> 
      {isExporting ? 'جاري التحضير...' : 'تصدير PDF "كتاب الذات"'}
    </button>
  );
}

