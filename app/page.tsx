import {Navbar} from "./components/navbar";
import {PolkadotPageComponent} from "./components/polkadot-page";
export default function Home() {
  return (
    <>
      <div className=" container mx-auto overflow-hidden font-[family-name:var(--font-geist-sans)]">
        <Navbar />
        <main>
          <PolkadotPageComponent />
        </main>
      </div>
    </>
  );
}
