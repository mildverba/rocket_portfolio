import pandas as pd
import requests
import io

url = "https://www.ici.org/mm_summary_data_2025.xls"
response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    df = pd.read_excel(io.BytesIO(response.content), sheet_name=0, header=None)
    data = []
    for i in range(len(df)):
        val = str(df.iloc[i, 0]).strip()
        # check if val looks like a date 'MM/DD/YYYY'
        if '/' in val and len(val.split('/')) == 3:
            date_str = val
            total = str(df.iloc[i, 2]).strip()
            try:
                total_float = float(total.replace(',', ''))
                total_billions = total_float / 1000
                data.append((date_str, total_billions))
            except Exception as e:
                pass
                
    data = data[-52:]
    data.reverse()
    
    print("Found {} records".format(len(data)))
    for d, t in data[:5]:
        print(f"{d} | {t:.2f}")
        
    with open("table_rows.tsx", "w") as f:
        for d, t in data:
            f.write(f'                <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">\n')
            f.write(f'                  <td className="py-2.5 px-4 text-xs font-medium text-slate-500">{d}</td>\n')
            f.write(f'                  <td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">${t:,.2f}B</td>\n')
            f.write(f'                </tr>\n')
            
except Exception as e:
    print(f"Error: {e}")
