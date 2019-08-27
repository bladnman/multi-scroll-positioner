import isUsingTranslateScroll from './isUsingTranslateScroll';
import getScrollLikePointForElement from './getScrollLikePointForElement';
import invertSign from './invertSign';
import breath from './breath';

const useRAF = true;

export default class Scroller {
  static EASE = {
    easeOutCuaic,
    linearTween,
    easeInQuad,
    easeOutQuad,
    easeInOutQuad,
    easeInCuaic,
    easeInOutCuaic,
    easeInQuart,
    easeOutQuart,
    easeInOutQuart,
    easeInQuint,
    easeOutQuint,
    easeInOutQuint,
    easeInSine,
    easeOutSine,
    easeInOutSine,
    easeInExpo,
    easeOutExpo,
    easeInOutExpo,
    easeInCirc,
    easeOutCirc,
    easeInOutCirc,
  };
  constructor({
    element,
    toPoint,
    durationMs = 0,
    fps = 60,
    easeFn,
    onDone,
    onCancel,
    useTranslate = isUsingTranslateScroll(),
    id = '',
  }) {
    this.id = id;
    this.element = element;
    this.durationMs = durationMs;
    this.fps = fps;
    this.startPoint = getScrollLikePointForElement(element, useTranslate);
    this.toPoint = Object.assign({}, this.startPoint, toPoint);
    this.canceled = false;
    this.onDone = onDone;
    this.onCancel = onCancel;
    this.useTranslate = useTranslate;

    if (!this.startPoint) return null;

    // SAME POINTS - already there
    if (
      this.startPoint.x === this.toPoint.x &&
      this.startPoint.y === this.toPoint.y
    ) {
      breath(this.onDone); // call 'done'
    }

    // SCROLL BABY!
    else {
      console.debug(
        `[${this.id}] from [${this.startPoint.x},${this.startPoint.y}] -> to [${
          this.toPoint.x
        },${this.toPoint.y}]`
      );

      // Clear any previous scroller
      if (this.element._scrollerRef) {
        this.element._scrollerRef.cancel();
        this.element._scrollerRef = null;
      }
      // add ourselves as a ref to this element
      element._scrollerRef = this;
      _scrollTo({
        element: this.element,
        fromPoint: this.startPoint,
        toPoint: this.toPoint,
        durationMs: this.durationMs,
        fps: this.fps,
        scrollerRef: this,
        easeFn,
        useTranslate,
        onCancel,
        onDone: () => {
          // clear ourselves from being a ref
          this.element._scrollerRef = null;

          // do any callback
          breath(this.onDone);
        },
      });
    }
  }
  cancel() {
    console.debug(
      `[${this.id}] cancel() : [${this.startPoint.x},${
        this.startPoint.y
      }] -> [${this.toPoint.x},${this.toPoint.y}]`
    );

    this.canceled = true;
    this.element._scrollerRef = null;
    this.onCancel && this.onCancel();
  }
}

/** SCROLL WORKERS */
function _scrollTo({
  element,
  fromPoint,
  toPoint,
  durationMs = 0,
  fps = 60,
  easeFn = easeOutCuaic,
  scrollerRef,
  useTranslate,
  onDone,
  onCancel,
}) {
  _doScroll({
    element,
    fromPoint,
    toPoint,
    speedModifier: durationMs > 0 ? 1 / durationMs : 0,
    stepMs: 1000 / fps,
    easeFn,
    scrollerRef,
    useTranslate,
    onDone,
    onCancel,
  });
}
function _doScroll({
  element,
  fromPoint,
  toPoint,
  t01 = 0,
  speedModifier,
  stepMs,
  easeFn = easeOutCuaic,
  scrollerRef,
  useTranslate,
  onDone,
  onCancel,
}) {
  // bail - canceled
  if (scrollerRef && scrollerRef.canceled) {
    onCancel && onCancel();
    return;
  }

  if (t01 < 0 || t01 > 1 || speedModifier <= 0) {
    _doMovementToPoint(element, toPoint, useTranslate);
    onDone && onDone();
    return;
  }
  const nextPoint = {
    x: ~~(fromPoint.x - (fromPoint.x - toPoint.x) * easeFn(t01)),
    y: ~~(fromPoint.y - (fromPoint.y - toPoint.y) * easeFn(t01)),
  };

  t01 += speedModifier * stepMs;

  // USE RAF
  if (useRAF) {
    window.requestAnimationFrame(() => {
      _doMovementToPoint(element, nextPoint, useTranslate);

      t01 += speedModifier * stepMs;

      setTimeout(function() {
        _doScroll({
          element,
          fromPoint,
          toPoint,
          t01,
          speedModifier,
          stepMs,
          easeFn,
          useTranslate,
          scrollerRef,
          onDone,
          onCancel,
        });
      }, stepMs);
    });
  }

  // no RAF
  else {
    element.scrollTo(nextPoint.x, nextPoint.y);

    setTimeout(function() {
      _doScroll({
        element,
        fromPoint,
        toPoint,
        t01,
        speedModifier,
        stepMs,
        easeFn,
        useTranslate,
        scrollerRef,
        onDone,
        onCancel,
      });
    }, stepMs);
  }
}
function _doMovementToPoint(element, point, useTranslate = false) {
  // TRANSFORM
  if (useTranslate) {
    if (!element.style) return;
    element.style.transform = `translate(${invertSign(point.x)}px, ${invertSign(
      point.y
    )}px)`;
  }

  // SCROLL
  else {
    element.scrollTo(point.x, point.y);
  }
}

/** EASE FUNCTIONS */
function linearTween(t) {
  return t;
}
function easeInQuad(t) {
  return t * t;
}
function easeOutQuad(t) {
  return -t * (t - 2);
}
function easeInOutQuad(t) {
  t /= 0.5;
  if (t < 1) return (t * t) / 2;
  t--;
  return (t * (t - 2) - 1) / 2;
}
function easeInCuaic(t) {
  return t * t * t;
}
function easeOutCuaic(t) {
  t--;
  return t * t * t + 1;
}
function easeInOutCuaic(t) {
  t /= 0.5;
  if (t < 1) return (t * t * t) / 2;
  t -= 2;
  return (t * t * t + 2) / 2;
}
function easeInQuart(t) {
  return t * t * t * t;
}
function easeOutQuart(t) {
  t--;
  return -(t * t * t * t - 1);
}
function easeInOutQuart(t) {
  t /= 0.5;
  if (t < 1) return 0.5 * t * t * t * t;
  t -= 2;
  return -(t * t * t * t - 2) / 2;
}
function easeInQuint(t) {
  return t * t * t * t * t;
}
function easeOutQuint(t) {
  t--;
  return t * t * t * t * t + 1;
}
function easeInOutQuint(t) {
  t /= 0.5;
  if (t < 1) return (t * t * t * t * t) / 2;
  t -= 2;
  return (t * t * t * t * t + 2) / 2;
}
function easeInSine(t) {
  return -Math.cos(t / (Math.PI / 2)) + 1;
}
function easeOutSine(t) {
  return Math.sin(t / (Math.PI / 2));
}
function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}
function easeInExpo(t) {
  return Math.pow(2, 10 * (t - 1));
}
function easeOutExpo(t) {
  return -Math.pow(2, -10 * t) + 1;
}
function easeInOutExpo(t) {
  t /= 0.5;
  if (t < 1) return Math.pow(2, 10 * (t - 1)) / 2;
  t--;
  return (-Math.pow(2, -10 * t) + 2) / 2;
}
function easeInCirc(t) {
  return -Math.sqrt(1 - t * t) - 1;
}
function easeOutCirc(t) {
  t--;
  return Math.sqrt(1 - t * t);
}
function easeInOutCirc(t) {
  t /= 0.5;
  if (t < 1) return -(Math.sqrt(1 - t * t) - 1) / 2;
  t -= 2;
  return (Math.sqrt(1 - t * t) + 1) / 2;
}
