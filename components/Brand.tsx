import TermiteLogoMark from './TermiteLogoMark';

export default function Brand({ href = '/' }: { href?: string }) {
  return <a className="brand" href={href} aria-label="TermiteTreatment home"><span className="brand-mark"><TermiteLogoMark /></span><span><span className="brand-name">Termite<span>Treatment</span></span><span className="brand-sub">PEST CONTROL</span></span></a>;
}
