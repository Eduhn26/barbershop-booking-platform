export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Magrão Barbershop</h1>
      <p className="mt-2 text-zinc-300">Refatoração em andamento (Next.js + NestJS + Postgres + Prisma).</p>
      <div className="mt-6 flex gap-3">
        <a className="rounded-md bg-zinc-800 px-4 py-2" href="/login">Login</a>
        <a className="rounded-md bg-zinc-800 px-4 py-2" href="/signup">Criar conta</a>
      </div>
    </main>
  );
}
