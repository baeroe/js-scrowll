# js-scrowll

[![NPM version](https://img.shields.io/badge/npm-v1.0.0-blue)](https://www.npmjs.com/package/js-scrowll)
[![NPM version](https://img.shields.io/badge/licence-MIT-green)](https://opensource.org/license/mit/)

js-scrowll is a npm package designed to dynamically calculate CSS values for elements based on the scroll state of
their parent elements. It enables smooth transitions and animations by adjusting CSS properties like opacity,
translation, scaling, rotation, color, background, and blur as the user scrolls through the page.

## Installation

You can install js-scrowll via npm:

```bash
npm install js-scrowll
```

## Usage

### Options

| Property   | Description            | Value                          |
|------------|------------------------|--------------------------------|
| opacity    | Opacity of the element | Value between 0 and 1          |
| translateY | Vertical translation   | Numeric value (px)             |
| translateX | Horizontal translation | Numeric value (px)             |
| scale      | Scaling factor         | Value between 0 and 1          |
| rotate     | Rotation angle         | Numeric value (deg)            |
| color      | Text color             | Hexcode string (e.g., #ff0000) |
| background | Background color       | Hexcode string (e.g., #00ff00) |
| blur       | Blur effect            | Numeric value (px)             |

### Example

![Alt Text](./example/example.gif)

#### JavaScript

```javascript
import { initScrollAnimate } from 'js-scrowll';

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
```

#### HTML

```html

<body>
    <div
        class="firstContainer"
        id="container-1"
    >
        <div
            class="content"
            id="content-1"
        >Hi, this is
        </div>
    </div>
    <div
        class="secondContainer"
        id="container-2"
    >
        <div
            class="content"
            id="content-2"
        >an example
        </div>
    </div>
</body>
```

#### CSS

```css
.firstContainer
{
    height: 2000px;
}

.secondContainer
{
    height: 2000px;
}

.content
{
    border-radius:   100%;
    position:        fixed;
    top:             0;
    height:          100vh;
    width:           100%;
    display:         flex;
    justify-content: center;
    align-items:     center;
    font-size:       68px;
}
```

Replace `'yourElementId'` with the ID of the element you want to apply the dynamic CSS values to.