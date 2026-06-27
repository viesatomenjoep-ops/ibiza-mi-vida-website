export function test() {
  const str = "hello <world>";
  const regex = /<[^>]+>/g;
  return (
    <main>
      {str.replace(regex, '')}
    </main>
  )
}
