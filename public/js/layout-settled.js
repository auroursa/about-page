(function () {
  const afterNextPaint = (callback) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(callback);
    });
  };

  const afterLayoutSettled = (callback) => {
    const run = () => {
      afterNextPaint(callback);
    };

    if (document.fonts?.status === 'loading') {
      document.fonts.ready.then(run, run);
      return;
    }

    run();
  };

  window.cynosura = window.cynosura ?? {};
  window.cynosura.afterLayoutSettled = afterLayoutSettled;
})();
