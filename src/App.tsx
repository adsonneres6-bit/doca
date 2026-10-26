import { useState } from 'react';
import {
  Building2,
  ChevronRight,
  CircleHelp,
  Clock3,
  MapPin,
  Megaphone,
  Navigation,
  Pencil,
  Shield,
  Truck,
  UserRound,
} from 'lucide-react';

type EditableFieldProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  format?: (value: string) => string | null;
  ariaLabel: string;
};

function EditableField({ value, onChange, className = '', format, ariaLabel }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const startEditing = () => {
    setDraft(value);
    setEditing(true);
  };

  const save = () => {
    const formattedValue = format ? format(draft) : draft.trim();
    if (formattedValue === null) return;
    onChange(formattedValue);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        className={`editable-input ${className}`}
        aria-label={ariaLabel}
        autoFocus
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={save}
        onKeyDown={(event) => {
          if (event.key === 'Enter') save();
          if (event.key === 'Escape') setEditing(false);
        }}
      />
    );
  }

  return (
    <span className={`editable-value ${className}`} onDoubleClick={startEditing} title="Clique duas vezes para editar">
      {value}
      <Pencil className="edit-hint" size={13} />
    </span>
  );
}

function normalizeRoute(value: string): string {
  const normalized = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const match = normalized.match(/^([A-Z])(\d+)$/);
  return match ? `${match[1]}-${match[2]}` : normalized;
}

function normalizePlate(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function normalizeVehicleType(value: string): string {
  return value.toUpperCase().trim();
}

function normalizeTime(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  const padded = digits.length === 3 ? digits.padStart(4, '0') : digits;
  if (padded.length !== 4) return null;

  const hours = Number(padded.slice(0, 2));
  const minutes = Number(padded.slice(2));
  if (hours > 23 || minutes > 59) return null;

  return `${padded.slice(0, 2)}:${padded.slice(2)}`;
}

function formatDateTime(date: Date): string {
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function App() {
  const [activeTab, setActiveTab] = useState('check-in');
  const [location, setLocation] = useState('OF Vila Guilherme');
  const [route, setRoute] = useState('S-4');
  const [dockTitle, setDockTitle] = useState('DOCA');
  const [dock, setDock] = useState('16');
  const [vehicleType, setVehicleType] = useState('MOTO');
  const [slotTime, setSlotTime] = useState('15:50');
  const [checkInTime, setCheckInTime] = useState('15:22');
  const [driverName, setDriverName] = useState('ADSON L. DOS SANTOS');
  const [plate, setPlate] = useState('TKI2A00');
  const [driverId, setDriverId] = useState('125471');
  const [checkInAt, setCheckInAt] = useState(() => formatDateTime(new Date()));

  return (
    <main className="app-shell">
      <section className="phone-screen" aria-label="YMS Motoristas">
        <header className="top-header">
          <div className="brand-row">
            <div className="brand-mark">
              <img className="brand-logo" src="/logo_yms.png" alt="YMS" />
            </div>
            <div>
              <h1>YMS Motoristas</h1>
              <p>Check-in e chamada</p>
            </div>
          </div>

          <div className="driver-row">
            <div>
              <strong><EditableField value={driverName} onChange={setDriverName} ariaLabel="Nome do motorista" /></strong>
              <span className="driver-id"><UserRound size={15} fill="currentColor" /> <EditableField value={driverId} onChange={setDriverId} ariaLabel="Identificação do motorista" /></span>
            </div>
            <button className="logout-button" type="button">Sair</button>
          </div>
        </header>

        <div className={`content-area ${activeTab === 'chamada' ? 'call-content-area' : ''}`}>
          {activeTab === 'chamada' ? (
            <section className="call-panel">
              <div className="call-panel-label">CHEGOU NA <EditableField value={dockTitle} onChange={setDockTitle} ariaLabel="Título da doca" /></div>
              <div className="call-card">
                <div className="call-card-topline">
                  <span className="call-card-caption">MOSTRE NA DOCA</span>
                  <span className="dock-pill">DOCA <EditableField value={dock} onChange={setDock} ariaLabel="Número da doca" /></span>
                </div>
                <h2><EditableField value={driverName} onChange={setDriverName} ariaLabel="Nome exibido na chamada" /></h2>
                <div className="call-rows">
                  <div><span>Cluster</span><strong><EditableField value={route} onChange={setRoute} format={normalizeRoute} ariaLabel="Cluster" /></strong></div>
                  <div><span>Tipo de veículo</span><strong><EditableField value={vehicleType} onChange={setVehicleType} format={normalizeVehicleType} ariaLabel="Tipo de veículo" /></strong></div>
                  <div><span>Placa</span><strong><EditableField value={plate} onChange={setPlate} format={normalizePlate} ariaLabel="Placa do veículo" /></strong></div>
                </div>
              </div>
              <div className="call-meta">
                <span><EditableField value={checkInAt} onChange={setCheckInAt} ariaLabel="Data e hora da chamada" /></span>
                <span className="call-meta-security"><Shield size={16} fill="currentColor" /> <b><EditableField value={driverId} onChange={setDriverId} ariaLabel="Identificação de segurança" /></b></span>
                <span><EditableField value={checkInAt} onChange={setCheckInAt} ariaLabel="Data e hora da chamada" /></span>
              </div>
            </section>
          ) : (
            <>
              <section className="operation-card">
                <div className="operation-icon"><Truck size={26} strokeWidth={2.7} /></div>
                <div className="operation-copy">
                  <h2>Na operação</h2>
                  <div className="operation-details">
                    <span><Building2 size={18} /> <EditableField value={location} onChange={setLocation} ariaLabel="Local da operação" /></span>
                    <span><Navigation size={17} /> Rota <EditableField value={route} onChange={setRoute} format={normalizeRoute} ariaLabel="Rota" /></span>
                    <span><Clock3 size={17} fill="currentColor" /> <EditableField value={slotTime} onChange={setSlotTime} format={normalizeTime} ariaLabel="Horário da operação" /></span>
                  </div>
                </div>
              </section>

              <section className="checkin-panel">
                <div className="panel-label">CHECK-IN CONFIRMADO</div>
                <div className="receipt-card">
                  <div className="receipt-topline">
                    <span className="receipt-caption">MOSTRE À SEGURANÇA</span>
                    <span className="confirmed-pill">CHECK-IN</span>
                  </div>
                  <h2><EditableField value={driverName} onChange={setDriverName} ariaLabel="Nome exibido no comprovante" /></h2>
                  <div className="receipt-rows">
                    <div><span>Slot</span><strong><EditableField value={slotTime} onChange={setSlotTime} format={normalizeTime} ariaLabel="Horário do slot" /></strong></div>
                    <div><span>Tipo de veículo</span><strong><EditableField value={vehicleType} onChange={setVehicleType} format={normalizeVehicleType} ariaLabel="Tipo de veículo" /></strong></div>
                    <div><span>Placa</span><strong><EditableField value={plate} onChange={setPlate} format={normalizePlate} ariaLabel="Placa do veículo" /></strong></div>
                    <div><span>Check-in realizado às</span><strong><EditableField value={checkInTime} onChange={setCheckInTime} format={normalizeTime} ariaLabel="Horário do check-in realizado" /></strong></div>
                  </div>
                </div>

                <div className="receipt-meta">
                  <span><EditableField value={checkInAt} onChange={setCheckInAt} ariaLabel="Data e hora do check-in" /></span>
                  <span><Shield size={16} fill="currentColor" /> <b><EditableField value={driverId} onChange={setDriverId} ariaLabel="Identificação no comprovante" /></b></span>
                  <span><EditableField value={checkInAt} onChange={setCheckInAt} ariaLabel="Data e hora do comprovante" /></span>
                </div>
                <p className="security-note">Apresente este comprovante ao grupo de<br /> segurança. Em seguida, acompanhe a chamada.</p>
                <button className="call-button" type="button" onClick={() => setActiveTab('chamada')}>
                  Ir para Chamada <ChevronRight size={23} strokeWidth={3} />
                </button>
              </section>
            </>
          )}
        </div>

        <nav className="bottom-nav" aria-label="Navegação principal">
          <NavButton active={activeTab === 'check-in'} label="Check-in" onClick={() => setActiveTab('check-in')}>
            <MapPin size={26} fill="currentColor" />
          </NavButton>
          <NavButton active={activeTab === 'chamada'} label="Chamada" onClick={() => setActiveTab('chamada')}>
            <Megaphone size={27} fill="currentColor" />
          </NavButton>
          <NavButton active={activeTab === 'ajuda'} label="Ajuda" onClick={() => setActiveTab('ajuda')}>
            <CircleHelp size={27} fill="currentColor" />
          </NavButton>
        </nav>
        <div className="home-indicator" />
      </section>
    </main>
  );
}

type NavButtonProps = {
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
};

function NavButton({ active, label, onClick, children }: NavButtonProps) {
  return (
    <button className={`nav-button ${active ? 'active' : ''}`} type="button" onClick={onClick}>
      {children}
      <span>{label}</span>
    </button>
  );
}

export default App;
