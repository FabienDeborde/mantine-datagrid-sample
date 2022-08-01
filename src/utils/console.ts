const logStyles = [
  'border-radius: 3px',
  'color: white',
  'font-weight: bold',
  'padding: 2px 5px'
]
const customizedStyle = (type?: string): string => {
  const style = [...logStyles]
  switch (type) {
    case 'info':
      style.push('background: #1890FF')
      break
    case 'debug':
      style.push('background: #550055')
      break
    case 'warn':
      style.push('background: #FFC011')
      break
    default:
      style.push('background: #555')
      break
  }
  return style.join(';')
}

export const initializeConsole = () => {
  const _log = console.log

  console.log = (function () {
    return Function.prototype.bind.call(_log, console, '%cLOG%c', customizedStyle(''), 'color: inherit')
  }())
  console.debug = (function () {
    return Function.prototype.bind.call(_log, console, '%cDebug%c', customizedStyle('debug'), 'color: inherit')
  }())
  console.info = (function () {
    return Function.prototype.bind.call(_log, console, '%cInfo%c', customizedStyle('info'), 'color: inherit')
  }())
  console.warn = (function () {
    return Function.prototype.bind.call(_log, console, '%cInfo%c', customizedStyle('warn'), 'color: inherit')
  }())
}
