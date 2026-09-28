export function Card({
  title,
  subtitle,
  children,
  className = '',
  action,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[22px] border border-[#D9E5FF] bg-white/95 shadow-[0_12px_40px_rgba(21,93,252,0.08)] ${className}`}
      style={{
        marginBottom: 28,
      }}
    >
      {(title || subtitle || action) && (
        <div
          className="flex items-start justify-between gap-4"
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #EAF0FA',
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,251,255,0.95))',
          }}
        >
          <div
            style={{
              position: 'relative',
              paddingLeft: 14,
            }}
          >
            {/* Blue accent */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 1,
                width: 4,
                height: 'calc(100% - 2px)',
                minHeight: 30,
                borderRadius: 999,
                background:
                  'linear-gradient(180deg, #155DFC, #38BDF8)',
              }}
            />

            {title && (
              <h2
                className="text-lg font-bold text-slate-800"
                style={{
                  margin: 0,
                  fontSize: 18,
                  lineHeight: 1.4,
                }}
              >
                {title}
              </h2>
            )}

            {subtitle && (
              <p
                style={{
                  margin: '5px 0 0',
                  fontSize: 13,
                  color: '#64748B',
                  lineHeight: 1.5,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {action && (
            <div className="shrink-0">
              {action}
            </div>
          )}
        </div>
      )}

      <div
        style={{
          padding: '22px 24px 24px',
        }}
      >
        {children}
      </div>
    </div>
  );
}