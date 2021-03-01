// const NumberWithCommas = (x) => String(parseInt(x)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
const NumberWithCommas = (x) => (parseInt(x)) ? String(parseInt(x)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(x).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

export default NumberWithCommas
