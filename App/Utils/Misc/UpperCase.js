const UpperCase = (string) => {
  return string.replace(/\b\w/g, l => l.toUpperCase())
}
export default UpperCase
