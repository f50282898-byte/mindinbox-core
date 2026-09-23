"use client";

interface PsychologyData {
  uid: string;
  email: string;
  solvedEnigmas: number;
  dailyInteractions: number;
}

export default function UserPsychologyTable({ data }: { data: PsychologyData[] }) {
  if (data.length === 0) {
    return <div className="text-neutral-500 font-inter">لا توجد بيانات سلوكية كافية بعد.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-neutral-800">
      <table className="w-full text-right font-inter text-sm" dir="rtl">
        <thead className="bg-neutral-900 border-b border-neutral-800 text-gold/60">
          <tr>
            <th className="p-4 font-normal">المعرف / البريد</th>
            <th className="p-4 font-normal text-center">الألغاز المحلولة</th>
            <th className="p-4 font-normal text-center">تفاعل الذكاء الاصطناعي</th>
            <th className="p-4 font-normal text-center">إجراء (Upsell)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, idx) => (
            <tr key={user.uid} className={`border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors ${idx % 2 === 0 ? 'bg-obsidian' : 'bg-neutral-950'}`}>
              <td className="p-4 text-neutral-300 font-mono text-xs">
                {user.email}
              </td>
              <td className="p-4 text-center">
                <span className="inline-block px-2 py-1 bg-gold/10 text-gold-light rounded-sm">
                  {user.solvedEnigmas}
                </span>
              </td>
              <td className="p-4 text-center text-neutral-400">
                {user.dailyInteractions}
              </td>
              <td className="p-4 text-center">
                <button className="text-gold hover:text-gold-light transition-colors text-xs border border-gold/30 px-3 py-1 rounded-sm hover:bg-gold/10">
                  دعوة للمجلس
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

