const OPTION_STYLES = Object.freeze({
  OPACITY: "opacity",
  TRANSLATE_Y: "translateY",
  TRANSLATE_X: "translateX",
  SCALE: "scale",
  ROTATE: "rotate",
});

/**
 * @param containerId
 * The id of the container element
 * @param targetId
 * The id of the target element
 * @param options
 * An array of options
 *
 * @description
 * Initializes scroll animation for target element
 *
 * @example
 * const containerId = 'container-1'
 * const targetId = 'content-1'
 * const options = [
 *    {
 *       from: 0,
 *       fromCss: {
 *       translateY: '-100'
 *    },
 *       to: 30,
 *       toCss: {
 *       translateY: '0'
 *    }
 * }]
 */
function initScrollAnimate(containerId, targetId, options) {
  scrollAnimate(containerId, targetId, options);

  document.addEventListener("scroll", () => {
    scrollAnimate(containerId, targetId, options);
  });
}

function scrollAnimate(containerId, targetId, options) {
  const container = document.getElementById(containerId);
  const target = document.getElementById(targetId);

  try {
    processScrollValues(container, target, options);
  } catch (e) {
    console.error(e);
  }
}

function processScrollValues(container, target, options) {
  const containerScrollPercentage =
    calculateContainerScrollPercentage(container);
  const isContainerVisible =
    containerScrollPercentage <= 100 && containerScrollPercentage >= 0;

  triggerContentVisibility(isContainerVisible, target);

  if (!isContainerVisible) {
    return;
  }

  options.forEach((option) => {
    const { from, fromCss, to, toCss } = option;
    const optionScrollPercentage =
      (containerScrollPercentage - from) / (to - from);
    const isScrollOutOfRange =
      containerScrollPercentage < from || containerScrollPercentage > to;

    if (isScrollOutOfRange) {
      return;
    }

    const cssValues = getCssValues(fromCss, toCss, optionScrollPercentage);

    appendCssValuesToTarget(cssValues, target);
  });
}

function appendCssValuesToTarget(cssValues, target) {
  cssValues.forEach((cssValue) => {
    Object.keys(cssValue).forEach((key) => {
      target.style[key] = cssValue[key];
    });
  });
}

function getCssValues(fromCss, toCss, optionScrollPercentage) {
  let cssValues = [];

  Object.keys(fromCss).forEach((key) => {
    validateOptionCss(key, fromCss, toCss);

    const fromValue = parseFloat(fromCss[key]);
    const toValue = parseFloat(toCss[key]);
    const value = fromValue + (toValue - fromValue) * optionScrollPercentage;

    cssValues.push(getCssValue(key, value));
  });

  cssValues = concatTransformStyles(cssValues);

  return cssValues;
}

function concatTransformStyles(cssValues) {
  let transformString = "";

  cssValues = cssValues.filter((style) => {
    const transformValue = style["transform"];

    if (!transformValue) {
      return true;
    }

    transformString += `${transformValue} `;
    return false;
  });

  cssValues.push({
    transform: transformString,
  });

  return cssValues;
}

function getCssValue(key, value) {
  switch (key) {
    case OPTION_STYLES.OPACITY:
      return { opacity: value };

    case OPTION_STYLES.TRANSLATE_Y:
      return { transform: "translateY(" + value + "px)" };

    case OPTION_STYLES.TRANSLATE_X:
      return { transform: "translateX(" + value + "px)" };

    case OPTION_STYLES.SCALE:
      return { transform: "scale(" + value + ")" };

    case OPTION_STYLES.ROTATE:
      return { transform: "rotate(" + value + "deg)" };
  }
}

function validateOptionCss(key, fromCss, toCss) {
  const allowedKeys = Object.values(OPTION_STYLES);
  const isKeyAllowed = allowedKeys.includes(key);

  if (!isKeyAllowed) {
    throw new Error(`Key ${key} is not allowed`);
  }

  const isKeyInToCss = key in toCss;
  if (!isKeyInToCss) {
    throw new Error(`Key ${key} is not in toCss`);
  }
}

function triggerContentVisibility(isContainerVisible, target) {
  if (isContainerVisible) {
    target.style = "visibility: visible";
  } else {
    target.style = "visibility: hidden";
  }
}

function calculateContainerScrollPercentage(container) {
  const containerHeight = container.offsetHeight;
  const containerOffsetTop = container.offsetTop;
  const isFirstContainer = containerOffsetTop === 0;
  let currentTotalScroll = window.pageYOffset + window.innerHeight;

  if (isFirstContainer) {
    currentTotalScroll -= window.innerHeight;
  }

  const containerStartScroll = currentTotalScroll - containerOffsetTop;
  const containerMaxScroll = isFirstContainer
    ? containerHeight - window.innerHeight
    : containerHeight;

  return (containerStartScroll / containerMaxScroll) * 100;
}
