import { useState } from 'react'

interface AccordionItem {
  label: string
  desc?: string
  dist?: string
}

export function Accordion({ items, light = false }: { items: AccordionItem[]; light?: boolean }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="divide-y" style={{ borderColor: light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)' }}>
      {items.map((item, i) => (
        <div key={i} className="py-4">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium tracking-wide">{item.label}</span>
              {item.dist && (
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.15)' }}>
                  {item.dist}
                </span>
              )}
            </div>
            <span className="text-lg leading-none transition-transform duration-300 shrink-0 ml-4"
              style={{ transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
          </button>
          {open === i && item.desc && (
            <p className="mt-3 text-sm opacity-65 leading-relaxed pr-8">{item.desc}</p>
          )}
        </div>
      ))}
    </div>
  )
}
