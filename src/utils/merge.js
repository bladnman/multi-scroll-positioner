export default function merge(...objects) {
  if (!objects || objects.length < 1) return null;

  const nonEmptyObjects = objects.filter(object => !!object);
  if (!nonEmptyObjects || nonEmptyObjects.length < 1) return null;

  if (nonEmptyObjects.length === 1) return nonEmptyObjects[0];
  return Object.assign(...nonEmptyObjects);
}
