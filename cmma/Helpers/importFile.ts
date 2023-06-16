export default async function importFile(fileName: string): Promise<any> {
  const module = await import(fileName)
  return module
}
