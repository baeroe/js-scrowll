const OPTION_STYLES = Object.freeze({
    OPACITY:     'opacity',
    TRANSLATE_Y: 'translateY',
    TRANSLATE_X: 'translateX',
    SCALE:       'scale',
    ROTATE:      'rotate',
    COLOR:       'color',
    BACKGROUND:  'background',
    BLUR:        'blur',
});

const NUMERIC_STYLES = Object.freeze([
    OPTION_STYLES.OPACITY,
    OPTION_STYLES.SCALE,
    OPTION_STYLES.ROTATE,
    OPTION_STYLES.BLUR,
    OPTION_STYLES.TRANSLATE_Y,
    OPTION_STYLES.TRANSLATE_X,
]);

const COLOR_STYLES = Object.freeze([
    OPTION_STYLES.COLOR,
    OPTION_STYLES.BACKGROUND,
]);

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
 *       percentage: {
 *          from: 90,
 *          to:   100,
 *       },
 *       styles:     {
 *          opacity: {
 *             from: 1,
 *             to:   0,
 *          },
 *          scale:   {
 *             from: 1,
 *             to:   0.5,
 *          },
 *       },
 *    }
 * ]
 */
export function initScrollAnimate(containerId, targetId, options) {
    scrollAnimate(containerId, targetId, options);

    document.addEventListener('scroll', () => {
        scrollAnimate(containerId, targetId, options);
    });
}

function scrollAnimate(containerId, targetId, options) {
    const container = document.getElementById(containerId);
    const target    = document.getElementById(targetId);

    try {
        processScrollValues(container, target, options);
    } catch (e) {
        console.error(e);
    }
}

function processScrollValues(container, target, options) {
    const containerScrollPercentage = calculateContainerScrollPercentage(container);
    const isContainerVisible        = (
        containerScrollPercentage <= 100 &&
        containerScrollPercentage >= 0
    );

    triggerContentVisibility(isContainerVisible, target);

    if (!isContainerVisible) {
        return;
    }

    options.forEach((option) => {
        const { from: percentageFrom, to: percentageTo } = option.percentage;
        // @formatter:off
        const optionScrollMultiplier =
                  (containerScrollPercentage - percentageFrom) /
                  (percentageTo - percentageFrom)
        ;
        // @formatter:on
        const isScrollOutOfRange                         = (
            containerScrollPercentage < percentageFrom ||
            containerScrollPercentage > percentageTo
        );

        if (isScrollOutOfRange) {
            return;
        }

        handleCssValues(
            option,
            optionScrollMultiplier,
            target,
        );
    });
}

function handleCssValues(option, optionScrollMultiplier, target) {
    const { styles } = option;

    let cssValues = [];

    Object.keys(styles).forEach((key) => {
        if (NUMERIC_STYLES.includes(key)) {
            handleNumericCssValues(
                cssValues,
                key,
                styles[key],
                optionScrollMultiplier,
            );
        } else if (COLOR_STYLES.includes(key)) {
            handleColorCssValues(
                cssValues,
                key,
                styles[key],
                optionScrollMultiplier,
            );
        }
    });

    concatTransformStyles(cssValues);
    appendCssValuesToTarget(cssValues, target);
}

function handleColorCssValues(cssValues, key, style, optionScrollMultiplier) {
    const { from: styleFrom, to: styleTo } = style;
    const optionScrollPercentage           = optionScrollMultiplier * 100;

    let cssValue  = {};
    cssValue[key] = `color-mix(in hsl, ${styleFrom}, ${styleTo} ${optionScrollPercentage}%)`;

    cssValues.push(cssValue);
}

function handleNumericCssValues(cssValues, key, style, optionScrollMultiplier) {
    const { from: styleFrom, to: styleTo } = style;
    const cssValue                         = getCssValue(
        key,
        styleFrom,
        styleTo,
        optionScrollMultiplier,
    );

    cssValues.push(cssValue);

}

function appendCssValuesToTarget(cssValues, target) {
    cssValues.forEach((cssValue) => {
        Object.keys(cssValue).forEach((key) => {
            console.log(cssValue[key]);
            target.style[key] = cssValue[key];
        });
    });
}

function getCssValue(name, from, to, optionScrollMultiplier) {
    validateOptionCss(name, from, to);

    const fromValue = parseFloat(from);
    const toValue   = parseFloat(to);
    const value     = fromValue + (
        toValue - fromValue
    ) * optionScrollMultiplier;

    switch (name) {
        case OPTION_STYLES.OPACITY:
            return { opacity: value };

        case OPTION_STYLES.TRANSLATE_Y:
            return { transform: 'translateY(' + value + 'px)' };

        case OPTION_STYLES.TRANSLATE_X:
            return { transform: 'translateX(' + value + 'px)' };

        case OPTION_STYLES.SCALE:
            return { transform: 'scale(' + value + ')' };

        case OPTION_STYLES.ROTATE:
            return { transform: 'rotate(' + value + 'deg)' };

        case OPTION_STYLES.BLUR:
            return { filter: 'blur(' + value + 'px)' };
    }
}

function concatTransformStyles(cssValues) {
    let transformString = '';

    cssValues = cssValues.filter((style) => {
        const transformValue = style['transform'];

        if (!transformValue) {
            return true;
        }

        transformString += `${transformValue} `;
        return false;
    });

    cssValues.push({
        transform: transformString,
    });
}

function validateOptionCss(key, from, to) {
    const allowedKeys  = Object.values(OPTION_STYLES);
    const isKeyAllowed = allowedKeys.includes(key);

    if (!isKeyAllowed) {
        throw new Error(`Key ${key} is not allowed`);
    }

    if (
        isNullOrUndefined(from) ||
        isNullOrUndefined(to)
    ) {
        throw new Error(`Key ${key} needs a from and a to value`);
    }
}

function triggerContentVisibility(isContainerVisible, target) {
    if (isContainerVisible) {
        target.style = 'visibility: visible';
    } else {
        target.style = 'visibility: hidden';
    }
}

function calculateContainerScrollPercentage(container) {
    const containerHeight    = container.offsetHeight;
    const containerOffsetTop = container.offsetTop;
    const isFirstContainer   = containerOffsetTop === 0;
    let currentTotalScroll   = window.pageYOffset + window.innerHeight;

    if (isFirstContainer) {
        currentTotalScroll -= window.innerHeight;
    }

    const containerStartScroll = currentTotalScroll - containerOffsetTop;
    const containerMaxScroll   = isFirstContainer
        ? containerHeight - window.innerHeight
        : containerHeight;

    return (
        containerStartScroll / containerMaxScroll
    ) * 100;
}

function isNullOrUndefined(value) {
    return value === null || value === undefined;
}