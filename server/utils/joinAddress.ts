const joinAddress = (line1?: string, line2?: string, line3?: string, postcode?: string) => {
  const joinedAddress = (separator: string) =>
    `${line1 ? line1 + separator : ''}${line2 ? line2 + separator : ''}${line3 ? line3 + separator : ''}${postcode || ''}`

  return {
    value: joinedAddress(', '),
    html: joinedAddress('<br>'),
  }
}

export default joinAddress
