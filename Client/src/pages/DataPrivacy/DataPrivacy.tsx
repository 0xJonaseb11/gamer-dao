import { useTranslation } from 'react-i18next';

import { PolicyContainer } from './styles';

function DataPrivacy () {
  const { t } = useTranslation();
  return (
    <PolicyContainer title={t('DATA_PRIVACY')}>
      <div className="block privacy-content">
        <div className="privacy-block">
          <h2 className="text-h2">I. Privacy Policy</h2>
          <p className="text-md">
            This website hq.q.org is operated by Q Development AG. The following Data Privacy Policy shall provide the
            necessary information on how Q Development AG deals with personal data.
          </p>
          <h3 className="text-h3">1. Contact</h3>
          <p className="text-md">
            For all enquiries regarding data protection, please contact us at info@qdev.li or Q Development AG,
            Rhigass 1 in 9487 Gamprin-Bendern, Liechtenstein.
          </p>
        </div>

        <div className="privacy-block">
          <h2 className="text-h2">II. Data processing in general</h2>
          <h3 className="text-h3">1. Scope of the processing of personal data</h3>
          <p className="text-md">
            The processing of personal data is limited to data that is required to operate a functional website and for
            the provision of content and services. The processing of personal data of our users is based on the purposes
            agreed or on a legal basis (GDPR). We only collect personal data that is necessary to implement and process
            our tasks and services or if you provide data voluntarily
          </p>

          <h3 className="text-h3">2. Your rights</h3>
          <p className="text-md">
            You have the right to request information about any of your personal data we process. In particular, you
            have the right to request information about the purpose of the processing, the categories of personal data,
            the categories of recipients who will have access or were disclosed with your data, the duration periods for
            saving the personal data, whether there is a right to adjust/correct, erase, restrict or object,
            transmission of data , the source of your data if not collected through us and if we use automatic
            decision-making technologies in-cluding profiling.
          </p>
          <p className="text-md">
            Additionally, you have the right to revoke a previously granted consent to use your personal data at any
            time.
          </p>
          <p className="text-md">
            If you believe that the processing of your personal data is inconsistent or contradicts the applicable data
            protection laws you have the possibility to lodge a complaint with the data protection office.
          </p>
        </div>

        <div className="privacy-block">
          <h2 className="text-h2">III. Description and scope of data processing</h2>
          <h3 className="text-h3">1. Provision of the website</h3>
          <p className="text-lg">a) Visitor data and usage data:</p>
          <p className="text-md">
            Our system records data and information about the computer used by the user automatically and with every
            visit on our website.
          </p>
          <p className="text-md">The following data are collected:</p>
          <ul className="privacy-list">
            <li className="text-md">Information regarding the type and version of internet browser used to access the website</li>
            <li className="text-md">Operating system</li>
            <li className="text-md">IP address</li>
            <li className="text-md">Date and time of each access</li>
            <li className="text-md">Web page from which the user was redirected to our page</li>
            <li className="text-md">Web pages and resources that were visited</li>
          </ul>
          <p className="text-md">
            The data mentioned above are saved for a maximum time period of 30 days. This storing is done due to
            security reasons to ensure the stability and integrity of our systems.
          </p>

          <p className="text-lg">b) Web analytics:</p>
          <p className="text-md">
            We use the error analysis tool Sentry (https://sentry.io ) for our website. The service is pro-vided by the
            company Sentry Inc.
          </p>
          <p className="text-md">
            This analysis is for the purpose of optimizing the website with regards to the relevance and security of our
            website. Sentry may also process data from you in the USA, among other places.{' '}
          </p>

          <p className="text-md">
            As a basis for data processing with recipients located in third countries (i.e. in particular in the USA) or
            a data transfer there, Sentry uses so-called standard contractual clauses (Article 46 GDPR). Standard
            Contractual Clauses are templates provided by the EU Commission and are intended to ensure that your data
            complies with European data protection standards even if it is transferred to and stored in third countries.
            Through these clauses, Sentry under-takes to comply with the European level of data protection when
            processing your relevant data, even if the data is stored, processed and managed in the United States. These
            clauses are based on an implementing decision of the EU Commission.
          </p>
          <p className="text-md">The Data Processing Addendum, which corresponds to the standard contractual clauses, can be found at:</p>
          <p className="text-md">
            —{' '}
            <a
              href="https://sentry.io/legal/dpa/"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              https://sentry.io/legal/dpa/
            </a>
          </p>
          <p className="text-md">
            To learn more about the data processed by using Sentry, see below at:
          </p>
          <p className="text-md">
            —{' '}
            <a
              href="https://sentry.io/privacy/"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              https://sentry.io/privacy/
            </a>
          </p>

          <h3 className="text-h3">2. Cookies</h3>
          <p className="text-md">
            This website does not use cookies, however the error analysis tool Sentry uses cookies. Sen-try uses cookies
            to understand and save your preferences for future visits, to advertise to you on other sites, and to
            compile aggregate data about site traffic and site interaction so that Sentry can offer better site
            experiences and tools in the future. Cookies are small files that are managed by the user’s web browser and
            are directly stored on the respective device (Laptop, Tablet, Smartphone etc.) whenever you visit our
            website. Cookies are stored as long as you do not don’t delete them.
          </p>

          <p className="text-md">
            If you do not wish to use cookies you can change the settings in your browser accordingly. You will then be
            notified whenever your browser attempts to create a cookie and you can decide whether you want to allow the
            cookie. However, please note that a deactivation of cookies may result in a limited user experience and you
            may not be able to use every func-tion of our website.
          </p>
          <p className="text-md">The legal basis for the processing of data through cookies is Article 6 (1) (f) GDPR. </p>
        </div>

        <div className="privacy-block">
          <h2 className="text-h2">IV. Data security</h2>
          <p className="text-md">
            We use a common encryption technology “SHA256 with RSA” in connection with the highest encryption levels
            that are supported by your browser. If a page on our website was/is being transmitted encrypted it is shown
            by the lock symbol in the address bar of your browser.
          </p>
        </div>
      </div>
    </PolicyContainer>
  );
}

export default DataPrivacy;
