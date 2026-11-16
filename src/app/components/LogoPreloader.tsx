export default function LogoPreloader() {
  return (
    <div className="brand-loader" role="status" aria-label="Loading 2Carvn Academy">
      <div className="brand-loader__scene" aria-hidden="true">
        <span className="brand-loader__halo" />
        <div className="brand-loader__wordmark">
          <span className="brand-loader__sweep" />
          <img
            src="/2carvn-logo.png"
            alt=""
            width="712"
            height="350"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <span className="brand-loader__caption">2CARVN ACADEMY</span>
      </div>
    </div>
  );
}
