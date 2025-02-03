const joinAddress = (line1?: string, line2?: string, line3?: string, postcode?: string, isHtml: boolean = false) => {
  const separator = isHtml ? '<br>' : ' ,'
  return `
    ${line1 ? `${line1 + separator}` : ''}
    ${line2 ? `${line2 + separator}` : ''}
    ${line3 ? `${line3 + separator}` : ''}
    ${postcode || ''}
  `
}

export default joinAddress
