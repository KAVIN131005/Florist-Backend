import React, { useState, useEffect, useCallback, useContext } from "react";
import { NotificationContext } from "../../context/NotificationContextDefinition";
import { useAuth } from "../../hooks/useAuth";

export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <p className="p-6">Not logged in.</p>;

  const displayName = user.name || user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown";
  const email = user.email || user.username || "Unknown";
  const roles = (user.roles && user.roles.length) ? user.roles.join(", ") : (user.role || "USER");

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="bg-white p-5 rounded-xl shadow space-y-3">
        <Field label="Name" value={displayName} />
        <Field label="Email" value={email} />
        <Field label="Roles" value={roles} />
        <Field label="User ID" value={user.id || user._id || user.userId || "—"} />
      </div>

      <RemindersCard user={user} defaultEmail={email} />
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 break-all max-w-[60%] text-right">{value}</span>
    </div>
  );
}

// Reminder Management Component
function RemindersCard({ user, defaultEmail }) {
  const userId = user.id || user._id || user.userId || 'guest';
  const storageKey = `reminders:${userId}`;
  const { notify } = useContext(NotificationContext);
  const [reminders, setReminders] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [form, setForm] = useState({ title: '', date: '', time: '', phone: user.phone || '', email: defaultEmail || '', sms: true, emailCh: true });
  const [errors, setErrors] = useState([]);

  const persist = useCallback((next) => {
    setReminders(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* ignore quota */ }
  }, [storageKey]);

  // Validation
  const validate = () => {
    const errs = [];
    if (!form.title.trim()) errs.push('Title required');
    if (!form.date) errs.push('Date required');
    if (!form.time) errs.push('Time required');
    const dt = new Date(`${form.date}T${form.time}:00`);
    if (isNaN(dt.getTime())) errs.push('Invalid date/time');
    else if (dt.getTime() < Date.now()) errs.push('Date/time must be future');
    if (form.sms && (!form.phone || !/^\d{10}$/.test(form.phone))) errs.push('Valid 10-digit phone required for SMS');
    if (form.emailCh && (!form.email || !/.+@.+\..+/.test(form.email))) errs.push('Valid email required for Email channel');
    if (!form.sms && !form.emailCh) errs.push('Select at least one channel');
    return errs;
  };

  const addReminder = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (errs.length) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const datetime = new Date(`${form.date}T${form.time}:00`).toISOString();
    const r = {
      id,
      title: form.title.trim(),
      datetime,
      phone: form.phone,
      email: form.email,
      channels: { sms: form.sms, email: form.emailCh },
      createdAt: new Date().toISOString(),
      notified: false
    };
    const next = [...reminders, r].sort((a,b) => new Date(a.datetime)-new Date(b.datetime));
    persist(next);
    setForm(f => ({ ...f, title: '', date: '', time: '' }));
    setErrors([]);
  };

  const deleteReminder = (id) => {
    persist(reminders.filter(r => r.id !== id));
  };

  // Simulated notification polling (every 30s)
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      let changed = false;
      const next = reminders.map(r => {
        if (!r.notified && new Date(r.datetime).getTime() <= now) {
          changed = true;
          // Fire in-app notification
          try {
            notify && notify(`Reminder: ${r.title}`, 'success');
            const unreadKey = `remindersUnread:${userId}`;
            localStorage.setItem(unreadKey, '1');
          } catch { /* ignore notify errors */ }
          return { ...r, notified: true, notifiedAt: new Date().toISOString() };
        }
        return r;
      });
      if (changed) persist(next);
    };
    const interval = setInterval(tick, 15000); // check every 15s for quicker feedback
    tick();
    return () => clearInterval(interval);
  }, [reminders, persist, notify, userId]);

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="font-semibold mb-3 flex items-center gap-2 text-lg">Occasion Reminders <span className="text-xs font-normal text-gray-500">(stored locally)</span></h2>
      <form onSubmit={addReminder} className="grid md:grid-cols-3 gap-3 mb-4 text-sm">
        <input
          className="border rounded px-3 py-2 col-span-3 md:col-span-1"
          placeholder="Occasion (e.g. Mom Birthday)"
          value={form.title}
          onChange={e=>setForm(f=>({...f,title:e.target.value}))}
        />
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={form.date}
          onChange={e=>setForm(f=>({...f,date:e.target.value}))}
        />
        <input
          type="time"
          className="border rounded px-3 py-2"
          value={form.time}
          onChange={e=>setForm(f=>({...f,time:e.target.value}))}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Phone (SMS)"
          value={form.phone}
          onChange={e=>setForm(f=>({...f,phone:e.target.value}))}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Email"
          value={form.email}
          onChange={e=>setForm(f=>({...f,email:e.target.value}))}
        />
        <div className="flex items-center gap-4 col-span-3 md:col-span-1">
          <label className="flex items-center gap-1 text-gray-600"><input type="checkbox" checked={form.sms} onChange={e=>setForm(f=>({...f,sms:e.target.checked}))}/> <span>SMS</span></label>
          <label className="flex items-center gap-1 text-gray-600"><input type="checkbox" checked={form.emailCh} onChange={e=>setForm(f=>({...f,emailCh:e.target.checked}))}/> <span>Email</span></label>
        </div>
        <div className="col-span-3 flex justify-end">
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium">Add Reminder</button>
        </div>
      </form>
      {errors.length>0 && (
        <ul className="mb-3 text-xs text-red-600 list-disc list-inside space-y-1">
          {errors.map(e=> <li key={e}>{e}</li>)}
        </ul>
      )}
  <div className="space-y-2 max-h-64 overflow-auto pr-1">
        {reminders.length === 0 && <p className="text-sm text-gray-500">No reminders set.</p>}
        {reminders.map(r => {
          const due = new Date(r.datetime);
          const now = Date.now();
          const msLeft = due.getTime() - now;
            const status = r.notified ? 'Sent' : (msLeft <=0 ? 'Due' : 'Pending');
          return (
            <div key={r.id} className="border rounded-lg px-3 py-2 flex flex-col sm:flex-row sm:items-center gap-2 justify-between text-xs bg-gray-50">
              <div className="flex-1">
                <div className="font-medium text-gray-800">{r.title}</div>
                <div className="text-gray-500">{due.toLocaleString()}</div>
                <div className="text-gray-500">{r.channels.sms && 'SMS'}{r.channels.sms && r.channels.email && ' / '}{r.channels.email && 'Email'}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${r.notified ? 'bg-green-100 text-green-700' : status==='Due' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'}`}>{status}</span>
                <button onClick={()=>deleteReminder(r.id)} className="text-red-600 hover:text-red-700">✕</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
