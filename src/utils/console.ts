declare global {
  interface Console {
    success: () => void
    danger: () => void
    warning: () => void
  }
}

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
    case 'success':
      style.push('background: #52C41A')
      break
    case 'danger':
      style.push('background: #D33F3F')
      break
    case 'warning':
      style.push('background: #FFC82C')
      break
    default:
      style.push('background: #555')
      break
  }
  return style.join(';')
}

export const initializeConsole = () => {
  const _warn = console.warn
  const _log = console.log
  const _error = console.error

  console.debug = (function () {
    return Function.prototype.bind.call(_log, console, '%cDebug%c', customizedStyle(), 'color: inherit')
  }())
  console.info = (function () {
    return Function.prototype.bind.call(_log, console, '%cInfo%c', customizedStyle('info'), 'color: inherit')
  }())
  console.success = (function () {
    return Function.prototype.bind.call(_log, console, '%cSuccess%c', customizedStyle('success'), 'color: inherit')
  }())
  console.danger = (function () {
    return Function.prototype.bind.call(_error, console, '%cError%c', customizedStyle('danger'), 'color: inherit')
  }())
  console.warning = (function () {
    return Function.prototype.bind.call(_warn, console, '%cWarning%c', customizedStyle('warning'), 'color: inherit')
  }())
}
