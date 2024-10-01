import Navbar from "./components/navbar";
import { PolkadotPageComponent } from "./components/polkadot-page";

export default function Home() {
  return (
    <>
      <div className="h-screen  bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-90 mx-auto overflow-auto font-[family-name:var(--font-geist-sans)]">
        <Navbar />
        <main className="container mx-auto max-w-screen-lg p-4 pt-20 space-y-8">
          <PolkadotPageComponent />
        </main>
      </div>
    </>
  );
}
