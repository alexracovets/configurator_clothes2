'use client';

const MainLoaderBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-input-border" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(152deg,#fafafa_0%,#f2f2f2_38%,#e8e8e8_52%,#dcdcdc_100%)]" />
      <div className="absolute inset-0 origin-center bg-[linear-gradient(118deg,transparent_42%,rgba(255,255,255,0.88)_48.5%,rgba(255,255,255,0.42)_51.5%,transparent_58%)] will-change-transform animate-loader-beam motion-reduce:animate-none motion-reduce:rotate-[-31deg] motion-reduce:scale-[1.65]" />
      <div className="absolute inset-x-0 top-0 h-[38%] bg-[linear-gradient(to_bottom,#ffffff_0%,#ffffff_12%,rgba(255,255,255,0.92)_22%,transparent_100%)]" />
    </div>
  );
};

export { MainLoaderBackground };
