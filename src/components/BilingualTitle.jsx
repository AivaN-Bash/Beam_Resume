import useBilingualToggle from "./useBilingualToggle";

export default function BilingualTitle({ english, thai }) {
  const [showThai, pauseHandlers] = useBilingualToggle();

  return (
    <h1 className={`page-title-switch${showThai ? " show-thai" : ""}`} {...pauseHandlers}>
      <span className="page-title-option page-title-english" aria-hidden={showThai}>{english}</span>
      <span className="page-title-option page-title-thai" aria-hidden={!showThai}>{thai}</span>
    </h1>
  );
}
