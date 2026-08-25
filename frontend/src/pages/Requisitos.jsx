import { CheckCircle, AlertCircle, CreditCard, QrCode } from 'lucide-react'

const reqLocal = [
  'Foto de cédula de identidad (vigente)',
  'Foto de licencia de conducir (vigente)',
  'Foto de factura de luz o agua (vigente)',
  'Ubicación exacta de domicilio (Google Maps)',
  'Verificación de domicilio',
  'Pago adelantado de los días requeridos',
]

const reqInterior = [
  'Foto de cédula de identidad (vigente)',
  'Foto de licencia de conducir (vigente)',
  'Voucher o reserva de su hotel',
  'Pago adelantado',
  'Depósito de garantía',
  'Pago por QR disponible de forma independiente',
]

const garantias = [
  { monto: '3.500 Bs', desc: 'Hasta 490 Bs/día' },
  { monto: '5.000 Bs', desc: 'Vehículos intermedios' },
  { monto: '7.000 Bs', desc: 'Premium / 4×4' },
]

export default function Requisitos() {
  return (
    <main className="pt-[64px]">
      <div className="max-w-5xl mx-auto px-6 lg:px-14 py-14">

        <p className="section-label mb-3 text-[#0015FF]">Antes de reservar</p>
        <h1 className="font-display text-6xl uppercase text-[#111] tracking-tight leading-none mb-4">
          Requisitos
        </h1>
        <p className="text-sm text-[#6B6B6B] mb-14">
          Duración mínima de alquiler: <strong className="text-[#111]">3 días</strong>. Reserva con anticipación.
        </p>

        {/* requisitos */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {[
            { title: 'Residentes en Bolivia', items: reqLocal },
            { title: 'Del interior o del extranjero', items: reqInterior },
          ].map(g => (
            <div key={g.title} className="card p-7">
              <h2 className="font-semibold text-[#111] text-sm mb-6 pb-4 border-b border-[#E8E8E8]">{g.title}</h2>
              <ul className="flex flex-col gap-3">
                {g.items.map(r => (
                  <li key={r} className="flex items-start gap-3 text-sm text-[#6B6B6B]">
                    <CheckCircle size={14} className="text-[#0015FF] shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* garantía */}
        <div className="bg-[#FFE600] border border-[#0015FF]/20 rounded-3xl p-8 mb-8">
          <p className="section-label mb-3 text-[#0015FF]">Garantía</p>
          <h2 className="font-display text-3xl uppercase text-[#111] mb-2">Depósito reembolsable</h2>
          <p className="text-sm text-[#333] mb-6">
            100% reembolsable al devolver el vehículo en las mismas condiciones.{' '}
            <span className="text-[#0015FF] font-medium">La garantía no corresponde al pago del alquiler.</span>
          </p>
          <div className="grid grid-cols-3 gap-4">
            {garantias.map((g, i) => (
              <div key={g.monto} className="bg-white rounded-2xl p-4 text-center shadow-card border border-[#E8E8E8]">
                <div className={`font-display text-2xl ${i === 1 ? 'text-[#FF0033]' : 'text-[#0015FF]'}`}>{g.monto}</div>
                <div className="section-label mt-1">{g.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* pago */}
        <div className="card p-7 mb-6">
          <h2 className="font-semibold text-[#111] text-sm mb-4">Formas de pago</h2>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: 'Pago con tarjeta débito y crédito', icon: <CreditCard size={15} className="text-[#FF0033]" /> },
              { label: 'QR', icon: <QrCode size={15} className="text-[#0015FF]" /> },
              { label: 'QR independiente (clientes extranjeros)', icon: <QrCode size={15} className="text-[#FF0033]" /> },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-2 bg-[#FFE600] rounded-full px-4 py-2">
                {p.icon}
                <span className="text-sm text-[#111]">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3 text-[#333] text-xs border border-[#0015FF]/20 rounded-2xl p-4 bg-[#FFE600] mb-3">
          <AlertCircle size={14} className="text-[#0015FF] shrink-0 mt-0.5" />
          <span><strong>Condición de entrega y devolución:</strong> El vehículo se entrega lavado y con tanque a full. Debe devolverse en las mismas condiciones.</span>
        </div>
        <div className="flex items-start gap-3 text-[#333] text-xs border border-[#0015FF]/20 rounded-2xl p-4 bg-[#FFE600]">
          <AlertCircle size={14} className="text-[#0015FF] shrink-0 mt-0.5" />
          Los precios y condiciones pueden variar según tipo de uso y duración. Consulta disponibilidad antes de reservar.
        </div>
      </div>
    </main>
  )
}
