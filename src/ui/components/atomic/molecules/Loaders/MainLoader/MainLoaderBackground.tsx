'use client';

const DIAGONAL_PANEL_CLASS = 'absolute top-[-55%] left-[-45%] h-[210%] w-[155%] -rotate-[27deg] motion-reduce:top-[-52%] motion-reduce:left-[-42%]';

const MainLoaderBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#d0d0d0]" aria-hidden>
      <div className="absolute inset-0 animate-loader-diagonal will-change-transform motion-reduce:animate-none">
        <div className={`${DIAGONAL_PANEL_CLASS} bg-[linear-gradient(165deg,#fcfcfc_0%,#f4f4f4_50%,#ebebeb_100%)]`} />
        <div
          className={`${DIAGONAL_PANEL_CLASS} bg-[linear-gradient(90deg,transparent_0%,transparent_48.8%,rgba(255,255,255,0.9)_49.6%,rgba(255,255,255,0.25)_50.4%,transparent_51.2%,transparent_100%)]`}
        />
      </div>
      <div className="absolute inset-x-0 top-0 h-[38%] bg-[linear-gradient(to_bottom,#ffffff_0%,#ffffff_12%,rgba(255,255,255,0.92)_22%,transparent_100%)]" />
    </div>
  );
};

export { MainLoaderBackground };
