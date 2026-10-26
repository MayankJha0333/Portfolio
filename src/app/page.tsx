import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { MoreProjects } from "@/components/MoreProjects";
import { Nav } from "@/components/Nav";
import { OpenSource } from "@/components/OpenSource";
import { Reel } from "@/components/Reel";
import { Toolkit } from "@/components/Toolkit";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Reel />
        <div className="h-16 lg:h-0" />
        <Toolkit />
        <Work />
        <OpenSource />
        <MoreProjects />
        <About />
      </main>
      <Contact />
    </>
  );
}
