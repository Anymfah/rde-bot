
export const get = (obj, desc) => {
  const arr = desc.split(".");
  while(arr.length && (obj = obj[arr.shift()]));
  return obj;
}

export const replaceTokens = (HTML: string, data: unknown) => {
  return HTML.split('{{').map(function(i) {
    const symbol = i.substring(0, i.indexOf('}}')).trim();
    return i.replace(symbol + '}}', get(data, symbol));
  }).join('');
}
/**
 * Return the duration of a match in hours, minutes and seconds
 * @param utcStartTime
 * @param utcEndTime
 * @returns '32 minutes 12 seconds'
 */
export const matchDuration = (utcStartTime, utcEndTime) => {
  const startTime = typeof utcStartTime === 'string' ? parseInt(utcStartTime, 10) : utcStartTime;
  const endTime = typeof utcEndTime === 'string' ? parseInt(utcEndTime, 10) : utcEndTime;

  const duration = endTime - startTime;
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;
  return `${hours ? hours + ' heures' : ''} ${minutes ? (hours ? ' et ' : '') + minutes + ' minutes' : ''} ${seconds ? (hours || minutes ? ' et ' : '') + seconds + ' secondes' : ''}`;
}
