import type { Metadata } from "next";
import Script from "next/script";
import "scroll-hint/css/scroll-hint.css";



import PageLoader from "../components/PageLoader";
import FloatingTrialCTA from "../components/FloatingTrialCTA";


import Hero from "../components/Hero";
import Goals from "../components/Goals";
import Tutor from "../components/Tutor";
import Who from "../components/Who";
import PlanLock from "../components/PlanLock";
import Contact from "../components/Contact";
import PriceTable from "../components/PriceTable";
import AboutCEO from "../components/AboutCEO";
import Faq from "../components/Faq";
import Footer from "../components/Footer";



export const metadata: Metadata = {
  title: "REALA Japanese Academy | Online Japanese Lessons (Free Talk / Textbook / JLPT / Intensive)",
  description:
    "Take personalized Japanese lessons online. Choose 25 or 50 minutes. English support available. Free talk, textbook-based study, JLPT prep, and short-term intensive plans.",
  alternates: {
    canonical: "http://reala-academy.com/",
  },
};


const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What kind of lessons do you offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Lessons are customized based on each student's goals and level. Options include free conversation, structured grammar lessons, JLPT preparation, and short-term intensive lessons."
      }
    },
    {
      "@type": "Question",
      "name": "I’m a complete beginner in Japanese. Is that okay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Absolutely. We provide friendly, step-by-step support starting from greetings and basic grammar, so beginners can feel comfortable and confident."
      }
    },
    {
      "@type": "Question",
      "name": "Can lessons be conducted in English?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Yes. We can explain grammar, answer questions, and offer learning advice in English as needed. English support is available throughout the learning process."
      }
    },
    {
      "@type": "Question",
      "name": "What teaching materials do you use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Mainly popular textbooks like “Minna no Nihongo” and “Genki”, depending on your level and learning style."
      }
    },
    {
      "@type": "Question",
      "name": "How long are the lessons?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "You can choose either 25-minute or 50-minute lessons. We recommend starting with a 25-minute trial."
      }
    },
    {
      "@type": "Question",
      "name": "Can I ask questions outside of lesson time?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "As a general rule, we do not offer one-on-one support outside lesson hours. However, questions asked during lessons will be followed up carefully in future sessions."
      }
    },
    {
      "@type": "Question",
      "name": "Can I take lessons with a friend or family member?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Currently, lessons are offered one-on-one, but feel free to inquire if you’d like to study with someone else."
      }
    },
    {
      "@type": "Question",
      "name": "I’d like to take intensive lessons in a short period. Is that possible?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Yes. We offer flexible short-term plans tailored to specific goals like travel or exams. Feel free to contact us to discuss your needs."
      }
    },
    {
      "@type": "Question",
      "name": "What happens in a trial lesson?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "During the trial, we’ll talk about your goals and level, and then try a short lesson. We’ll also explain how future lessons would be structured if you decide to continue."
      }
    },
    {
      "@type": "Question",
      "name": "How do I schedule a lesson?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "You can schedule by contacting us through LINE or email. Please let us know your preferred date and time."
      }
    },
    {
      "@type": "Question",
      "name": "What payment methods do you accept?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "PayPal (recommended for overseas learners), bank transfer to Rakuten Bank (for residents in Japan), and PayPay (for those in Japan who prefer it)."
      }
    },
    {
      "@type": "Question",
      "name": "Can I cancel a lesson?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Cancellations are free up to 24 hours before the lesson. After that, the full lesson fee will be charged."
      }
    },
    {
      "@type": "Question",
      "name": "How does payment work for fixed plans like weekly lessons?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For weekly plans, we offer a monthly subscription system."
      }
    },
    {
      "@type": "Question",
      "name": "What do I need to prepare for the lesson?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Please have a stable internet connection, a computer or tablet, a webcam, and a microphone. We use Zoom or Google Meet for lessons."
      }
    },
    {
      "@type": "Question",
      "name": "I don’t know how to use Zoom. Is that okay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "No problem. Zoom is free and easy to use. We’ll send you a quick guide after booking."
      }
    }
  ]
};



export default function Page() {
  return (
    <PageLoader minDurationMs={2800} slideMs={1000}>
      <main>
        <Hero />
        {/* <PenLine /> */}
        <Goals />
        <Tutor />
        <Who />
   

        <PlanLock
          slides={[
            {
              img: "/plans/textbook.webp",
              title: "Textbook Plan",
              sub: "Solid Foundation",
              body: "Using popular textbooks like Minna no Nihongo and Genki, you will methodically learn grammar, vocabulary, and expressions. The first lesson will be dedicated to clarifying your goals and creating a personalized study plan."
            },
            {
              img: "/plans/free-talk.webp",
              title: "Free Talk Plan",
              sub: "Improve Conversational Fluency",
              body: "Discuss any topic you like, such as hobbies, travel, culture, or news. This plan is ideal for practicing natural Japanese expressions and reactions. We also offer conversation practice in Kansai-ben."
            },
            {
              img: "/plans/jlpt.webp",
              title: "JLPT Prep Plan",
              sub: "Beyond Passing the Test",
              body: "Using resources like the Shin Kanzen Master series, we will focus on grammar, vocabulary, reading and listening. If you feel anxious about preparing for the JLPT alone, we will work together to achieve your target score."
            }
          ]}

        />
        <PriceTable />
        <AboutCEO
          imageSrc="/ceo.png"  // 実際の画像パスに変更してください
          imageAlt="CEO"
          points={[
            "Over 10 years of experience in English education at high schools and personalized tutoring at cram schools.",
            "CELTA certified, allowing me to provide instruction based on established language education theory and practice.",
            "Deep understanding of the structural differences between Japanese and English, enabling me to provide clear and logical explanations.",
            "Full support in English (lesson bookings, grammar explanations, learning consultations, etc.).",
            "Fluent in Kansai-ben, providing native-level guidance on natural expressions."
          ]}
        />
        <Faq />
        <Contact />
        <FloatingTrialCTA
          href="/signup"
          label="Start Free Trial"   // お好みで “Try it free” などに変更OK
          showOnMobile={true}        // モバイルでもラベル表示したい場合
        />

        <Footer />
      </main>
    </PageLoader>
  );
}