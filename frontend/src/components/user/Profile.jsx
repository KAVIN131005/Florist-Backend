import React, { useState, useEffect, useCallback, useContext } from "react";
import { NotificationContext } from "../../context/NotificationContextDefinition";
import { ThemeContext } from "../../context/themeContextDefinition";
import { useAuth } from "../../hooks/useAuth";

export default function Profile() {
  const { dark } = useContext(ThemeContext);
  const { user, loading } = useAuth();

  if (loading) return (
    <div className={`min-h-screen flex justify-center items-center ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'}`}>
      <div className="text-center">
        <div className="relative mb-8">
          <div className={`w-20 h-20 rounded-full border-4 border-t-transparent animate-spin ${dark ? 'border-indigo-400' : 'border-indigo-500'}`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl animate-ping">👤</span>
          </div>
        </div>
        <p className={`text-xl font-semibold ${dark ? 'text-indigo-300' : 'text-indigo-600'} animate-pulse`}>
          Loading Profile...
        </p>
      </div>
    </div>
  );

  if (!user) return (
    <div className={`min-h-screen flex justify-center items-center ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'}`}>
      <div className={`text-center p-8 rounded-3xl ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-2 shadow-xl`}>
        <div className="text-6xl mb-6">🔒</div>
        <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-4`}>Access Required</h2>
        <p className={`${dark ? 'text-gray-300' : 'text-gray-600'}`}>Please log in to view your profile</p>
      </div>
    </div>
  );

  const displayName = user.name || user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown";
  const email = user.email || user.username || "Unknown";
  const roles = (user.roles && user.roles.length) ? user.roles.join(", ") : (user.role || "USER");

  return (
    <div className={`min-h-screen py-8 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'}`}>
      {/* Enhanced Header Section */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="relative">
              <div className="text-7xl animate-bounce transform hover:scale-110 transition-transform duration-300">👤</div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-500 rounded-full animate-ping"></div>
            </div>
            <div className="text-7xl animate-pulse transform hover:scale-110 transition-transform duration-300">⚙️</div>
            <div className="relative">
              <div className="text-7xl animate-pulse transform hover:scale-110 transition-transform duration-300">🌟</div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-500 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <div className="relative mb-8">
            <h1 className={`text-5xl md:text-6xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif mb-6 relative`}>
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                My Profile
              </span>
            </h1>
            <div className="w-32 h-1 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"></div>
          </div>
          
          <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-xl mb-8 font-medium`}>
            🌺 Manage your account settings and preferences
          </p>
          

        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Information Card */}
        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border-2 shadow-xl overflow-hidden`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
          
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${dark ? 'bg-indigo-600' : 'bg-indigo-100'}`}>
                👤
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-1`}>
                  Profile Information
                </h2>
                <p className={`${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your account details and settings
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Name" value={displayName} icon="👤" dark={dark} />
              <Field label="Email" value={email} icon="📧" dark={dark} />
              <Field label="Roles" value={roles} icon="🏷️" dark={dark} />
              <Field label="User ID" value={user.id || user._id || user.userId || "—"} icon="🔑" dark={dark} />
            </div>
          </div>
        </div>

        {/* Reminders Card */}
        <RemindersCard user={user} defaultEmail={email} dark={dark} />
      </div>
    </div>
  );
}

function Field({ label, value, icon, dark }) {
  return (
    <div className={`p-4 rounded-2xl ${dark ? 'bg-gray-700' : 'bg-gray-50'} border-l-4 ${dark ? 'border-indigo-400' : 'border-indigo-500'}`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-lg">{icon}</span>
        <span className={`text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
      </div>
      <p className={`font-medium ${dark ? 'text-white' : 'text-gray-900'} break-all pl-8`}>{value}</p>
    </div>
  );
}

// Reminder Management Component
function RemindersCard({ user, defaultEmail, dark }) {
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
    <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border-2 shadow-xl overflow-hidden`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 animate-gradient-x"></div>
      
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${dark ? 'bg-purple-600' : 'bg-purple-100'}`}>
            🔔
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-1`}>
              Occasion Reminders
            </h2>
            <p className={`${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              Never miss special moments <span className="text-xs">(stored locally)</span>
            </p>
          </div>
        </div>
        
        {/* Reminder Form */}
        <form onSubmit={addReminder} className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                <span>🎉</span> Occasion Title
              </label>
              <input
                className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${dark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500'} focus:outline-none focus:ring-2 focus:ring-purple-200`}
                placeholder="e.g. Mom's Birthday, Anniversary"
                value={form.title}
                onChange={e=>setForm(f=>({...f,title:e.target.value}))}
              />
            </div>
            
            <div>
              <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                <span>📅</span> Date
              </label>
              <input
                type="date"
                className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${dark ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-400' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500'} focus:outline-none focus:ring-2 focus:ring-purple-200`}
                value={form.date}
                onChange={e=>setForm(f=>({...f,date:e.target.value}))}
              />
            </div>
            
            <div>
              <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                <span>⏰</span> Time
              </label>
              <input
                type="time"
                className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${dark ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-400' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500'} focus:outline-none focus:ring-2 focus:ring-purple-200`}
                value={form.time}
                onChange={e=>setForm(f=>({...f,time:e.target.value}))}
              />
            </div>
            
            <div>
              <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                <span>📱</span> Phone (SMS)
              </label>
              <input
                className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${dark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500'} focus:outline-none focus:ring-2 focus:ring-purple-200`}
                placeholder="10-digit phone number"
                value={form.phone}
                onChange={e=>setForm(f=>({...f,phone:e.target.value}))}
              />
            </div>
          </div>
          
          <div>
            <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              <span>📧</span> Email
            </label>
            <input
              className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${dark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500'} focus:outline-none focus:ring-2 focus:ring-purple-200`}
              placeholder="your.email@example.com"
              value={form.email}
              onChange={e=>setForm(f=>({...f,email:e.target.value}))}
            />
          </div>
          
          {/* Notification Channels */}
          <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-700' : 'bg-purple-50'}`}>
            <h4 className={`flex items-center gap-2 font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
              <span>🔔</span> Notification Channels
            </h4>
            <div className="flex flex-wrap gap-6">
              <label className={`flex items-center gap-3 cursor-pointer ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                <input 
                  type="checkbox" 
                  checked={form.sms} 
                  onChange={e=>setForm(f=>({...f,sms:e.target.checked}))}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded"
                />
                <span className="flex items-center gap-2 font-medium">
                  <span>📱</span> SMS Notifications
                </span>
              </label>
              <label className={`flex items-center gap-3 cursor-pointer ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                <input 
                  type="checkbox" 
                  checked={form.emailCh} 
                  onChange={e=>setForm(f=>({...f,emailCh:e.target.checked}))}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded"
                />
                <span className="flex items-center gap-2 font-medium">
                  <span>📧</span> Email Notifications
                </span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="submit" 
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${dark ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400`}
            >
              <span>➕</span>
              <span>Add Reminder</span>
            </button>
          </div>
        </form>
        
        {/* Error Messages */}
        {errors.length > 0 && (
          <div className={`p-4 rounded-2xl border-l-4 border-red-500 mb-6 ${dark ? 'bg-red-900 bg-opacity-20' : 'bg-red-50'}`}>
            <h4 className={`flex items-center gap-2 font-semibold mb-2 ${dark ? 'text-red-300' : 'text-red-800'}`}>
              <span>⚠️</span> Please fix the following:
            </h4>
            <ul className="space-y-1">
              {errors.map(e => (
                <li key={e} className={`text-sm ${dark ? 'text-red-400' : 'text-red-700'} flex items-center gap-2`}>
                  <span>•</span> {e}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Reminders List */}
        <div className="space-y-4 max-h-96 overflow-auto pr-2">
          {reminders.length === 0 ? (
            <div className={`text-center py-12 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="text-6xl mb-4">📅</div>
              <p className="text-lg font-medium mb-2">No reminders set</p>
              <p className="text-sm">Add your first reminder above!</p>
            </div>
          ) : (
            reminders.map(r => {
              const due = new Date(r.datetime);
              const now = Date.now();
              const msLeft = due.getTime() - now;
              const status = r.notified ? 'Sent' : (msLeft <= 0 ? 'Due' : 'Pending');
              
              return (
                <div key={r.id} className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${dark ? 'bg-gray-700 border-gray-600 hover:border-purple-400' : 'bg-gray-50 border-gray-200 hover:border-purple-300'}`}>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">🎉</span>
                        <h4 className={`text-lg font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{r.title}</h4>
                      </div>
                      
                      <div className="space-y-2">
                        <div className={`flex items-center gap-2 text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span>📅</span>
                          <span>{due.toLocaleString()}</span>
                        </div>
                        
                        <div className={`flex items-center gap-2 text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span>🔔</span>
                          <span>
                            {r.channels.sms && '📱 SMS'}
                            {r.channels.sms && r.channels.email && ' • '}
                            {r.channels.email && '📧 Email'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        r.notified 
                          ? `${dark ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'}` 
                          : status === 'Due' 
                            ? `${dark ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}` 
                            : `${dark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                      }`}>
                        {status === 'Sent' && '✅'} 
                        {status === 'Due' && '⏰'} 
                        {status === 'Pending' && '⏳'} 
                        {status}
                      </span>
                      
                      <button 
                        onClick={() => deleteReminder(r.id)} 
                        className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${dark ? 'bg-red-800 hover:bg-red-700 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-600'}`}
                        title="Delete reminder"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
