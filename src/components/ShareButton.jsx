// "Share with Marius" button — sends active routine JSON via EmailJS
import { useState } from 'react';

const SERVICE_ID = 'service_vr6xd17';
const TEMPLATE_ID = 'template_4weog9r';
const PUBLIC_KEY = 's_WKtppyZ__dTYspN';

export default function ShareButton({ routine }) {
  const [state, setState] = useState('idle'); // idle | confirm | sending | sent | error

  function handleClick() {
    setState('confirm');
  }

  function handleCancel() {
    setState('idle');
  }

  async function handleSend() {
    setState('sending');
    try {
      const payload = {
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: {
          name: routine.name,
          template_json: JSON.stringify(routine, null, 2),
        },
      };

      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Send failed');
      setState('sent');
      setTimeout(() => setState('idle'), 3000);
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  }

  if (state === 'confirm') {
    return (
      <div className="px-4 py-3 border-t border-slate-700">
        <p className="text-xs text-slate-300 mb-2">
          This sends your "<span className="font-medium">{routine.name}</span>" template to Marius. No other data is shared.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleSend}
            className="flex-1 text-xs font-medium px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            Send
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 text-xs font-medium px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-t border-slate-700">
      <p className="text-xs text-slate-500 text-center mb-3 leading-relaxed">
        100% private. Your schedule is stored locally on your device — no data is sent to any server.
      </p>
      {state === 'sending' && (
        <button disabled className="w-full text-xs font-medium px-3 py-2 rounded bg-slate-700 text-slate-400">
          Sending...
        </button>
      )}
      {state === 'sent' && (
        <div className="text-xs text-green-400 text-center py-2">Sent successfully</div>
      )}
      {state === 'error' && (
        <div className="text-xs text-red-400 text-center py-2">Failed to send. Try again.</div>
      )}
      {state === 'idle' && (
        <button
          onClick={handleClick}
          className="w-full text-xs font-medium px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
          Share with Marius
        </button>
      )}
    </div>
  );
}
