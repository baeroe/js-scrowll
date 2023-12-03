const options = [
    {
        percentage: {
            from: 0,
            to:   90,
        },
        styles:     {
            opacity:    {
                from: 0,
                to:   1,
            },
            translateY: {
                from: '-100',
                to:   '0',
            },
            scale:      {
                from: 0.5,
                to:   1,
            },
            rotate:     {
                from: 45,
                to:   0,
            },
            blur:       {
                from: 4,
                to:   0,
            },
            background: {
                from: '#bb99ff',
                to:   '#ab6f33',
            },
        },
    },
    {
        percentage: {
            from: 90,
            to:   100,
        },
        styles:     {
            opacity:    {
                from: 1,
                to:   0,
            },
            scale:      {
                from: 1,
                to:   0.5,
            },
            background: {
                from: '#ab6f33',
                to:   '#bb99ff',
            },
        },
    },

];

initScrollAnimate(
    'container-1',
    'content-1',
    options,
);
initScrollAnimate(
    'container-2',
    'content-2',
    options,
);
