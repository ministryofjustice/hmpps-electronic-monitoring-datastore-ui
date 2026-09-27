export const cleanTextContent = (text: string): string =>
  text
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .reduce((acc: string[], line: string) => {
      if (line !== '') acc.push(line)
      return acc
    }, [] as string[])
    .join('\n')

export default cleanTextContent
