const CARD_STYLE = {
  position: 'relative',
  overflow: 'hidden',
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(239,246,255,0.9))',
  border: '1px solid #D9E5FF',
  borderRadius: 22,
  padding: '20px 20px 18px',
  boxShadow: '0 12px 35px rgba(21,93,252,0.08)',
  minHeight: 145,
};

const LABEL_STYLE = {
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.09em',
  color: '#64748B',
  fontWeight: 700,
  marginBottom: 8,
};

const VALUE_STYLE = {
  fontSize: 32,
  fontWeight: 800,
  color: '#155DFC',
  lineHeight: 1.2,
};

export function StatisticsCards({ stats }) {
  const {
    totalKasus,
    uniqueKabupaten,
  } = stats;

  const cards = [
    {
      label: 'Total Kasus',
      value: totalKasus.toLocaleString('id-ID'),
      icon: '📊',
    },
    {
      label: 'Kabupaten/Kota',
      value: uniqueKabupaten.toLocaleString('id-ID'),
      icon: '📍',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 20,
        marginBottom: 28,
      }}
    >
      {cards.map((card, index) => (
        <div key={index} style={CARD_STYLE}>
          {/* Decorative gradient */}
          <div
            style={{
              position: 'absolute',
              width: 150,
              height: 150,
              right: -55,
              top: -60,
              borderRadius: '50%',
              background:
                index === 0
                  ? 'radial-gradient(circle, rgba(21,93,252,0.16), transparent 70%)'
                  : 'radial-gradient(circle, rgba(14,165,233,0.16), transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 14,
              background:
                'linear-gradient(135deg, #E8F0FF, #FFFFFF)',
              border: '1px solid #D5E3FF',
              boxShadow: '0 6px 16px rgba(21,93,252,0.10)',
              marginBottom: 15,
              fontSize: 21,
            }}
          >
            {card.icon}
          </div>

          <div style={LABEL_STYLE}>
            {card.label}
          </div>

          <div style={VALUE_STYLE}>
            {card.value}
          </div>

          {/* Blue accent */}
          <div
            style={{
              width: 42,
              height: 3,
              marginTop: 12,
              borderRadius: 999,
              background:
                'linear-gradient(90deg, #155DFC, #38BDF8)',
            }}
          />
        </div>
      ))}

      <style>
        {`
          @media (max-width: 640px) {
            .statistics-cards {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}