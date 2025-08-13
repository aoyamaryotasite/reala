import Hero from "../components/Hero";
import Goals from "../components/Goals";
import Tutor from "../components/Tutor";
import Who from "../components/Who";
import PlanLock from "../components/PlanLock";
import Contact from "../components/Contact";


export default function Page() {
  return (
    <main>
      <Hero />
      <Goals />
      <Tutor />
      <Who />
      <PlanLock
        slides={[
          {
            img: "/plans/textbook.png",
            title: "Textbook Plan",
            sub: "Solid Foundation",
            body: "Using popular textbooks like Minna no Nihongo and Genki, you will systematically learn grammar, vocabulary, and expressions. The first lesson will clarify your goals and create a personalized plan."
          },
          {
            img: "/plans/free-talk.png",
            title: "Free Talk Plan",
            sub: "Improve Conversational Fluency",
            body: "Discuss any topic you like, such as hobbies, travel, culture, or news. This plan is ideal for practicing natural Japanese expressions and reactions. We also offer conversation practice in Kansai-ben."
          },
          {
            img: "/plans/jlpt.png",
            title: "JLPT Prep Plan",
            sub: "Beyond Passing the Test",
            body: "Using resources like the Shin Kanzen Master series, we will focus on grammar, vocabulary, reading and listening. If you feel anxious about preparing for the JLPT alone, we will work together to achieve your target score."
          }
        ]}
        nextAnchorId="after-plans"
      />

      <div id="after-plans" style={{ height: "1px" }} />
      <Contact />
    </main>
  );
}