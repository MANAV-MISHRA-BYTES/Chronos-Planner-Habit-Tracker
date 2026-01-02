
import React, { useState } from 'react';

interface CustomDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: any) => void;
  colorClass?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, value, options, onChange, colorClass = "bg-white" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">{label}</label>
      <div className={`w-full ${colorClass} border border-slate-200 rounded-xl px-4 py-[11px] text-sm cursor-default flex justify-between items-center transition-all group-hover:border-blue-400 group-hover:ring-2 group-hover:ring-blue-100 shadow-sm`}>
        <span className="capitalize text-slate-700 font-bold">{value}</span>
        <i className={`fas fa-chevron-down text-xs text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
      </div>
      
      {isOpen && (
        <div className="absolute z-20 top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer capitalize transition-colors ${
                value === opt ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 font-medium'
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
