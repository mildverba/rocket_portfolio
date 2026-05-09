import { NextResponse } from "next/server";
import * as xlsx from "xlsx";

export async function GET() {
  try {
    const url = "https://www.ici.org/mm_summary_data_2025.xls";
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch ICI data" }, { status: res.status });
    }

    const arrayBuffer = await res.arrayBuffer();
    const workbook = xlsx.read(arrayBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    const json = xlsx.utils.sheet_to_json<any[]>(sheet, { header: 1 });
    const data: { date: string, total: number }[] = [];
    
    for (const row of json) {
      if (Array.isArray(row) && row.length > 2) {
        const dateCell = row[0];
        const totalCell = row[2];
        
        if (typeof dateCell === 'string' && dateCell.includes('/')) {
          const totalStr = String(totalCell).replace(/,/g, '');
          const totalFloat = parseFloat(totalStr);
          if (!isNaN(totalFloat)) {
            data.push({
              date: dateCell.trim(),
              total: totalFloat / 1000 // Convert millions to billions
            });
          }
        } else if (typeof dateCell === 'number') {
            const dateObj = xlsx.SSF.parse_date_code(dateCell);
            if (dateObj) {
               const dateStr = `${String(dateObj.m).padStart(2, '0')}/${String(dateObj.d).padStart(2, '0')}/${dateObj.y}`;
               const totalStr = String(totalCell).replace(/,/g, '');
               const totalFloat = parseFloat(totalStr);
               if (!isNaN(totalFloat)) {
                 data.push({
                   date: dateStr,
                   total: totalFloat / 1000
                 });
               }
            }
        }
      }
    }
    
    // The file is typically oldest at the top, newest at the bottom.
    // We reverse to get newest first.
    data.reverse();
    
    // Get only the last 4 weeks
    const last4 = data.slice(0, 4);
    
    return NextResponse.json({ data: last4 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
