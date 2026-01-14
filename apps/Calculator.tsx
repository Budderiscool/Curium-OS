import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState('');
  const [op, setOp] = useState('');

  const handleNum = (n: string) => {
    setDisplay(display === '0' ? n : display + n);
  };

  const handleOp = (o: string) => {
    setPrev(display);
    setOp(o);
    setDisplay('0');
  };

  const calculate = () => {
    const a = parseFloat(prev);
    const b = parseFloat(display);
    let res = 0;
    if (op === '+') res = a + b;
    if (op === '-') res = a - b;
    if (op === '*') res = a * b;
    if (op === '/') res = a / b;
    setDisplay(res.toString());
    setOp('');
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', 'C', '=', '+'
  ];

  return (
    <div className="h-full bg-[#0a0a0a] flex flex-col p-6 items-center justify-center">
      <div className="w-64 bg-white/5 border border-white/10 rounded-[2rem] p-4 shadow-2xl">
        <div className="h-20 flex flex-col items-end justify-end px-4 py-2 text-white overflow-hidden">
          <span className="text-xs opacity-40 font-mono">{prev} {op}</span>
          <span className="text-4xl font-light tracking-tighter truncate w-full text-right">{display}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4">
          {buttons.map(btn => (
            <button
              key={btn}
              onClick={() => {
                if (btn === 'C') { setDisplay('0'); setPrev(''); setOp(''); }
                else if (btn === '=') calculate();
                else if (['+', '-', '*', '/'].includes(btn)) handleOp(btn);
                else handleNum(btn);
              }}
              className={`h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all active:scale-90 ${btn === '=' ? 'bg-indigo-600 text-white col-span-1' : ['+', '-', '*', '/'].includes(btn) ? 'bg-white/10 text-indigo-400' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;