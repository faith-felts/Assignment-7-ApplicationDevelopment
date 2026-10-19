function LoadingSpinner() {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <p>Loading movies...</p>
    </div>
  );
}

export default LoadingSpinner;
