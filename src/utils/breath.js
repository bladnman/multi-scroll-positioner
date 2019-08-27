import isFunction from "./isFunction";

export default function breath(thenExecute) {
  var forMillsOrNull = 1;
  /**
   * This will breath for a few mills by default,
   * or allow you to send in the mills to breath for.
   *
   * Highly variable interface. This can be called like this:
   *    breath(function)
   *      - or -
   *    breath(mils, function)
   *      - or -
   *    breath(function, mils)
   *
   * This function will figure out which you mean.
   * It will return reference to the timer, if any was used.
   */

  var argsArray = [].slice.apply(arguments);

  if (argsArray.length < 1) {
    return null;
  }

  // 1 argument
  if (argsArray.length === 1) {
    thenExecute = argsArray[0];
  }

  // 2 arguments
  else if (argsArray.length === 2) {
    forMillsOrNull = argsArray[0];
    thenExecute = argsArray[1];
  }

  // get the parms straightened out
  // this allows for (func,int) and (int,func)
  if (isFunction(forMillsOrNull)) {
    var tmp = thenExecute || null;
    thenExecute = forMillsOrNull;
    forMillsOrNull = tmp;
  }

  // bail -- we have NO FUNCTIONS
  if (!isFunction(thenExecute)) return null;

  var breathForMills = forMillsOrNull || 10;
  // if the timeout is 0 then execute immediately
  if (breathForMills < 1) {
    thenExecute();
  }

  // otherwise run the timeout
  else {
    return setTimeout(thenExecute, breathForMills);
  }

  return null;
}
