// Share modal — sends routine JSON via EmailJS
import { useState, useRef, useEffect } from 'react';

const SERVICE_ID = 'service_vr6xd17';
const TEMPLATE_ID = 'template_4weog9r';
const PUBLIC_KEY = 's_WKtppyZ__dTYspN';

export default function ShareButton({ routine, open, onClose }) {
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [userName, setUserName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) { setState('idle'); inputRef.current?.focus(); }
  }, [open]);

  function handleClose() {
    setUserName('');
    setState('idle');
    onClose();
  }

  async function handleSend() {
    if (!userName.trim()) {
      inputRef.current?.focus();
      return;
    }
    setState('sending');
    try {
      const payload = {
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: {
          name: userName.trim(),
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
      setUserName('');
      setTimeout(() => handleClose(), 2500);
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-[340px] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {state === 'idle' && (
          <>
            <h3 className="text-sm font-semibold text-white mb-1">Share with Marius</h3>
            <p className="text-xs text-slate-400 mb-4">
              Sending your "<span className="text-slate-200">{routine.name}</span>" template. No other data is shared.
            </p>
            <input
              ref={inputRef}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); if (e.key === 'Escape') handleClose(); }}
              placeholder="Your name"
              className="w-full text-sm bg-slate-900 text-white placeholder-slate-500 rounded-lg px-3 py-2 mb-4 outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSend}
                className="flex-1 text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Send
              </button>
              <button
                onClick={handleClose}
                className="flex-1 text-sm font-medium px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {state === 'sending' && (
          <p className="text-sm text-slate-300 text-center py-4">Sending...</p>
        )}

        {state === 'sent' && (
          <p className="text-sm text-green-400 text-center py-4">Sent successfully!</p>
        )}

        {state === 'error' && (
          <p className="text-sm text-red-400 text-center py-4">Failed to send. Try again.</p>
        )}
      </div>
    </div>
  );
}
