const options = [
  {
    from: 0,
    fromCss: {
      opacity: 0,
      scale: 0.5,
      translateY: "-100",
      rotate: 45,
    },
    to: 30,
    toCss: {
      opacity: 1,
      scale: 1,
      translateY: "0",
      rotate: 0,
    },
  },
  {
    from: 70,
    fromCss: {
      opacity: 1,
    },
    to: 100,
    toCss: {
      opacity: 0,
    },
  },
];
initScrollAnimate("container-1", "content-1", options);
initScrollAnimate("container-2", "content-2", options);
