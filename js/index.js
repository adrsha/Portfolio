const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    multiplier:0.5,
    mobile: {
      breakpoint:0,
      smooth: true
    },
    tablet: {
      breakpoint:0,
      smooth: true
    },
    lerp: 0.07,
  });
