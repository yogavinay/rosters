export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary mb-4">
        Andhra Rosters
      </h1>
      <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
        The premium marketplace for poultry enthusiasts. Buy and sell roosters, hens, eggs, and chicks with confidence.
      </p>
      <div className="flex gap-4">
        <a href="/products" className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
          Browse Market
        </a>
        <a href="/register" className="bg-secondary text-secondary-foreground px-6 py-3 rounded-md font-medium hover:bg-secondary/80 transition-colors">
          Become a Seller
        </a>
      </div>
    </div>
  );
}
