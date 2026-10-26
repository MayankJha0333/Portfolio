import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { MoreProjects } from "@/components/MoreProjects";
import { Nav } from "@/components/Nav";
import { OpenSource } from "@/components/OpenSource";
import { ShatterReel } from "@/components/ShatterReel";
import { Toolkit } from "@/components/Toolkit";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ShatterReel />
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
