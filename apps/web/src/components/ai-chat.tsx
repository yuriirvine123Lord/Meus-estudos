import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; content: string };

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', content: 'Olá! Sou o assistente de IA do OpenCut. Como posso ajudar com seu vídeo?' },
  ]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...msgs, { role: 'user', content: text }];
    setMsgs(next);
    setInput('');
    setLoading(true);
    try {
      const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || '';
      if (!apiKey) {
        setMsgs([...next, { role: 'assistant', content: '⚠️ Defina VITE_OPENAI_API_KEY no .env para usar o chat de IA.' }]);
        return;
      }
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: 'Você é um assistente de edição de vídeo do OpenCut. Responda em português, de forma concisa e útil.' }, ...next],
        }),
      });
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content || 'Sem resposta.';
      setMsgs([...next, { role: 'assistant', content: reply }]);
    } catch (e: any) {
      setMsgs([...next, { role: 'assistant', content: 'Erro: ' + (e?.message || e) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
          aria-label="Abrir chat de IA"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[32rem] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800">
            <span className="font-semibold">Assistente IA</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-100'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 px-3 py-2 rounded-xl text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> pensando...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="border-t border-gray-700 p-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Digite sua pergunta..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
            <button onClick={send} disabled={loading || !input.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg px-3">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
