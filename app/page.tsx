// import PolkadotPage from "./Components/PolkadotPage";
import NavBar from "./Components/Navbar";
import Polkadot from "./Components/test";

export default function Home() {
  return (
    <>
      <div className=" container mx-auto overflow-hidden font-[family-name:var(--font-geist-sans)]">
        <NavBar />
        <main>
          {/* <PolkadotPage /> */}
          <Polkadot/>
        </main>
      </div>
    </>
  );
}
