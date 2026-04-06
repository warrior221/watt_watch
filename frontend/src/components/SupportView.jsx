import React, { useState } from 'react';

const SupportView = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How do I get started?',
      a: 'Upload a CSV dataset using the "Upload Dataset" button in the top bar. Your CSV must include id, lat, lng fields. Then click "Run Full Detection" in the sidebar to start monitoring.',
    },
    {
      q: 'What does the confidence score mean?',
      a: 'Confidence score indicates how strongly the system suspects electricity theft at that pole. It is calculated as (actual_load - expected_load) / expected_load. A score above 0.7 is considered high risk.',
    },
    {
      q: 'Why are some transformers flagged as suspicious?',
      a: 'A transformer is flagged when the sum of its child poles\' actual loads exceeds the transformer\'s expected load by more than the detection threshold (0.5 kW). This indicates anomalous consumption.',
    },
    {
      q: 'How do I inject theft for testing?',
      a: 'Upload a dataset first, then click the "Inject" button in the Grid View. This will artificially increase the load on a random pole to simulate electricity theft. Then run detection to see it flagged.',
    },
    {
      q: 'What CSV format is required?',
      a: 'Your CSV must have at minimum: id, lat, lng columns. Optional: type (pole/transformer/Powerplant), parent_id, expected_load, area. The system will auto-infer types from the id field if type is missing.',
    },
  ];

  const endpoints = [
    { method: 'POST', path: '/upload-data', desc: 'Upload CSV grid dataset' },
    { method: 'GET',  path: '/generate-grid', desc: 'Fetch current grid nodes & edges' },
    { method: 'POST', path: '/inject-theft', desc: 'Inject theft into specific poles' },
    { method: 'GET',  path: '/detect-theft', desc: 'Run & return theft detection' },
    { method: 'GET',  path: '/metrics', desc: 'System health & stats' },
    { method: 'GET',  path: '/alerts', desc: 'List of active theft alerts' },
    { method: 'GET',  path: '/history', desc: 'Detection history log' },
    { method: 'POST', path: '/reset', desc: 'Reset all grid state' },
  ];

  const methodColor = m => m === 'GET' ? 'text-green-400 bg-green-500/10' : 'text-blue-400 bg-blue-500/10';

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-950 text-white">
      <header className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-blue-400">
          HELP & <span className="text-white">SUPPORT</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold mt-1">
          Documentation & Contact
        </p>
      </header>

      {/* Quick Start Banner */}
      <div className="bg-blue-500/10 border border-blue-500/25 rounded-3xl p-6 mb-8 flex items-start gap-5">
        <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-blue-400 text-2xl">lightbulb</span>
        </div>
        <div>
          <h3 className="text-blue-400 font-black text-sm uppercase tracking-wider mb-2">Quick Start Guide</h3>
          <ol className="space-y-1.5 text-slate-300 text-[13px]">
            {[
              'Upload your grid dataset (CSV) using the Upload Dataset button',
              'Navigate to Grid View to see the power grid map',
              'Click "Run Full Detection" in the sidebar to detect anomalies',
              'View flagged poles in the Alerts panel or Analytics tab',
              'Use "Inject Theft" to simulate and test detection behaviour',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-slate-300">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Contact */}
        <div className="bg-white/3 border border-white/5 rounded-3xl p-6 shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5">Contact</h3>
          <div className="space-y-4">
            {[
              { icon: 'email',   label: 'Email Support',    value: 'support@wattwatch.in' },
              { icon: 'phone',   label: 'Helpline',         value: '+91 98765 43210' },
              { icon: 'schedule', label: 'Support Hours',   value: 'Mon–Fri, 9am–6pm IST' },
              { icon: 'location_on', label: 'Headquarters', value: 'New Delhi, India' },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-4 bg-white/3 rounded-xl px-4 py-3">
                <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-400 text-lg">{c.icon}</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{c.label}</p>
                  <p className="text-sm font-bold text-white">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Reference */}
        <div className="bg-white/3 border border-white/5 rounded-3xl p-6 shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5">
            API Reference
            <span className="ml-2 text-green-400 font-bold text-[10px] bg-green-500/10 px-2 py-0.5 rounded-full">localhost:8000</span>
          </h3>
          <div className="space-y-2">
            {endpoints.map(ep => (
              <div key={ep.path} className="flex items-center gap-3 bg-white/3 rounded-xl px-3 py-2.5">
                <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${methodColor(ep.method)}`}>
                  {ep.method}
                </span>
                <span className="text-[11px] font-black text-slate-300 font-mono flex-1">{ep.path}</span>
                <span className="text-[10px] text-slate-500 hidden md:block">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white/3 border border-white/5 rounded-3xl p-6 shadow-xl">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/40 transition-colors"
              >
                <span className="text-sm font-bold text-white">{faq.q}</span>
                <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-[13px] text-slate-400 leading-relaxed border-t border-slate-800">
                  <p className="pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportView;
