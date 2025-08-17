"use client";

import Head from "next/head";
import Footer from "../../components/Footer";
import HeroHeader from "../../components/HeroHeader";

export default function PrivacyPolicy() {
  return (
    <>
     <HeroHeader />
      <Head>
        <title>Privacy Policy</title>
        <meta name="description" content="Privacy Policy of our services" />
      </Head>
      <div className="container">
        <h1>Privacy Policy</h1>
        <p>
          REALA (hereinafter referred to as "the Company") establishes the
          following privacy policy (hereinafter referred to as "this Policy")
          regarding the handling of users' personal information in the services
          provided on this website (hereinafter referred to as "the Services").
        </p>

        <h2>Article 1 (Personal Information)</h2>
        <p>
          "Personal Information" refers to "personal information" as defined in
          the Act on the Protection of Personal Information, which means
          information about a living individual that can identify a specific
          individual by name, date of birth, address, telephone number, contact
          information, and other descriptions, as well as data related to
          appearance, fingerprints, voiceprints, and the insurer number of a
          health insurance card, etc., which can identify a specific individual
          by such information alone (personal identification information).
        </p>

        <h2>Article 2 (Method of Collecting Personal Information)</h2>
        <p>
          The Company may ask users for personal information such as name, date
          of birth, address, telephone number, email address, bank account
          number, credit card number, driver's license number, etc., when they
          register for use. In addition, the Company may collect transaction
          records and payment information, including users' personal
          information, from partners (including information providers,
          advertisers, advertisement distributors, hereinafter referred to as
          "Partners").
        </p>

        <h2>Article 3 (Purpose of Collecting and Using Personal Information)</h2>
        <p>The purposes for which the Company collects and uses personal information are as follows:</p>
        <ul>
          <li>To provide and operate the Company's services</li>
          <li>
            To respond to inquiries from users (including identity verification)
          </li>
          <li>
            To send emails regarding new features, updates, campaigns, and other
            services provided by the Company
          </li>
          <li>
            To contact users as necessary for maintenance, important notices,
            etc.
          </li>
          <li>
            To identify users who violate the Terms of Use or attempt to use the
            service for fraudulent or improper purposes, and to refuse their use
          </li>
          <li>
            To allow users to view, change, delete their registration
            information, and check their usage status
          </li>
          <li>To charge users fees for paid services</li>
          <li>For purposes incidental to the above</li>
        </ul>

        <h2>Article 4 (Change of Purpose of Use)</h2>
        <p>
          The Company may change the purpose of use of personal information only
          if it is reasonably related to the purpose before the change. In case
          of a change, the Company shall notify the user or publicly announce it
          on this website.
        </p>

        <h2>Article 5 (Provision of Personal Information to Third Parties)</h2>
        <p>
          Except in the cases listed below or as permitted by laws and
          regulations, the Company will not provide personal information to
          third parties without prior consent from the user:
        </p>
        <ul>
          <li>
            When necessary to protect a person's life, body, or property and it
            is difficult to obtain the person's consent
          </li>
          <li>
            When it is particularly necessary for improving public health or
            promoting the sound development of children, and it is difficult to
            obtain the person's consent
          </li>
          <li>
            When it is necessary to cooperate with national institutions, local
            governments, or their contractors in performing duties prescribed by
            law, and obtaining the person's consent may impede the execution of
            such duties
          </li>
          <li>
            When the following matters have been announced in advance, and the
            Company has notified the Personal Information Protection Commission:
            <ul>
              <li>That the purpose of use includes provision to third parties</li>
              <li>Items of data provided to third parties</li>
              <li>Means or methods of provision to third parties</li>
              <li>
                That the provision to third parties will be stopped at the
                request of the individual
              </li>
              <li>Methods of accepting such requests</li>
            </ul>
          </li>
        </ul>
        <p>
          Notwithstanding the provisions above, the following cases are not
          considered provision to third parties:
        </p>
        <ul>
          <li>
            When the Company outsources all or part of the handling of personal
            information within the scope necessary to achieve the purpose of use
          </li>
          <li>
            When personal information is provided due to business succession by
            merger or other reasons
          </li>
          <li>
            When personal information is used jointly with specific persons, and
            the scope, purpose, and responsible party are notified to the
            individual in advance or made easily accessible
          </li>
        </ul>

        <h2>Article 6 (Disclosure of Personal Information)</h2>
        <p>
          When requested by the individual, the Company shall disclose personal
          information without delay. However, all or part of the disclosure may
          not be made if it falls under any of the following, and the Company
          will notify the user without delay if a decision not to disclose is
          made. A fee of 1,000 yen per case will be charged for disclosure:
        </p>
        <ul>
          <li>
            If disclosure may harm the life, body, property, or other rights and
            interests of the individual or a third party
          </li>
          <li>
            If disclosure may significantly hinder the proper execution of the
            Company's business
          </li>
          <li>If disclosure would violate other laws or regulations</li>
        </ul>
        <p>
          Notwithstanding the above, in principle, the Company will not disclose
          information other than personal information such as history and
          characteristic information.
        </p>

        <h2>Article 7 (Correction and Deletion of Personal Information)</h2>
        <p>
          Users may request correction, addition, or deletion ("Correction,
          etc.") of their personal information held by the Company if it is
          incorrect. If deemed necessary, the Company shall promptly make such
          Correction, etc. If the Company makes a Correction, etc., or decides
          not to, it shall promptly notify the user.
        </p>

        <h2>Article 8 (Suspension of Use of Personal Information)</h2>
        <p>
          If requested by the individual to suspend or delete ("Suspension of
          Use, etc.") their personal information due to being handled beyond the
          scope of the purpose of use or obtained by improper means, the Company
          shall promptly investigate and, if necessary, take action. If the
          Company takes such action or decides not to, it shall promptly notify
          the user. However, if Suspension of Use, etc. requires excessive cost
          or is otherwise difficult, the Company will take alternative measures
          to protect users' rights and interests.
        </p>

        <h2>Article 9 (Changes to the Privacy Policy)</h2>
        <p>
          The contents of this Policy may be changed without notifying users,
          except as otherwise provided by laws or this Policy. Unless otherwise
          specified by the Company, the revised Privacy Policy shall take effect
          when posted on this website.
        </p>
      </div>
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 140px auto;
          padding: 20px;
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color:#373737;
        }
        h1 {
          font-size: 28px;
          margin-bottom: 20px;
           color:#373737;
        }
        h2 {
          font-size: 20px;
          margin-top: 30px;
          margin-bottom: 10px;
           color:#373737;
        }
        ul {
          margin-left: 20px;
          list-style: disc;
           color:#373737;
        }
        p {
          margin-bottom: 15px;
           color:#373737;
        }
      `}</style>
         <Footer />
    </>
  );
}
